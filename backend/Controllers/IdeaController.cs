using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IdeaController : ControllerBase
{
    private readonly ILogger<IdeaController> _logger;

    public IdeaController(ILogger<IdeaController> logger)
    {
        _logger = logger;
    }

    // GET: api/idea
    [HttpGet]
    public IActionResult GetAllIdeas([FromQuery] int? topicId, [FromQuery] int? categoryId, [FromQuery] int? departmentId)
    {
        // Mock data with filtering
        var ideas = new[]
        {
            new 
            { 
                Id = 1,
                Title = "Nâng cấp hệ thống Wi-Fi trong khuôn viên",
                Content = "Đề xuất nâng cấp băng thông và mở rộng vùng phủ sóng Wi-Fi...",
                IsAnonymous = false,
                AuthorName = "Nguyễn Văn A",
                TopicId = 1,
                TopicName = "Nâng cao trải nghiệm sinh viên",
                CategoryId = 1,
                CategoryName = "Hạ tầng công nghệ",
                DepartmentName = "Công nghệ thông tin",
                ThumbsUpCount = 25,
                ThumbsDownCount = 2,
                CommentsCount = 8,
                ViewCount = 156,
                CreatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new 
            { 
                Id = 2,
                Title = "Cải thiện quy trình đăng ký học phần",
                Content = "Đề xuất cải tiến giao diện và tối ưu hóa quy trình đăng ký...",
                IsAnonymous = true,
                AuthorName = "Anonymous",
                TopicId = 1,
                TopicName = "Nâng cao trải nghiệm sinh viên",
                CategoryId = 2,
                CategoryName = "Dịch vụ hành chính",
                DepartmentName = "Kinh doanh",
                ThumbsUpCount = 42,
                ThumbsDownCount = 1,
                CommentsCount = 15,
                ViewCount = 234,
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            }
        };
        return Ok(ideas);
    }

    // GET: api/idea/{id}
    [HttpGet("{id}")]
    public IActionResult GetIdeaById(int id)
    {
        var idea = new 
        { 
            Id = id,
            Title = "Nâng cấp hệ thống Wi-Fi trong khuôn viên",
            Content = "Đề xuất nâng cấp băng thông và mở rộng vùng phủ sóng Wi-Fi để đáp ứng nhu cầu học tập trực tuyến...",
            IsAnonymous = false,
            AuthorId = 1,
            AuthorName = "Nguyễn Văn A",
            AuthorEmail = "nguyenvana@university.edu",
            TopicId = 1,
            CategoryId = 1,
            CategoryName = "Hạ tầng công nghệ",
            DepartmentName = "Công nghệ thông tin",
            AttachmentFileName = "wifi-proposal.pdf",
            ThumbsUpCount = 25,
            ThumbsDownCount = 2,
            CommentsCount = 8,
            ViewCount = 156,
            CreatedAt = DateTime.UtcNow.AddDays(-5)
        };
        return Ok(idea);
    }

    // POST: api/idea
    [HttpPost]
    public IActionResult CreateIdea([FromBody] IdeaDto ideaDto)
    {
        // Check if topic allows idea submission
        var newIdea = new 
        { 
            Id = 3,
            Title = ideaDto.Title,
            Content = ideaDto.Content,
            IsAnonymous = ideaDto.IsAnonymous,
            TopicId = ideaDto.TopicId,
            CategoryId = ideaDto.CategoryId,
            CreatedAt = DateTime.UtcNow,
            Message = "Ý tưởng đã được gửi thành công. Email thông báo đã được gửi đến QA Coordinator."
        };
        return CreatedAtAction(nameof(GetIdeaById), new { id = 3 }, newIdea);
    }

    // PUT: api/idea/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateIdea(int id, [FromBody] IdeaDto ideaDto)
    {
        // Only author can update their own idea
        var updatedIdea = new 
        { 
            Id = id,
            Title = ideaDto.Title,
            Content = ideaDto.Content,
            CategoryId = ideaDto.CategoryId,
            UpdatedAt = DateTime.UtcNow
        };
        return Ok(updatedIdea);
    }

    // DELETE: api/idea/{id}
    [HttpDelete("{id}")]
    public IActionResult DeleteIdea(int id)
    {
        // Only author or QA Manager can delete
        return NoContent();
    }

    // POST: api/idea/{id}/react
    [HttpPost("{id}/react")]
    public IActionResult ReactToIdea(int id, [FromBody] ReactionDto reactionDto)
    {
        var reaction = new
        {
            IdeaId = id,
            IsThumbsUp = reactionDto.IsThumbsUp,
            Message = reactionDto.IsThumbsUp ? "Đã thả Thumbs Up" : "Đã thả Thumbs Down"
        };
        return Ok(reaction);
    }

    // GET: api/idea/no-comments
    [HttpGet("no-comments")]
    public IActionResult GetIdeasWithoutComments([FromQuery] int topicId)
    {
        // Report: Ideas without any comments
        var ideas = new[]
        {
            new 
            { 
                Id = 5,
                Title = "Mở rộng giờ mở cửa thư viện",
                AuthorName = "Anonymous",
                CategoryName = "Cơ sở vật chất",
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                CommentsCount = 0
            }
        };
        return Ok(ideas);
    }

    // GET: api/idea/anonymous
    [HttpGet("anonymous")]
    public IActionResult GetAnonymousIdeas([FromQuery] int topicId)
    {
        // Report: Anonymous ideas
        var ideas = new[]
        {
            new 
            { 
                Id = 2,
                Title = "Cải thiện quy trình đăng ký học phần",
                CategoryName = "Dịch vụ hành chính",
                DepartmentName = "Kinh doanh",
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                IsAnonymous = true
            }
        };
        return Ok(ideas);
    }
}

public class IdeaDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsAnonymous { get; set; }
    public int TopicId { get; set; }
    public int CategoryId { get; set; }
}

public class ReactionDto
{
    public bool IsThumbsUp { get; set; }
}
