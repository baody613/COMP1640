# 🚀 QUICK START GUIDE - COMP1640

## Thiết Lập Nhanh (5 phút)

### 1️⃣ Cài Đặt Database

```bash
# Tạo database MySQL
mysql -u root -p

# Trong MySQL console
CREATE DATABASE COMP1640_IdeaHub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Import schema
mysql -u root -p COMP1640_IdeaHub < backend/Database/schema.sql
```

### 2️⃣ Cấu Hình Backend

```bash
cd backend

# Sửa appsettings.json
# Thay "Password=your_password" bằng password MySQL của bạn
```

**appsettings.json:**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=COMP1640_IdeaHub;User=root;Password=YOUR_MYSQL_PASSWORD;AllowUserVariables=True;UseAffectedRows=False"
  }
}
```

### 3️⃣ Chạy Backend

```bash
cd backend
dotnet restore
dotnet run
```

✅ Backend: `http://localhost:5122`  
✅ Swagger: `http://localhost:5122/swagger`

### 4️⃣ Chạy Frontend

```bash
# Terminal mới
cd frontend
npm install
npm run dev
```

✅ Frontend: `http://localhost:5173`

---

## 🔑 Tài Khoản Test

| Email                      | Password      | Role          |
| -------------------------- | ------------- | ------------- |
| `admin@university.edu`     | `password123` | Administrator |
| `qamanager@university.edu` | `password123` | QA Manager    |
| `john@university.edu`      | `password123` | Staff         |

---

## ✅ Checklist

- [ ] MySQL đang chạy
- [ ] Database đã được tạo và import schema
- [ ] Connection string trong `appsettings.json` đúng
- [ ] Backend chạy tại port 5122
- [ ] Frontend chạy tại port 5173
- [ ] Đăng nhập thành công với tài khoản test

---

## 🐛 Lỗi Thường Gặp

### "Unable to connect to database"

➡️ Kiểm tra MySQL đang chạy: `mysql -u root -p`  
➡️ Kiểm tra password trong `appsettings.json`

### "Port 5122 already in use"

```bash
# Windows
netstat -ano | findstr :5122
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5122 | xargs kill -9
```

### "npm install fails"

```bash
# Xóa cache
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📋 Các Lệnh Hữu Ích

### Backend

```bash
dotnet restore              # Restore packages
dotnet build               # Build project
dotnet run                 # Run development
dotnet publish -c Release  # Build for production
dotnet ef database update  # Run migrations
```

### Frontend

```bash
npm install        # Install dependencies
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

### Database

```bash
# Backup database
mysqldump -u root -p COMP1640_IdeaHub > backup.sql

# Restore database
mysql -u root -p COMP1640_IdeaHub < backup.sql

# Reset database
mysql -u root -p COMP1640_IdeaHub < backend/Database/schema.sql
```

---

## 📚 Đọc Thêm

- [PROJECT_SETUP_README.md](PROJECT_SETUP_README.md) - Hướng dẫn chi tiết
- [backend/README.md](backend/README.md) - Backend documentation
- [frontend/FRONTEND_GUIDE.md](frontend/FRONTEND_GUIDE.md) - Frontend guide

---

**Happy Coding! 🎉**
