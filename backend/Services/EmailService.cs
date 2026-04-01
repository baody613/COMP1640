using System.Text;
using backend.Models;

namespace backend.Services;

public interface IEmailService
{
    Task SendIdeaSubmittedNotificationAsync(Idea idea, User coordinator);
    Task SendNewIdeaNotificationAsync(string coordinatorEmail, string coordinatorName, string ideaTitle, string ideaContent);
    Task SendCommentNotificationAsync(Comment comment, User ideaAuthor);
    Task SendNewCommentNotificationAsync(string authorEmail, string authorName, string ideaTitle, string commentContent);
    Task SendBulkEmailAsync(List<string> recipients, string subject, string body);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendIdeaSubmittedNotificationAsync(Idea idea, User coordinator)
    {
        try
        {
            var rows = new[]
            {
                $"Dear {coordinator.FullName},",
                "A new idea has been submitted in your department.",
                $"<strong>Title:</strong> {idea.Title}",
                $"<strong>Author:</strong> {(idea.IsAnonymous ? "Anonymous" : idea.Author?.FullName)}",
                $"<strong>Category:</strong> {idea.Category?.Name}",
                $"<strong>Submitted:</strong> {idea.CreatedAt:dd MMM yyyy HH:mm}",
                $"<strong>Content:</strong> {idea.Content}"
            };
            var body = BuildHtmlEmail("New Idea Submitted", rows,
                $"http://localhost:3000/idea/{idea.Id}", "View Idea");

            await SendEmailAsync(coordinator.Email, $"New Idea: {idea.Title}", body);
            _logger.LogInformation("Sent idea notification to QA Coordinator: {Email}", coordinator.Email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send idea notification");
        }
    }

    public async Task SendCommentNotificationAsync(Comment comment, User ideaAuthor)
    {
        try
        {
            var rows = new[]
            {
                $"Dear {ideaAuthor.FullName},",
                $"A new comment has been posted on your idea: <strong>{comment.Idea?.Title}</strong>",
                $"<strong>Comment by:</strong> {(comment.IsAnonymous ? "Anonymous" : comment.Author?.FullName)}",
                $"<strong>Comment:</strong> {comment.Content}",
                $"<strong>Posted:</strong> {comment.CreatedAt:dd MMM yyyy HH:mm}"
            };
            var body = BuildHtmlEmail("New Comment on Your Idea", rows,
                $"http://localhost:3000/idea/{comment.IdeaId}", "View Idea");

            await SendEmailAsync(ideaAuthor.Email, $"New Comment: {comment.Idea?.Title}", body);
            _logger.LogInformation("Sent comment notification to idea author: {Email}", ideaAuthor.Email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send comment notification");
        }
    }

    public async Task SendNewIdeaNotificationAsync(string coordinatorEmail, string coordinatorName, string ideaTitle, string ideaContent)
    {
        try
        {
            var rows = new[]
            {
                $"Dear {coordinatorName},",
                "A new idea has been submitted in your department and requires your review.",
                $"<strong>Title:</strong> {ideaTitle}",
                $"<strong>Summary:</strong> {ideaContent}",
                "Please log in to the system to review and respond."
            };
            var body = BuildHtmlEmail("New Idea Notification", rows);
            await SendEmailAsync(coordinatorEmail, $"New Idea Submitted: {ideaTitle}", body);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send new idea notification");
        }
    }

    public async Task SendNewCommentNotificationAsync(string authorEmail, string authorName, string ideaTitle, string commentContent)
    {
        try
        {
            var rows = new[]
            {
                $"Dear {authorName},",
                $"Your idea <strong>{ideaTitle}</strong> has received a new comment.",
                $"<blockquote style=\"border-left:4px solid #2563eb;margin:0;padding-left:16px;color:#374151\">{commentContent}</blockquote>",
                "Log in to reply or review the discussion."
            };
            var body = BuildHtmlEmail("New Comment on Your Idea", rows);
            await SendEmailAsync(authorEmail, $"New Comment: {ideaTitle}", body);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send comment notification");
        }
    }

    public async Task SendBulkEmailAsync(List<string> recipients, string subject, string body)
    {
        foreach (var recipient in recipients)
        {
            await SendEmailAsync(recipient, subject, body);
        }
    }

    private static string BuildHtmlEmail(string heading, IEnumerable<string> paragraphs, string? linkHref = null, string? linkText = null)
    {
        var sb = new StringBuilder();
        sb.Append("<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\" /></head>");
        sb.Append("<body style=\"font-family:Arial,Helvetica,sans-serif;background:#f4f4f4;margin:0;padding:0\">");
        sb.Append("<div style=\"max-width:600px;margin:32px auto;background:#fff;border-radius:8px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,.08)\">");
        sb.Append($"<h2 style=\"color:#2563eb;margin-top:0\">{heading}</h2>");
        foreach (var p in paragraphs)
            sb.Append($"<p style=\"line-height:1.6\">{p}</p>");
        if (linkHref is not null)
            sb.Append($"<p><a href=\"{linkHref}\" style=\"display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:4px;text-decoration:none\">{linkText ?? "View"}</a></p>");
        sb.Append("<hr style=\"border:none;border-top:1px solid #e5e7eb;margin-top:24px\" />");
        sb.Append("<p style=\"font-size:12px;color:#9ca3af\">This is an automated notification from COMP1640 IdeaHub. Do not reply.</p>");
        sb.Append("</div></body></html>");
        return sb.ToString();
    }

    private async Task SendEmailAsync(string to, string subject, string htmlBody)
    {
        // TODO: Implement actual email sending using SMTP
        // For development, just log the email
        
        var enableNotifications = _configuration.GetValue<bool>("EmailSettings:EnableNotifications");
        
        if (!enableNotifications)
        {
            _logger.LogInformation($"Email notifications disabled. Would have sent to {to}: {subject}");
            return;
        }

        // Example using System.Net.Mail (for production, consider using SendGrid, MailKit, etc.)
        /*
        using var client = new SmtpClient(_configuration["EmailSettings:SmtpServer"])
        {
            Port = int.Parse(_configuration["EmailSettings:SmtpPort"]),
            Credentials = new NetworkCredential(
                _configuration["EmailSettings:Username"],
                _configuration["EmailSettings:Password"]),
            EnableSsl = true,
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_configuration["EmailSettings:FromEmail"], _configuration["EmailSettings:FromName"]),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true,
        };
        mailMessage.To.Add(to);

        await client.SendMailAsync(mailMessage);
        */

        // For development/demo purposes
        _logger.LogInformation($"[EMAIL] To: {to}, Subject: {subject}");
        await Task.CompletedTask;
    }
}
