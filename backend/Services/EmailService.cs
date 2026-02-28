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
            var subject = $"New Idea Submitted: {idea.Title}";
            var body = $@"
                <html>
                <body>
                    <h2>New Idea Submitted</h2>
                    <p>A new idea has been submitted in your department.</p>
                    <h3>{idea.Title}</h3>
                    <p><strong>Submitted by:</strong> {(idea.IsAnonymous ? "Anonymous" : idea.Author?.FullName)}</p>
                    <p><strong>Category:</strong> {idea.Category?.Name}</p>
                    <p><strong>Created at:</strong> {idea.CreatedAt:yyyy-MM-dd HH:mm}</p>
                    <p><strong>Content:</strong></p>
                    <p>{idea.Content}</p>
                    <p><a href='http://localhost:5173/ideas/{idea.Id}'>View Idea</a></p>
                </body>
                </html>
            ";

            await SendEmailAsync(coordinator.Email, subject, body);
            _logger.LogInformation($"Sent idea notification to QA Coordinator: {coordinator.Email}");
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
            var subject = $"New Comment on Your Idea: {comment.Idea?.Title}";
            var body = $@"
                <html>
                <body>
                    <h2>New Comment on Your Idea</h2>
                    <p>Someone has commented on your idea.</p>
                    <h3>{comment.Idea?.Title}</h3>
                    <p><strong>Comment by:</strong> {(comment.IsAnonymous ? "Anonymous" : comment.Author?.FullName)}</p>
                    <p><strong>Comment:</strong></p>
                    <p>{comment.Content}</p>
                    <p><strong>Posted at:</strong> {comment.CreatedAt:yyyy-MM-dd HH:mm}</p>
                    <p><a href='http://localhost:5173/ideas/{comment.IdeaId}'>View Idea</a></p>
                </body>
                </html>
            ";

            await SendEmailAsync(ideaAuthor.Email, subject, body);
            _logger.LogInformation($"Sent comment notification to idea author: {ideaAuthor.Email}");
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
            var subject = $"New Idea Submitted: {ideaTitle}";
            var body = $@"
                <html>
                <body>
                    <h2>New Idea Submitted</h2>
                    <p>Dear {coordinatorName},</p>
                    <p>A new idea has been submitted:</p>
                    <h3>{ideaTitle}</h3>
                    <p>{ideaContent}</p>
                    <p>Please review it in the system.</p>
                </body>
                </html>";

            await SendEmailAsync(coordinatorEmail, subject, body);
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
            var subject = $"New Comment on Your Idea: {ideaTitle}";
            var body = $@"
                <html>
                <body>
                    <h2>New Comment on Your Idea</h2>
                    <p>Dear {authorName},</p>
                    <p>Someone has commented on your idea '{ideaTitle}':</p>
                    <blockquote>{commentContent}</blockquote>
                    <p>Check it out in the system.</p>
                </body>
                </html>";

            await SendEmailAsync(authorEmail, subject, body);
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
