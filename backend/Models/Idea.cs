namespace backend.Models;

public class Idea
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsAnonymous { get; set; } = false;
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
    
    // Helper properties
    public int ThumbsUpCount => Reactions.Count(r => r.IsThumbsUp);
    public int ThumbsDownCount => Reactions.Count(r => !r.IsThumbsUp);
}
