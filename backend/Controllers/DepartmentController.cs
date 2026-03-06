using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<DepartmentController> _logger;

    public DepartmentController(AppDbContext context, ILogger<DepartmentController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/department
    [HttpGet]
    public async Task<IActionResult> GetAllDepartments()
    {
        try
        {
            var departments = await _context.Departments
                .Select(d => new
                {
                    d.Id,
                    d.Name,
                    d.Code,
                    StaffCount = d.Users.Count(u => u.IsActive),
                    IdeasCount = d.Ideas.Count,
                    QACoordinatorId = d.QACoordinatorId,
                    QACoordinatorName = d.QACoordinator != null ? d.QACoordinator.FullName : null
                })
                .OrderBy(d => d.Name)
                .ToListAsync();

            return Ok(departments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching departments");
            return StatusCode(500, new { message = "Error fetching departments" });
        }
    }

    // GET: api/department/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDepartmentById(int id)
    {
        try
        {
            var department = await _context.Departments
                .Where(d => d.Id == id)
                .Select(d => new
                {
                    d.Id,
                    d.Name,
                    d.Code,
                    StaffCount = d.Users.Count(u => u.IsActive),
                    IdeasCount = d.Ideas.Count,
                    QACoordinatorId = d.QACoordinatorId,
                    QACoordinatorName = d.QACoordinator != null ? d.QACoordinator.FullName : null
                })
                .FirstOrDefaultAsync();

            if (department == null)
                return NotFound(new { message = "Department not found" });

            return Ok(department);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching department {DepartmentId}", id);
            return StatusCode(500, new { message = "Error fetching department" });
        }
    }

    // POST: api/department
    [HttpPost]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> CreateDepartment([FromBody] DepartmentDto dto)
    {
        try
        {
            if (await _context.Departments.AnyAsync(d => d.Code == dto.Code))
                return BadRequest(new { message = "Department code already exists" });

            var department = new Department
            {
                Name = dto.Name,
                Code = dto.Code,
                CreatedAt = DateTime.UtcNow
            };

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDepartmentById), new { id = department.Id }, new { department.Id, department.Name, department.Code });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating department");
            return StatusCode(500, new { message = "Error creating department" });
        }
    }

    // PUT: api/department/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> UpdateDepartment(int id, [FromBody] DepartmentDto dto)
    {
        try
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
                return NotFound(new { message = "Department not found" });

            department.Name = dto.Name;
            department.Code = dto.Code;

            await _context.SaveChangesAsync();
            return Ok(new { department.Id, department.Name, department.Code });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating department {DepartmentId}", id);
            return StatusCode(500, new { message = "Error updating department" });
        }
    }
}

public class DepartmentDto
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}
