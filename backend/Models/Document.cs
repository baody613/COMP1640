namespace backend.Models;

public class Document
{
    public int Id { get; set; }
    public int IdeaId { get; set; }
    public Idea? Idea { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string MimeType { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
