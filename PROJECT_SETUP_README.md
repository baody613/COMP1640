# COMP1640 - Student Idea Contribution System

## 📌 Project Overview

A web-based role-based system for collecting improvement ideas from employees in a university.

### Technology Stack

- **Frontend**: React.js 18+ với TypeScript
- **Backend**: ASP.NET Core 8.0 Web API
- **Database**: MySQL 8.0+
- **ORM**: Entity Framework Core 8.0
- **Authentication**: JWT Bearer Token

---

## 🎯 Main Features

### User Roles

1. **Administrator** - System management
2. **QA Manager** - Full process management
3. **QA Coordinator** - Department management
4. **Staff** - Employee idea contribution

### Features

✅ Submit ideas (can be anonymous) with file attachments  
✅ Comment and Thumbs Up/Down for ideas  
✅ Categorize ideas by category  
✅ Deadlines for submission and comments  
✅ Email notifications (QA Coordinator and author)  
✅ Statistics and Analytics  
✅ Export CSV and ZIP files (after final closure date)  
✅ Pagination (5 items/page)  
✅ Responsive design (mobile, tablet, desktop)

---

## 🚀 Installation Guide

### System Requirements

- Node.js 18+ and npm/yarn
- .NET SDK 8.0+
- MySQL Server 8.0+
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd COMP1640
```

### 2. Set Up Database (MySQL)

#### Install MySQL

**Windows:**

```powershell
# Download MySQL Installer from https://dev.mysql.com/downloads/installer/
# Or use Chocolatey
choco install mysql
```

**macOS:**

```bash
brew install mysql
brew services start mysql
```

**Linux:**

```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

#### Create Database

```bash
# Login to MySQL
mysql -u root -p

# Run database creation script
mysql -u root -p < backend/Database/schema.sql
```

Or run SQL commands individually:

```sql
CREATE DATABASE COMP1640_IdeaHub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE COMP1640_IdeaHub;
-- Sau đó chạy toàn bộ script trong backend/Database/schema.sql
```

### 3. Set Up Backend (.NET)

```bash
cd backend

# Restore packages
dotnet restore

# Update connection string in appsettings.json
# "DefaultConnection": "Server=localhost;Port=3306;Database=COMP1640_IdeaHub;User=root;Password=YOUR_PASSWORD;AllowUserVariables=True;UseAffectedRows=False"
```

#### Configure appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=COMP1640_IdeaHub;User=root;Password=your_password;AllowUserVariables=True;UseAffectedRows=False"
  },
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyForJWT_MinimumLength32Characters",
    "Issuer": "COMP1640_IdeaHub",
    "Audience": "COMP1640_Users",
    "ExpiryMinutes": 60
  },
  "EmailSettings": {
    "EnableNotifications": false,
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "Username": "your-email@gmail.com",
    "Password": "your-app-password",
    "FromEmail": "noreply@university.edu",
    "FromName": "COMP1640 Idea Hub"
  }
}
```

#### Run Migration (if needed)

```bash
# Create new migration
dotnet ef migrations add InitialCreate

# Apply migration
dotnet ef database update
```

#### Run Backend

```bash
dotnet run
```

Backend will run at: `http://localhost:5122`  
Swagger UI: `http://localhost:5122/swagger`

### 4. Set Up Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 👥 Default Accounts

| Email                    | Password    | Role          |
| ------------------------ | ----------- | ------------- |
| admin@university.edu     | password123 | Administrator |
| qamanager@university.edu | password123 | QA Manager    |
| john@university.edu      | password123 | Staff         |

---

## 📂 Project Structure

```
COMP1640/
├── backend/                    # ASP.NET Core Web API
│   ├── Controllers/           # API Controllers
│   │   ├── AuthController.cs
│   │   ├── IdeaController.cs
│   │   ├── CommentController.cs
│   │   ├── DocumentController.cs
│   │   ├── StatisticsController.cs
│   │   ├── AdminController.cs
│   │   └── ...
│   ├── Models/                # Entity Models
│   │   ├── User.cs
│   │   ├── Idea.cs
│   │   ├── Comment.cs
│   │   ├── Document.cs
│   │   └── ...
│   ├── Data/                  # DbContext
│   │   └── AppDbContext.cs
│   ├── Services/              # Business Logic
│   │   └── EmailService.cs
│   ├── Database/              # SQL Scripts
│   │   └── schema.sql
│   ├── Migrations/            # EF Core Migrations
│   └── Program.cs             # Entry Point
│
├── frontend/                  # React + TypeScript
│   ├── src/
│   │   ├── components/       # React Components
│   │   ├── pages/            # Page Components
│   │   ├── services/         # API Services
│   │   │   ├── authService.ts
│   │   │   ├── ideaService.ts
│   │   │   ├── documentService.ts
│   │   │   ├── statisticsService.ts
│   │   │   └── ...
│   │   ├── types/            # TypeScript Types
│   │   └── api.ts            # API Client
│   └── package.json
│
└── README.md                  # This file
```

---

## 🔧 API Endpoints

### Authentication

- `POST /api/Auth/login` - Login
- `POST /api/Auth/register` - Register
- `POST /api/Auth/refresh` - Refresh token

### Ideas

- `GET /api/Idea` - Get ideas list (pagination)
- `GET /api/Idea/{id}` - Get idea details
- `POST /api/Idea` - Create new idea
- `PUT /api/Idea/{id}` - Update idea
- `DELETE /api/Idea/{id}` - Delete idea
- `GET /api/Idea/most-popular` - Most popular ideas
- `GET /api/Idea/most-viewed` - Most viewed ideas
- `GET /api/Idea/latest` - Latest ideas

### Comments

- `GET /api/Comment/idea/{ideaId}` - Get comments for idea
- `POST /api/Comment` - Create comment
- `DELETE /api/Comment/{id}` - Delete comment

### Documents

- `POST /api/Document/upload/{ideaId}` - Upload file
- `GET /api/Document/idea/{ideaId}` - Get files for idea
- `DELETE /api/Document/{id}` - Delete file

### Statistics

- `GET /api/Statistics/overview` - Overall statistics
- `GET /api/Statistics/departments` - Statistics by department
- `GET /api/Statistics/ideas-by-category` - Ideas by category
- `GET /api/Statistics/top-contributors` - Top contributors

### Admin

- `GET /api/Admin/export-csv/{topicId}` - Export CSV
- `GET /api/Admin/export-documents/{topicId}` - Export ZIP
- `GET /api/Admin/export-all-data/{topicId}` - Export All

---

## 🗃️ Database Schema

### Main Tables

1. **Users** - User information
2. **Departments** - Department/Division
3. **Topics** - Topic/Academic year
4. **Categories** - Classification categories
5. **Ideas** - Ideas
6. **Comments** - Comments
7. **Reactions** - Thumbs up/down
8. **Documents** - Attachments
9. **SystemSettings** - System configuration

### Relationships

- User ↔ Department (Many-to-One)
- Idea ↔ Topic (Many-to-One)
- Idea ↔ Category (Many-to-One)
- Idea ↔ Comments (One-to-Many)
- Idea ↔ Reactions (One-to-Many)
- Idea ↔ Documents (One-to-Many)
- User ↔ Reactions (One user = 1 vote per idea)

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
dotnet test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

---

## 📦 Deployment

### Backend (Azure/IIS)

```bash
cd backend
dotnet publish -c Release -o ./publish
```

### Frontend (Vercel/Netlify/Azure Static Web Apps)

```bash
cd frontend
npm run build
# Build output in folder: dist/
```

### Environment Variables

**Backend (Production):**

- Connection String
- JWT Secret Key
- Email Settings

**Frontend (Production):**

- `VITE_API_BASE_URL` - Backend API URL

---

## 📝 Special Requirements

### ✅ Implemented

- ✅ Role-based access control (4 roles)
- ✅ Terms & Conditions agreement
- ✅ Anonymous posting (store author in DB)
- ✅ File uploads with validation
- ✅ Email notifications
- ✅ Closure dates (idea submission & final comment)
- ✅ Thumbs Up/Down (1 vote per user per idea)
- ✅ Pagination (5 items/page)
- ✅ Export CSV & ZIP
- ✅ Statistics by Department
- ✅ Responsive design ready

### 🔄 To Be Completed

- Email SMTP configuration (currently logs only)
- Frontend UI components (some pages need implementation)
- Unit tests and Integration tests
- Security audit (CSRF, XSS, SQL Injection prevention)

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check if MySQL is running
mysql --version
mysql -u root -p

# Check connection string in appsettings.json
```

### Port Already in Use

```bash
# Backend (port 5122)
netstat -ano | findstr :5122

# Frontend (port 5173)
netstat -ano | findstr :5173
```

### Migration Errors

```bash
# Reset database
dotnet ef database drop
dotnet ef database update
```

---

## 📞 Support & Contact

- **Project Lead**: [Your name]
- **Email**: [Your email]
- **GitHub**: [GitHub repo URL]

---

## 📄 License

This project is developed for educational purposes (COMP1640 coursework).

---

## 🙏 Acknowledgments

- Greenwich University Vietnam
- COMP1640 Course Instructors

---

**Last Updated**: April 2026
