namespace backend.Models;

public class SystemSettings
{
    public int Id { get; set; }
    public string SettingKey { get; set; } = string.Empty;
    public string? SettingValue { get; set; }
    public string? Description { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public int? UpdatedBy { get; set; }
    public User? UpdatedByUser { get; set; }
}
