using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<CategoryController> _logger;

    public CategoryController(AppDbContext context, ILogger<CategoryController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/category
    [HttpGet]
    public async Task<IActionResult> GetAllCategories([FromQuery] int? topicId)
    {
        try
        {
            var query = _context.Categories.AsQueryable();

            if (topicId.HasValue)
                query = query.Where(c => c.TopicId == topicId.Value);

            var categories = await query
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description,
                    c.TopicId,
                    IdeasCount = c.Ideas.Count
                })
                .ToListAsync();

            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching categories");
            return StatusCode(500, new { message = "Error fetching categories" });
        }
    }

    // GET: api/category/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategoryById(int id)
    {
        try
        {
            var category = await _context.Categories
                .Include(c => c.Ideas)
                .Where(c => c.Id == id)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description,
                    c.TopicId,
                    IdeasCount = c.Ideas.Count
                })
                .FirstOrDefaultAsync();

            if (category == null)
                return NotFound(new { message = "Category not found" });

            return Ok(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching category {CategoryId}", id);
            return StatusCode(500, new { message = "Error fetching category" });
        }
    }

    // POST: api/category
    [HttpPost]
    [Authorize(Roles = "QAManager,Administrator")]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryDto categoryDto)
    {
        try
        {
            var newCategory = new Category
            {
                Name = categoryDto.Name,
                Description = categoryDto.Description,
                TopicId = categoryDto.TopicId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Categories.Add(newCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategoryById), new { id = newCategory.Id }, newCategory);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating category");
            return StatusCode(500, new { message = "Error creating category" });
        }
    }

    // PUT: api/category/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "QAManager,Administrator")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryDto categoryDto)
    {
        try
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new { message = "Category not found" });

            category.Name = categoryDto.Name;
            category.Description = categoryDto.Description;

            await _context.SaveChangesAsync();

            return Ok(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating category {CategoryId}", id);
            return StatusCode(500, new { message = "Error updating category" });
        }
    }

    // DELETE: api/category/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "QAManager,Administrator")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        try
        {
            var category = await _context.Categories
                .Include(c => c.Ideas)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return NotFound(new { message = "Category not found" });

            // Cannot delete if category has ideas
            if (category.Ideas.Any())
                return BadRequest(new { message = "Cannot delete category that has associated ideas" });

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Category deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting category {CategoryId}", id);
            return StatusCode(500, new { message = "Error deleting category" });
        }
    }
}

public class CategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int TopicId { get; set; }
}
