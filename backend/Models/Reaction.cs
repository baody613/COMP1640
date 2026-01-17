namespace backend.Models;

public class Reaction
{
    public int Id { get; set; }
    public bool IsThumbsUp { get; set; } // true = thumbs up, false = thumbs down
    public int UserId { get; set; }
    public User? User { get; set; }
    public int IdeaId { get; set; }
    public Idea? Idea { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
