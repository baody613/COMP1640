using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<DocumentController> _logger;

    public DocumentController(
        AppDbContext context, 
        IWebHostEnvironment environment,
        ILogger<DocumentController> logger)
    {
        _context = context;
        _environment = environment;
        _logger = logger;
    }

    // POST: api/Document/upload/{ideaId}
    [HttpPost("upload/{ideaId}")]
    [Authorize]
    public async Task<ActionResult<Document>> UploadDocument(int ideaId, IFormFile file)
    {
        try
        {
            // Validate idea exists
            var idea = await _context.Ideas.FindAsync(ideaId);
            if (idea == null)
                return NotFound("Idea not found");

            // Get max file size from settings
            var maxFileSizeSetting = await _context.SystemSettings
                .FirstOrDefaultAsync(s => s.SettingKey == "MaxFileUploadSize");
            var maxFileSize = maxFileSizeSetting != null 
                ? long.Parse(maxFileSizeSetting.SettingValue ?? "10485760") 
                : 10485760; // 10MB default

            // Validate file size
            if (file.Length > maxFileSize)
                return BadRequest($"File size exceeds maximum allowed size of {maxFileSize / 1048576}MB");

            // Get allowed file types
            var allowedTypesSetting = await _context.SystemSettings
                .FirstOrDefaultAsync(s => s.SettingKey == "AllowedFileTypes");
            var allowedTypes = allowedTypesSetting?.SettingValue?.Split(',') 
                ?? new[] { ".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".zip" };

            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedTypes.Contains(fileExtension))
                return BadRequest($"File type {fileExtension} is not allowed");

            // Create upload directory if not exists
            var uploadDir = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", ideaId.ToString());
            Directory.CreateDirectory(uploadDir);

            // Generate unique filename
            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadDir, uniqueFileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Create document record
            var document = new Document
            {
                IdeaId = ideaId,
                FileName = file.FileName,
                FilePath = $"/uploads/{ideaId}/{uniqueFileName}",
                FileSize = file.Length,
                MimeType = file.ContentType,
                UploadedAt = DateTime.UtcNow
            };

            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDocument), new { id = document.Id }, document);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading document");
            return StatusCode(500, "An error occurred while uploading the file");
        }
    }

    // GET: api/Document/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Document>> GetDocument(int id)
    {
        var document = await _context.Documents.FindAsync(id);

        if (document == null)
            return NotFound();

        return document;
    }

    // GET: api/Document/idea/{ideaId}
    [HttpGet("idea/{ideaId}")]
    public async Task<ActionResult<IEnumerable<Document>>> GetDocumentsByIdea(int ideaId)
    {
        var documents = await _context.Documents
            .Where(d => d.IdeaId == ideaId)
            .ToListAsync();

        return documents;
    }

    // DELETE: api/Document/{id}
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteDocument(int id)
    {
        var document = await _context.Documents.FindAsync(id);
        if (document == null)
            return NotFound();

        // Delete physical file
        try
        {
            var physicalPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", document.FilePath.TrimStart('/'));
            if (System.IO.File.Exists(physicalPath))
            {
                System.IO.File.Delete(physicalPath);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to delete physical file");
        }

        _context.Documents.Remove(document);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
