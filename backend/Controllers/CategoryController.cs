using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ILogger<CategoryController> _logger;

    public CategoryController(ILogger<CategoryController> logger)
    {
        _logger = logger;
    }

    // GET: api/category
    [HttpGet]
    public IActionResult GetAllCategories([FromQuery] int? topicId)
    {
        var categories = new[]
        {
            new { Id = 1, Name = "Cải tiến phương pháp giảng dạy", Description = "", TopicId = 1 },
            new { Id = 2, Name = "Cơ sở vật chất & phòng học", Description = "", TopicId = 1 },
            new { Id = 3, Name = "Dịch vụ hành chính & hỗ trợ sinh viên", Description = "", TopicId = 1 },
            new { Id = 4, Name = "Hỗ trợ tâm lý & sức khỏe tinh thần", Description = "", TopicId = 1 },
            new { Id = 5, Name = "Hạ tầng công nghệ & hệ thống học tập trực tuyến", Description = "", TopicId = 1 },
            new { Id = 6, Name = "Hướng nghiệp & việc làm sau tốt nghiệp", Description = "", TopicId = 1 }
        };
        return Ok(categories);
    }

    // GET: api/category/{id}
    [HttpGet("{id}")]
    public IActionResult GetCategoryById(int id)
    {
        var category = new 
        { 
            Id = id,
            Name = "Hạ tầng công nghệ & hệ thống học tập trực tuyến",
            Description = "Các ý tưởng liên quan đến cải thiện hạ tầng công nghệ thông tin",
            TopicId = 1,
            IdeasCount = 12
        };
        return Ok(category);
    }

    // POST: api/category
    [HttpPost]
    public IActionResult CreateCategory([FromBody] CategoryDto categoryDto)
    {
        // Only QA Manager can create category
        var newCategory = new 
        { 
            Id = 7,
            Name = categoryDto.Name,
            Description = categoryDto.Description,
            TopicId = categoryDto.TopicId,
            CreatedAt = DateTime.UtcNow
        };
        return Ok(newCategory);
    }

    // PUT: api/category/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateCategory(int id, [FromBody] CategoryDto categoryDto)
    {
        var updatedCategory = new 
        { 
            Id = id,
            Name = categoryDto.Name,
            Description = categoryDto.Description
        };
        return Ok(updatedCategory);
    }

    // DELETE: api/category/{id}
    [HttpDelete("{id}")]
    public IActionResult DeleteCategory(int id)
    {
        return NoContent();
    }
}

public class CategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int TopicId { get; set; }
}
