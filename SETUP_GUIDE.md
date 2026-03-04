# 🚀 COMP1640 IdeaHub - Setup Guide for New Machine

## 📋 Prerequisites

1. **.NET 9.0 SDK**
   - Download: https://dotnet.microsoft.com/download/dotnet/9.0
   - Verify: `dotnet --version`

2. **Node.js (v18+)**
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

3. **MySQL or MariaDB**
   - MySQL: https://dev.mysql.com/downloads/mysql/
   - MariaDB: https://mariadb.org/download/
   - During installation, set root password (remember it!)

## 📦 Step 1: Extract Project

```bash
# Extract the ZIP file to your desired location
# Example: C:\Projects\COMP1640
```

## 🗄️ Step 2: Setup Database

### 2.1 Open MySQL Command Line or MySQL Workbench

**Command Line:**

```bash
mysql -u root -p
# Enter your root password
```

### 2.2 Create Database

```sql
CREATE DATABASE COMP1640_IdeaHub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2.3 Run Schema File

**Option A - Command Line:**

```bash
mysql -u root -p COMP1640_IdeaHub < backend/Database/schema.sql
```

**Option B - MySQL Workbench:**

1. Open `backend/Database/schema.sql`
2. Execute the script (⚡ icon or Ctrl+Shift+Enter)

### 2.4 Insert Admin Users

**Option A - Command Line:**

```bash
mysql -u root -p COMP1640_IdeaHub < backend/setup_admin_users.sql
```

**Option B - MySQL Workbench:**

1. Open `backend/setup_admin_users.sql`
2. Execute the script

## ⚙️ Step 3: Configure Backend

Edit `backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=COMP1640_IdeaHub;User=root;Password=YOUR_MYSQL_PASSWORD;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyHere123456789",
    "Issuer": "IdeaHubAPI",
    "Audience": "IdeaHubUsers"
  },
  "Email": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "your-email@gmail.com",
    "SenderName": "IdeaHub System",
    "Username": "your-email@gmail.com",
    "Password": "your-app-password"
  }
}
```

**Important:** Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password!

## 🎯 Step 4: Install Dependencies

### Backend:

```bash
cd backend
dotnet restore
```

### Frontend:

```bash
cd frontend
npm install
```

## ▶️ Step 5: Run the Application

### Start Backend (Terminal 1):

```bash
cd backend
dotnet run
```

Should see: `Now listening on: http://localhost:5000`

### Start Frontend (Terminal 2):

```bash
cd frontend
npm run dev
```

Should see: `Local: http://localhost:3000`

## 🧪 Step 6: Test the Application

1. Open browser: **http://localhost:3000**
2. Click "Login"
3. Use test credentials:

| Email                    | Password    | Role          |
| ------------------------ | ----------- | ------------- |
| admin@university.edu     | password123 | Administrator |
| qamanager@university.edu | password123 | QA Manager    |
| john@university.edu      | password123 | Staff         |

4. After login, click "Admin Dashboard" to manage users

## 🐛 Troubleshooting

### ❌ Backend won't start - MySQL Connection Failed

**Error:** `Unable to connect to MySQL server`

**Solution:**

1. Check MySQL is running:
   ```bash
   # Windows
   Get-Service MySQL*
   # Or check Task Manager for mysqld.exe
   ```
2. Verify password in `appsettings.json` is correct
3. Test connection:
   ```bash
   mysql -u root -p
   ```

### ❌ Port 5000 already in use

**Error:** `address already in use`

**Solution:**

```bash
# Windows PowerShell
Get-NetTCPConnection -LocalPort 5000 | Stop-Process
```

### ❌ Frontend can't connect to backend

**Error:** Network errors in browser console

**Solution:**

1. Ensure backend is running on port 5000
2. Check `frontend/src/api.ts` has correct URL:
   ```typescript
   const API_BASE_URL = "http://localhost:5000/api";
   ```

### ❌ Login fails with 401 Unauthorized

**Error:** Cannot login with admin credentials

**Solution:**

1. Re-run `backend/setup_admin_users.sql`
2. Verify users exist:
   ```sql
   USE COMP1640_IdeaHub;
   SELECT * FROM Users WHERE Email = 'admin@university.edu';
   ```

## 📝 Default Project Structure

```
COMP1640/
├── backend/                    # ASP.NET Core API
│   ├── Controllers/           # API endpoints
│   ├── Models/               # Data models
│   ├── Services/             # Business logic
│   ├── Database/
│   │   └── schema.sql        # Database structure
│   ├── setup_admin_users.sql # Admin users setup
│   ├── appsettings.json      # Configuration (UPDATE THIS!)
│   └── Program.cs            # Entry point
│
├── frontend/                  # React + TypeScript
│   ├── src/
│   │   ├── AdminDashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── IdeaForm.tsx
│   │   └── services/         # API service layer
│   └── package.json
│
└── README.md
```

## 🌐 Application URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Swagger (API Docs):** http://localhost:5000/swagger

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed correctly
3. Ensure MySQL is running and accessible
4. Check that both backend and frontend are running without errors

---

**Happy Coding! 🎉**
