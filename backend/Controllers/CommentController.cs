using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly ILogger<CommentController> _logger;

    public CommentController(ILogger<CommentController> logger)
    {
        _logger = logger;
    }

    // GET: api/comment/idea/{ideaId}
    [HttpGet("idea/{ideaId}")]
    public IActionResult GetCommentsByIdeaId(int ideaId)
    {
        var comments = new[]
        {
            new 
            { 
                Id = 1,
                Content = "Ý tưởng rất hay! Tôi hoàn toàn đồng ý với đề xuất này.",
                IsAnonymous = false,
                AuthorName = "Trần Thị B",
                IdeaId = ideaId,
                CreatedAt = DateTime.UtcNow.AddHours(-2)
            },
            new 
            { 
                Id = 2,
                Content = "Nên bổ sung thêm chi tiết về ngân sách thực hiện.",
                IsAnonymous = true,
                AuthorName = "Anonymous",
                IdeaId = ideaId,
                CreatedAt = DateTime.UtcNow.AddHours(-1)
            }
        };
        return Ok(comments);
    }

    // POST: api/comment
    [HttpPost]
    public IActionResult CreateComment([FromBody] CommentDto commentDto)
    {
        // Check if topic allows commenting
        var newComment = new 
        { 
            Id = 3,
            Content = commentDto.Content,
            IsAnonymous = commentDto.IsAnonymous,
            IdeaId = commentDto.IdeaId,
            CreatedAt = DateTime.UtcNow,
            Message = "Bình luận đã được thêm. Email thông báo đã được gửi đến tác giả ý tưởng."
        };
        return Ok(newComment);
    }

    // PUT: api/comment/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateComment(int id, [FromBody] CommentDto commentDto)
    {
        // Only author can update their comment
        var updatedComment = new 
        { 
            Id = id,
            Content = commentDto.Content,
            UpdatedAt = DateTime.UtcNow
        };
        return Ok(updatedComment);
    }

    // DELETE: api/comment/{id}
    [HttpDelete("{id}")]
    public IActionResult DeleteComment(int id)
    {
        // Only author or QA Manager can delete
        return NoContent();
    }
}

public class CommentDto
{
    public string Content { get; set; } = string.Empty;
    public bool IsAnonymous { get; set; }
    public int IdeaId { get; set; }
}
