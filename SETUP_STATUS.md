# 🎉 COMP1640 IdeaHub - Setup Complete!

## ✅ System Status

All components have been successfully set up and are running:

### ✓ Database (MySQL)
- **Status**: ✅ Running
- **Location**: XAMPP MySQL (localhost:3306)
- **Database Name**: `comp1640_ideahub`
- **Connection**: Root user without password
- **Tables**: 9 tables created (Users, Departments, Topics, Categories, Ideas, Comments, Reactions, Documents, SystemSettings)
- **Initial Data**: 5 admin users + sample data loaded

### ✓ Backend API (.NET 9.0)
- **Status**: ✅ Running
- **URL**: http://localhost:5000
- **API Base URL**: http://localhost:5000/api
- **Built**: Successfully compiled
- **Database**: Connected and operational
- **Port**: 5000

### ✓ Frontend (React + Vite)
- **Status**: ✅ Running
- **URL**: http://localhost:3000
- **Port**: 3000
- **Host**: 0.0.0.0 (accessible from any network interface)
- **Built**: Dependencies installed

---

## 🚀 Access the Application

### Local Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

### Network Access  
- **Frontend**: http://192.168.2.149:3000 (replace IP with your machine's IP)
- **Backend API**: http://192.168.2.149:5000/api

---

## 👤 Default Admin Users

All users have password: `password123`

| Email | Role | Department |
|-------|------|-----------|
| admin@university.edu | Administrator | Computer Science |
| qamanager@university.edu | QA Manager | Computer Science |
| coordinator@university.edu | QA Coordinator | Business Administration |
| john@university.edu | Staff | Computer Science |
| jane@university.edu | Staff | Business Administration |

---

## 📊 Database Structure

**Tables Created:**
1. **Users** - User accounts and roles
2. **Departments** - Department management
3. **Topics** - Idea submission periods
4. **Categories** - Idea categories
5. **Ideas** - Student ideas/suggestions
6. **Comments** - Comments on ideas
7. **Reactions** - Thumbs up/down
8. **Documents** - File attachments
9. **SystemSettings** - System configuration

**Sample Data:**
- 1 Topic: "Innovation Ideas 2025"
- 4 Categories: Technology, Sustainability, Education, Other
- 5 Users with different roles

---

## 🔧 Configuration Details

### Backend Configuration
**File**: `backend/appsettings.json`
- Connection String: `Server=localhost;Port=3306;Database=comp1640_ideahub;User=root`
- JWT Settings: Configured
- CORS: Enabled for all origins
- Email Service: Configured (Gmail SMTP)

### Frontend Configuration
**File**: `frontend/vite.config.ts`
- Port: 3000
- Host: 0.0.0.0
- API Endpoint: http://{hostname}:5000/api

---

## 📝 Important Notes

1. **MySQL Password**: Root user has NO password (for development)
2. **CORS**: Backend allows requests from all origins (for development)
3. **Seed Data**: Some Vietnamese content has been normalized to English
4. **Static Files**: Backend wwwroot directory not found (normal for development)

---

## 🛠️ Managing the Services

### Start Services (if they stop)

**Backend:**
```powershell
cd d:\Test_4\COMP1640\backend
dotnet run
```

**Frontend:**
```powershell
cd d:\Test_4\COMP1640\frontend
npm run dev
```

**MySQL (via XAMPP):**
```powershell
"C:\xampp\mysql\bin\mysqld" --datadir="C:\xampp\mysql\data"
```

---

## 📋 Troubleshooting

### Backend won't connect to database
- Ensure MySQL is running
- Check connection string in `appsettings.json`
- Verify `comp1640_ideahub` database exists

### Frontend returns 404
- Ensure backend is running on port 5000
- Check `src/api.ts` configuration
- Browser console for CORS errors

### Port already in use
- Backend (5000): `netstat -ano | findstr :5000`
- Frontend (3000): `netstat -ano | findstr :3000`

---

## ✨ Next Steps

1. **Access the application**: Open http://localhost:3000 in your browser
2. **Login**: Use any of the admin credentials above
3. **Explore**: Create ideas, add comments, manage topics
4. **Customize**: Modify database seed data or add new features

---

**Setup Date**: April 11, 2026
**Status**: ✅ All systems operational
