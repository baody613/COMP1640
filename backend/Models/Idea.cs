namespace backend.Models;

public enum IdeaApprovalStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

public class Idea
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsAnonymous { get; set; } = false;
    public IdeaApprovalStatus ApprovalStatus { get; set; } = IdeaApprovalStatus.Pending;
    public int? ReviewedById { get; set; }
    public User? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? RejectionReason { get; set; }
    public int AuthorId { get; set; }
    public User? Author { get; set; }
    public int TopicId { get; set; }
    public Topic? Topic { get; set; }
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public int? DepartmentId { get; set; }
    public Department? Department { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // File attachments - stored as comma-separated filenames
    public string? Attachments { get; set; }
    
    // Statistics
    public int ViewCount { get; set; } = 0;
    
    // Navigation properties
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();
    public ICollection<Document> Documents { get; set; } = new List<Document>();
    
    // Helper properties
    public int ThumbsUpCount => Reactions.Count(r => r.IsThumbsUp);
    public int ThumbsDownCount => Reactions.Count(r => !r.IsThumbsUp);
}
