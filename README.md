# COMP1640 — Idea Hub

A web application for university staff to submit, discuss, and manage improvement ideas across departments.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript, Vite, React Router, Axios |
| Backend | ASP.NET Core 9 (C#), Entity Framework Core |
| Database | MySQL |
| Auth | JWT Bearer Tokens |

---

## Features

- **Idea Submission** — Staff submit ideas under topics, categories, and departments; optional anonymous posting
- **Approval Workflow** — Administrators review ideas (Pending → Approved / Rejected) with optional rejection reason
- **Comments & Reactions** — Authenticated users engage with approved ideas
- **File Attachments** — Upload supporting documents alongside an idea
- **Admin Dashboard** — Manage users, topics, categories, departments, and view statistics
- **Email Notifications** — SMTP-based alerts for key events
- **Role-based Access** — `Staff` and `Administrator` roles with separate views

---

## Project Structure

```
COMP1640/
├── backend/        # ASP.NET Core Web API
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   ├── Services/
│   └── Migrations/
└── frontend/       # React + TypeScript SPA
    └── src/
```

---

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- MySQL 8+

### Backend

```bash
cd backend
# Set connection string in appsettings.Development.json
dotnet ef database update
dotnet run
```

API runs at `https://localhost:7001` — Swagger UI available at `/swagger`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

---

## Default Roles

| Role | Permissions |
|------|-------------|
| Staff | Submit ideas, comment, react, view approved ideas |
| Administrator | All above + approve/reject ideas, manage all entities |
