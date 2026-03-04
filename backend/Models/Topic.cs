namespace backend.Models;

public class Topic
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime IdeaSubmissionDeadline { get; set; }
    public DateTime CommentDeadline { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int CreatedById { get; set; }
    public User? CreatedBy { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Navigation properties
    public ICollection<Idea> Ideas { get; set; } = new List<Idea>();
    public ICollection<Category> Categories { get; set; } = new List<Category>();
    
    // Helper methods
    public bool CanSubmitIdea() => DateTime.Now <= IdeaSubmissionDeadline;
    public bool CanComment() => DateTime.Now <= CommentDeadline;
}
