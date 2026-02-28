namespace backend.Models;

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Staff";
    public int? DepartmentId { get; set; }
    public Department? Department { get; set; }
    public bool AgreedTerms { get; set; } = false;
    public DateTime? AgreedTermsDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Navigation properties
    public ICollection<Idea> Ideas { get; set; } = new List<Idea>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();
}
