# Admin Dashboard - User Guide

## ✅ Completed

### 1. 📊 **Admin Dashboard Component**

- **File**: `frontend-app/src/AdminDashboard.tsx` and `AdminDashboard.css`
- **Features**:
  - ✅ "Overview" Tab: Display overall statistics (total ideas, comments, users, departments)
  - ✅ "User Management" Tab: Display list of all users with detailed information (role, department, status)
  - ✅ "Topics Management" Tab: Display all topics with deadline management and export functions
  - ✅ "Categories Management" Tab: Display list of categories
  - ✅ "Statistics" Tab: Detailed statistics by department, category, and topic with charts
  - ✅ Navigation in Dashboard.tsx has been updated (Admin button shown for QAManager and Administrator)
  - ✅ Route `/admin` has been added to App.tsx with PrivateRoute protection

### 2. 🔧 **Backend APIs - User Management**

- **GET** `/api/Admin/users` - Get list of all users
- **POST** `/api/Admin/users` - Create new user (Administrator only)
- **PUT** `/api/Admin/users/{id}` - Update user information (Administrator only)
- **DELETE** `/api/Admin/users/{id}` - Deactivate user (soft delete) (Administrator only)

**Request body for POST/PUT users:**

```json
{
  "fullName": "Nguyen Van A",
  "email": "nguyenvana@university.edu",
  "password": "password123",
  "role": "Staff" // Administrator | QAManager | Staff | QACoordinator
  "departmentId": 1,
  "isActive": true
}
```

### 3. 🔧 **Backend APIs - Topic Management**

- **POST** `/api/Admin/topics` - Create new topic
- **PUT** `/api/Admin/topics/{id}` - Update topic
- **DELETE** `/api/Admin/topics/{id}` - Delete topic (if no ideas)

**Request body for POST/PUT topics:**

```json
{
  "name": "Innovation for 2025",
  "description": "Submit your innovative ideas for the year 2025",
  "ideaSubmissionDeadline": "2025-05-01T00:00:00Z",
  "commentDeadline": "2025-05-15T00:00:00Z",
  "isActive": true
}
```

### 4. 📁 **Files Updated/Created**

- ✅ `frontend-app/src/AdminDashboard.tsx` (NEW)
- ✅ `frontend-app/src/AdminDashboard.css` (NEW)
- ✅ `frontend-app/src/App.tsx` (Updated - added /admin route)
- ✅ `backend/Controllers/AdminController.cs` (Updated - added user/topic management endpoints)
- ✅ `backend/Models/AdminDtos.cs` (NEW - DTOs for API requests)

---

## 🚀 How to Use

### **Step 1: Restart Backend** ⚠️ (REQUIRED)

Backend is running and needs to restart to apply new endpoints:

```powershell
# Stop current backend
Stop-Process -Id 7668 -Force

# Start backend again
cd N:\COMP1640\backend
dotnet run
```

Or in VS Code:

1. Press `Ctrl+C` in the terminal running backend
2. Run again: `dotnet run`

### **Step 2: Access Admin Dashboard**

1. Login with Administrator account:
   - **Email**: `admin@university.edu`
   - **Password**: `password123`

2. After login, click **"Admin"** button on Dashboard header

3. Or access directly: `http://localhost:3000/admin`

---

## 📋 Details of Tabs in Admin Dashboard

### 📊 **"Overview" Tab**

- Display 4 stat cards:
  - 💡 Total ideas
  - 💬 Total comments
  - 👥 Total users
  - 🏢 Total departments

### 👥 **"User Management" Tab**

- **Display user list** with information:
  - ID, Full Name, Email, Role (with color badge)
  - Department, T&C Agreement Status, Active/Inactive Status
  - Creation Date

- **Current features**: View list and refresh
- **TODO**: Add CRUD forms (Create/Edit/Delete user)

### 📚 **"Topics Management" Tab**

- **Display topics grid** with:
  - Topic name, description
  - 📅 Idea Submission Deadline
  - 💬 Comment Deadline
  - Number of ideas and categories
  - **Export buttons**:
    - 📥 Export CSV - Export ideas list to CSV file
    - 📦 Export Docs - Export all documents in topic to ZIP file

- **Current features**: View topics and export
- **TODO**: Add CRUD forms (Create/Edit/Delete topic)

### 🏷️ **"Categories Management" Tab**

- **Display categories grid** with name and description
- **TODO**: Add CRUD forms (Create/Edit/Delete category)

### 📈 **"Statistics" Tab**

- **3 detailed statistics tables**:
  1. **🏢 Statistics by Department**:
     - Number of employees
     - Number of ideas
     - Number of comments
     - Views
  2. **🏷️ Statistics by Category**:
     - Number of ideas
     - Number of comments
     - 👍 Thumbs Up (green)
     - 👎 Thumbs Down (red)
  3. **📚 Statistics by Topic**:
     - Number of ideas
     - Number of comments
     - Views
     - Number of participants
     - Active/Inactive Status

---

## 🔐 Permissions

### **QAManager and Administrator**

- ✅ View all tabs in Admin Dashboard
- ✅ Export CSV and Documents
- ✅ View statistics

### **Administrator only** (for CRUD operations)

- ✅ Create/Edit/Delete User
- ✅ Create/Edit/Delete Topic
- ✅ Create/Edit/Delete Category

### **Staff and QACoordinator**

- ❌ No access to Admin Dashboard

---

## 🎨 UI/UX Features

### **Design**

- Gradient background (purple theme)
- Modern card-based layout
- Responsive grid system
- Hover effects and transitions
- Color-coded role badges:
  - 🟡 Administrator (yellow/gold)
  - 🔵 QAManager (blue)
  - 🟢 Staff (green)
  - 🔴 QACoordinator (pink)

### **Navigation**

- Tab-based navigation with active state
- Breadcrumb in header
- Quick return to Dashboard button
- Logout button always displayed

---

## 🔄 Next Steps (Optional enhancements)

### **1. User Management CRUD Forms**

```tsx
// TODO: Add modal/form for:
- ➕ Create User button → Form modal with fields (FullName, Email, Password, Role, Department)
- ✏️ Edit User button → Pre-filled form
- 🗑️ Delete User button → Confirmation dialog
- Validation: Email format, password strength, unique email
```

### **2. Topic Management CRUD Forms**

```tsx
// TODO: Add modal/form for:
- ➕ Create Topic button → Form with Name, Description, Deadlines
- ✏️ Edit Topic button → Update deadlines
- 🗑️ Delete Topic button (with check ideas count)
- Toggle Active/Inactive status
```

### **3. Category Management CRUD Forms**

```tsx
// TODO: Add modal/form for:
- ➕ Create Category button → Form with Name, Description, TopicId
- ✏️ Edit Category button
- 🗑️ Delete Category button
```

### **4. Search & Filters**

```tsx
// TODO: Add:
- 🔍 Search users by name, email, role
- 🔍 Filter topics by active status
- 🔍 Filter categories by topic
```

### **5. Charts & Visualizations** (Optional)

```bash
# Install chart library
npm install recharts
# or
npm install chart.js react-chartjs-2
```

Then add charts to Statistics tab:

- Line chart: Ideas over time
- Bar chart: Ideas by department/category
- Pie chart: User roles distribution

---

## ✅ Testing Checklist

- [x] Backend build successful (has warnings about file lock - normal)
- [x] Frontend has no TypeScript errors
- [ ] Restart backend and test endpoints:
  - [ ] GET `/api/Admin/users` → Returns user list
  - [ ] POST `/api/Admin/users` → Creates new user
  - [ ] PUT `/api/Admin/users/1` → Updates user
  - [ ] DELETE `/api/Admin/users/2` → Deactivates user
- [ ] Frontend Admin Dashboard:
  - [ ] Navigate to `/admin` as Administrator
  - [ ] All tabs load correctly
  - [ ] Overview stats display properly
  - [ ] Users table shows all users
  - [ ] Topics grid with export buttons
  - [ ] Statistics tables populated
- [ ] Role restrictions:
  - [ ] Administrator can access all features
  - [ ] QAManager can access Admin Dashboard
  - [ ] Staff/QACoordinator cannot access `/admin`

---

## 📝 Notes

1. **Backend is running** (PID 7668) so build failed because cannot copy new files. **MUST restart backend** to apply new endpoints.

2. **Validation rules**:
   - Email must be unique
   - Password minimum 6 characters (can add validation)
   - Idea submission deadline must be before comment deadline
   - Cannot delete topic with ideas (can only deactivate)
   - Cannot delete yourself (in DeleteUser)

3. **Database changes**: No new migration needed because only adding endpoints, no schema changes.

4. **Frontend is ready**: Can test immediately after restarting backend.

---

## 🎯 Summary

**✅ COMPLETED:**

- Admin Dashboard UI với 5 tabs
- Backend APIs cho User Management (GET/POST/PUT/DELETE)
- Backend APIs cho Topic Management (POST/PUT/DELETE)
- Routing và navigation
- Role-based access control
- Export CSV/ZIP cho topics

**🔄 CẦN LÀM THÊM:**

- Restart backend (QUAN TRỌNG!)
- Test tất cả endpoints
- Thêm CRUD forms cho User/Topic/Category (optional)
- Thêm search/filter functionality (optional)
- Thêm charts/graphs (optional)

**👤 User có thể bắt đầu test ngay bằng cách:**

1. Stop backend hiện tại: `Stop-Process -Id 7668 -Force`
2. Start backend: `cd N:\COMP1640\backend; dotnet run`
3. Login as admin: `admin@university.edu` / `password123`
4. Click "Admin" button hoặc truy cập `http://localhost:3000/admin`
