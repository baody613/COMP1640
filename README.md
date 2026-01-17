# Student Idea Contribution System - COMP1640

Hệ thống đóng góp ý tưởng của sinh viên - Dự án COMP1640

## 📋 Tổng quan

Hệ thống cho phép sinh viên đóng góp ý tưởng nhằm nâng cao trải nghiệm học tập tại trường. Hệ thống hỗ trợ:
- ✅ Quản lý Topics với deadline
- ✅ Đóng góp ý tưởng (có thể ẩn danh)
- ✅ Phân loại theo Categories
- ✅ Bình luận và tương tác
- ✅ Reaction (thumbs up/down)
- ✅ Upload file đính kèm
- ✅ Thống kê và báo cáo

## 🏗️ Kiến trúc

### Backend
- **Framework**: ASP.NET Core .NET 9.0
- **API Documentation**: Swagger/Swashbuckle 6.5.0
- **Port**: 5122
- **CORS**: Configured for cross-origin requests

### Frontend
- **Framework**: React 18.2 + TypeScript
- **Build Tool**: Vite 5.4.21
- **Styling**: Tailwind CSS (PostCSS plugin)
- **HTTP Client**: Axios 1.6.2
- **Routing**: React Router DOM 6.21.0
- **Port**: 5173

## 📁 Cấu trúc Project

```
COMP1640/
├── backend/
│   ├── Controllers/          # API Controllers
│   │   ├── AuthController.cs
│   │   ├── TopicController.cs
│   │   ├── IdeaController.cs
│   │   ├── CommentController.cs
│   │   ├── CategoryController.cs
│   │   └── DepartmentController.cs
│   ├── Models/              # Data Models
│   │   ├── User.cs
│   │   ├── Topic.cs
│   │   ├── Idea.cs
│   │   ├── Comment.cs
│   │   ├── Reaction.cs
│   │   ├── Category.cs
│   │   └── Department.cs
│   ├── Program.cs           # Entry point
│   └── appsettings.json     # Configuration
│
└── frontend/
    ├── src/
    │   ├── components/      # React Components
    │   │   ├── IdeaForm.tsx
    │   │   ├── IdeaCard.tsx
    │   │   └── CommentList.tsx
    │   ├── pages/           # Page Components
    │   │   ├── HomePage.tsx
    │   │   └── TopicDetailPage.tsx
    │   ├── services/        # API Services
    │   │   ├── authService.ts
    │   │   ├── topicService.ts
    │   │   ├── ideaService.ts
    │   │   ├── commentService.ts
    │   │   ├── categoryService.ts
    │   │   └── departmentService.ts
    │   ├── utils/           # Utilities
    │   │   ├── constants.ts
    │   │   ├── validators.ts
    │   │   ├── formatters.ts
    │   │   └── index.ts
    │   ├── api.ts           # Axios configuration
    │   ├── types.ts         # TypeScript types
    │   ├── App.tsx          # Root component
    │   └── main.tsx         # Entry point
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.ts
    └── package.json
```

## 🚀 Cài đặt & Chạy

### Backend

```bash
cd backend
dotnet restore
dotnet run
```

Backend sẽ chạy tại: http://localhost:5122
Swagger UI: http://localhost:5122/swagger

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Topics
- `GET /api/topic` - Lấy tất cả topics
- `GET /api/topic/{id}` - Lấy topic theo ID
- `POST /api/topic` - Tạo topic mới
- `PUT /api/topic/{id}` - Cập nhật topic
- `DELETE /api/topic/{id}` - Xóa topic
- `GET /api/topic/statistics` - Thống kê
- `GET /api/topic/{id}/export` - Export data

### Ideas
- `GET /api/idea` - Lấy tất cả ideas
- `GET /api/idea/{id}` - Lấy idea theo ID
- `GET /api/idea/topic/{topicId}` - Lấy ideas theo topic
- `POST /api/idea` - Tạo idea mới
- `PUT /api/idea/{id}` - Cập nhật idea
- `DELETE /api/idea/{id}` - Xóa idea
- `POST /api/idea/{id}/react` - React to idea
- `GET /api/idea/topic/{topicId}/no-comments` - Ideas không có comment
- `GET /api/idea/anonymous` - Ideas ẩn danh

### Comments
- `GET /api/comment/idea/{ideaId}` - Lấy comments theo idea
- `POST /api/comment` - Tạo comment
- `PUT /api/comment/{id}` - Cập nhật comment
- `DELETE /api/comment/{id}` - Xóa comment

### Categories
- `GET /api/category` - Lấy tất cả categories
- `GET /api/category/{id}` - Lấy category theo ID
- `POST /api/category` - Tạo category
- `PUT /api/category/{id}` - Cập nhật category
- `DELETE /api/category/{id}` - Xóa category

### Departments
- `GET /api/department` - Lấy tất cả departments
- `GET /api/department/{id}` - Lấy department theo ID

## 🎨 Tính năng đã tối ưu

### Backend
- ✅ Response compression
- ✅ JSON serialization options (ignore cycles, null values)
- ✅ Global error handling middleware
- ✅ Health check endpoint
- ✅ Swagger documentation với detailed info
- ✅ Async/await patterns
- ✅ Proper HTTP status codes

### Frontend
- ✅ Axios interceptors cho authentication
- ✅ Request/Response error handling
- ✅ Client-side caching (30-60s TTL)
- ✅ Form validation với custom validators
- ✅ Loading states & error states
- ✅ React.memo optimization cho components
- ✅ useCallback & useMemo hooks
- ✅ File upload validation
- ✅ Responsive design (mobile-first)
- ✅ TypeScript strict mode
- ✅ Utility functions (formatters, validators)

## 📊 Performance

### Caching Strategy
- **Topics**: 30 seconds cache
- **Categories**: 60 seconds cache (ít thay đổi)
- **Ideas**: 30 seconds cache
- Auto clear cache khi có mutation (create/update/delete)

### Validation
- Client-side validation trước khi gửi request
- Tất cả validators tách riêng trong `utils/validators.ts`
- File size limit: 10MB
- Allowed file types: Images, PDF, Word docs

### Error Handling
- Global API error interceptor
- 401: Auto redirect to login
- 403: Access forbidden notification
- 500: Server error logging
- Network errors: Connection check notification

## 🔐 Security

- CORS configured cho cross-origin requests
- Token-based authentication
- LocalStorage cho token & user data
- Auto logout khi token expired (401)
- Input validation cả client & server side

## 🎯 User Roles

- **Staff (0)**: Nhân viên - Đóng góp ý tưởng
- **QA Coordinator (1)**: Điều phối viên - Quản lý trong department
- **QA Manager (2)**: Quản lý - Toàn quyền

## 📝 TODO - Next Steps

### Database Integration
- [ ] Setup Entity Framework Core
- [ ] Database migrations
- [ ] Seed initial data

### Authentication
- [ ] JWT token implementation
- [ ] Refresh token mechanism
- [ ] Password hashing (BCrypt)
- [ ] Role-based authorization

### Features
- [ ] Email notifications
- [ ] File upload to server/cloud storage
- [ ] Advanced search & filtering
- [ ] Data export (CSV, Excel)
- [ ] Real-time notifications (SignalR)
- [ ] Charts & analytics dashboard

### Testing
- [ ] Unit tests (xUnit)
- [ ] Integration tests
- [ ] E2E tests (Playwright/Cypress)

### Deployment
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Production configuration
- [ ] Monitoring & logging

## 👥 Team

COMP1640 Project Team - University of Greenwich

## 📄 License

Educational Project - 2026
