using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SystemSettingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SystemSettingsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/SystemSettings
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SystemSettings>>> GetAllSettings()
    {
        return await _context.SystemSettings.ToListAsync();
    }

    // GET: api/SystemSettings/{key}
    [HttpGet("{key}")]
    public async Task<ActionResult<SystemSettings>> GetSettingByKey(string key)
    {
        var setting = await _context.SystemSettings
            .FirstOrDefaultAsync(s => s.SettingKey == key);

        if (setting == null)
            return NotFound();

        return setting;
    }

    // PUT: api/SystemSettings/{key}
    [HttpPut("{key}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> UpdateSetting(string key, [FromBody] UpdateSettingDto dto)
    {
        var setting = await _context.SystemSettings
            .FirstOrDefaultAsync(s => s.SettingKey == key);

        if (setting == null)
        {
            // Create new setting if not exists
            setting = new SystemSettings
            {
                SettingKey = key,
                SettingValue = dto.Value,
                Description = dto.Description,
                UpdatedAt = DateTime.UtcNow
            };
            _context.SystemSettings.Add(setting);
        }
        else
        {
            setting.SettingValue = dto.Value;
            if (!string.IsNullOrEmpty(dto.Description))
                setting.Description = dto.Description;
            setting.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/SystemSettings
    [HttpPost]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<SystemSettings>> CreateSetting([FromBody] CreateSettingDto dto)
    {
        var existingSetting = await _context.SystemSettings
            .FirstOrDefaultAsync(s => s.SettingKey == dto.Key);

        if (existingSetting != null)
            return Conflict("Setting already exists");

        var setting = new SystemSettings
        {
            SettingKey = dto.Key,
            SettingValue = dto.Value,
            Description = dto.Description,
            UpdatedAt = DateTime.UtcNow
        };

        _context.SystemSettings.Add(setting);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSettingByKey), new { key = setting.SettingKey }, setting);
    }

    // DELETE: api/SystemSettings/{key}
    [HttpDelete("{key}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeleteSetting(string key)
    {
        var setting = await _context.SystemSettings
            .FirstOrDefaultAsync(s => s.SettingKey == key);

        if (setting == null)
            return NotFound();

        _context.SystemSettings.Remove(setting);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// DTOs
public class UpdateSettingDto
{
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class CreateSettingDto
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
}
