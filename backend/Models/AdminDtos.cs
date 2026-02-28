namespace backend.Models;

// User Management DTOs
public class CreateUserDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int? DepartmentId { get; set; }
}

public class UpdateUserDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Password { get; set; }
    public string Role { get; set; } = string.Empty;
    public int? DepartmentId { get; set; }
    public bool IsActive { get; set; } = true;
}

// Topic Management DTOs
public class CreateTopicDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime IdeaSubmissionDeadline { get; set; }
    public DateTime CommentDeadline { get; set; }
}

public class UpdateTopicDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime IdeaSubmissionDeadline { get; set; }
    public DateTime CommentDeadline { get; set; }
    public bool IsActive { get; set; }
}

// Category Management DTOs
public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int TopicId { get; set; }
}

public class UpdateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int TopicId { get; set; }
}
