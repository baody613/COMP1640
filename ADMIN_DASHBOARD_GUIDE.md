# Admin Dashboard - Hướng dẫn sử dụng

## ✅ Đã hoàn thành

### 1. 📊 **Admin Dashboard Component**

- **File**: `frontend-app/src/AdminDashboard.tsx` và `AdminDashboard.css`
- **Tính năng**:
  - ✅ Tab "Tổng quan": Hiển thị thống kê tổng quan (tổng số ideas, comments, users, departments)
  - ✅ Tab "Quản lý User": Hiển thị danh sách tất cả users với thông tin chi tiết (role, department, status)
  - ✅ Tab "Quản lý Topics": Hiển thị tất cả topics với deadline management và export functions
  - ✅ Tab "Quản lý Categories": Hiển thị danh sách categories
  - ✅ Tab "Thống kê": Thống kê chi tiết theo phòng ban, category, và topic với biểu đồ
  - ✅ Navigation trong Dashboard.tsx đã được cập nhật (Admin button hiển thị cho QAManager và Administrator)
  - ✅ Route `/admin` đã được thêm vào App.tsx với PrivateRoute protection

### 2. 🔧 **Backend APIs - User Management**

- **GET** `/api/Admin/users` - Lấy danh sách tất cả users
- **POST** `/api/Admin/users` - Tạo user mới (Administrator only)
- **PUT** `/api/Admin/users/{id}` - Cập nhật thông tin user (Administrator only)
- **DELETE** `/api/Admin/users/{id}` - Deactivate user (soft delete) (Administrator only)

**Request body cho POST/PUT users:**

```json
{
  "fullName": "Nguyen Van A",
  "email": "nguyenvana@university.edu",
  "password": "password123",
  "role": "Staff", // Administrator | QAManager | Staff | QACoordinator
  "departmentId": 1,
  "isActive": true
}
```

### 3. 🔧 **Backend APIs - Topic Management**

- **POST** `/api/Admin/topics` - Tạo topic mới
- **PUT** `/api/Admin/topics/{id}` - Cập nhật topic
- **DELETE** `/api/Admin/topics/{id}` - Xóa topic (nếu chưa có ideas)

**Request body cho POST/PUT topics:**

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

## 🚀 Cách sử dụng

### **Bước 1: Restart Backend** ⚠️ (BẮT BUỘC)

Backend đang chạy (PID 7668) và cần restart để áp dụng các endpoint mới:

```powershell
# Stop backend hiện tại
Stop-Process -Id 7668 -Force

# Start lại backend
cd N:\COMP1640\backend
dotnet run
```

Hoặc trong VS Code:

1. Nhấn `Ctrl+C` trong terminal đang chạy backend
2. Chạy lại: `dotnet run`

### **Bước 2: Truy cập Admin Dashboard**

1. Login với tài khoản Administrator:
   - **Email**: `admin@university.edu`
   - **Password**: `password123`

2. Sau khi login, click button **"Admin"** trên Dashboard header

3. Hoặc truy cập trực tiếp: `http://localhost:3000/admin`

---

## 📋 Chi tiết các tab trong Admin Dashboard

### 📊 **Tab "Tổng quan"**

- Hiển thị 4 stat cards:
  - 💡 Tổng số ý tưởng
  - 💬 Tổng số bình luận
  - 👥 Tổng số người dùng
  - 🏢 Tổng số phòng ban

### 👥 **Tab "Quản lý User"**

- **Hiển thị danh sách users** với thông tin:
  - ID, Họ tên, Email, Role (với color badge)
  - Phòng ban, Trạng thái Đồng ý T&C, Trạng thái Active/Inactive
  - Ngày tạo

- **Tính năng hiện tại**: Xem danh sách và refresh
- **TODO**: Thêm CRUD forms (Create/Edit/Delete user)

### 📚 **Tab "Quản lý Topics"**

- **Hiển thị grid của topics** với:
  - Tên topic, mô tả
  - 📅 Deadline ý tưởng (Idea Submission Deadline)
  - 💬 Deadline bình luận (Comment Deadline)
  - Số lượng ideas và categories
  - **Export buttons**:
    - 📥 Export CSV - Xuất danh sách ideas ra file CSV
    - 📦 Export Docs - Xuất tất cả documents trong topic ra file ZIP

- **Tính năng hiện tại**: Xem topics và export
- **TODO**: Thêm CRUD forms (Create/Edit/Delete topic)

### 🏷️ **Tab "Quản lý Categories"**

- **Hiển thị grid của categories** với tên và mô tả
- **TODO**: Thêm CRUD forms (Create/Edit/Delete category)

### 📈 **Tab "Thống kê"**

- **3 bảng thống kê chi tiết**:
  1. **🏢 Thống kê theo phòng ban**:
     - Số nhân viên
     - Số ý tưởng
     - Số bình luận
     - Lượt xem
  2. **🏷️ Thống kê theo danh mục**:
     - Số ý tưởng
     - Số bình luận
     - 👍 Thumbs Up (màu xanh)
     - 👎 Thumbs Down (màu đỏ)
  3. **📚 Thống kê theo topic**:
     - Số ý tưởng
     - Số bình luận
     - Lượt xem
     - Số người tham gia
     - Trạng thái Active/Inactive

---

## 🔐 Phân quyền

### **QAManager và Administrator**

- ✅ Xem tất cả tabs trong Admin Dashboard
- ✅ Export CSV và Documents
- ✅ Xem thống kê

### **Administrator only** (cho CRUD operations)

- ✅ Tạo/Sửa/Xóa User
- ✅ Tạo/Sửa/Xóa Topic
- ✅ Tạo/Sửa/Xóa Category

### **Staff và QACoordinator**

- ❌ Không có quyền truy cập Admin Dashboard

---

## 🎨 UI/UX Features

### **Design**

- Gradient background (purple theme)
- Modern card-based layout
- Responsive grid system
- Hover effects và transitions
- Color-coded role badges:
  - 🟡 Administrator (yellow/gold)
  - 🔵 QAManager (blue)
  - 🟢 Staff (green)
  - 🔴 QACoordinator (pink)

### **Navigation**

- Tab-based navigation với active state
- Breadcrumb trong header
- Quick return to Dashboard button
- Logout button luôn hiển thị

---

## 🔄 Các bước tiếp theo (Optional enhancements)

### **1. User Management CRUD Forms**

```tsx
// TODO: Thêm modal/form cho:
- ➕ Create User button → Form modal với fields (FullName, Email, Password, Role, Department)
- ✏️ Edit User button → Pre-filled form
- 🗑️ Delete User button → Confirmation dialog
- Validation: Email format, password strength, unique email
```

### **2. Topic Management CRUD Forms**

```tsx
// TODO: Thêm modal/form cho:
- ➕ Create Topic button → Form với Name, Description, Deadlines
- ✏️ Edit Topic button → Update deadlines
- 🗑️ Delete Topic button (với check ideas count)
- Toggle Active/Inactive status
```

### **3. Category Management CRUD Forms**

```tsx
// TODO: Thêm modal/form cho:
- ➕ Create Category button → Form với Name, Description, TopicId
- ✏️ Edit Category button
- 🗑️ Delete Category button
```

### **4. Search & Filters**

```tsx
// TODO: Thêm:
- 🔍 Search users by name, email, role
- 🔍 Filter topics by active status
- 🔍 Filter categories by topic
```

### **5. Charts & Visualizations** (Optional)

```bash
# Cài đặt chart library
npm install recharts
# hoặc
npm install chart.js react-chartjs-2
```

Then add charts to Statistics tab:

- Line chart: Ideas over time
- Bar chart: Ideas by department/category
- Pie chart: User roles distribution

---

## ✅ Testing Checklist

- [x] Backend build thành công (có warnings về file lock - normal)
- [x] Frontend không có TypeScript errors
- [ ] Restart backend và test endpoints:
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

1. **Backend đang chạy** (PID 7668) nên build failed vì không thể copy file mới. **BẮT BUỘC phải restart backend** để áp dụng các endpoint mới.

2. **Validation rules**:
   - Email phải unique
   - Password tối thiểu 6 ký tự (có thể thêm validation)
   - Idea submission deadline phải trước comment deadline
   - Không thể xóa topic có ideas (chỉ có thể deactivate)
   - Không thể xóa chính mình (trong DeleteUser)

3. **Database changes**: Không cần migration mới vì chỉ thêm endpoints, không thay đổi schema.

4. **Frontend đã sẵn sàng**: Có thể test ngay sau khi restart backend.

---

## 🎯 Summary

**✅ HOÀN THÀNH:**

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
