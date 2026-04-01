using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AppDbContext context, IConfiguration configuration, ILogger<AuthController> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    // GET: api/auth/test-bcrypt (for testing only)
    [HttpGet("test-bcrypt")]
    public IActionResult TestBCrypt([FromQuery] string password = "password123")
    {
        string existingHash = "$2a$11$8GvBJz9VX4qYq5T1kZXLmefL.p3yKYYR9.cOLKLvZJqVvJqWXqD8O";
        string newHash = BCrypt.Net.BCrypt.HashPassword(password);
        bool verifyExisting = BCrypt.Net.BCrypt.Verify(password, existingHash);
        bool verifyNew = BCrypt.Net.BCrypt.Verify(password, newHash);
        
        return Ok(new
        {
            password,
            existingHash,
            newHash,
            verifyExisting,
            verifyNew
        });
    }
    
    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            // Validate email uniqueness
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                return BadRequest(new { message = "Email is already in use" });

            // Validate department exists
            var department = await _context.Departments.FindAsync(registerDto.DepartmentId);
            if (department == null)
                return BadRequest(new { message = "Department does not exist" });

            // Validate password length
            if (string.IsNullOrEmpty(registerDto.Password) || registerDto.Password.Length < 6)
                return BadRequest(new { message = "Password must be at least 6 characters" });

            // Create new user with Staff role (default for registration)
            var user = new User
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = "Staff", // Default role for registered users
                DepartmentId = registerDto.DepartmentId,
                StudentId = registerDto.StudentId?.Trim(),
                AgreedTerms = registerDto.AgreedTerms,
                AgreedTermsDate = registerDto.AgreedTerms ? DateTime.UtcNow : null,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("New user registered: {Email}", user.Email);

            // Generate JWT token for auto-login
            var token = GenerateJwtToken(user);

            return Ok(new
            {
                message = "Registration successful!",
                token,
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role,
                    user.DepartmentId,
                    DepartmentName = department.Name,
                    user.StudentId,
                    user.AgreedTerms,
                    user.AgreedTermsDate
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for {Email}", registerDto.Email);
            return StatusCode(500, new { message = "Registration failed. Please try again." });
        }
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.Department)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.IsActive);

            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            _logger.LogInformation("User found: {Email}, Hash: {Hash}", user.Email, user.PasswordHash);
            _logger.LogInformation("Password to verify: {Password}", loginDto.Password);
            
            // Verify password
            bool isValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            _logger.LogInformation("BCrypt verify result: {Result}", isValid);
            
            if (!isValid)
                return Unauthorized(new { message = "Invalid email or password" });

            // Generate JWT token
            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role,
                    user.DepartmentId,
                    DepartmentName = user.Department?.Name,
                    user.StudentId,
                    user.AgreedTerms,
                    user.AgreedTermsDate
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for {Email}", loginDto.Email);
            return StatusCode(500, new { message = "Error during login" });
        }
    }

    // POST: api/auth/agree-terms
    [HttpPost("agree-terms")]
    [Authorize]
    public async Task<IActionResult> AgreeToTerms()
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            if (user.AgreedTerms)
                return BadRequest(new { message = "You have already agreed to Terms and Conditions" });

            user.AgreedTerms = true;
            user.AgreedTermsDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Terms and Conditions accepted successfully",
                agreedTermsDate = user.AgreedTermsDate
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error agreeing to terms");
            return StatusCode(500, new { message = "Error processing request" });
        }
    }

    // GET: api/auth/me
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "Invalid user token" });

            var user = await _context.Users
                .Include(u => u.Department)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                user.DepartmentId,
                DepartmentName = user.Department?.Name,
                user.StudentId,
                user.AgreedTerms,
                user.AgreedTermsDate
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching current user");
            return StatusCode(500, new { message = "Error fetching user data" });
        }
    }

    private string GenerateJwtToken(User user)
    {
        var (signingKey, issuer, audience, expiryMinutes) = LoadJwtConfig();

        var descriptor = new SecurityTokenDescriptor
        {
            Subject            = new ClaimsIdentity(BuildClaimsForUser(user)),
            Issuer             = issuer,
            Audience           = audience,
            NotBefore          = DateTime.UtcNow,
            IssuedAt           = DateTime.UtcNow,
            Expires            = DateTime.UtcNow.AddMinutes(expiryMinutes),
            SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256Signature)
        };

        var handler = new JwtSecurityTokenHandler();
        return handler.WriteToken(handler.CreateToken(descriptor));
    }

    private (SymmetricSecurityKey Key, string Issuer, string Audience, int ExpiryMinutes) LoadJwtConfig()
    {
        var cfg = _configuration.GetSection("JwtSettings");
        var rawSecret = cfg["SecretKey"]
            ?? throw new InvalidOperationException("JwtSettings:SecretKey is not configured.");

        return (
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(rawSecret)),
            cfg["Issuer"]   ?? "comp1640-ideahub",
            cfg["Audience"] ?? "comp1640-client",
            int.TryParse(cfg["ExpiryMinutes"], out var mins) ? mins : 60
        );
    }

    private static IEnumerable<Claim> BuildClaimsForUser(User user)
    {
        yield return new Claim("userId",         user.Id.ToString());
        yield return new Claim("jti",            Guid.NewGuid().ToString("N"));
        yield return new Claim(ClaimTypes.Email, user.Email);
        yield return new Claim(ClaimTypes.Name,  user.FullName);
        yield return new Claim(ClaimTypes.Role,  user.Role);
        yield return new Claim("role",           user.Role);
        yield return new Claim("deptId",         user.DepartmentId?.ToString() ?? "0");
        yield return new Claim("termsAgreed",    user.AgreedTerms ? "1" : "0");
        if (!string.IsNullOrWhiteSpace(user.StudentId))
            yield return new Claim("studentId", user.StudentId);
    }
}

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public string? StudentId { get; set; }
    public bool AgreedTerms { get; set; } = false;
}
