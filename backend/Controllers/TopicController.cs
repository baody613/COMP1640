using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TopicController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<TopicController> _logger;

    public TopicController(AppDbContext context, ILogger<TopicController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/topic/all
    [HttpGet("all")]
    public async Task<IActionResult> GetAllTopics()
    {
        try
        {
            var topics = await _context.Topics
                .Include(t => t.CreatedBy)
                .Include(t => t.Ideas)
                .Include(t => t.Categories)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Description,
                    t.IdeaSubmissionDeadline,
                    t.CommentDeadline,
                    t.IsActive,
                    t.CreatedAt,
                    CreatedBy = t.CreatedBy!.FullName,
                    IdeasCount = t.Ideas.Count,
                    CommentsCount = t.Ideas.SelectMany(i => i.Comments).Count(),
                    CategoriesCount = t.Categories.Count
                })
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(topics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching topics");
            return StatusCode(500, new { message = "Error fetching topics" });
        }
    }

    // GET: api/topic/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTopicById(int id)
    {
        try
        {
            var topic = await _context.Topics
                .Include(t => t.CreatedBy)
                .Include(t => t.Categories)
                .Where(t => t.Id == id)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Description,
                    t.IdeaSubmissionDeadline,
                    t.CommentDeadline,
                    t.IsActive,
                    t.CreatedAt,
                    CreatedBy = t.CreatedBy!.FullName,
                    CanSubmitIdea = DateTime.UtcNow <= t.IdeaSubmissionDeadline,
                    CanComment = DateTime.UtcNow <= t.CommentDeadline,
                    Categories = t.Categories.Select(c => new { c.Id, c.Name, c.Description })
                })
                .FirstOrDefaultAsync();

            if (topic == null)
                return NotFound(new { message = "Topic not found" });

            return Ok(topic);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching topic {TopicId}", id);
            return StatusCode(500, new { message = "Error fetching topic" });
        }
    }

    // POST: api/topic
    [HttpPost]
    [Authorize(Roles = "QAManager,Administrator")]
    public async Task<IActionResult> CreateTopic([FromBody] TopicDto topicDto)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "Invalid user token" });

            var newTopic = new Topic
            {
                Name = topicDto.Name,
                Description = topicDto.Description,
                IdeaSubmissionDeadline = topicDto.IdeaSubmissionDeadline,
                CommentDeadline = topicDto.CommentDeadline,
                CreatedById = userId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Topics.Add(newTopic);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTopicById), new { id = newTopic.Id }, newTopic);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating topic");
            return StatusCode(500, new { message = "Error creating topic" });
        }
    }

    // PUT: api/topic/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "QAManager,Administrator")]
    public async Task<IActionResult> UpdateTopic(int id, [FromBody] TopicDto topicDto)
    {
        try
        {
            var topic = await _context.Topics.FindAsync(id);
            if (topic == null)
                return NotFound(new { message = "Topic not found" });

            topic.Name = topicDto.Name;
            topic.Description = topicDto.Description;
            topic.IdeaSubmissionDeadline = topicDto.IdeaSubmissionDeadline;
            topic.CommentDeadline = topicDto.CommentDeadline;

            await _context.SaveChangesAsync();

            return Ok(topic);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating topic {TopicId}", id);
            return StatusCode(500, new { message = "Error updating topic" });
        }
    }

    // DELETE: api/topic/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeleteTopic(int id)
    {
        try
        {
            var topic = await _context.Topics.FindAsync(id);
            if (topic == null)
                return NotFound(new { message = "Topic not found" });

            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Topic deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting topic {TopicId}", id);
            return StatusCode(500, new { message = "Error deleting topic" });
        }
    }
}

public class TopicDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime IdeaSubmissionDeadline { get; set; }
    public DateTime CommentDeadline { get; set; }
}
