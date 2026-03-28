using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO.Compression;
using System.Text;
using backend.Data;
using backend.Models;
using BCrypt.Net;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "QAManager,Administrator")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<AdminController> _logger;

    public AdminController(
        AppDbContext context,
        IWebHostEnvironment environment,
        ILogger<AdminController> logger)
    {
        _context = context;
        _environment = environment;
        _logger = logger;
    }

    // ==================== USER MANAGEMENT ====================

    // GET: api/Admin/users
    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<object>>> GetAllUsers()
    {
        try
        {
            var users = await _context.Users
                .Include(u => u.Department)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Role,
                    u.DepartmentId,
                    DepartmentName = u.Department != null ? u.Department.Name : null,
                    u.AgreedTerms,
                    u.IsActive,
                    u.CreatedAt
                })
                .OrderBy(u => u.FullName)
                .ToListAsync();

            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users");
            return StatusCode(500, "An error occurred while retrieving users");
        }
    }

    // POST: api/Admin/users
    [HttpPost("users")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<User>> CreateUser([FromBody] CreateUserDto dto)
    {
        try
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already exists");

            // Validate role
            var validRoles = new[] { "Administrator", "QAManager", "Staff", "QACoordinator" };
            if (!validRoles.Contains(dto.Role))
                return BadRequest("Invalid role");

            // Validate department for non-admin roles
            if (dto.Role != "Administrator" && dto.DepartmentId.HasValue)
            {
                var deptExists = await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId.Value);
                if (!deptExists)
                    return BadRequest("Department not found");
            }

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
                DepartmentId = dto.DepartmentId,
                AgreedTerms = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllUsers), new { id = user.Id }, new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                user.DepartmentId,
                user.AgreedTerms,
                user.IsActive,
                user.CreatedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            return StatusCode(500, "An error occurred while creating user");
        }
    }

    // PUT: api/Admin/users/{id}
    [HttpPut("users/{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
    {
        try
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("User not found");

            // Check if new email conflicts with other users
            if (dto.Email != user.Email && await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != id))
                return BadRequest("Email already exists");

            // Validate role
            var validRoles = new[] { "Administrator", "QAManager", "Staff", "QACoordinator" };
            if (!validRoles.Contains(dto.Role))
                return BadRequest("Invalid role");

            // Validate department
            if (dto.DepartmentId.HasValue)
            {
                var deptExists = await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId.Value);
                if (!deptExists)
                    return BadRequest("Department not found");
            }

            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.Role = dto.Role;
            user.DepartmentId = dto.DepartmentId;
            user.IsActive = dto.IsActive;

            // Update password only if provided
            if (!string.IsNullOrEmpty(dto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                user.DepartmentId,
                user.IsActive,
                Message = "User updated successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user");
            return StatusCode(500, "An error occurred while updating user");
        }
    }

    // DELETE: api/Admin/users/{id}
    [HttpDelete("users/{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("User not found");

            // Prevent deleting yourself
            var currentUserId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            if (user.Id == currentUserId)
                return BadRequest("Cannot delete your own account");

            // Soft delete by setting IsActive = false
            user.IsActive = false;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User deactivated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user");
            return StatusCode(500, "An error occurred while deleting user");
        }
    }

    // ==================== TOPIC MANAGEMENT ====================

    // GET: api/Admin/topics/{topicId}/ideas-with-documents
    [HttpGet("topics/{topicId}/ideas-with-documents")]
    public async Task<IActionResult> GetIdeasWithDocumentsByTopic(int topicId)
    {
        try
        {
            var topic = await _context.Topics.FindAsync(topicId);
            if (topic == null)
                return NotFound("Topic not found");

            var ideas = await _context.Ideas
                .Include(i => i.Author)
                .Include(i => i.Department)
                .Include(i => i.Category)
                .Include(i => i.Documents)
                .Where(i => i.TopicId == topicId)
                .OrderByDescending(i => i.CreatedAt)
                .Select(i => new
                {
                    i.Id,
                    i.Title,
                    i.Content,
                    i.IsAnonymous,
                    i.CreatedAt,
                    AuthorName = i.IsAnonymous
                        ? "Anonymous"
                        : (i.Author != null ? i.Author.FullName : "Unknown"),
                    AuthorEmail = i.Author != null ? i.Author.Email : null,
                    DepartmentName = i.Department != null ? i.Department.Name : "N/A",
                    CategoryName = i.Category != null ? i.Category.Name : "N/A",
                    Documents = i.Documents
                        .OrderByDescending(d => d.UploadedAt)
                        .Select(d => new
                        {
                            d.Id,
                            d.FileName,
                            d.FilePath,
                            d.FileSize,
                            d.UploadedAt
                        })
                        .ToList()
                })
                .ToListAsync();

            return Ok(new
            {
                TopicId = topic.Id,
                TopicName = topic.Name,
                TotalIdeas = ideas.Count,
                TotalDocuments = ideas.Sum(i => i.Documents.Count),
                Ideas = ideas
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting ideas and documents for topic {TopicId}", topicId);
            return StatusCode(500, "An error occurred while retrieving topic ideas and documents");
        }
    }

    // PUT: api/Admin/topics/{id}
    [HttpPut("topics/{id}")]
    public async Task<IActionResult> UpdateTopic(int id, [FromBody] UpdateTopicDto dto)
    {
        try
        {
            var topic = await _context.Topics.FindAsync(id);
            if (topic == null)
                return NotFound("Topic not found");

            // Validate deadlines
            if (dto.IdeaSubmissionDeadline >= dto.CommentDeadline)
                return BadRequest("Idea submission deadline must be before comment deadline");

            topic.Name = dto.Name;
            topic.Description = dto.Description;
            topic.IdeaSubmissionDeadline = dto.IdeaSubmissionDeadline;
            topic.CommentDeadline = dto.CommentDeadline;
            topic.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                topic.Id,
                topic.Name,
                topic.Description,
                topic.IdeaSubmissionDeadline,
                topic.CommentDeadline,
                topic.IsActive,
                Message = "Topic updated successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating topic");
            return StatusCode(500, "An error occurred while updating topic");
        }
    }

    // POST: api/Admin/topics
    [HttpPost("topics")]
    public async Task<ActionResult<Topic>> CreateTopic([FromBody] CreateTopicDto dto)
    {
        try
        {
            // Validate deadlines
            if (dto.IdeaSubmissionDeadline >= dto.CommentDeadline)
                return BadRequest("Idea submission deadline must be before comment deadline");

            if (dto.IdeaSubmissionDeadline < DateTime.UtcNow)
                return BadRequest("Idea submission deadline must be in the future");

            var topic = new Topic
            {
                Name = dto.Name,
                Description = dto.Description,
                IdeaSubmissionDeadline = dto.IdeaSubmissionDeadline,
                CommentDeadline = dto.CommentDeadline,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(CreateTopic), new { id = topic.Id }, topic);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating topic");
            return StatusCode(500, "An error occurred while creating topic");
        }
    }

    // DELETE: api/Admin/topics/{id}
    [HttpDelete("topics/{id}")]
    public async Task<IActionResult> DeleteTopic(int id)
    {
        try
        {
            var topic = await _context.Topics
                .Include(t => t.Ideas)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (topic == null)
                return NotFound("Topic not found");

            if (topic.Ideas.Any())
                return BadRequest("Cannot delete topic with existing ideas. Deactivate it instead.");

            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Topic deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting topic");
            return StatusCode(500, "An error occurred while deleting topic");
        }
    }

    // ==================== EXISTING EXPORT METHODS ====================

    // GET: api/Admin/export-csv/{topicId}
    [HttpGet("export-csv/{topicId}")]
    public async Task<IActionResult> ExportIdeasToCSV(int topicId)
    {
        try
        {
            var topic = await _context.Topics.FindAsync(topicId);
            if (topic == null)
                return NotFound("Topic not found");

            // Check if final closure date has passed
            if (DateTime.UtcNow < topic.CommentDeadline)
                return BadRequest("Cannot export data before final closure date");

            var ideas = await _context.Ideas
                .Include(i => i.Author)
                .Include(i => i.Department)
                .Include(i => i.Category)
                .Include(i => i.Comments).ThenInclude(c => c.Author)
                .Include(i => i.Reactions)
                .Where(i => i.TopicId == topicId)
                .ToListAsync();

            var csv = new StringBuilder();
            
            // Header
            csv.AppendLine("Idea ID,Title,Content,Category,Department,Author Name,Author Email,Is Anonymous,Created At,View Count,Thumbs Up,Thumbs Down,Comment Count");

            // Data rows
            foreach (var idea in ideas)
            {
                var thumbsUp = idea.Reactions.Count(r => r.IsThumbsUp);
                var thumbsDown = idea.Reactions.Count(r => !r.IsThumbsUp);
                var commentCount = idea.Comments.Count;

                csv.AppendLine($"{idea.Id}," +
                    $"\"{EscapeCSV(idea.Title)}\"," +
                    $"\"{EscapeCSV(idea.Content)}\"," +
                    $"\"{idea.Category?.Name ?? "N/A"}\"," +
                    $"\"{idea.Department?.Name ?? "N/A"}\"," +
                    $"\"{EscapeCSV(idea.Author?.FullName ?? "Anonymous")}\"," +
                    $"\"{idea.Author?.Email ?? "N/A"}\"," +
                    $"{idea.IsAnonymous}," +
                    $"{idea.CreatedAt:yyyy-MM-dd HH:mm:ss}," +
                    $"{idea.ViewCount}," +
                    $"{thumbsUp}," +
                    $"{thumbsDown}," +
                    $"{commentCount}");
            }

            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            var fileName = $"Ideas_Export_{topic.Name.Replace(" ", "_")}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";

            return File(bytes, "text/csv", fileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error exporting CSV");
            return StatusCode(500, "An error occurred while exporting data");
        }
    }

    // GET: api/Admin/export-documents/{topicId}
    [HttpGet("export-documents/{topicId}")]
    public async Task<IActionResult> ExportDocumentsZIP(int topicId)
    {
        try
        {
            var topic = await _context.Topics.FindAsync(topicId);
            if (topic == null)
                return NotFound("Topic not found");

            // Check if final closure date has passed
            if (DateTime.UtcNow < topic.CommentDeadline)
                return BadRequest("Cannot export documents before final closure date");

            var documents = await _context.Documents
                .Include(d => d.Idea)
                .Where(d => d.Idea!.TopicId == topicId)
                .ToListAsync();

            if (!documents.Any())
                return NotFound("No documents found for this topic");

            // Create temporary ZIP file
            var tempPath = Path.Combine(Path.GetTempPath(), $"Documents_{Guid.NewGuid()}.zip");

            using (var archive = ZipFile.Open(tempPath, ZipArchiveMode.Create))
            {
                foreach (var doc in documents)
                {
                    var physicalPath = Path.Combine(
                        _environment.WebRootPath ?? "wwwroot",
                        doc.FilePath.TrimStart('/'));

                    if (System.IO.File.Exists(physicalPath))
                    {
                        // Create folder structure: IdeaID/filename
                        var entryName = $"Idea_{doc.IdeaId}/{doc.FileName}";
                        archive.CreateEntryFromFile(physicalPath, entryName);
                    }
                }
            }

            var bytes = await System.IO.File.ReadAllBytesAsync(tempPath);
            System.IO.File.Delete(tempPath); // Clean up temp file

            var fileName = $"Documents_Export_{topic.Name.Replace(" ", "_")}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.zip";

            return File(bytes, "application/zip", fileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error exporting documents");
            return StatusCode(500, "An error occurred while exporting documents");
        }
    }

    // GET: api/Admin/export-all-data/{topicId}
    [HttpGet("export-all-data/{topicId}")]
    public async Task<IActionResult> ExportAllData(int topicId)
    {
        try
        {
            var topic = await _context.Topics.FindAsync(topicId);
            if (topic == null)
                return NotFound("Topic not found");

            // Check if final closure date has passed
            if (DateTime.UtcNow < topic.CommentDeadline)
                return BadRequest("Cannot export data before final closure date");

            // Create temporary directory
            var tempDir = Path.Combine(Path.GetTempPath(), $"Export_{Guid.NewGuid()}");
            Directory.CreateDirectory(tempDir);

            // 1. Export Ideas CSV
            var ideas = await _context.Ideas
                .Include(i => i.Author)
                .Include(i => i.Department)
                .Include(i => i.Category)
                .Include(i => i.Reactions)
                .Include(i => i.Comments)
                .Where(i => i.TopicId == topicId)
                .ToListAsync();

            var ideasCsv = GenerateIdeasCSV(ideas);
            await System.IO.File.WriteAllTextAsync(
                Path.Combine(tempDir, "Ideas.csv"),
                ideasCsv);

            // 2. Export Comments CSV
            var comments = ideas.SelectMany(i => i.Comments).ToList();
            var commentsCsv = GenerateCommentsCSV(comments);
            await System.IO.File.WriteAllTextAsync(
                Path.Combine(tempDir, "Comments.csv"),
                commentsCsv);

            // 3. Export Reactions CSV
            var reactions = ideas.SelectMany(i => i.Reactions).ToList();
            var reactionsCsv = GenerateReactionsCSV(reactions);
            await System.IO.File.WriteAllTextAsync(
                Path.Combine(tempDir, "Reactions.csv"),
                reactionsCsv);

            // 4. Copy documents
            var documents = await _context.Documents
                .Include(d => d.Idea)
                .Where(d => d.Idea!.TopicId == topicId)
                .ToListAsync();

            if (documents.Any())
            {
                var docsDir = Path.Combine(tempDir, "Documents");
                Directory.CreateDirectory(docsDir);

                foreach (var doc in documents)
                {
                    var sourcePath = Path.Combine(
                        _environment.WebRootPath ?? "wwwroot",
                        doc.FilePath.TrimStart('/'));

                    if (System.IO.File.Exists(sourcePath))
                    {
                        var destDir = Path.Combine(docsDir, $"Idea_{doc.IdeaId}");
                        Directory.CreateDirectory(destDir);
                        var destPath = Path.Combine(destDir, doc.FileName);
                        System.IO.File.Copy(sourcePath, destPath);
                    }
                }
            }

            // Create ZIP
            var zipPath = Path.Combine(Path.GetTempPath(), $"AllData_{Guid.NewGuid()}.zip");
            ZipFile.CreateFromDirectory(tempDir, zipPath);

            var bytes = await System.IO.File.ReadAllBytesAsync(zipPath);

            // Clean up
            Directory.Delete(tempDir, true);
            System.IO.File.Delete(zipPath);

            var fileName = $"AllData_Export_{topic.Name.Replace(" ", "_")}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.zip";

            return File(bytes, "application/zip", fileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error exporting all data");
            return StatusCode(500, "An error occurred while exporting all data");
        }
    }

    private string GenerateIdeasCSV(List<Models.Idea> ideas)
    {
        var csv = new StringBuilder();
        csv.AppendLine("ID,Title,Content,Category,Department,Author,Email,IsAnonymous,CreatedAt,ViewCount,ThumbsUp,ThumbsDown,CommentCount");

        foreach (var idea in ideas)
        {
            csv.AppendLine($"{idea.Id}," +
                $"\"{EscapeCSV(idea.Title)}\"," +
                $"\"{EscapeCSV(idea.Content)}\"," +
                $"\"{idea.Category?.Name ?? "N/A"}\"," +
                $"\"{idea.Department?.Name ?? "N/A"}\"," +
                $"\"{EscapeCSV(idea.Author?.FullName ?? "Anonymous")}\"," +
                $"\"{idea.Author?.Email ?? "N/A"}\"," +
                $"{idea.IsAnonymous}," +
                $"{idea.CreatedAt:yyyy-MM-dd HH:mm:ss}," +
                $"{idea.ViewCount}," +
                $"{idea.Reactions.Count(r => r.IsThumbsUp)}," +
                $"{idea.Reactions.Count(r => !r.IsThumbsUp)}," +
                $"{idea.Comments.Count}");
        }

        return csv.ToString();
    }

    private string GenerateCommentsCSV(List<Models.Comment> comments)
    {
        var csv = new StringBuilder();
        csv.AppendLine("ID,IdeaID,Author,Email,Content,IsAnonymous,CreatedAt");

        foreach (var comment in comments)
        {
            csv.AppendLine($"{comment.Id}," +
                $"{comment.IdeaId}," +
                $"\"{EscapeCSV(comment.Author?.FullName ?? "Anonymous")}\"," +
                $"\"{comment.Author?.Email ?? "N/A"}\"," +
                $"\"{EscapeCSV(comment.Content)}\"," +
                $"{comment.IsAnonymous}," +
                $"{comment.CreatedAt:yyyy-MM-dd HH:mm:ss}");
        }

        return csv.ToString();
    }

    private string GenerateReactionsCSV(List<Models.Reaction> reactions)
    {
        var csv = new StringBuilder();
        csv.AppendLine("ID,IdeaID,UserID,IsThumbsUp,CreatedAt");

        foreach (var reaction in reactions)
        {
            csv.AppendLine($"{reaction.Id}," +
                $"{reaction.IdeaId}," +
                $"{reaction.UserId}," +
                $"{reaction.IsThumbsUp}," +
                $"{reaction.CreatedAt:yyyy-MM-dd HH:mm:ss}");
        }

        return csv.ToString();
    }

    private string EscapeCSV(string? value)
    {
        if (string.IsNullOrEmpty(value))
            return string.Empty;

        return value.Replace("\"", "\"\"").Replace("\n", " ").Replace("\r", " ");
    }
}
