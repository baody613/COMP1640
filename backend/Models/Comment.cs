namespace backend.Models;

public class Comment
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsAnonymous { get; set; } = false;
    public int AuthorId { get; set; }
    public User? Author { get; set; }
    public int IdeaId { get; set; }
    public Idea? Idea { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
