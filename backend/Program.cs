using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.Data;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!))
    };
});

builder.Services.AddAuthorization();

// Register EmailService
builder.Services.AddScoped<IEmailService, EmailService>();

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "Student Idea Contribution API", 
        Version = "v1",
        Description = "API for COMP1640 Student Idea Contribution System"
    });
});

// Response Compression
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

await NormalizeSeedContentToEnglishAsync(app);

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Student Idea API V1");
    });
}

app.UseResponseCompression();
app.UseCors("AllowFrontend");

// Enable static files for file uploads
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

// Global error handling
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Unhandled exception occurred");
        
        context.Response.StatusCode = 500;
        await context.Response.WriteAsJsonAsync(new { error = "An error occurred processing your request" });
    }
});

app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }))
    .WithName("HealthCheck")
    .WithTags("Health");

app.Run();

static async Task NormalizeSeedContentToEnglishAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var hasChanges = false;

        var topic = await context.Topics.FirstOrDefaultAsync(t => t.Id == 1);
        if (topic != null)
        {
            const string vnTopicName = "Nâng cao trải nghiệm sinh viên toàn trường";
            const string enTopicName = "Enhancing the student experience across the entire campus.";
            const string enTopicDescription = "Collect ideas from staff members (lecturers and support staff) to improve service quality, learning environment, facilities, administrative workflows, and academic support for students.";

            if (topic.Name == vnTopicName)
            {
                topic.Name = enTopicName;
                hasChanges = true;
            }

            if (!string.Equals(topic.Description, enTopicDescription, StringComparison.Ordinal))
            {
                topic.Description = enTopicDescription;
                hasChanges = true;
            }

            var topicCategories = await context.Categories
                .Where(c => c.TopicId == 1 && c.Id >= 1 && c.Id <= 6)
                .ToListAsync();

            foreach (var category in topicCategories)
            {
                var target = category.Id switch
                {
                    1 => (Name: "Technology & Facilities", Description: "Ideas to improve equipment, labs, Wi-Fi, and learning tools"),
                    2 => (Name: "Learning Environment", Description: "Ideas for study spaces, library, self-study areas, and green zones"),
                    3 => (Name: "Student Services", Description: "Ideas for student support, academic advising, clubs, and extracurricular activities"),
                    4 => (Name: "Administrative Processes", Description: "Ideas for simplifying procedures, online services, and one-stop support"),
                    5 => (Name: "Teaching & Learning", Description: "Ideas for teaching methods, learning materials, and academic support tools"),
                    6 => (Name: "Other", Description: "Ideas that do not belong to the categories above"),
                    _ => ((string Name, string Description)?)null
                };

                if (target.HasValue)
                {
                    if (!string.Equals(category.Name, target.Value.Name, StringComparison.Ordinal))
                    {
                        category.Name = target.Value.Name;
                        hasChanges = true;
                    }

                    if (!string.Equals(category.Description, target.Value.Description, StringComparison.Ordinal))
                    {
                        category.Description = target.Value.Description;
                        hasChanges = true;
                    }
                }
            }
        }

        var ideaTranslations = new Dictionary<string, (string Title, string Content)>
        {
            ["Hệ thống quản lý tài liệu thông minh"] = (
                "Smart Document Management System",
                "Propose building an online document management system for the whole university, allowing lecturers and students to easily share, search, and store learning materials. The system should include full-text search, automatic classification by subject, and real-time collaboration features."),
            ["Chương trình mentorship kết nối sinh viên - doanh nghiệp"] = (
                "Mentorship Program Connecting Students and Industry",
                "Build a mentorship program that connects final-year students with industry professionals. Each student is paired with a mentor and meets every two weeks for career guidance and practical skill development."),
            ["Tái chế rác thải điện tử trong khuôn viên trường"] = (
                "Electronic Waste Recycling on Campus",
                "Place e-waste collection bins (used batteries and broken devices) in each building. Partner with certified recycling companies for proper processing and organize awareness sessions to promote environmental responsibility among students."),
            ["Ứng dụng theo dõi sức khỏe tâm thần cho sinh viên"] = (
                "Mental Health Tracking App for Students",
                "Develop a free mobile app for students to monitor mental well-being, access breathing and mindfulness exercises, and connect with university counselors when needed. All personal data must remain private and secure."),
            ["Lắp đặt tấm pin năng lượng mặt trời trên mái nhà"] = (
                "Install Solar Panels on Campus Buildings",
                "Install solar panel systems on building rooftops to reduce electricity costs by 30-40 percent and lower carbon emissions. Estimated investment payback is within 5-7 years."),
            ["Hệ thống đặt phòng học nhóm trực tuyến"] = (
                "Online Group Study Room Booking System",
                "Build a web/app platform for students to reserve group study rooms, labs, and computer rooms by schedule. This helps avoid room conflicts and improves facility utilization."),
            ["Quỹ hỗ trợ sinh viên khởi nghiệp"] = (
                "Student Startup Support Fund",
                "Establish an internal startup fund providing grants from 5 to 20 million VND for student startup projects. A committee of lecturers and industry representatives reviews applications each semester."),
            ["Câu lạc bộ trao đổi ngôn ngữ đa văn hóa"] = (
                "Multicultural Language Exchange Club",
                "Create a language exchange club connecting Vietnamese and international students through weekly meetups, cultural events, and exchange activities to improve communication skills and cross-cultural understanding."),
            ["Số hóa thư viện - Mượn sách không cần thẻ"] = (
                "Digital Library - Cardless Borrowing",
                "Integrate library borrowing and returning with student ID cards or QR codes. Students can reserve books online, receive availability notifications, and renew loans through an app."),
            ["Phòng gym và yoga miễn phí cho sinh viên"] = (
                "Free Gym and Yoga Space for Students",
                "Convert unused storage areas into a free gym and yoga space for students and staff. Equip basic facilities and hire part-time trainers for several sessions each week to improve physical and mental health."),
            ["Mở rộng giờ ký túc xá 24/7"] = (
                "Extend Dormitory Access to 24/7",
                "Dormitories currently close at 11 PM, which is inconvenient for students studying late. Extend access to 24/7 with proper security coverage."),
            ["Cải thiện chất lượng bữa ăn căng tin"] = (
                "Improve Cafeteria Meal Quality",
                "The current cafeteria menu is limited and expensive. Partner with local restaurants to diversify meals and provide student discounts."),
            ["Thư viện số hóa tài liệu"] = (
                "Digitize Library Materials",
                "Digitize all library materials and integrate an online borrowing system. Students can reserve, borrow, and return books remotely through a mobile app."),
            ["Câu lạc bộ kỹ năng mềm liên khoa"] = (
                "Interdisciplinary Soft Skills Club",
                "Establish a cross-faculty soft skills club so students from different majors can connect and learn communication, presentation, and teamwork skills together."),
            ["Hệ thống phòng học thông minh"] = (
                "Smart Classroom System",
                "Equip classrooms with touch displays, smart boards, and online room booking features. This improves classroom utilization and saves energy."),
            ["Khu vực thư giãn xanh cho sinh viên"] = (
                "Green Relaxation Area for Students",
                "Create outdoor relaxation areas with trees, seating, and free Wi-Fi so students can study and rest between classes."),
            ["Ứng dụng theo dõi lịch học và hoạt động"] = (
                "Integrated Study and Activity Tracking App",
                "Develop a mobile app integrating class schedules, activity notifications, library reservations, and credit management into a single platform."),
            ["Chương trình hỗ trợ tâm lý sinh viên"] = (
                "Student Mental Health Support Program",
                "Set up a free mental health counseling center with professional advisors to help students manage academic pressure, exams, and life challenges."),
            ["Trạm sạc xe đạp điện năng lượng mặt trời"] = (
                "Solar-Powered E-Bike Charging Stations",
                "Install solar-powered e-bike charging stations around campus to encourage sustainable transportation and reduce CO2 emissions."),
            ["Hệ thống phân loại rác thông minh"] = (
                "Smart Waste Sorting System",
                "Deploy smart bins with sensors that detect waste types and guide users. Integrate with an app to gamify recycling participation."),
            ["Vườn rau hữu cơ trong khuôn viên trường"] = (
                "Organic Campus Community Garden",
                "Build a student-managed organic garden on campus. Produce can support the cafeteria, with surplus shared among participating students."),
            ["Tái sử dụng nước mưa"] = (
                "Rainwater Reuse System",
                "Install rainwater collection systems for irrigation and cleaning, with an estimated 40 percent monthly water saving."),
            ["Thay đèn LED toàn trường"] = (
                "Campus-wide LED Lighting Upgrade",
                "Replace legacy lighting with LED systems and motion sensors to reduce electricity costs by an estimated 60 percent."),
            ["Chương trình đổi rác lấy điểm thưởng"] = (
                "Recycle-for-Rewards Program",
                "Students can earn points by bringing recyclables to collection stations and redeem rewards at the cafeteria, library, or other campus services."),
            ["Rừng cây kỷ niệm sinh viên tốt nghiệp"] = (
                "Graduation Memorial Forest",
                "Each graduating class plants a small memorial forest on campus with name plaques, creating long-term green space and legacy value."),
            ["Cải thiện nhiệt độ phòng học"] = (
                "Improve Classroom Temperature",
                "Install additional air conditioners in classrooms.")
        };

        var viTitles = ideaTranslations.Keys.ToList();
        var ideas = await context.Ideas
            .Where(i => viTitles.Contains(i.Title))
            .ToListAsync();

        foreach (var idea in ideas)
        {
            if (ideaTranslations.TryGetValue(idea.Title, out var translated))
            {
                idea.Title = translated.Title;
                idea.Content = translated.Content;
                hasChanges = true;
            }
        }

        if (hasChanges)
        {
            await context.SaveChangesAsync();
            logger.LogInformation("Seed content normalization to English applied successfully.");
        }
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Seed content normalization skipped due to an error.");
    }
}
