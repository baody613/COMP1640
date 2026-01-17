using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentController : ControllerBase
{
    private readonly ILogger<DepartmentController> _logger;

    public DepartmentController(ILogger<DepartmentController> logger)
    {
        _logger = logger;
    }

    // GET: api/department
    [HttpGet]
    public IActionResult GetAllDepartments()
    {
        var departments = new[]
        {
            new { Id = 1, Name = "Khoa Công nghệ thông tin", Code = "IT" },
            new { Id = 2, Name = "Khoa Kinh doanh", Code = "BUS" },
            new { Id = 3, Name = "Khoa Kế toán", Code = "ACC" },
            new { Id = 4, Name = "Khoa Thiết kế đồ họa", Code = "GD" },
            new { Id = 5, Name = "Khoa Marketing", Code = "MKT" }
        };
        return Ok(departments);
    }

    // GET: api/department/{id}
    [HttpGet("{id}")]
    public IActionResult GetDepartmentById(int id)
    {
        var department = new 
        { 
            Id = id,
            Name = "Khoa Công nghệ thông tin",
            Code = "IT",
            StaffCount = 45,
            IdeasCount = 15
        };
        return Ok(department);
    }
}
