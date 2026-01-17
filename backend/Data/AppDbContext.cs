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

        // Seed initial data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Departments
        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "Computer Science", CreatedAt = DateTime.UtcNow },
            new Department { Id = 2, Name = "Business Administration", CreatedAt = DateTime.UtcNow },
            new Department { Id = 3, Name = "Engineering", CreatedAt = DateTime.UtcNow },
            new Department { Id = 4, Name = "Arts & Design", CreatedAt = DateTime.UtcNow },
            new Department { Id = 5, Name = "Science", CreatedAt = DateTime.UtcNow }
        );

        // Seed Categories
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Technology", Description = "Technology and innovation ideas", CreatedAt = DateTime.UtcNow },
            new Category { Id = 2, Name = "Environment", Description = "Environmental sustainability", CreatedAt = DateTime.UtcNow },
            new Category { Id = 3, Name = "Education", Description = "Educational improvements", CreatedAt = DateTime.UtcNow },
            new Category { Id = 4, Name = "Health", Description = "Health and wellness", CreatedAt = DateTime.UtcNow },
            new Category { Id = 5, Name = "Social", Description = "Social initiatives", CreatedAt = DateTime.UtcNow },
            new Category { Id = 6, Name = "Other", Description = "Other categories", CreatedAt = DateTime.UtcNow }
        );

        // Seed Users (Passwords are hashed version of "password123")
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                FullName = "Admin User",
                Email = "admin@university.edu",
                PasswordHash = "$2a$11$8GvBJz9VX4qYq5T1kZXLmefL.p3yKYYR9.cOLKLvZJqVvJqWXqD8O",
                Role = UserRole.QAManager,
                DepartmentId = 1,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = 2,
                FullName = "John Doe",
                Email = "john@university.edu",
                PasswordHash = "$2a$11$8GvBJz9VX4qYq5T1kZXLmefL.p3yKYYR9.cOLKLvZJqVvJqWXqD8O",
                Role = UserRole.Staff,
                DepartmentId = 1,
                CreatedAt = DateTime.UtcNow
            }
        );
    }
}
