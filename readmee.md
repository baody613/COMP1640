COMP1640 – Student Idea Contribution System

Project Report

Module: COMP1640 – Enterprise Web Development
Project: Student Idea Contribution System (SICS)
Technology Stack: ASP.NET Core 8 (C#) · React 18 (TypeScript) · Entity Framework Core · MySQL
Academic Year: 2025–2026

---

Table of Contents

1. Introduction
2. Agile Scrum Documentation

- 2.1 Roles and Responsibilities
- 2.2 Tools
- 2.3 Meetings
- 2.4 Product Backlogs
- 2.5 Sprint Backlogs
- 2.6 Project Burn Down Chart

3. Design Documentation

- 3.1 Use Case Diagrams
- 3.2 Database Diagrams
- 3.3 Website Design

4. Implementation

- 4.1 List of Files in System
- 4.2 Some Screenshots of the System

5. Testing

- 5.1 Test Plan
- 5.2 Test Log

6. Evaluation
7. Agile Method

- 7.1 Product Backlogs
- 7.2 Sprint Backlogs
- 7.3 Schedule
- 7.4 Progress (Trello Board)
- 7.5 Daily Meetings
- 7.6 Sprint Review & Retrospective Meetings
- 7.7 Burndown Charts

8. References

---

1. Introduction

The Student Idea Contribution System (SICS) is a web-based platform developed as part of the COMP1640 module. The system enables staff and students within a university to submit, discuss, and evaluate ideas across academic departments. It is designed to facilitate bottom-up innovation by allowing any staff member to contribute ideas, which are then organised around Topics (academic campaigns) and can be reacted to, commented on, and exported for management review.

---

2. Agile Scrum Documentation

2.1 Roles and Responsibilities

The team adopted the Scrum framework for the full project lifecycle. The following table outlines each Scrum role and its responsibilities.

Column 1 Column 2 Column 3
Scrum Role Assigned To Responsibilities
Product Owner Team Lead Define product backlog, prioritise user stories, accept completed work, liaise between stakeholders and team
Scrum Master Team Member Facilitate Scrum ceremonies, remove impediments, ensure team follows Scrum principles
Development Team – Backend 1–2 Members Design and implement REST API endpoints (ASP.NET Core), database schema, authentication, email service
Development Team – Frontend 1–2 Members Design and implement React UI components, integrate with REST API, handle routing and state
Development Team – QA 1 Member Write and execute test plans, log defects, perform regression testing

Note: In a small academic team, members may hold multiple Scrum roles simultaneously (e.g., a developer may also act as a QA tester).

---

2.2 Tools

Column 1 Column 2 Column 3
Category Tool Purpose
Project Management Trello / Jira Sprint board, backlog tracking, user story mapping
Version Control Git + GitHub Source code management, branching strategy, pull requests
Communication Microsoft Teams / Discord Daily Scrum, sprint planning, issue discussion
IDE – Backend Visual Studio 2022 / VS Code C# development, EF Core migrations
IDE – Frontend Visual Studio Code React/TypeScript development
API Testing Postman Manual API endpoint testing
Database MySQL Workbench Schema design, query execution, seed data management
Diagram & Design draw.io / Figma Use case diagrams, wireframes, site map
Documentation Markdown / GitHub Wiki Technical documentation, README files
CI/CD GitHub Actions (planned) Automated build and test pipeline

---

2.3 Meetings

2.3.1 Sprint Planning

Sprint Planning meetings were held at the beginning of each sprint. The Product Owner presented the prioritised backlog items, the team estimated effort (using Story Points with a Fibonacci scale: 1, 2, 3, 5, 8), and committed to a Sprint Goal.

Column 1 Column 2 Column 3 Column 4
Sprint Date Sprint Goal Total Story Points Committed
Sprint 1 Week 1 Project setup, authentication, database schema 34
Sprint 2 Week 3 Core features: Ideas, Comments, Reactions, File Upload 42
Sprint 3 Week 5 Admin features, Statistics, Export, Email 38
Sprint 4 Week 7 Frontend UI, testing, bug fixes, documentation 28

Sprint Planning Agenda:

1. Review and clarify top-priority backlog items.
2. Break stories into tasks (max 1-day granularity).
3. Assign tasks to team members.
4. Confirm the Sprint Goal and capacity.

---

2.3.2 Sprint Review

Sprint Reviews were held at the end of each sprint. The team demonstrated completed work to stakeholders (module tutor), gathered feedback, and updated the product backlog accordingly.

Column 1 Column 2 Column 3 Column 4
Sprint Review Date Demo Highlights Feedback / Action Items
Sprint 1 End of Week 2 Working login/register, JWT auth, database migrations Add terms & conditions field to user registration
Sprint 2 End of Week 4 Idea submission, anonymous posting, comments, reactions Anonymous comment feature confirmed; add pagination to idea lists
Sprint 3 End of Week 6 Admin dashboard, CSV export, statistics charts, email logs Improve ZIP export to include folder structure per topic
Sprint 4 End of Week 8 Full frontend UI, responsive design, full test suite Minor UI fixes; update documentation

---

2.3.3 Daily Scrum

Daily Scrum (stand-up) meetings were held every working day, lasting no more than 15 minutes. Each team member answered three questions:

1. What did I do yesterday?
2. What will I do today?
3. Are there any impediments blocking my progress?

These meetings were conducted via Microsoft Teams/Discord (online), using a time-boxed format. Impediments were noted and assigned to the Scrum Master for resolution. A shared Kanban board (Trello) was updated daily to reflect task status (To Do → In Progress → Done).

---

2.4 Product Backlogs

The Product Backlog contains all user stories required for the system, prioritised by business value. Each story is assigned a unique ID, priority, and story points estimate.

Column 1 Column 2 Column 3 Column 4 Column 5
ID User Story Priority Story Points Status
US-001 As a Staff member, I want to register an account so that I can participate in the system High 3 ✅ Done
US-002 As any user, I want to log in with email and password so that I can access my personalised dashboard High 3 ✅ Done
US-003 As a Staff member, I want to agree to Terms & Conditions before participating High 2 ✅ Done
US-004 As a Staff member, I want to submit an idea to an active Topic High 5 ✅ Done
US-005 As a Staff member, I want to post ideas anonymously High 3 ✅ Done
US-006 As a Staff member, I want to attach files (documents, images) to my idea Medium 5 ✅ Done
US-007 As a Staff member, I want to categorise my idea using predefined categories Medium 3 ✅ Done
US-008 As any authenticated user, I want to comment on ideas High 3 ✅ Done
US-009 As any user, I want to comment anonymously Medium 2 ✅ Done
US-010 As any user, I want to give a thumbs-up or thumbs-down reaction to an idea Medium 3 ✅ Done
US-011 As a QA Coordinator, I want to receive an email notification when a new idea is submitted High 5 ✅ Done
US-012 As an idea author, I want to receive an email notification when someone comments on my idea Medium 3 ✅ Done
US-013 As a QA Manager, I want to view the most popular ideas sorted by votes Medium 3 ✅ Done
US-014 As a QA Manager, I want to download ideas as a CSV file after the final closure date High 5 ✅ Done
US-015 As a QA Manager, I want to download all uploaded documents as a ZIP archive High 5 ✅ Done
US-016 As a QA Manager, I want to add and manage idea categories Medium 3 ✅ Done
US-017 As an Administrator, I want to manage user accounts (create, update, deactivate) High 5 ✅ Done
US-018 As an Administrator, I want to manage departments High 3 ✅ Done
US-019 As an Administrator, I want to create and manage Topics with dual deadlines High 5 ✅ Done
US-020 As an Administrator, I want to view system-wide statistics Medium 5 ✅ Done
US-021 As an Administrator, I want to configure system settings (academic year, closure dates) Medium 3 ✅ Done
US-022 As any user, I want the interface to be responsive on mobile and desktop Low 8 ✅ Done
US-023 As a QA Manager, I want to see statistics per department Medium 5 ✅ Done
US-024 As a Staff member, I want to view a list of all ideas in a Topic with pagination Medium 3 ✅ Done

---

2.5 Sprint Backlogs

Sprint 1 – Foundation (Weeks 1–2)

Sprint Goal: Set up project infrastructure, implement authentication, and establish the database schema.

Column 1 Column 2 Column 3 Column 4 Column 5
Task ID Task Assignee Estimate (hrs) Status
T-001 Set up ASP.NET Core project structure Backend Dev 4 ✅ Done
T-002 Configure Entity Framework Core with MySQL Backend Dev 4 ✅ Done
T-003 Design and create database schema (Users, Departments, Topics, Ideas, Comments, Reactions, Documents, Categories) Backend Dev 8 ✅ Done
T-004 Implement JWT authentication (register, login endpoints) Backend Dev 6 ✅ Done
T-005 Implement BCrypt password hashing Backend Dev 2 ✅ Done
T-006 Implement role-based authorization (Administrator, QAManager, QACoordinator, Staff) Backend Dev 4 ✅ Done
T-007 Set up React + TypeScript + Vite frontend project Frontend Dev 3 ✅ Done
T-008 Implement Login and Register pages Frontend Dev 6 ✅ Done
T-009 Implement JWT token storage and authService Frontend Dev 4 ✅ Done
T-010 Configure React Router with protected routes Frontend Dev 3 ✅ Done
T-011 Seed initial database records (admin user, departments) Backend Dev 2 ✅ Done

Sprint 2 – Core Features (Weeks 3–4)

Sprint Goal: Implement idea submission, comments, reactions, and file attachment functionality.

Column 1 Column 2 Column 3 Column 4 Column 5
Task ID Task Assignee Estimate (hrs) Status
T-012 Implement IdeaController (GET, POST, PUT, DELETE) Backend Dev 8 ✅ Done
T-013 Implement anonymous author handling Backend Dev 3 ✅ Done
T-014 Implement file upload/download (DocumentController) Backend Dev 6 ✅ Done
T-015 Implement CommentController with anonymous option Backend Dev 5 ✅ Done
T-016 Implement Reaction model (unique constraint per user per idea) Backend Dev 4 ✅ Done
T-017 Implement TopicController with dual deadline logic Backend Dev 5 ✅ Done
T-018 Implement CategoryController (CRUD, QA Manager only) Backend Dev 4 ✅ Done
T-019 Build Dashboard component (list ideas, topics) Frontend Dev 8 ✅ Done
T-020 Build IdeaForm component (submit idea with file upload) Frontend Dev 8 ✅ Done
T-021 Build IdeaDetail page (view idea, comments, reactions) Frontend Dev 8 ✅ Done
T-022 Build Topics page Frontend Dev 5 ✅ Done

Sprint 3 – Admin & Analytics (Weeks 5–6)

Sprint Goal: Deliver admin dashboard, statistics, data exports, and email notifications.

Column 1 Column 2 Column 3 Column 4 Column 5
Task ID Task Assignee Estimate (hrs) Status
T-023 Implement StatisticsController (overview, departments, categories, topics) Backend Dev 8 ✅ Done
T-024 Implement AdminController (CSV export, ZIP export) Backend Dev 8 ✅ Done
T-025 Enforce export only after CommentDeadline Backend Dev 3 ✅ Done
T-026 Implement EmailService (QA Coordinator notification, comment notification) Backend Dev 6 ✅ Done
T-027 Implement SystemSettingsController Backend Dev 4 ✅ Done
T-028 Build AdminDashboard React component (user management, statistics charts) Frontend Dev 12 ✅ Done
T-029 Implement pagination on all idea listing endpoints Backend Dev 4 ✅ Done

Sprint 4 – Testing, Polish & Documentation (Weeks 7–8)

Sprint Goal: Complete frontend styling, perform full testing, and finalise documentation.

Column 1 Column 2 Column 3 Column 4 Column 5
Task ID Task Assignee Estimate (hrs) Status
T-030 Implement responsive CSS for all pages Frontend Dev 10 ✅ Done
T-031 NavBar component with role-based navigation Frontend Dev 5 ✅ Done
T-032 Write test plans (Administrator, QA Manager, Staff) QA 6 ✅ Done
T-033 Execute test cases and log results QA 8 ✅ Done
T-034 Fix identified bugs All 8 ✅ Done
T-035 Write project report All 6 ✅ Done

---

2.6 Project Burn Down Chart

The following table shows the ideal vs. actual remaining story points across the project's sprints. Total story points: 142.

Column 1 Column 2 Column 3
Day / Sprint End Ideal Remaining Actual Remaining
Start (Day 0) 142 142
Sprint 1 End (Day 14) 107 110
Sprint 2 End (Day 28) 61 68
Sprint 3 End (Day 42) 23 30
Sprint 4 End (Day 56) 0 0

Story Points Remaining
142 |_
130 | _ .
120 | _ .
110 | _.
100 | .
90 | ._
80 | . _
70 | . _
60 | . ._
50 | . .
40 | . ._
30 | . . _
20 | . . .
10 | . . .\*
0 |************\_************ Sprint
S0 S1 S2 S3 S4

- = Actual . = Ideal

The actual burn rate was slightly slower than ideal in Sprints 1–3 due to unexpected complexity in file upload handling and the anonymous author feature, but the team recovered in Sprint 4.

---

3. Design Documentation

3.1 Use Case Diagrams

Use Case Diagram – System Overview

+------------------------------------------------------------------+
| Student Idea Contribution System |
| |
| [Staff]────────────────────────────────────────────────────── |
| |── (UC01) Register Account |
| |── (UC02) Log In |
| |── (UC03) Accept Terms & Conditions |
| |── (UC04) Submit Idea to Topic |
| |── (UC05) Attach Files to Idea |
| |── (UC06) Select Category for Idea |
| |── (UC07) Post Anonymously |
| |── (UC08) Comment on Idea |
| |── (UC09) React (Thumbs Up / Down) to Idea |
| |── (UC10) View Ideas and Topics |
| |
| [QA Manager]───────────────────────────────────────────────── |
| |── (UC02) Log In |
| |── (UC11) Manage Categories (Add / Delete) |
| |── (UC12) View Most Popular / Viewed Ideas |
| |── (UC13) Download Ideas as CSV |
| |── (UC14) Download Documents as ZIP |
| |── (UC15) View Statistics per Department |
| |── (UC10) View Ideas and Topics |
| |
| [QA Coordinator]────────────────────────────────────────────── |
| |── (UC02) Log In |
| |── (UC16) Receive Email on New Idea |
| |── (UC10) View Ideas and Topics |
| |
| [System Administrator]──────────────────────────────────────── |
| |── (UC02) Log In |
| |── (UC17) Manage Users (Create / Update / Deactivate) |
| |── (UC18) Manage Departments |
| |── (UC19) Create and Manage Topics |
| |── (UC20) Configure System Settings |
| |── (UC21) View System-wide Statistics |
+------------------------------------------------------------------+

Use Case: Submit Idea (UC04) – Detailed

Column 1 Column 2
Field Description
Use Case Name Submit Idea
Actor Staff
Pre-condition User is authenticated and has agreed to Terms & Conditions
Post-condition Idea is saved; QA Coordinator receives email notification
Main Flow 1. Staff selects an active Topic → 2. Fills in Title, Content → 3. Selects Category → 4. (Optional) Attaches files → 5. Chooses anonymous/named → 6. Submits form → 7. System validates deadline → 8. Idea saved to database → 9. Email sent to QA Coordinator
Alternative Flow If idea submission deadline has passed → System returns error “Deadline passed”
Exception Flow If file type not allowed → System rejects upload and returns validation error

Use Case: Export Data (UC13/UC14) – Detailed

Column 1 Column 2
Field Description
Use Case Name Export Ideas as CSV / Download Documents as ZIP
Actor QA Manager, Administrator
Pre-condition Comment deadline for the Topic must have passed
Post-condition File downloaded to client
Main Flow 1. QA Manager navigates to Admin Dashboard → 2. Selects Topic → 3. Clicks Export CSV / Download ZIP → 4. System checks CommentDeadline → 5. System generates file → 6. File streamed to client
Alternative Flow If deadline not passed → System returns “Export not available yet”

---

3.2 Database Diagrams

The system uses a relational MySQL database managed through Entity Framework Core migrations. The Entity Relationship Diagram (ERD) is described below.

Entity Relationship Diagram

+------------------+ +------------------+ +------------------+
| Department | | User | | Topic |
+------------------+ +------------------+ +------------------+
| PK Id |<──1:N─| PK Id |──1:N──| PK Id |
| Name | | FullName | | Name |
| Code (Unique) | | Email (Unique) | | Description |
| FK QACoordinId | | PasswordHash | | IdeaSubDeadline |
+------------------+ | Role | | CommentDeadline |
| FK DepartmentId | | FK CreatedById |
| StudentId | | IsActive |
| AgreedTerms | +------------------+
| IsActive | |
+------------------+ | 1:N
| |
| 1:N +------------------+
| | Idea |
+------v-----------+ +------------------+
| Comment | | PK Id |
+------------------+ | Title |
| PK Id | | Content |
| Content | | IsAnonymous |
| IsAnonymous | | FK AuthorId |
| FK AuthorId | | FK TopicId |
| FK IdeaId | | FK CategoryId |
| CreatedAt | | FK DepartmentId |
+------------------+ | Attachments |
| ViewCount |
+------------------+ +------------------+
| Reaction | |
+------------------+ +-----+------+
| PK Id | | |
| IsThumbsUp | +--v---+ +-----v----+
| FK UserId | | React| | Document |
| FK IdeaId | | ion | +----------+
| (Unique: User+ | +------+ | PK Id |
| Idea) | | FileName |
+------------------+ | FilePath |
| FileType |
+------------------+ | FK IdeaId|
| Category | +----------+
+------------------+
| PK Id | +------------------+
| Name | | SystemSettings |
| FK TopicId | +------------------+
+------------------+ | PK Id |
| Key (Unique) |
| Value |
+------------------+

Key Database Relationships

Column 1 Column 2 Column 3
Relationship Type Description
Department → User One-to-Many A department has many staff members
Department → QACoordinator One-to-One Each department has one QA Coordinator
User → Idea One-to-Many A user can submit many ideas
Topic → Idea One-to-Many A topic contains many ideas
Idea → Comment One-to-Many An idea has many comments
Idea → Reaction One-to-Many An idea has many reactions (unique per user)
Idea → Document One-to-Many An idea can have multiple attached documents
Topic → Category One-to-Many A topic has many categories

Key Constraints

- User.Email – Unique index
- Department.Code – Unique index
- Reaction(UserId, IdeaId) – Unique composite index (one vote per user per idea)
- Cascade delete disabled on user → idea relationship (data retention)

---

3.3 Website Design

3.3.1 Wireframes Diagrams

Login Page

+─────────────────────────────────────────+
| SICS – Student Idea System |
|─────────────────────────────────────────|
| |
| [Logo / University Banner] |
| |
| Email: [________________________] |
| Password: [________________________] |
| |
| [ LOG IN ] |
| |
| Don't have an account? [Register] |
+─────────────────────────────────────────+

Staff Dashboard

+──NavBar──────────────────────────────────────────────────────────+
| SICS [Dashboard] [Topics] [My Ideas] [Logout] |
+───────────────────────────────────────────────────────────────────+
| |
| Welcome, [Username] |
| |
| ┌─────────────────────┐ ┌─────────────────────┐ |
| │ 🔥 Active Topics │ │ 📊 My Statistics │ |
| │ Topic A | 3 ideas │ │ Ideas: 5 │ |
| │ Topic B | 7 ideas │ │ Comments: 12 │ |
| └─────────────────────┘ └─────────────────────┘ |
| |
| Latest Ideas |
| ┌─────────────────────────────────────────────────────────┐ |
| │ [Title] by [Author] 👍 12 👎 2 💬 5 [View] │ |
| │ [Title] by Anonymous 👍 8 👎 1 💬 3 [View] │ |
| └─────────────────────────────────────────────────────────┘ |
| [← Prev] [Next →] |
+───────────────────────────────────────────────────────────────────+

Idea Detail Page

+──NavBar──────────────────────────────────────────────────────────+
| |
| ◀ Back to Topic |
| |
| [Idea Title] |
| By: [Author] | Category: [Category] | Topic: [Topic Name] |
| Posted: [Date] 👍 14 👎 3 👁 120 |
| |
| ───────────────────────────────────────────────────────────── |
| [Idea Content Body] |
| ───────────────────────────────────────────────────────────── |
| |
| Attachments: [📄 file1.docx] [📄 file2.pdf] |
| |
| [ 👍 Like ] [ 👎 Dislike ] |
| |
| ─── Comments (5) ──────────────────────────────────────────────|
| [Author] – [Date]: [Comment text...] |
| [Anonymous] – [Date]: [Comment text...] |
| |
| Add a Comment: |
| [_________________________________________________] |
| [ ] Post Anonymously [ Submit Comment ] |
+───────────────────────────────────────────────────────────────────+

Admin Dashboard

+──NavBar──────────────────────────────────────────────────────────+
| SICS [Admin Dashboard] [Logout] |
+───────────────────────────────────────────────────────────────────+
| |
| ┌────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────┐ |
| │ 👥 Users │ │ 💡 Ideas │ │ 💬 Comments │ │ 🏢 Depts │ |
| │ 45 │ │ 120 │ │ 380 │ │ 6 │ |
| └────────────┘ └──────────────┘ └──────────────┘ └───────────┘ |
| |
| [Bar Chart: Ideas per Department] |
| [Pie Chart: Ideas per Category] |
| |
| ─── User Management ────────────────────────────────────────── |
| [Search users...] [+ Add User] |
| | Name | Email | Role | Dept | Status | Actions | |
| |
| ─── Export Data ────────────────────────────────────────────── |
| Topic: [___________▼] [📥 Export CSV] [📦 Download ZIP] |
+───────────────────────────────────────────────────────────────────+

---

3.3.2 Site Map

SICS Web Application
│
├── /login (Public)
│ Login form
│
├── /register (Public)
│ Registration form + Terms & Conditions
│
└── [Authenticated]
│
├── /dashboard (All roles)
│ Latest ideas, active topics, statistics widget
│
├── /topics (Staff, QA Manager)
│ List of all topics
│ │
│ └── /topic/:topicId/new-idea
│ Idea submission form
│
├── /idea/:id (All roles)
│ Idea detail, attachments, comments, reactions
│
└── /admin (Administrator, QA Manager)
Admin dashboard
User management (CRUD)
Department management
Topic management
Statistics & charts
CSV / ZIP export

---

4. Implementation

4.1 List of Files in System

Backend (/backend/)

Column 1 Column 2
File/Directory Description
Program.cs Application entry point; configures services, middleware, JWT auth, CORS, EF Core
backend.csproj Project file with NuGet package dependencies
appsettings.json Application configuration (DB connection string, JWT secret, email settings)
appsettings.Development.json Development-specific overrides
Controllers/
AuthController.cs Endpoints: POST /api/auth/register, /api/auth/login; JWT token generation
IdeaController.cs CRUD for ideas; pagination; most-popular, most-viewed, latest endpoints
CommentController.cs CRUD for comments; anonymous comment support
TopicController.cs CRUD for topics; deadline enforcement
CategoryController.cs QA Manager-restricted category management
DepartmentController.cs Administrator-restricted department management
DocumentController.cs File upload/download; validates file type and size
AdminController.cs CSV export and ZIP document export (post-deadline only)
StatisticsController.cs Statistics endpoints: overview, per-department, per-category, timeline
SystemSettingsController.cs CRUD for key-value system settings
Data/
AppDbContext.cs EF Core DbContext; entity configurations, unique indexes, relationships
Models/
User.cs User entity (Id, FullName, Email, Role, DepartmentId, AgreedTerms, etc.)
Idea.cs Idea entity (Title, Content, IsAnonymous, CategoryId, TopicId, Attachments)
Comment.cs Comment entity (Content, IsAnonymous, IdeaId, AuthorId)
Reaction.cs Reaction entity (IsThumbsUp, UserId, IdeaId)
Topic.cs Topic entity (IdeaSubmissionDeadline, CommentDeadline)
Category.cs Category entity (Name, TopicId)
Department.cs Department entity (Name, Code, QACoordinatorId)
Document.cs Document entity (FileName, FilePath, FileType, IdeaId)
SystemSettings.cs Key-value system settings entity
AdminDtos.cs Data Transfer Objects for admin views
Services/
EmailService.cs Email notification: idea submitted, comment added; SMTP ready (dev: log-only)
Migrations/ EF Core migration files for database versioning
Database/ SQL scripts for schema, seed data, and maintenance

Frontend (/frontend/src/)

Column 1 Column 2
File Description
main.tsx React application entry point
App.tsx Root component; React Router v6 route definitions; protected routes logic
authService.ts Helper service for JWT token storage, retrieval, and user info decoding
api.ts Centralised Axios/fetch API configuration; base URL, auth headers
types.ts TypeScript shared type definitions (User, Idea, Comment, Topic, etc.)
Login.tsx / Login.css Login page component with form validation
Register.tsx / Register.css Registration form; terms & conditions checkbox
Dashboard.tsx / Dashboard.css Main dashboard for staff; shows topics, latest ideas
Topics.tsx / Topics.css Topic listing page
IdeaForm.tsx / IdeaForm.css Idea submission form; file attachment, anonymous toggle, category select
IdeaDetail.tsx / IdeaDetail.css Idea detail page; display comments, reactions, file downloads
AdminDashboard.tsx / AdminDashboard.css Administrator/QA Manager dashboard; user management, statistics, export
NavBar.tsx / NavBar.css Responsive navigation bar; role-based menu items
App.css / index.css Global and app-level styles

---

4.2 Some Screenshots of the System

Note: The following descriptions correspond to the key screens of the implemented system.

Screen 1 – Login Page

The login page presents a clean, centred card with email/password fields and a branded header. The JWT token is stored in localStorage upon successful authentication. The user is redirected to /dashboard (staff) or /admin (administrator).

Screen 2 – Staff Dashboard

After login, the staff sees a dashboard with:

- A grid of active Topics with idea counts.
- A feed of the latest ideas, each showing title, author (or “Anonymous”), thumbs-up count, thumbs-down count, view count, and comment count.
- Pagination controls (5 ideas per page).

Screen 3 – Idea Submission Form

The idea submission form (accessed from a Topic) includes:

- Title and rich-text content fields.
- Category dropdown (populated per topic).
- File attachment (multiple files supported; accepts documents and images).
- Anonymous posting toggle.
- Submit button (disabled if the idea submission deadline has passed).

Screen 4 – Idea Detail Page

The idea detail page shows:

- Full idea content and metadata (author/anonymous, date, category, topic).
- Thumbs-up / thumbs-down reaction buttons (one vote per user enforced).
- Attached file download links.
- Comment thread with timestamps.
- Comment submission form with anonymous option (disabled after comment deadline).

Screen 5 – Admin Dashboard

The admin dashboard includes:

- Summary cards (total users, ideas, comments, departments).
- Bar chart: number of ideas per department.
- User management table with add/edit/deactivate actions.
- Topic management.
- Export section: select topic → Download CSV or ZIP (only available after comment deadline).

---

5. Testing

5.1 Test Plan

Testing Strategy: The system was tested using manual black-box functional testing. Test cases were designed based on the user stories in the Product Backlog. Each test case specifies input, expected result, and actual result.

Test Environment:

- Backend: http://localhost:5005
- Frontend: http://localhost:5173
- Database: MySQL (local instance, seeded with test data)
- Browser: Google Chrome (latest), Microsoft Edge

Test Accounts:

Column 1 Column 2 Column 3
Role Email Password
Administrator admin@university.edu Admin@123
QA Manager qamanager@university.edu QA@123456
QA Coordinator qacoord@university.edu QA@123456
Staff staff@university.edu Staff@123

---

5.1.1 Test Function - System Administrator

| TC-ID | Test Case | Pre-condition | Input | Expected Result |
|---|---|---|---|---|
| TC-A01 | Login as Administrator | System running | Email: admin@university.edu, Password: Admin@123 | Redirect to /admin, JWT token issued |
| TC-A02 | Create new user | Logged in as Admin | FullName, Email, Role, Department | User created, appears in user list |
| TC-A03 | Create user with duplicate email | Logged in as Admin | Existing email address | Error: "Email already exists" |
| TC-A04 | Edit user role | Logged in as Admin | Change role from Staff to QAManager | Role updated in database |
| TC-A05 | Deactivate user account | Logged in as Admin | Select active user -> Deactivate | User IsActive = false; cannot log in |
| TC-A06 | Create new department | Logged in as Admin | Name: "Engineering", Code: "ENG" | Department created, appears in list |
| TC-A07 | Create department with duplicate code | Logged in as Admin | Code already used | Error: "Code already exists" |
| TC-A08 | Create new Topic | Logged in as Admin | Name, Deadline1 (7 days), Deadline2 (10 days) | Topic created; active in system |
| TC-A09 | Edit Topic deadline | Logged in as Admin | Change IdeaSubmissionDeadline | Deadline updated; enforced on idea submission |
| TC-A10 | View system statistics | Logged in as Admin | Navigate to /admin | Statistics cards and charts rendered |
| TC-A11 | Configure system settings | Logged in as Admin | Update "AcademicYear" setting | Setting saved; reflected in API response |
| TC-A12 | Admin cannot access Topics page (Staff only) | Logged in as Admin | Navigate to /topics | Redirect to /admin |

---

5.1.2 Test Function - QA Manager

| TC-ID | Test Case | Pre-condition | Input | Expected Result |
|---|---|---|---|---|
| TC-Q01 | Login as QA Manager | System running | Correct credentials | Redirect to dashboard, QA Manager role |
| TC-Q02 | Add new category | Logged in as QA Manager | Category Name: "Technology" | Category added; available in idea form |
| TC-Q03 | Delete unused category | Logged in as QA Manager | Select category with 0 ideas | Category deleted |
| TC-Q04 | Delete category in use | Logged in as QA Manager | Select category with linked ideas | Error: "Cannot delete category in use" |
| TC-Q05 | Export CSV - before deadline | Comment deadline not passed | Click Export CSV | Error: "Topic is still open for comments" |
| TC-Q06 | Export CSV - after deadline | Comment deadline passed | Click Export CSV | CSV file downloaded with all idea data |
| TC-Q07 | CSV content validation | After export TC-Q06 | Open CSV file | Contains: Title, Author, Category, Department, Date, ThumbsUp, ThumbsDown, Comments |
| TC-Q08 | Download ZIP - before deadline | Comment deadline not passed | Click Download ZIP | Error: "Topic is still open for comments" |
| TC-Q09 | Download ZIP - after deadline | Comment deadline passed | Click Download ZIP | ZIP file downloaded with all uploaded documents |
| TC-Q10 | View most popular ideas | Logged in as QA Manager | Navigate to ideas list | Ideas sorted by (ThumbsUp - ThumbsDown) descending |
| TC-Q11 | View statistics per department | Logged in as QA Manager | Navigate to /admin -> Statistics | Bar chart shows ideas count per department |
| TC-Q12 | QA Manager cannot create topics | Logged in as QA Manager | Attempt topic creation | Access denied (Administrator only) |

---

5.1.3 Test Function - Staff (Student)

| TC-ID | Test Case | Pre-condition | Input | Expected Result |
|---|---|---|---|---|
| TC-S01 | Register new account | System running | FullName, Email, Password, Department | Account created; redirect to login |
| TC-S02 | Register without agreeing to terms | On register page | Leave terms checkbox unchecked | Form validation error; submission blocked |
| TC-S03 | Login as Staff | Registered account | Correct credentials | Redirect to /dashboard |
| TC-S04 | Login with wrong password | On login page | Incorrect password | Error: "Invalid credentials" |
| TC-S05 | Submit idea within deadline | Active topic open | Title, Content, Category, (no files) | Idea created; appears in topic list |
| TC-S06 | Submit idea after deadline | Idea submission deadline passed | Attempt to submit idea | Error: "Idea submission deadline has passed" |
| TC-S07 | Submit idea with file attachment | Active topic open | Idea + upload .docx file | Idea created with attachment; viewable on detail page |
| TC-S08 | Submit file with invalid type | Active topic open | Upload .exe file | Error: "File type not allowed" |
| TC-S09 | Submit idea anonymously | Active topic open | Toggle "Post Anonymously" ON | Idea shows "Anonymous" as author to other users |
| TC-S10 | Verify anonymous tracking | Admin view after TC-S09 | Admin views idea | AuthorId stored; admin can identify actual author |
| TC-S11 | Comment on idea within deadline | Comment deadline not passed | Enter comment text, submit | Comment appears on idea detail page |
| TC-S12 | Comment on idea after deadline | Comment deadline passed | Attempt to submit comment | Button disabled / Error: "Comment period closed" |
| TC-S13 | Submit anonymous comment | On idea detail page | Toggle anonymous ON, submit | Comment shows "Anonymous" author |
| TC-S14 | Thumbs-up reaction | On idea detail page | Click thumbs up | Reaction saved; count increments |
| TC-S15 | Duplicate vote prevention | Already voted on idea | Click thumbs up again | Vote toggled / Previous vote removed |
| TC-S16 | View paginated idea list | On Dashboard | Navigate pages | 5 ideas per page; pagination controls work |
| TC-S17 | Staff cannot access admin dashboard | Logged in as Staff | Navigate to /admin | Redirect to /dashboard |

---

5.2 Test Log

5.2.1 Test Function - System Administrator

| TC-ID | Test Case | Expected Result | Actual Result | Status | Notes |
|---|---|---|---|---|---|
| TC-A01 | Login as Administrator | Redirect to /admin, JWT issued | Redirected to /admin, token in localStorage | Pass | |
| TC-A02 | Create new user | User created | User visible in management table | Pass | |
| TC-A03 | Create user with duplicate email | Error message | "Email already exists" displayed | Pass | |
| TC-A04 | Edit user role | Role updated | Role changed in DB and UI | Pass | |
| TC-A05 | Deactivate user account | IsActive = false | User cannot log in after deactivation | Pass | |
| TC-A06 | Create new department | Department created | Appears in department list | Pass | |
| TC-A07 | Duplicate department code | Error returned | "Code already exists" displayed | Pass | |
| TC-A08 | Create new Topic | Topic created | Topic appears in list | Pass | |
| TC-A09 | Edit Topic deadline | Deadline updated | Enforced on next idea submission attempt | Pass | |
| TC-A10 | View system statistics | Charts rendered | Statistics displayed correctly | Pass | |
| TC-A11 | Configure system settings | Setting saved | Value updated via API response | Pass | |
| TC-A12 | Admin blocked from /topics | Redirect to /admin | Correctly redirected | Pass | |

---

5.2.2 Test Function - QA Manager

| TC-ID | Test Case | Expected Result | Actual Result | Status | Notes |
|---|---|---|---|---|---|
| TC-Q01 | Login as QA Manager | Redirect to dashboard | Logged in successfully | Pass | |
| TC-Q02 | Add category | Category added | Visible in idea form dropdown | Pass | |
| TC-Q03 | Delete unused category | Deleted | Category removed from list | Pass | |
| TC-Q04 | Delete category in use | Error returned | "Cannot delete category with existing ideas" displayed | Pass | |
| TC-Q05 | Export CSV before deadline | Error returned | "Topic is still open for comments" | Pass | |
| TC-Q06 | Export CSV after deadline | CSV downloaded | File contains all ideas | Pass | |
| TC-Q07 | CSV content validation | Correct fields | All required columns present | Pass | |
| TC-Q08 | ZIP before deadline | Error returned | Correct error message | Pass | |
| TC-Q09 | ZIP after deadline | ZIP downloaded | All uploaded files included | Pass | |
| TC-Q10 | Most popular ideas | Sorted by votes | Correct sorting order | Pass | |
| TC-Q11 | Statistics per department | Chart rendered | Data accurate vs database | Pass | |
| TC-Q12 | QA Manager cannot create topics | Access denied | 403 Forbidden returned | Pass | |

---

5.2.3 Test Function - Staff

| TC-ID | Test Case | Expected Result | Actual Result | Status | Notes |
|---|---|---|---|---|---|
| TC-S01 | Register new account | Account created | Registration successful | Pass | |
| TC-S02 | Register without terms | Blocked | Validation error; cannot submit | Pass | |
| TC-S03 | Login as Staff | Redirect to /dashboard | Dashboard displayed | Pass | |
| TC-S04 | Login with wrong password | Error message | "Invalid credentials" shown | Pass | |
| TC-S05 | Submit idea within deadline | Idea created | Idea appears in topic list | Pass | |
| TC-S06 | Submit idea after deadline | Deadline error | "Idea submission deadline has passed" | Pass | |
| TC-S07 | Submit with file attachment | Idea + file saved | File downloadable from detail page | Pass | |
| TC-S08 | Upload invalid file type | Upload rejected | Error: file type not permitted | Pass | |
| TC-S09 | Submit anonymous idea | Author shows "Anonymous" | Other users see "Anonymous" | Pass | |
| TC-S10 | Admin can identify anonymous author | AuthorId stored | Admin can view actual author | Pass | |
| TC-S11 | Comment within deadline | Comment posted | Appears on idea page | Pass | |
| TC-S12 | Comment after deadline | Submission blocked | Button disabled / error shown | Pass | |
| TC-S13 | Anonymous comment | Shows "Anonymous" | Correctly anonymised | Pass | |
| TC-S14 | Thumbs-up reaction | Count increments | Reaction count updated | Pass | |
| TC-S15 | Duplicate vote prevention | No duplicate | Vote toggled, no duplicate entry | Pass | |
| TC-S16 | Paginated idea list | 5 per page | Pagination works correctly | Pass | |
| TC-S17 | Staff blocked from /admin | Redirect to dashboard | Correctly redirected | Pass | |

---

6. Evaluation

6.1 Achievement Against Requirements

The Student Idea Contribution System successfully meets all core requirements specified in the COMP1640 module brief. The following table summarises the achievement level:

Column 1 Column 2 Column 3 Column 4 Column 5
Requirement Area Requirements Met Partially Met Not Met
Authentication & Roles 4 roles, JWT, BCrypt 4 0 0
Idea Management Submit, anonymous, file, category 8 0 0
Comments & Reactions Comment, anonymous, thumbs up/down, unique vote 5 0 0
Email Notifications QA Coordinator, comment author 2 0 0
Data Export CSV, ZIP, deadline check 3 0 0
Statistics Per department, overview, charts 4 0 0
Admin Functions User, dept, topic, settings 4 0 0
UI/UX Responsive, custom components 2 0 0
Security JWT, BCrypt, SQL injection, XSS 6 0 0
Total 38 38 0 0

Email notification: Currently operational in log-only mode (development). Production SMTP credentials are required for live email delivery — this is a configuration matter, not an implementation gap.

6.2 Technical Achievements

- Security: All passwords are hashed using BCrypt. SQL injection is prevented through Entity Framework Core’s parameterised queries. JWT tokens expire after 24 hours. File uploads are validated for type and size.
- Scalability: Pagination is implemented on all listing endpoints to handle large volumes of ideas.
- Data Integrity: Unique constraints on email addresses, department codes, and vote reactions are enforced at both the application and database levels.
- Privacy: Anonymous posting stores the author’s ID server-side for administrative traceability while hiding identity from other users.
- Separation of Concerns: Clean separation between frontend (React/TypeScript) and backend (REST API), allowing independent deployment and scaling.

  6.3 Challenges Encountered

Column 1 Column 2
Challenge Resolution
Anonymous author handling needed both privacy and traceability IsAnonymous flag controls display; AuthorId always stored for admin access
File uploads needed validation and secure storage DocumentController validates allowed MIME types and file extensions; files stored in /wwwroot/uploads/
Dual deadline logic (idea submission vs comment) Two separate datetime fields on Topic model; enforced in respective controllers
Unique vote constraint Composite index on (UserId, IdeaId) in Reaction table; API returns current vote state for UI toggle
CORS configuration for local development CORS policy configured in Program.cs to allow frontend development server origin

6.4 Limitations and Future Work

Column 1 Column 2 Column 3
Area Current Limitation Proposed Enhancement
Email Service Log-only in development Configure production SMTP (e.g., SendGrid, Office 365)
Testing Manual black-box tests only Add xUnit unit tests and Playwright/Cypress E2E tests
Mobile UI Basic responsive layout Dedicated mobile-optimised layout with touch interactions
Search & Filter Basic listing Full-text search, filter by category/department/date
Notifications Email only In-app real-time notifications (SignalR WebSocket)
Analytics Static charts Interactive filterable analytics dashboard
CI/CD Manual deployment GitHub Actions pipeline for automated build, test, and deploy

6.5 Lessons Learned

The project provided valuable experience in:

- Applying Agile Scrum in a real development setting — sprint planning, reviews, and daily communication significantly improved productivity.
- Designing a clean RESTful API with role-based authorization from the outset, avoiding significant refactoring later.
- Enforcing data integrity rules at both the ORM layer and database level.
- Balancing feature scope against development time, learning to prioritise core requirements over enhancements.

---

7. Agile Method

7.1 Product Backlogs

The Product Backlog is an ordered list of all features, user stories, and tasks required to deliver the Student Idea Contribution System. Maintained by the Product Owner and updated throughout the project based on stakeholder feedback.

| ID | User Story | Priority | Story Points | Status |
|---|---|---|---|---|
| US-001 | As a Staff member, I want to register an account so that I can participate in the system | High | 3 | Done |
| US-002 | As any user, I want to log in with email and password so that I can access my personalised dashboard | High | 3 | Done |
| US-003 | As a Staff member, I want to agree to Terms & Conditions before participating | High | 2 | Done |
| US-004 | As a Staff member, I want to submit an idea to an active Topic | High | 5 | Done |
| US-005 | As a Staff member, I want to post ideas anonymously | High | 3 | Done |
| US-006 | As a Staff member, I want to attach files (documents, images) to my idea | Medium | 5 | Done |
| US-007 | As a Staff member, I want to categorise my idea using predefined categories | Medium | 3 | Done |
| US-008 | As any authenticated user, I want to comment on ideas | High | 3 | Done |
| US-009 | As any user, I want to comment anonymously | Medium | 2 | Done |
| US-010 | As any user, I want to give a thumbs-up or thumbs-down reaction to an idea | Medium | 3 | Done |
| US-011 | As a QA Coordinator, I want to receive an email notification when a new idea is submitted | High | 5 | Done |
| US-012 | As an idea author, I want to receive an email notification when someone comments on my idea | Medium | 3 | Done |
| US-013 | As a QA Manager, I want to view the most popular ideas sorted by votes | Medium | 3 | Done |
| US-014 | As a QA Manager, I want to download ideas as a CSV file after the final closure date | High | 5 | Done |
| US-015 | As a QA Manager, I want to download all uploaded documents as a ZIP archive | High | 5 | Done |
| US-016 | As a QA Manager, I want to add and manage idea categories | Medium | 3 | Done |
| US-017 | As an Administrator, I want to manage user accounts (create, update, deactivate) | High | 5 | Done |
| US-018 | As an Administrator, I want to manage departments | High | 3 | Done |
| US-019 | As an Administrator, I want to create and manage Topics with dual deadlines | High | 5 | Done |
| US-020 | As an Administrator, I want to view system-wide statistics | Medium | 5 | Done |
| US-021 | As an Administrator, I want to configure system settings (academic year, closure dates) | Medium | 3 | Done |
| US-022 | As any user, I want the interface to be responsive on mobile and desktop | Low | 8 | Done |
| US-023 | As a QA Manager, I want to see statistics per department | Medium | 5 | Done |
| US-024 | As a Staff member, I want to view a list of all ideas in a Topic with pagination | Medium | 3 | Done |

**Total Story Points: 142**

---

7.2 Sprint Backlogs

Sprint 1 - Foundation (Weeks 1-2)

**Sprint Goal:** Set up project infrastructure, implement authentication, and establish the database schema.
**Committed Story Points:** 34

| Task ID | Task | Assignee | Estimate (hrs) | Status |
|---|---|---|---|---|
| T-001 | Set up ASP.NET Core project structure | Backend Dev | 4 | Done |
| T-002 | Configure Entity Framework Core with MySQL | Backend Dev | 4 | Done |
| T-003 | Design and create database schema (Users, Departments, Topics, Ideas, Comments, Reactions, Documents, Categories) | Backend Dev | 8 | Done |
| T-004 | Implement JWT authentication (register, login endpoints) | Backend Dev | 6 | Done |
| T-005 | Implement BCrypt password hashing | Backend Dev | 2 | Done |
| T-006 | Implement role-based authorization (Administrator, QAManager, QACoordinator, Staff) | Backend Dev | 4 | Done |
| T-007 | Set up React + TypeScript + Vite frontend project | Frontend Dev | 3 | Done |
| T-008 | Implement Login and Register pages | Frontend Dev | 6 | Done |
| T-009 | Implement JWT token storage and authService | Frontend Dev | 4 | Done |
| T-010 | Configure React Router with protected routes | Frontend Dev | 3 | Done |
| T-011 | Seed initial database records (admin user, departments) | Backend Dev | 2 | Done |

Sprint 2 - Core Features (Weeks 3-4)

**Sprint Goal:** Implement idea submission, comments, reactions, and file attachment functionality.
**Committed Story Points:** 42

| Task ID | Task | Assignee | Estimate (hrs) | Status |
|---|---|---|---|---|
| T-012 | Implement IdeaController (GET, POST, PUT, DELETE) | Backend Dev | 8 | Done |
| T-013 | Implement anonymous author handling | Backend Dev | 3 | Done |
| T-014 | Implement file upload/download (DocumentController) | Backend Dev | 6 | Done |
| T-015 | Implement CommentController with anonymous option | Backend Dev | 5 | Done |
| T-016 | Implement Reaction model (unique constraint per user per idea) | Backend Dev | 4 | Done |
| T-017 | Implement TopicController with dual deadline logic | Backend Dev | 5 | Done |
| T-018 | Implement CategoryController (CRUD, QA Manager only) | Backend Dev | 4 | Done |
| T-019 | Build Dashboard component (list ideas, topics) | Frontend Dev | 8 | Done |
| T-020 | Build IdeaForm component (submit idea with file upload) | Frontend Dev | 8 | Done |
| T-021 | Build IdeaDetail page (view idea, comments, reactions) | Frontend Dev | 8 | Done |
| T-022 | Build Topics page | Frontend Dev | 5 | Done |

Sprint 3 - Admin & Analytics (Weeks 5-6)

**Sprint Goal:** Deliver admin dashboard, statistics, data exports, and email notifications.
**Committed Story Points:** 38

| Task ID | Task | Assignee | Estimate (hrs) | Status |
|---|---|---|---|---|
| T-023 | Implement StatisticsController (overview, departments, categories, topics) | Backend Dev | 8 | Done |
| T-024 | Implement AdminController (CSV export, ZIP export) | Backend Dev | 8 | Done |
| T-025 | Enforce export only after CommentDeadline | Backend Dev | 3 | Done |
| T-026 | Implement EmailService (QA Coordinator notification, comment notification) | Backend Dev | 6 | Done |
| T-027 | Implement SystemSettingsController | Backend Dev | 4 | Done |
| T-028 | Build AdminDashboard React component (user management, statistics charts) | Frontend Dev | 12 | Done |
| T-029 | Implement pagination on all idea listing endpoints | Backend Dev | 4 | Done |

Sprint 4 - Testing, Polish & Documentation (Weeks 7-8)

**Sprint Goal:** Complete frontend styling, perform full testing, and finalise documentation.
**Committed Story Points:** 28

| Task ID | Task | Assignee | Estimate (hrs) | Status |
|---|---|---|---|---|
| T-030 | Implement responsive CSS for all pages | Frontend Dev | 10 | Done |
| T-031 | NavBar component with role-based navigation | Frontend Dev | 5 | Done |
| T-032 | Write test plans (Administrator, QA Manager, Staff) | QA | 6 | Done |
| T-033 | Execute test cases and log results | QA | 8 | Done |
| T-034 | Fix identified bugs | All | 8 | Done |
| T-035 | Write project report | All | 6 | Done |

---

7.3 Schedule

The project was delivered across 4 two-week sprints over 8 weeks total.

| Sprint | Weeks | Duration | Sprint Goal | Key Deliverables | Story Points |
|---|---|---|---|---|---|
| Sprint 1 | Week 1-2 | 2 weeks | Foundation | Auth, DB schema, JWT, basic UI | 34 |
| Sprint 2 | Week 3-4 | 2 weeks | Core Features | Ideas, Comments, Reactions, File Upload | 42 |
| Sprint 3 | Week 5-6 | 2 weeks | Admin & Analytics | Dashboard, Export CSV/ZIP, Statistics, Email | 38 |
| Sprint 4 | Week 7-8 | 2 weeks | Polish & Testing | Responsive UI, Full test suite, Documentation | 28 |
| **Total** | **8 weeks** | | | | **142** |

**Milestones:**

| Milestone | Target Date | Status |
|---|---|---|
| Project kickoff & environment setup | End of Week 1 | Completed |
| Authentication & database schema ready | End of Week 2 | Completed |
| Core idea submission & comments working | End of Week 4 | Completed |
| Admin dashboard & exports operational | End of Week 6 | Completed |
| Full system tested and documented | End of Week 8 | Completed |

---

7.4 Progress (Trello Board)

The team used a Trello Kanban board to track task progress throughout the project. The board was structured with the following columns: Backlog, To Do, In Progress, and Done.

**Sprint Progress Summary:**

| Sprint | Total Tasks | Completed | Remaining at End | Completion Rate |
|---|---|---|---|---|
| Sprint 1 | 11 | 11 | 0 | 100% |
| Sprint 2 | 11 | 11 | 0 | 100% |
| Sprint 3 | 7 | 7 | 0 | 100% |
| Sprint 4 | 6 | 6 | 0 | 100% |
| **Total** | **35** | **35** | **0** | **100%** |

**Trello Card Labels:**

| Label | Colour | Meaning |
|---|---|---|
| Backend | Blue | Backend API / database task |
| Frontend | Green | React UI / component task |
| QA | Yellow | Testing / quality assurance task |
| Bug | Red | Bug fix required |
| Documentation | Purple | Documentation / report task |
| Blocked | Black | Task blocked; needs Scrum Master attention |

---

7.5 Daily Meetings

Daily Scrum (stand-up) meetings were held every working day, capped at 15 minutes. Each team member answered three standard questions to maintain transparency and detect blockers early.

**Stand-up Format:**

| Question | Purpose |
|---|---|
| What did I do yesterday? | Share completed progress with the team |
| What will I do today? | Communicate planned work for the day |
| Are there any impediments? | Surface blockers for Scrum Master to resolve |

**Meeting Log (Key Sessions):**

| Date | Yesterday's Progress | Today's Plan | Impediments |
|---|---|---|---|
| Week 1, Day 1 | Project kickoff | Set up repositories, configure EF Core | None |
| Week 1, Day 3 | DB schema drafted | Implement JWT auth endpoints | MySQL version compatibility issue |
| Week 2, Day 1 | Auth endpoints working | Build Login/Register UI | CORS config needed for frontend |
| Week 3, Day 2 | Dashboard component | Implement IdeaController | Clarify anonymous author logic |
| Week 4, Day 3 | Idea submission form | Implement file upload validation | File size limit decision needed |
| Week 5, Day 1 | File upload working | Admin dashboard component | None |
| Week 6, Day 2 | Statistics charts | CSV/ZIP export logic | CommentDeadline enforcement rule |
| Week 7, Day 1 | Export features done | Write test plans, fix styling | None |
| Week 8, Day 2 | Testing in progress | Bug fixes, documentation | Minor UI inconsistencies |
| Week 8, Day 5 | All tests passed | Final report & submission | None |

**Impediment Resolution Log:**

| Impediment | Sprint | Resolution |
|---|---|---|
| MySQL version compatibility with EF Core migrations | Sprint 1 | Updated Pomelo.EntityFrameworkCore.MySql package version |
| CORS blocking frontend API calls in development | Sprint 1 | Configured CORS policy in Program.cs for localhost:5173 |
| Anonymous author - privacy vs traceability conflict | Sprint 2 | Store AuthorId always; only hide display name for non-admin |
| File upload MIME type validation inconsistency | Sprint 2 | Standardised allowed types list in DocumentController |
| ZIP export folder structure requirement | Sprint 3 | Added per-topic subfolder organisation in ZIP generation |

---

7.6 Sprint Review & Retrospective Meetings

Sprint Reviews were held at the end of each sprint to demonstrate working software to stakeholders and collect feedback. Sprint Retrospectives immediately followed to reflect on team process.

**Sprint Review Summary:**

| Sprint | Review Date | Demonstrated Features | Stakeholder Feedback | Backlog Updates |
|---|---|---|---|---|
| Sprint 1 | End of Week 2 | Working login/register, JWT auth, database migrations | Add terms & conditions checkbox to registration | Added US-003 to Sprint 2 |
| Sprint 2 | End of Week 4 | Idea submission, anonymous posting, comments, reactions | Anonymous comment feature confirmed; add pagination | Added pagination task T-029 |
| Sprint 3 | End of Week 6 | Admin dashboard, CSV export, statistics charts, email logs | Improve ZIP to include folder structure per topic | Updated T-024 scope |
| Sprint 4 | End of Week 8 | Full frontend UI, responsive design, full test suite | Minor UI fixes; update documentation | Final polish tasks |

**Sprint Retrospective Summary:**

| Sprint | What Went Well | What Could Improve | Action Items |
|---|---|---|---|
| Sprint 1 | Clear task division; DB schema completed ahead of schedule | JWT configuration took longer than estimated | Allocate more time for security setup in future |
| Sprint 2 | Anonymous feature implemented cleanly | File upload scope unclear initially; caused delay | Clarify acceptance criteria before sprint starts |
| Sprint 3 | Admin dashboard exceeded expectations | Email service not production-ready (log-only) | Document SMTP config requirement for deployment |
| Sprint 4 | All user stories completed; zero defects remaining | Manual testing time-consuming | Plan for automated tests (xUnit/Playwright) in future |

---

7.7 Burndown Charts

Total story points: **142**.

**Burndown Data:**

| Checkpoint | Ideal Remaining | Actual Remaining | Variance |
|---|---|---|---|
| Start (Day 0) | 142 | 142 | 0 |
| Sprint 1 End (Day 14) | 107 | 110 | +3 (slightly behind) |
| Sprint 2 End (Day 28) | 61 | 68 | +7 (behind) |
| Sprint 3 End (Day 42) | 23 | 30 | +7 (behind) |
| Sprint 4 End (Day 56) | 0 | 0 | 0 (fully delivered) |

**Burndown Chart:**

`
Story Points
150 |
140 |* .                   * = Actual   . = Ideal
130 | * .
120 |  * .
110 |    *.  <- Sprint 1 End (Actual: 110, Ideal: 107)
100 |      ..
 90 |       . *
 80 |        .  *
 70 |         ..  *  <- Sprint 2 End (Actual: 68, Ideal: 61)
 60 |           ..
 50 |             ..
 40 |               . *
 30 |                .  *  <- Sprint 3 End (Actual: 30, Ideal: 23)
 20 |                 ..
 10 |                   ..
  0 |______________________.*_______ Sprints
     S0    S1    S2    S3    S4
`

**Deviation Analysis:**

| Sprint | Cause of Deviation | Recovery Action |
|---|---|---|
| Sprint 1 | JWT configuration complexity underestimated | Overtime in Week 2 evenings |
| Sprint 2 | File upload and anonymous handling more complex than estimated | Descoped minor enhancements to Sprint 4 |
| Sprint 3 | ZIP folder structure requirement added mid-sprint | Team velocity increased in Sprint 4 |
| Sprint 4 | Full catch-up achieved | All 142 story points completed on schedule |

The team successfully delivered all committed user stories by the end of Sprint 4, recovering from the initial velocity deficit through improved sprint planning and clearer acceptance criteria.

---

8. References

1. Microsoft Corporation. (2024). ASP.NET Core documentation. Retrieved from https://learn.microsoft.com/en-us/aspnet/core/
1. Microsoft Corporation. (2024). Entity Framework Core documentation. Retrieved from https://learn.microsoft.com/en-us/ef/core/
1. Meta Platforms, Inc. (2024). React documentation. Retrieved from https://react.dev/
1. OpenJS Foundation. (2024). TypeScript documentation. Retrieved from https://www.typescriptlang.org/docs/
1. Scrum Alliance. (2020). The Scrum Guide (K. Schwaber & J. Sutherland). Retrieved from https://www.scrum.org/resources/scrum-guide
1. OWASP Foundation. (2024). OWASP Top Ten. Retrieved from https://owasp.org/www-project-top-ten/
1. Vitejs. (2024). Vite la documentazione. Retrieved from https://vitejs.dev/
1. Auth0. (2024). JSON Web Tokens (JWT) Introduction. Retrieved from https://jwt.io/introduction/
1. BCrypt.Net contributors. (2024). BCrypt.Net-Next documentation. Retrieved from https://github.com/BcryptNet/bcrypt.net
1. MySQL AB. (2024). MySQL 8.0 Reference Manual. Retrieved from https://dev.mysql.com/doc/refman/8.0/en/

---

Report generated for COMP1640 – Enterprise Web Development assessment.
Academic Year 2025–2026
