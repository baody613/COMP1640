using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StatisticsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StatisticsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Statistics/overview
    [HttpGet("overview")]
    public async Task<ActionResult<OverviewStatistics>> GetOverviewStatistics()
    {
        var totalIdeas = await _context.Ideas.CountAsync();
        var totalComments = await _context.Comments.CountAsync();
        var totalUsers = await _context.Users.CountAsync();
        var totalDepartments = await _context.Departments.CountAsync();

        return new OverviewStatistics
        {
            TotalIdeas = totalIdeas,
            TotalComments = totalComments,
            TotalUsers = totalUsers,
            TotalDepartments = totalDepartments
        };
    }

    // GET: api/Statistics/departments
    [HttpGet("departments")]
    [Authorize(Roles = "QAManager,Administrator")]
    public async Task<ActionResult<IEnumerable<DepartmentStatistics>>> GetDepartmentStatistics()
    {
        var stats = await _context.Departments
            .Select(d => new DepartmentStatistics
            {
                DepartmentId = d.Id,
                DepartmentName = d.Name,
                DepartmentCode = d.Code,
                StaffCount = d.Users.Count,
                IdeaCount = d.Ideas.Count,
                CommentCount = d.Ideas.SelectMany(i => i.Comments).Count(),
                TotalViews = d.Ideas.Sum(i => i.ViewCount)
            })
            .ToListAsync();

        return stats;
    }

    // GET: api/Statistics/ideas-by-category
    [HttpGet("ideas-by-category")]
    public async Task<ActionResult<IEnumerable<CategoryStatistics>>> GetIdeasByCategory(int? topicId)
    {
        var query = _context.Categories.AsQueryable();

        if (topicId.HasValue)
            query = query.Where(c => c.TopicId == topicId.Value);

        var stats = await query
            .Select(c => new CategoryStatistics
            {
                CategoryId = c.Id,
                CategoryName = c.Name,
                IdeaCount = c.Ideas.Count,
                CommentCount = c.Ideas.SelectMany(i => i.Comments).Count(),
                ThumbsUpCount = c.Ideas.SelectMany(i => i.Reactions.Where(r => r.IsThumbsUp)).Count(),
                ThumbsDownCount = c.Ideas.SelectMany(i => i.Reactions.Where(r => !r.IsThumbsUp)).Count()
            })
            .ToListAsync();

        return stats;
    }

    // GET: api/Statistics/ideas-by-topic
    [HttpGet("ideas-by-topic")]
    public async Task<ActionResult<IEnumerable<TopicStatistics>>> GetIdeasByTopic()
    {
        var stats = await _context.Topics
            .Select(t => new TopicStatistics
            {
                TopicId = t.Id,
                TopicName = t.Name,
                IdeaCount = t.Ideas.Count,
                CommentCount = t.Ideas.SelectMany(i => i.Comments).Count(),
                TotalViews = t.Ideas.Sum(i => i.ViewCount),
                ParticipantCount = t.Ideas.Select(i => i.AuthorId).Distinct().Count(),
                IdeaSubmissionDeadline = t.IdeaSubmissionDeadline,
                CommentDeadline = t.CommentDeadline,
                IsActive = t.IsActive
            })
            .ToListAsync();

        return stats;
    }

    // GET: api/Statistics/user-engagement/{userId}
    [HttpGet("user-engagement/{userId}")]
    public async Task<ActionResult<UserEngagementStatistics>> GetUserEngagement(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound();

        var stats = new UserEngagementStatistics
        {
            UserId = userId,
            UserName = user.FullName,
            IdeasSubmitted = await _context.Ideas.CountAsync(i => i.AuthorId == userId),
            CommentsPosted = await _context.Comments.CountAsync(c => c.AuthorId == userId),
            ReactionsGiven = await _context.Reactions.CountAsync(r => r.UserId == userId),
            TotalViewsReceived = await _context.Ideas
                .Where(i => i.AuthorId == userId)
                .SumAsync(i => i.ViewCount)
        };

        return stats;
    }

    // GET: api/Statistics/top-contributors
    [HttpGet("top-contributors")]
    public async Task<ActionResult<IEnumerable<TopContributor>>> GetTopContributors(int topN = 10)
    {
        var contributors = await _context.Users
            .Where(u => u.Role == "Staff" || u.Role == "QACoordinator")
            .Select(u => new TopContributor
            {
                UserId = u.Id,
                UserName = u.FullName,
                DepartmentName = u.Department != null ? u.Department.Name : "N/A",
                IdeasCount = u.Ideas.Count,
                CommentsCount = u.Comments.Count,
                TotalEngagement = u.Ideas.Count + u.Comments.Count
            })
            .OrderByDescending(c => c.TotalEngagement)
            .Take(topN)
            .ToListAsync();

        return contributors;
    }

    // GET: api/Statistics/ideas-timeline
    [HttpGet("ideas-timeline")]
    public async Task<ActionResult<IEnumerable<TimelineStatistics>>> GetIdeasTimeline(
        int? topicId,
        DateTime? startDate,
        DateTime? endDate)
    {
        var query = _context.Ideas.AsQueryable();

        if (topicId.HasValue)
            query = query.Where(i => i.TopicId == topicId.Value);

        if (startDate.HasValue)
            query = query.Where(i => i.CreatedAt >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(i => i.CreatedAt <= endDate.Value);

        var stats = await query
            .GroupBy(i => new { i.CreatedAt.Year, i.CreatedAt.Month, i.CreatedAt.Day })
            .Select(g => new TimelineStatistics
            {
                Date = new DateTime(g.Key.Year, g.Key.Month, g.Key.Day),
                IdeaCount = g.Count(),
                CommentCount = g.SelectMany(i => i.Comments).Count()
            })
            .OrderBy(s => s.Date)
            .ToListAsync();

        return stats;
    }
}

// DTOs
public class OverviewStatistics
{
    public int TotalIdeas { get; set; }
    public int TotalComments { get; set; }
    public int TotalUsers { get; set; }
    public int TotalDepartments { get; set; }
}

public class DepartmentStatistics
{
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public string DepartmentCode { get; set; } = string.Empty;
    public int StaffCount { get; set; }
    public int IdeaCount { get; set; }
    public int CommentCount { get; set; }
    public int TotalViews { get; set; }
}

public class CategoryStatistics
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int IdeaCount { get; set; }
    public int CommentCount { get; set; }
    public int ThumbsUpCount { get; set; }
    public int ThumbsDownCount { get; set; }
}

public class TopicStatistics
{
    public int TopicId { get; set; }
    public string TopicName { get; set; } = string.Empty;
    public int IdeaCount { get; set; }
    public int CommentCount { get; set; }
    public int TotalViews { get; set; }
    public int ParticipantCount { get; set; }
    public DateTime IdeaSubmissionDeadline { get; set; }
    public DateTime CommentDeadline { get; set; }
    public bool IsActive { get; set; }
}

public class UserEngagementStatistics
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int IdeasSubmitted { get; set; }
    public int CommentsPosted { get; set; }
    public int ReactionsGiven { get; set; }
    public int TotalViewsReceived { get; set; }
}

public class TopContributor
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public int IdeasCount { get; set; }
    public int CommentsCount { get; set; }
    public int TotalEngagement { get; set; }
}

public class TimelineStatistics
{
    public DateTime Date { get; set; }
    public int IdeaCount { get; set; }
    public int CommentCount { get; set; }
}
