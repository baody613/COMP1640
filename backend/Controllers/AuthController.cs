using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;

    public AuthController(ILogger<AuthController> logger)
    {
        _logger = logger;
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto loginDto)
    {
        // Mock authentication
        var user = new 
        { 
            Id = 1,
            FullName = "Nguyễn Văn A",
            Email = loginDto.Email,
            Role = "Staff",
            DepartmentId = 1,
            DepartmentName = "Khoa Công nghệ thông tin",
            Token = "mock-jwt-token-here"
        };
        return Ok(user);
    }

    // POST: api/auth/register
    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterDto registerDto)
    {
        var newUser = new 
        { 
            Id = 2,
            FullName = registerDto.FullName,
            Email = registerDto.Email,
            Role = registerDto.Role,
            DepartmentId = registerDto.DepartmentId,
            Message = "Đăng ký thành công"
        };
        return Ok(newUser);
    }

    // GET: api/auth/me
    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        // Mock current user from token
        var user = new 
        { 
            Id = 1,
            FullName = "Nguyễn Văn A",
            Email = "nguyenvana@university.edu",
            Role = "Staff",
            DepartmentId = 1,
            DepartmentName = "Khoa Công nghệ thông tin"
        };
        return Ok(user);
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
    public string Role { get; set; } = "Staff";
    public int DepartmentId { get; set; }
}
