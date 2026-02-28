# COMP1640 - Student Idea Contribution System

## 📌 Tổng Quan Dự Án

Hệ thống web-based role-based để thu thập ý tưởng cải tiến từ nhân viên trong trường Đại học.

### Stack Công Nghệ

- **Frontend**: React.js 18+ với TypeScript
- **Backend**: ASP.NET Core 9.0 Web API
- **Database**: MySQL 8.0+
- **ORM**: Entity Framework Core 9.0
- **Authentication**: JWT Bearer Token

---

## 🎯 Tính Năng Chính

### Vai Trò Người Dùng

1. **Administrator** - Quản lý hệ thống
2. **QA Manager** - Quản lý toàn bộ quy trình
3. **QA Coordinator** - Quản lý theo Department
4. **Staff** - Nhân viên đóng góp ý tưởng

### Chức Năng

✅ Submit ideas (có thể ẩn danh) với file attachments  
✅ Comment và Thumbs Up/Down cho ideas  
✅ Phân loại ideas theo categories  
✅ Deadline cho submission và comments  
✅ Email notifications (QA Coordinator và tác giả)  
✅ Statistics và Analytics  
✅ Export CSV và ZIP files (sau final closure date)  
✅ Pagination (5 items/page)  
✅ Responsive design (mobile, tablet, desktop)

---

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu Hệ Thống

- Node.js 18+ và npm/yarn
- .NET SDK 9.0+
- MySQL Server 8.0+
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd COMP1640
```

### 2. Thiết Lập Database (MySQL)

#### Cài đặt MySQL

**Windows:**

```powershell
# Download MySQL Installer từ https://dev.mysql.com/downloads/installer/
# Hoặc dùng Chocolatey
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

#### Tạo Database

```bash
# Đăng nhập MySQL
mysql -u root -p

# Chạy script tạo database
mysql -u root -p < backend/Database/schema.sql
```

Hoặc chạy từng dòng SQL:

```sql
CREATE DATABASE COMP1640_IdeaHub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE COMP1640_IdeaHub;
-- Sau đó chạy toàn bộ script trong backend/Database/schema.sql
```

### 3. Thiết Lập Backend (.NET)

```bash
cd backend

# Restore packages
dotnet restore

# Cập nhật connection string trong appsettings.json
# "DefaultConnection": "Server=localhost;Port=3306;Database=COMP1640_IdeaHub;User=root;Password=YOUR_PASSWORD;AllowUserVariables=True;UseAffectedRows=False"
```

#### Cấu hình appsettings.json

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

#### Chạy Migration (nếu cần)

```bash
# Tạo migration mới
dotnet ef migrations add InitialCreate

# Apply migration
dotnet ef database update
```

#### Chạy Backend

```bash
dotnet run
```

Backend sẽ chạy tại: `http://localhost:5122`  
Swagger UI: `http://localhost:5122/swagger`

### 4. Thiết Lập Frontend (React)

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## 👥 Tài Khoản Mặc Định

| Email                    | Password    | Role          |
| ------------------------ | ----------- | ------------- |
| admin@university.edu     | password123 | Administrator |
| qamanager@university.edu | password123 | QA Manager    |
| john@university.edu      | password123 | Staff         |

---

## 📂 Cấu Trúc Dự Án

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

- `POST /api/Auth/login` - Đăng nhập
- `POST /api/Auth/register` - Đăng ký
- `POST /api/Auth/refresh` - Refresh token

### Ideas

- `GET /api/Idea` - Lấy danh sách ideas (pagination)
- `GET /api/Idea/{id}` - Lấy chi tiết idea
- `POST /api/Idea` - Tạo idea mới
- `PUT /api/Idea/{id}` - Cập nhật idea
- `DELETE /api/Idea/{id}` - Xóa idea
- `GET /api/Idea/most-popular` - Ideas phổ biến nhất
- `GET /api/Idea/most-viewed` - Ideas xem nhiều nhất
- `GET /api/Idea/latest` - Ideas mới nhất

### Comments

- `GET /api/Comment/idea/{ideaId}` - Lấy comments của idea
- `POST /api/Comment` - Tạo comment
- `DELETE /api/Comment/{id}` - Xóa comment

### Documents

- `POST /api/Document/upload/{ideaId}` - Upload file
- `GET /api/Document/idea/{ideaId}` - Lấy files của idea
- `DELETE /api/Document/{id}` - Xóa file

### Statistics

- `GET /api/Statistics/overview` - Thống kê tổng quan
- `GET /api/Statistics/departments` - Thống kê theo department
- `GET /api/Statistics/ideas-by-category` - Ideas theo category
- `GET /api/Statistics/top-contributors` - Top contributors

### Admin

- `GET /api/Admin/export-csv/{topicId}` - Export CSV
- `GET /api/Admin/export-documents/{topicId}` - Export ZIP
- `GET /api/Admin/export-all-data/{topicId}` - Export All

---

## 🗃️ Database Schema

### Bảng Chính

1. **Users** - Thông tin người dùng
2. **Departments** - Khoa/Phòng ban
3. **Topics** - Chủ đề/Năm học
4. **Categories** - Danh mục phân loại
5. **Ideas** - Ý tưởng
6. **Comments** - Bình luận
7. **Reactions** - Thumbs up/down
8. **Documents** - File đính kèm
9. **SystemSettings** - Cấu hình hệ thống

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
# Build output trong folder: dist/
```

### Environment Variables

**Backend (Production):**

- Connection String
- JWT Secret Key
- Email Settings

**Frontend (Production):**

- `VITE_API_BASE_URL` - Backend API URL

---

## 📝 Yêu Cầu Đặc Biệt

### ✅ Đã Implement

- ✅ Role-based access control (4 roles)
- ✅ Terms & Conditions agreement
- ✅ Anonymous posting (lưu author trong DB)
- ✅ File uploads với validation
- ✅ Email notifications
- ✅ Closure dates (idea submission & final comment)
- ✅ Thumbs Up/Down (1 vote per user per idea)
- ✅ Pagination (5 items/page)
- ✅ Export CSV & ZIP
- ✅ Statistics by Department
- ✅ Responsive design ready

### 🔄 Cần Hoàn Thiện

- Email SMTP configuration (hiện đang log only)
- Frontend UI components (some pages need implementation)
- Unit tests và Integration tests
- Security audit (CSRF, XSS, SQL Injection prevention)

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Kiểm tra MySQL đang chạy
mysql --version
mysql -u root -p

# Kiểm tra connection string trong appsettings.json
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

- **Project Lead**: [Tên của bạn]
- **Email**: [Email của bạn]
- **GitHub**: [GitHub repo URL]

---

## 📄 License

This project is developed for educational purposes (COMP1640 coursework).

---

## 🙏 Acknowledgments

- Greenwich University Vietnam
- COMP1640 Course Instructors

---

**Last Updated**: February 2026
