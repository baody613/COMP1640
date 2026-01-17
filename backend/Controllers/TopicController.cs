using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TopicController : ControllerBase
{
    private readonly ILogger<TopicController> _logger;
    // TODO: Add DbContext when database is configured

    public TopicController(ILogger<TopicController> logger)
    {
        _logger = logger;
    }

    // GET: api/topic
    [HttpGet]
    public IActionResult GetAllTopics()
    {
        // Mock data
        var topics = new[]
        {
            new 
            { 
                Id = 1, 
                Name = "Nâng cao trải nghiệm sinh viên toàn trường",
                Description = "Thu thập ý tưởng cải thiện chất lượng dịch vụ, môi trường học tập...",
                IdeaSubmissionDeadline = new DateTime(2026, 3, 1),
                CommentDeadline = new DateTime(2026, 3, 15),
                IsActive = true,
                IdeasCount = 45,
                CommentsCount = 123
            }
        };
        return Ok(topics);
    }

    // GET: api/topic/{id}
    [HttpGet("{id}")]
    public IActionResult GetTopicById(int id)
    {
        var topic = new 
        { 
            Id = id, 
            Name = "Nâng cao trải nghiệm sinh viên toàn trường",
            Description = "Thu thập ý tưởng cải thiện chất lượng dịch vụ, môi trường học tập...",
            IdeaSubmissionDeadline = new DateTime(2026, 3, 1),
            CommentDeadline = new DateTime(2026, 3, 15),
            IsActive = true,
            CanSubmitIdea = DateTime.UtcNow <= new DateTime(2026, 3, 1),
            CanComment = DateTime.UtcNow <= new DateTime(2026, 3, 15)
        };
        return Ok(topic);
    }

    // POST: api/topic
    [HttpPost]
    public IActionResult CreateTopic([FromBody] TopicDto topicDto)
    {
        // Only QA Manager can create topic
        var newTopic = new 
        { 
            Id = 2,
            Name = topicDto.Name,
            Description = topicDto.Description,
            IdeaSubmissionDeadline = topicDto.IdeaSubmissionDeadline,
            CommentDeadline = topicDto.CommentDeadline,
            CreatedAt = DateTime.UtcNow
        };
        return CreatedAtAction(nameof(GetTopicById), new { id = 2 }, newTopic);
    }

    // PUT: api/topic/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateTopic(int id, [FromBody] TopicDto topicDto)
    {
        var updatedTopic = new 
        { 
            Id = id,
            Name = topicDto.Name,
            Description = topicDto.Description,
            IdeaSubmissionDeadline = topicDto.IdeaSubmissionDeadline,
            CommentDeadline = topicDto.CommentDeadline,
            UpdatedAt = DateTime.UtcNow
        };
        return Ok(updatedTopic);
    }

    // GET: api/topic/{id}/statistics
    [HttpGet("{id}/statistics")]
    public IActionResult GetTopicStatistics(int id)
    {
        var stats = new
        {
            TopicId = id,
            TotalIdeas = 45,
            TotalComments = 123,
            TotalReactions = 234,
            IdeasByDepartment = new[]
            {
                new { Department = "Công nghệ thông tin", Count = 15 },
                new { Department = "Kinh doanh", Count = 12 },
                new { Department = "Kế toán", Count = 10 }
            },
            IdeasByCategory = new[]
            {
                new { Category = "Cơ sở vật chất & phòng học", Count = 18 },
                new { Category = "Hạ tầng công nghệ", Count = 12 },
                new { Category = "Dịch vụ hành chính", Count = 8 }
            }
        };
        return Ok(stats);
    }

    // GET: api/topic/{id}/export
    [HttpGet("{id}/export")]
    public IActionResult ExportTopicData(int id)
    {
        // TODO: Implement CSV/ZIP export
        // Only QA Manager can export
        return Ok(new { Message = "Export functionality - to be implemented" });
    }
}

public class TopicDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime IdeaSubmissionDeadline { get; set; }
    public DateTime CommentDeadline { get; set; }
}
