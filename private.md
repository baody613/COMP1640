# Personal Backend Development Report

## COMP1640 – Student Idea Contribution System

**Module:** COMP1640 – Enterprise Web Development  
**Role:** Backend Developer  
**Technology:** ASP.NET Core 8 (C#), Entity Framework Core, MySQL  
**Academic Year:** 2025–2026

---

## Table of Contents

1. [Overview of My Contribution](#1-overview-of-my-contribution)
2. [System Architecture](#2-system-architecture)
3. [Database Design & Entity Framework Core](#3-database-design--entity-framework-core)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [API Endpoints Implemented](#5-api-endpoints-implemented)
6. [Email Notification Service](#6-email-notification-service)
7. [File Upload & Document Management](#7-file-upload--document-management)
8. [Statistics & Reporting](#8-statistics--reporting)
9. [Challenges & Solutions](#9-challenges--solutions)
10. [Reflection](#10-reflection)

---

## 1. Overview of My Contribution

My primary responsibility in this project was the full backend development of the Student Idea Contribution System (SICS). I designed and implemented the RESTful API using **ASP.NET Core 8 (C#)** with **Entity Framework Core** as the ORM and **MySQL** as the relational database engine.

Key areas I was responsible for:

| Area            | Description                                           |
| --------------- | ----------------------------------------------------- |
| Database Schema | Designed all 9 tables and their relationships         |
| REST API        | Implemented 10 controllers with 50+ endpoints         |
| Authentication  | JWT-based authentication with BCrypt password hashing |
| Authorization   | Role-based access control (RBAC) for 4 user roles     |
| Email Service   | Automated email notifications via SMTP                |
| File Management | Secure file upload and ZIP download capability        |
| Statistics      | Analytics endpoints for admin dashboard               |

---

## 2. System Architecture

The backend follows a clean **layered architecture**:

```
frontend (React)
      |
      | HTTP/JSON
      v
  Controllers       ← API layer (request/response handling)
      |
  AppDbContext      ← Data access layer (Entity Framework Core)
      |
   MySQL DB         ← Persistence layer
      |
  EmailService      ← External service (SMTP)
```

**Project structure:**

```
backend/
├── Controllers/          # 10 API controllers
│   ├── AuthController.cs
│   ├── IdeaController.cs
│   ├── CommentController.cs
│   ├── DocumentController.cs
│   ├── AdminController.cs
│   ├── StatisticsController.cs
│   ├── TopicController.cs
│   ├── CategoryController.cs
│   ├── DepartmentController.cs
│   └── SystemSettingsController.cs
├── Models/               # 9 entity models + DTOs
├── Data/
│   └── AppDbContext.cs   # EF Core DbContext
├── Services/
│   └── EmailService.cs   # SMTP email service
├── Migrations/           # EF Core database migrations
└── Program.cs            # App configuration & DI registration
```

**Program.cs** acts as the composition root — all services, middleware, and configurations are registered here: JWT authentication, CORS, EF Core DbContext, Swagger, and response compression.

---

## 3. Database Design & Entity Framework Core

I designed the full database schema consisting of **9 tables** and configured all relationships using EF Core Fluent API inside `AppDbContext.OnModelCreating()`.

### Entity Relationship Summary

| Entity           | Key Relationships                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| `Departments`    | Has many `Users`, has many `Ideas`, has one `QACoordinator` (User)                                  |
| `Users`          | Belongs to `Departments`, authors `Ideas` and `Comments`                                            |
| `Topics`         | Has many `Ideas`, has many `Categories`, created by `User`                                          |
| `Categories`     | Belongs to `Topic`, has many `Ideas`                                                                |
| `Ideas`          | Belongs to `User`, `Topic`, `Category`, `Department`; has many `Comments`, `Reactions`, `Documents` |
| `Comments`       | Belongs to `Idea` and `User`                                                                        |
| `Reactions`      | Belongs to `Idea` and `User` (thumbs up / thumbs down)                                              |
| `Documents`      | File attachments belonging to `Ideas`                                                               |
| `SystemSettings` | Key-value configuration store                                                                       |

### EF Core Configuration Highlights

- **Unique index** on `Users.Email` to prevent duplicate accounts
- **Unique index** on `Departments.Code`
- **DeleteBehavior.Restrict** on `Users → Department` to prevent accidental cascade deletes
- **DeleteBehavior.SetNull** on `Departments.QACoordinatorId` so removing a QA coordinator does not delete the department
- **DeleteBehavior.Cascade** on `Ideas → Comments`, `Ideas → Reactions`, `Ideas → Documents`

### Migration

I created the initial EF Core migration (`InitialCreate`) which generates the complete schema programmatically, ensuring the database schema stays in sync with the C# models throughout development.

---

## 4. Authentication & Authorization

Security was a critical concern. I implemented **JWT Bearer authentication** with **BCrypt password hashing**.

### JWT Configuration (`Program.cs`)

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey!))
        };
    });
```

### AuthController Endpoints

| Method | Endpoint             | Description                             |
| ------ | -------------------- | --------------------------------------- |
| POST   | `/api/auth/register` | Register new user (default role: Staff) |
| POST   | `/api/auth/login`    | Login and receive JWT token             |
| GET    | `/api/auth/me`       | Get current authenticated user profile  |
| PUT    | `/api/auth/profile`  | Update profile (name, password)         |

### Registration Flow

1. Validate email uniqueness
2. Validate department exists
3. Validate password length (minimum 6 characters)
4. Hash password using `BCrypt.Net.BCrypt.HashPassword()`
5. Assign default role `Staff`
6. Save to database
7. Generate JWT token for immediate auto-login

### Login Flow

1. Find user by email
2. Verify password with `BCrypt.Net.BCrypt.Verify()`
3. Check if account is active (`IsActive = true`)
4. Generate JWT token with claims: `UserId`, `Email`, `Role`, `DepartmentId`
5. Return token + user object to frontend

### Role-Based Authorization

The system supports 4 roles with controlled access:

| Role            | Access Level                                                     |
| --------------- | ---------------------------------------------------------------- |
| `Administrator` | Full system access: user management, settings, all data          |
| `QAManager`     | Manage all topics, categories, export data, view all departments |
| `QACoordinator` | Manage their own department's ideas and topics                   |
| `Staff`         | Submit ideas, comment, react within open topics                  |

Controllers use `[Authorize(Roles = "...")]` to enforce access:

```csharp
[Authorize(Roles = "QAManager,Administrator")]
public class AdminController : ControllerBase { ... }
```

---

## 5. API Endpoints Implemented

### IdeaController

The core controller. Handles the full lifecycle of idea submissions.

| Method | Endpoint                    | Auth         | Description                               |
| ------ | --------------------------- | ------------ | ----------------------------------------- |
| GET    | `/api/idea/topic/{topicId}` | Public       | Get paginated ideas for a topic           |
| GET    | `/api/idea/{id}`            | Public       | Get single idea with comments & reactions |
| POST   | `/api/idea`                 | Staff        | Submit new idea                           |
| PUT    | `/api/idea/{id}`            | Author       | Edit own idea                             |
| DELETE | `/api/idea/{id}`            | Author/Admin | Delete idea                               |
| POST   | `/api/idea/{id}/react`      | Auth         | Thumbs up / thumbs down                   |
| GET    | `/api/idea/my`              | Auth         | Get current user's submitted ideas        |

**Privacy feature:** When an idea is submitted with `IsAnonymous = true`, the `AuthorId` and `AuthorName` are never exposed in API responses, protecting the submitter's identity.

**Pagination:** The list endpoint supports `page` and `pageSize` query parameters to avoid loading all records at once.

### CommentController

| Method | Endpoint                     | Auth         | Description                                 |
| ------ | ---------------------------- | ------------ | ------------------------------------------- |
| GET    | `/api/comment/idea/{ideaId}` | Public       | Get all comments for an idea                |
| GET    | `/api/comment/latest`        | Auth         | Get latest comments (optional topic filter) |
| POST   | `/api/comment`               | Auth         | Post a new comment                          |
| PUT    | `/api/comment/{id}`          | Author       | Edit own comment                            |
| DELETE | `/api/comment/{id}`          | Author/Admin | Delete comment                              |

After a comment is posted, the system automatically sends an **email notification** to the idea's author (unless the idea is anonymous).

### AdminController

Restricted to `QAManager` and `Administrator` roles.

| Method | Endpoint                | Description                         |
| ------ | ----------------------- | ----------------------------------- |
| GET    | `/api/admin/users`      | List all users                      |
| POST   | `/api/admin/users`      | Create new user                     |
| PUT    | `/api/admin/users/{id}` | Update user (role, status)          |
| DELETE | `/api/admin/users/{id}` | Deactivate user                     |
| GET    | `/api/admin/export-csv` | Export all ideas as CSV             |
| GET    | `/api/admin/export-zip` | Export all ideas + documents as ZIP |

### TopicController, CategoryController, DepartmentController

These controllers provide CRUD operations for their respective entities. Topic management includes deadline enforcement — ideas cannot be submitted to a topic after its `ClosureDate`, and comments are disabled after `FinalClosureDate`.

### SystemSettingsController

Manages configurable system parameters stored in the `SystemSettings` table:

| Key                        | Purpose                                      |
| -------------------------- | -------------------------------------------- |
| `MaxFileUploadSize`        | Maximum allowed file size (bytes)            |
| `AllowedFileTypes`         | Comma-separated list of permitted extensions |
| `SystemEmail`              | SMTP sender address                          |
| `EnableEmailNotifications` | Toggle email service on/off                  |

---

## 6. Email Notification Service

I implemented an abstracted email service using the `IEmailService` interface to keep the email logic decoupled from controllers.

```csharp
public interface IEmailService
{
    Task SendIdeaSubmittedNotificationAsync(Idea idea, User coordinator);
    Task SendNewIdeaNotificationAsync(string coordinatorEmail, ...);
    Task SendCommentNotificationAsync(Comment comment, User ideaAuthor);
    Task SendNewCommentNotificationAsync(string authorEmail, ...);
    Task SendBulkEmailAsync(List<string> recipients, string subject, string body);
}
```

**Email triggers:**

- When a new idea is submitted → notify the department's QA Coordinator
- When a comment is added to an idea → notify the idea's author
- Bulk email → used by admin to notify all department members

The service builds responsive HTML emails with a call-to-action button (link to the idea page). It reads SMTP credentials from `appsettings.json` and gracefully handles failures with `ILogger` without crashing the main request flow.

Registration in `Program.cs`:

```csharp
builder.Services.AddScoped<IEmailService, EmailService>();
```

---

## 7. File Upload & Document Management

I implemented secure file upload in `DocumentController` with the following safeguards:

1. **File size validation** — reads `MaxFileUploadSize` from `SystemSettings` (default 10 MB)
2. **File type validation** — reads `AllowedFileTypes` from `SystemSettings`; only whitelisted extensions are accepted (`.pdf`, `.doc`, `.docx`, `.jpg`, `.jpeg`, `.png`, `.zip`)
3. **Unique filename generation** — uses `Guid.NewGuid()` + original extension to prevent filename collisions and path traversal attacks
4. **Server-side storage** — files are saved to `wwwroot/uploads/`
5. **ZIP export** — `AdminController` can bundle all idea documents into a single `.zip` file for download using `System.IO.Compression.ZipArchive`

```csharp
var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
if (!allowedTypes.Contains(fileExtension))
    return BadRequest($"File type {fileExtension} is not allowed");
```

---

## 8. Statistics & Reporting

`StatisticsController` provides analytics data consumed by the admin dashboard frontend.

| Endpoint                                | Data Returned                                                       |
| --------------------------------------- | ------------------------------------------------------------------- |
| `GET /api/statistics/overview`          | Total ideas, comments, users, departments                           |
| `GET /api/statistics/departments`       | Per-department: staff count, idea count, comment count, total views |
| `GET /api/statistics/ideas-by-category` | Per-category: idea count, comment count, reaction count             |
| `GET /api/statistics/top-ideas`         | Top-viewed and most-reacted ideas                                   |
| `GET /api/statistics/timeline`          | Ideas submitted per week/month                                      |

These endpoints use EF Core's `Include()` with `ThenInclude()` for efficient joined queries, and LINQ projection (`Select`) to return only the fields needed by the frontend, minimising data transfer.

---

## 9. Challenges & Solutions

### Challenge 1: Anonymous Idea Privacy

**Problem:** The frontend must never receive the real `AuthorId` or `AuthorName` when an idea is marked anonymous — even if someone inspects the API response.

**Solution:** Used EF Core LINQ projection in the controller to conditionally null out sensitive fields:

```csharp
AuthorId = i.IsAnonymous ? (int?)null : i.AuthorId,
AuthorName = i.IsAnonymous ? "Anonymous" : i.Author!.FullName,
```

This ensures privacy is enforced at the API layer, not just the UI.

---

### Challenge 2: Topic Deadline Enforcement

**Problem:** Ideas and comments must be blocked automatically after topic deadlines, without manual intervention.

**Solution:** Added server-side deadline checks in `IdeaController.Create()` and `CommentController.Create()`:

```csharp
if (topic.ClosureDate < DateTime.UtcNow)
    return BadRequest(new { message = "This topic is closed for new ideas." });
```

---

### Challenge 3: Circular Reference in JSON Serialization

**Problem:** EF Core navigation properties caused infinite loops during JSON serialization (Idea → Comments → Idea → ...).

**Solution:** Configured `System.Text.Json` in `Program.cs`:

```csharp
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});
```

---

### Challenge 4: Email Service Resilience

**Problem:** If SMTP is unavailable, the entire idea submission would fail.

**Solution:** Wrapped all email calls in `try-catch` blocks that log the error but do not re-throw, so the main operation completes successfully even if email delivery fails.

---

## 10. Reflection

Working on the backend of SICS gave me practical experience building a production-grade REST API with real security concerns. Key learning outcomes:

- **JWT authentication** — understanding how tokens are issued, validated, and how claims are used for role-based access control
- **EF Core relationships** — configuring complex one-to-many and many-to-many relationships using Fluent API and handling cascade delete rules carefully
- **Service abstraction** — using `IEmailService` interface with dependency injection made the codebase testable and decoupled
- **API security** — implementing input validation, file type whitelisting, anonymous data masking, and role guards at the controller level
- **LINQ projections** — selecting only required fields in database queries to improve performance and avoid over-fetching

The biggest challenge was balancing feature completeness with code quality under time constraints. I prioritised security (authentication, RBAC, input validation) first, then built features incrementally. If I were to extend this project, I would add unit tests using xUnit and Moq, implement refresh token rotation, and introduce API rate limiting.
