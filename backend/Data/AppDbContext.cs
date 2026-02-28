using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // DbSet properties
    public DbSet<User> Users { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Topic> Topics { get; set; }
    public DbSet<Idea> Ideas { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Reaction> Reactions { get; set; }
    public DbSet<Document> Documents { get; set; }
    public DbSet<SystemSettings> SystemSettings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationships
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
            entity.Property(e => e.PasswordHash).IsRequired();
            
            entity.HasOne(e => e.Department)
                .WithMany(d => d.Users)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Code).IsUnique();
            
            entity.HasOne(e => e.QACoordinator)
                .WithMany()
                .HasForeignKey(e => e.QACoordinatorId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
        });

        modelBuilder.Entity<Topic>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            
            entity.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Idea>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Content).IsRequired();
            
            entity.HasOne(e => e.Topic)
                .WithMany(t => t.Ideas)
                .HasForeignKey(e => e.TopicId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Category)
                .WithMany(c => c.Ideas)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(e => e.Author)
                .WithMany(u => u.Ideas)
                .HasForeignKey(e => e.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);
            
            entity.HasOne(e => e.Idea)
                .WithMany(i => i.Comments)
                .HasForeignKey(e => e.IdeaId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Author)
                .WithMany(u => u.Comments)
                .HasForeignKey(e => e.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Reaction>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.Idea)
                .WithMany(i => i.Reactions)
                .HasForeignKey(e => e.IdeaId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.Reactions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Composite unique index: one user can only have one reaction per idea
            entity.HasIndex(e => new { e.UserId, e.IdeaId }).IsUnique();
        });

        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FilePath).IsRequired().HasMaxLength(500);
            entity.Property(e => e.MimeType).IsRequired().HasMaxLength(100);
            
            entity.HasOne(e => e.Idea)
                .WithMany(i => i.Documents)
                .HasForeignKey(e => e.IdeaId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SystemSettings>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SettingKey).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.SettingKey).IsUnique();
            
            entity.HasOne(e => e.UpdatedByUser)
                .WithMany()
                .HasForeignKey(e => e.UpdatedBy)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Seed initial data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Departments
        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "Computer Science", Code = "CS", CreatedAt = DateTime.UtcNow },
            new Department { Id = 2, Name = "Business Administration", Code = "BA", CreatedAt = DateTime.UtcNow },
            new Department { Id = 3, Name = "Engineering", Code = "ENG", CreatedAt = DateTime.UtcNow },
            new Department { Id = 4, Name = "Arts & Design", Code = "AD", CreatedAt = DateTime.UtcNow },
            new Department { Id = 5, Name = "Science", Code = "NS", CreatedAt = DateTime.UtcNow }
        );

        // Seed Users (Passwords are hashed version of "password123")
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                FullName = "System Administrator",
                Email = "admin@university.edu",
                PasswordHash = "$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO",
                Role = "Administrator",
                DepartmentId = 1,
                AgreedTerms = true,
                AgreedTermsDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = 2,
                FullName = "QA Manager",
                Email = "qamanager@university.edu",
                PasswordHash = "$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO",
                Role = "QAManager",
                DepartmentId = 1,
                AgreedTerms = true,
                AgreedTermsDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = 3,
                FullName = "John Doe",
                Email = "john@university.edu",
                PasswordHash = "$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO",
                Role = "Staff",
                DepartmentId = 1,
                AgreedTerms = true,
                AgreedTermsDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            }
        );

        // Seed Topics
        modelBuilder.Entity<Topic>().HasData(
            new Topic 
            { 
                Id = 1, 
                Name = "Nâng cao trải nghiệm sinh viên toàn trường", 
                Description = "Thu thập các ý tưởng từ nhân viên (giảng viên và nhân viên hỗ trợ) nhằm cải thiện chất lượng dịch vụ, môi trường học tập, cơ sở vật chất, quy trình hành chính và hỗ trợ học tập cho sinh viên.",
                IdeaSubmissionDeadline = new DateTime(2026, 6, 30, 23, 59, 59),  // 30/06/2026
                CommentDeadline = new DateTime(2026, 7, 31, 23, 59, 59),         // 31/07/2026
                CreatedById = 2,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        );

        // Seed Categories
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, TopicId = 1, Name = "Công nghệ & Cơ sở vật chất", Description = "Ý tưởng về cải thiện trang thiết bị, phòng lab, wifi, thiết bị học tập", CreatedAt = DateTime.UtcNow },
            new Category { Id = 2, TopicId = 1, Name = "Môi trường học tập", Description = "Ý tưởng về không gian học tập, thư viện, khu tự học, không gian xanh", CreatedAt = DateTime.UtcNow },
            new Category { Id = 3, TopicId = 1, Name = "Dịch vụ sinh viên", Description = "Ý tưởng về hỗ trợ sinh viên, tư vấn học tập, câu lạc bộ, hoạt động ngoại khóa", CreatedAt = DateTime.UtcNow },
            new Category { Id = 4, TopicId = 1, Name = "Quy trình hành chính", Description = "Ý tưởng về đơn giản hóa thủ tục, online services, one-stop service", CreatedAt = DateTime.UtcNow },
            new Category { Id = 5, TopicId = 1, Name = "Giảng dạy & Học tập", Description = "Ý tưởng về phương pháp giảng dạy, tài liệu học tập, công cụ hỗ trợ học tập", CreatedAt = DateTime.UtcNow },
            new Category { Id = 6, TopicId = 1, Name = "Khác", Description = "Các ý tưởng khác không thuộc các danh mục trên", CreatedAt = DateTime.UtcNow }
        );

        // Seed System Settings
        modelBuilder.Entity<SystemSettings>().HasData(
            new SystemSettings
            {
                Id = 1,
                SettingKey = "CurrentAcademicYear",
                SettingValue = "2025-2026",
                Description = "Current academic year",
                UpdatedAt = DateTime.UtcNow
            },
            new SystemSettings
            {
                Id = 2,
                SettingKey = "EnableEmailNotifications",
                SettingValue = "true",
                Description = "Enable/disable email notifications",
                UpdatedAt = DateTime.UtcNow
            },
            new SystemSettings
            {
                Id = 3,
                SettingKey = "MaxFileUploadSize",
                SettingValue = "10485760",
                Description = "Maximum file upload size in bytes (10MB)",
                UpdatedAt = DateTime.UtcNow
            },
            new SystemSettings
            {
                Id = 4,
                SettingKey = "AllowedFileTypes",
                SettingValue = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip",
                Description = "Allowed file upload types",
                UpdatedAt = DateTime.UtcNow
            }
        );
    }
}
