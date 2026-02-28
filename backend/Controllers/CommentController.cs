using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<CommentController> _logger;

    public CommentController(AppDbContext context, IEmailService emailService, ILogger<CommentController> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    // GET: api/comment/idea/{ideaId}
    [HttpGet("idea/{ideaId}")]
    public async Task<IActionResult> GetCommentsByIdeaId(int ideaId)
    {
        try
        {
            var comments = await _context.Comments
                .Include(c => c.Author)
                .Where(c => c.IdeaId == ideaId)
                .OrderBy(c => c.CreatedAt)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.IsAnonymous,
                    AuthorName = c.IsAnonymous ? "Anonymous" : c.Author!.FullName,
                    c.IdeaId,
                    c.CreatedAt,
                    c.UpdatedAt
                })
                .ToListAsync();

            return Ok(comments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching comments for idea {IdeaId}", ideaId);
            return StatusCode(500, new { message = "Error fetching comments" });
        }
    }

    // GET: api/comment/latest
    [HttpGet("latest")]
    public async Task<IActionResult> GetLatestComments([FromQuery] int? topicId, [FromQuery] int limit = 10)
    {
        try
        {
            var query = _context.Comments
                .Include(c => c.Author)
                .Include(c => c.Idea)
                    .ThenInclude(i => i.Topic)
                .AsQueryable();

            if (topicId.HasValue)
                query = query.Where(c => c.Idea.TopicId == topicId.Value);

            var comments = await query
                .OrderByDescending(c => c.CreatedAt)
                .Take(limit)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.IsAnonymous,
                    AuthorName = c.IsAnonymous ? "Anonymous" : c.Author!.FullName,
                    IdeaId = c.IdeaId,
                    IdeaTitle = c.Idea.Title,
                    c.CreatedAt
                })
                .ToListAsync();

            return Ok(comments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching latest comments");
            return StatusCode(500, new { message = "Error fetching latest comments" });
        }
    }

    // POST: api/comment
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateComment([FromBody] CommentDto commentDto)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "Invalid user token" });

            // Get idea with topic
            var idea = await _context.Ideas
                .Include(i => i.Topic)
                .Include(i => i.Author)
                .FirstOrDefaultAsync(i => i.Id == commentDto.IdeaId);

            if (idea == null)
                return NotFound(new { message = "Idea not found" });

            // Check if topic allows commenting
            if (!idea.Topic!.CanComment())
                return BadRequest(new { message = "Comment deadline has passed for this topic" });

            var newComment = new Comment
            {
                Content = commentDto.Content,
                IsAnonymous = commentDto.IsAnonymous,
                AuthorId = userId,
                IdeaId = commentDto.IdeaId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(newComment);
            await _context.SaveChangesAsync();

            // Send email notification to idea author
            if (idea.Author != null && idea.AuthorId != userId) // Don't send email if commenting on own idea
            {
                await _emailService.SendNewCommentNotificationAsync(
                    idea.Author.Email,
                    idea.Author.FullName,
                    idea.Title,
                    commentDto.Content
                );
            }

            return Ok(new
            {
                id = newComment.Id,
                message = "Comment added successfully. Email notification sent to idea author."
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating comment");
            return StatusCode(500, new { message = "Error creating comment" });
        }
    }

    // PUT: api/comment/{id}
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateComment(int id, [FromBody] CommentDto commentDto)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "Invalid user token" });

            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
                return NotFound(new { message = "Comment not found" });

            // Only author can update their comment
            if (comment.AuthorId != userId)
                return Forbid();

            comment.Content = commentDto.Content;
            comment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Comment updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating comment {CommentId}", id);
            return StatusCode(500, new { message = "Error updating comment" });
        }
    }

    // DELETE: api/comment/{id}
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteComment(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            var userRole = User.FindFirst("role")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "Invalid user token" });

            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
                return NotFound(new { message = "Comment not found" });

            // Only author or QA Manager/Administrator can delete
            if (comment.AuthorId != userId && userRole != "QAManager" && userRole != "Administrator")
                return Forbid();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Comment deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting comment {CommentId}", id);
            return StatusCode(500, new { message = "Error deleting comment" });
        }
    }
}

public class CommentDto
{
    public string Content { get; set; } = string.Empty;
    public bool IsAnonymous { get; set; }
    public int IdeaId { get; set; }
}
