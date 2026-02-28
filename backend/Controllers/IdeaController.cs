using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IdeaController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<IdeaController> _logger;

    public IdeaController(AppDbContext context, IEmailService emailService, ILogger<IdeaController> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    // GET: api/idea/topic/{topicId}
    [HttpGet("topic/{topicId}")]
    public async Task<IActionResult> GetIdeasByTopic(int topicId, [FromQuery] int page = 1, [FromQuery] int pageSize = 5)
    {
        try
        {
            var query = _context.Ideas
                .Include(i => i.Author)
                .Include(i => i.Category)
                .Include(i => i.Department)
                .Include(i => i.Reactions)
                .Include(i => i.Comments)
                .Where(i => i.TopicId == topicId);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var ideas = await query
                .OrderByDescending(i => i.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(i => new
                {
                    i.Id,
                    i.Title,
                    i.Content,
                    i.IsAnonymous,
                    AuthorId = i.AuthorId,
                    AuthorName = i.IsAnonymous ? "Anonymous" : i.Author!.FullName,
                    i.TopicId,
                    i.CategoryId,
                    CategoryName = i.Category!.Name,
                    DepartmentName = i.Department != null ? i.Department.Name : "",
                    i.ViewCount,
                    ThumbsUpCount = i.Reactions.Count(r => r.IsThumbsUp),
                    ThumbsDownCount = i.Reactions.Count(r => !r.IsThumbsUp),
                    CommentsCount = i.Comments.Count,
                    i.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                data = ideas,
                page,
                pageSize,
                totalCount,
                totalPages
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching ideas for topic {TopicId}", topicId);
            return StatusCode(500, new { message = "Error fetching ideas" });
        }
    }

    // GET: api/idea/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetIdeaById(int id)
    {
        try
        {
            var idea = await _context.Ideas
                .Include(i => i.Author)
                .Include(i => i.Category)
                .Include(i => i.Department)
                .Include(i => i.Reactions)
                .Include(i => i.Comments)
                    .ThenInclude(c => c.Author)
                .Include(i => i.Documents)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (idea == null)
                return NotFound(new { message = "Idea not found" });

            // Increment view count
            idea.ViewCount++;
            await _context.SaveChangesAsync();

            var userIdClaim = User.FindFirst("userId")?.Value;
            int? currentUserId = null;
            if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out int uid))
                currentUserId = uid;

            var result = new
            {
                idea.Id,
                idea.Title,
                idea.Content,
                idea.IsAnonymous,
                AuthorId = idea.AuthorId,
                AuthorName = idea.IsAnonymous ? "Anonymous" : idea.Author!.FullName,
                AuthorEmail = idea.Author!.Email,
                idea.TopicId,
                idea.CategoryId,
                CategoryName = idea.Category!.Name,
                DepartmentName = idea.Department?.Name,
                idea.ViewCount,
                ThumbsUpCount = idea.Reactions.Count(r => r.IsThumbsUp),
                ThumbsDownCount = idea.Reactions.Count(r => !r.IsThumbsUp),
                UserReaction = currentUserId.HasValue
                    ? idea.Reactions.FirstOrDefault(r => r.UserId == currentUserId.Value)?.IsThumbsUp
                    : null,
                Comments = idea.Comments.Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.IsAnonymous,
                    AuthorName = c.IsAnonymous ? "Anonymous" : c.Author!.FullName,
                    c.CreatedAt
                }).OrderBy(c => c.CreatedAt),
                Documents = idea.Documents.Select(d => new
                {
                    d.Id,
                    d.FileName,
                    d.FilePath,
                    d.FileSize,
                    d.UploadedAt
                }),
                idea.CreatedAt,
                idea.UpdatedAt
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching idea {IdeaId}", id);
            return StatusCode(500, new { message = "Error fetching idea" });
        }
    }

    // POST: api/idea
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateIdea([FromBody] IdeaCreateDto ideaDto)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "Invalid user token" });

            // Check if user agreed to terms
            var user = await _context.Users.FindAsync(userId);
            if (user == null || !user.AgreedTerms)
                return BadRequest(new { message = "You must agree to Terms and Conditions before submitting ideas" });

            // Check if topic allows idea submission
            var topic = await _context.Topics.FindAsync(ideaDto.TopicId);
            if (topic == null)
                return NotFound(new { message = "Topic not found" });

            if (!topic.CanSubmitIdea())
                return BadRequest(new { message = "Idea submission deadline has passed for this topic" });

            var newIdea = new Idea
            {
                Title = ideaDto.Title,
                Content = ideaDto.Content,
                IsAnonymous = ideaDto.IsAnonymous,
                AuthorId = userId,
                TopicId = ideaDto.TopicId,
                CategoryId = ideaDto.CategoryId,
                DepartmentId = user.DepartmentId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Ideas.Add(newIdea);
            await _context.SaveChangesAsync();

            // Send email to QA Coordinator
            if (user.DepartmentId.HasValue)
            {
                var department = await _context.Departments
                    .Include(d => d.QACoordinator)
                    .FirstOrDefaultAsync(d => d.Id == user.DepartmentId.Value);

                if (department?.QACoordinator != null)
                {
                    await _emailService.SendNewIdeaNotificationAsync(
                        department.QACoordinator.Email,
                        department.QACoordinator.FullName,
                        newIdea.Title,
                        department.Name
                    );
                }
            }

            return CreatedAtAction(nameof(GetIdeaById), new { id = newIdea.Id }, new { id = newIdea.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating idea");
            return StatusCode(500, new { message = "Error creating idea" });
        }
    }

    // POST: api/idea/{id}/reaction
    [HttpPost("{id}/reaction")]
    [Authorize]
    public async Task<IActionResult> AddReaction(int id, [FromBody] ReactionDto reactionDto)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "Invalid user token" });

            var idea = await _context.Ideas.FindAsync(id);
            if (idea == null)
                return NotFound(new { message = "Idea not found" });

            // Check if user already reacted
            var existingReaction = await _context.Reactions
                .FirstOrDefaultAsync(r => r.IdeaId == id && r.UserId == userId);

            if (existingReaction != null)
            {
                // Update existing reaction
                existingReaction.IsThumbsUp = reactionDto.IsThumbsUp;
            }
            else
            {
                // Create new reaction
                var newReaction = new Reaction
                {
                    IsThumbsUp = reactionDto.IsThumbsUp,
                    UserId = userId,
                    IdeaId = id,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Reactions.Add(newReaction);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Reaction added successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding reaction to idea {IdeaId}", id);
            return StatusCode(500, new { message = "Error adding reaction" });
        }
    }

    // DELETE: api/idea/{id}/reaction
    [HttpDelete("{id}/reaction")]
    [Authorize]
    public async Task<IActionResult> RemoveReaction(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "Invalid user token" });

            var reaction = await _context.Reactions
                .FirstOrDefaultAsync(r => r.IdeaId == id && r.UserId == userId);

            if (reaction == null)
                return NotFound(new { message = "Reaction not found" });

            _context.Reactions.Remove(reaction);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Reaction removed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing reaction from idea {IdeaId}", id);
            return StatusCode(500, new { message = "Error removing reaction" });
        }
    }

    // GET: api/idea/popular
    [HttpGet("popular")]
    public async Task<IActionResult> GetPopularIdeas([FromQuery] int? topicId, [FromQuery] int limit = 10)
    {
        try
        {
            var query = _context.Ideas
                .Include(i => i.Author)
                .Include(i => i.Category)
                .Include(i => i.Reactions)
                .AsQueryable();

            if (topicId.HasValue)
                query = query.Where(i => i.TopicId == topicId.Value);

            var ideas = await query
                .Select(i => new
                {
                    i.Id,
                    i.Title,
                    i.IsAnonymous,
                    AuthorName = i.IsAnonymous ? "Anonymous" : i.Author!.FullName,
                    CategoryName = i.Category!.Name,
                    Score = i.Reactions.Count(r => r.IsThumbsUp) - i.Reactions.Count(r => !r.IsThumbsUp),
                    ThumbsUpCount = i.Reactions.Count(r => r.IsThumbsUp),
                    ThumbsDownCount = i.Reactions.Count(r => !r.IsThumbsUp),
                    i.ViewCount,
                    i.CreatedAt
                })
                .OrderByDescending(i => i.Score)
                .Take(limit)
                .ToListAsync();

            return Ok(ideas);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching popular ideas");
            return StatusCode(500, new { message = "Error fetching popular ideas" });
        }
    }

    // GET: api/idea/most-viewed
    [HttpGet("most-viewed")]
    public async Task<IActionResult> GetMostViewedIdeas([FromQuery] int? topicId, [FromQuery] int limit = 10)
    {
        try
        {
            var query = _context.Ideas
                .Include(i => i.Author)
                .Include(i => i.Category)
                .AsQueryable();

            if (topicId.HasValue)
                query = query.Where(i => i.TopicId == topicId.Value);

            var ideas = await query
                .OrderByDescending(i => i.ViewCount)
                .Take(limit)
                .Select(i => new
                {
                    i.Id,
                    i.Title,
                    i.IsAnonymous,
                    AuthorName = i.IsAnonymous ? "Anonymous" : i.Author!.FullName,
                    CategoryName = i.Category!.Name,
                    i.ViewCount,
                    i.CreatedAt
                })
                .ToListAsync();

            return Ok(ideas);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching most viewed ideas");
            return StatusCode(500, new { message = "Error fetching most viewed ideas" });
        }
    }

    // GET: api/idea/latest
    [HttpGet("latest")]
    public async Task<IActionResult> GetLatestIdeas([FromQuery] int? topicId, [FromQuery] int limit = 10)
    {
        try
        {
            var query = _context.Ideas
                .Include(i => i.Author)
                .Include(i => i.Category)
                .AsQueryable();

            if (topicId.HasValue)
                query = query.Where(i => i.TopicId == topicId.Value);

            var ideas = await query
                .OrderByDescending(i => i.CreatedAt)
                .Take(limit)
                .Select(i => new
                {
                    i.Id,
                    i.Title,
                    i.IsAnonymous,
                    AuthorName = i.IsAnonymous ? "Anonymous" : i.Author!.FullName,
                    CategoryName = i.Category!.Name,
                    i.ViewCount,
                    i.CreatedAt
                })
                .ToListAsync();

            return Ok(ideas);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching latest ideas");
            return StatusCode(500, new { message = "Error fetching latest ideas" });
        }
    }
}

public class IdeaCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsAnonymous { get; set; } = false;
    public int TopicId { get; set; }
    public int CategoryId { get; set; }
}

public class ReactionDto
{
    public bool IsThumbsUp { get; set; }
}
