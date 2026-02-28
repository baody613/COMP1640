namespace backend.Models;

public class Department
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public int? QACoordinatorId { get; set; }
    public User? QACoordinator { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Idea> Ideas { get; set; } = new List<Idea>();
}
