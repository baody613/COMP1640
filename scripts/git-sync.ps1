param(
    [string]$Branch = "main",
    [string]$Message = "",
    [switch]$AutoStash,
    [switch]$SkipPull,
    [switch]$NoPush,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Run-Git {
    param(
        [Parameter(Mandatory = $true)][string]$Args,
        [switch]$AllowFailure
    )

    Write-Host "> git $Args" -ForegroundColor Cyan

    if ($DryRun) {
        return ""
    }

    $output = cmd /c "git $Args" 2>&1
    $exitCode = $LASTEXITCODE

    if (-not $AllowFailure -and $exitCode -ne 0) {
        Write-Host $output
        throw "Command failed: git $Args"
    }

    if ($output) {
        Write-Host $output
    }

    return $output
}

function Assert-GitRepo {
    $inside = (& git rev-parse --is-inside-work-tree 2>$null)
    if ($LASTEXITCODE -ne 0 -or $inside -ne "true") {
        throw "Current directory is not a git repository."
    }
}

function Get-WorkingChanges {
    return (& git status --porcelain)
}

try {
    Assert-GitRepo

    Write-Host "=== Git Sync Workflow ===" -ForegroundColor Green
    Write-Host "Repository: $(Get-Location)"
    Write-Host "Branch: $Branch"
    Write-Host "DryRun: $DryRun"

    $stashed = $false
    $stashName = "auto-stash-before-pull-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

    if (-not $SkipPull) {
        $changesBeforePull = Get-WorkingChanges

        if ($changesBeforePull) {
            if ($AutoStash) {
                Run-Git "stash push -u -m $stashName"
                $stashed = $true
            }
            else {
                throw "Working tree has local changes. Re-run with -AutoStash or commit changes first."
            }
        }

        Run-Git "pull --ff-only origin $Branch"

        if ($stashed) {
            Run-Git "stash pop" -AllowFailure

            $unmerged = (& git diff --name-only --diff-filter=U)
            if ($unmerged) {
                Write-Host "Merge conflicts detected after stash pop:" -ForegroundColor Yellow
                Write-Host $unmerged
                throw "Resolve conflicts, then run: git add . ; git commit -m 'resolve conflicts'"
            }
        }
    }

    $changesAfterPull = Get-WorkingChanges
    if (-not $changesAfterPull) {
        Write-Host "No local changes to commit. Repository is up to date." -ForegroundColor Green
        exit 0
    }

    Run-Git "add -A"

    if ([string]::IsNullOrWhiteSpace($Message)) {
        $Message = "chore: sync changes $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    }

    $safeMessage = $Message.Replace('"', "'")
    Run-Git ('commit -m "{0}"' -f $safeMessage) -AllowFailure

    $stillStaged = (& git status --porcelain)
    if (-not $stillStaged) {
        Write-Host "Commit completed." -ForegroundColor Green
    }

    if (-not $NoPush) {
        Run-Git "push origin $Branch"
        Write-Host "Push completed successfully." -ForegroundColor Green
    }
    else {
        Write-Host "Push skipped by -NoPush." -ForegroundColor Yellow
    }

    Write-Host "Done." -ForegroundColor Green
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
