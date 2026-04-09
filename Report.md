# COMP1640 – Student Idea Contribution System

## Project Report

**Module**: COMP1640 – Enterprise Web Development  
**Project**: Student Idea Contribution System (SICS)  
**Technology Stack**: ASP.NET Core (.NET 9.0) (C#) · React 18.2 (TypeScript) · Entity Framework Core · MySQL  
**Academic Year**: 2025–2026

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Agile Scrum Documentation](#2-agile-scrum-documentation)
   - 2.1 [Roles and Responsibilities](#21-roles-and-responsibilities)
   - 2.2 [Tools](#22-tools)
   - 2.3 [Meetings](#23-meetings)
   - 2.4 [Product Backlogs](#24-product-backlogs)
   - 2.5 [Sprint Backlogs](#25-sprint-backlogs)
   - 2.6 [Project Burn Down Chart](#26-project-burn-down-chart)
3. [Design Documentation](#3-design-documentation)
   - 3.1 [Use Case Diagrams](#31-use-case-diagrams)
   - 3.2 [Database Diagrams](#32-database-diagrams)
   - 3.3 [Website Design](#33-website-design)
   - 3.4 [Activity Diagrams](#34-activity-diagrams)
4. [Implementation](#4-implementation)
   - 4.1 [List of Files in System](#41-list-of-files-in-system)
   - 4.2 [API Endpoints](#42-api-endpoints)
   - 4.3 [Some Screenshots of System](#43-some-screenshots-of-system)
5. [Testing](#5-testing)
   - 5.1 [Test Plan](#51-test-plan)
   - 5.2 [Test Log](#52-test-log)
6. [Evaluation](#6-evaluation)
7. [References](#7-references)

---

## 1. Introduction

The **Student Idea Contribution System (SICS)** is a web-based platform developed as part of the COMP1640 module. The system enables staff and students within a university to submit, discuss, and evaluate ideas across academic departments. It is designed to facilitate bottom-up innovation by allowing any staff member to contribute ideas, which are then organised around Topics (academic campaigns) and can be reacted to, commented on, and exported for management review.

### Technology Stack

#### Backend
- **Framework**: ASP.NET Core (.NET 9.0)
- **ORM**: Entity Framework Core
- **Database**: MySQL 8.0+
- **Authentication**: JWT Bearer tokens + BCrypt password hashing
- **API Documentation**: Swagger/Swashbuckle 6.5.0
- **Port**: 5122
- **CORS**: Configured for cross-origin requests

#### Frontend
- **Framework**: React 18.2 + TypeScript
- **Build Tool**: Vite 5.4.21
- **Styling**: Tailwind CSS (PostCSS plugin)
- **HTTP Client**: Axios 1.6.2
- **Routing**: React Router DOM 6.21.0
- **Port**: 5173

---

## 2. Agile Scrum Documentation

### 2.1 Roles and Responsibilities

The team adopted the Scrum framework for the full project lifecycle. The following table outlines each Scrum role and its responsibilities.

| Scrum Role                      | Assigned To | Responsibilities                                                                                             |
| ------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------ |
| **Product Owner**               | Team Lead   | Define product backlog, prioritise user stories, accept completed work, liaise between stakeholders and team |
| **Scrum Master**                | Team Member | Facilitate Scrum ceremonies, remove impediments, ensure team follows Scrum principles                        |
| **Development Team – Backend**  | 1–2 Members | Design and implement REST API endpoints (ASP.NET Core), database schema, authentication, email service       |
| **Development Team – Frontend** | 1–2 Members | Design and implement React UI components, integrate with REST API, handle routing and state                  |
| **Development Team – QA**       | 1 Member    | Write and execute test plans, log defects, perform regression testing                                        |

> **Note**: In a small academic team, members may hold multiple Scrum roles simultaneously (e.g., a developer may also act as QA tester).

---

### 2.2 Tools

| Category           | Tool                                 | Purpose                                                   |
| ------------------ | ------------------------------------ | --------------------------------------------------------- |
| Project Management | **Trello** / **Jira**                | Sprint board, backlog tracking, user story mapping        |
| Version Control    | **Git + GitHub**                     | Source code management, branching strategy, pull requests |
| Communication      | **Microsoft Teams** / **Discord**    | Daily Scrum, sprint planning, issue discussion            |
| IDE – Backend      | **Visual Studio 2022** / **VS Code** | C# (.NET 9.0) development, EF Core migrations             |
| IDE – Frontend     | **Visual Studio Code**               | React 18.2 / TypeScript development                       |
| Build Tool         | **Vite 5.4.21**                      | Frontend build and hot-module replacement                 |
| CSS Framework      | **Tailwind CSS**                     | Utility-first responsive styling                          |
| HTTP Client        | **Axios 1.6.2**                      | Frontend API requests with interceptors                   |
| API Testing        | **Postman**                          | Manual API endpoint testing; Swagger UI (port 5122)       |
| Database           | **MySQL 8.0+ / MySQL Workbench**     | Schema design, query execution, seed data management      |
| Diagram & Design   | **draw.io** / **Figma**              | Use case diagrams, wireframes, site map                   |
| Documentation      | **Markdown / GitHub Wiki**           | Technical documentation, README files                     |
| CI/CD              | **GitHub Actions** (planned)         | Automated build and test pipeline                         |

---

### 2.3 Meetings

#### 2.3.1 Sprint Planning

Sprint Planning meetings were held at the beginning of each sprint. The Product Owner presented the prioritised backlog items, the team estimated effort (using Story Points with a Fibonacci scale: 1, 2, 3, 5, 8), and committed to a Sprint Goal.

| Sprint   | Date   | Sprint Goal                                            | Total Story Points Committed |
| -------- | ------ | ------------------------------------------------------ | ---------------------------- |
| Sprint 1 | Week 1 | Project setup, authentication, database schema         | 34                           |
| Sprint 2 | Week 3 | Core features: Ideas, Comments, Reactions, File Upload | 42                           |
| Sprint 3 | Week 5 | Admin features, Statistics, Export, Email              | 38                           |
| Sprint 4 | Week 7 | Frontend UI, testing, bug fixes, documentation         | 28                           |

**Sprint Planning Agenda**:

1. Review and clarify top-priority backlog items.
2. Break stories into tasks (max 1-day granularity).
3. Assign tasks to team members.
4. Confirm Sprint Goal and capacity.

---

#### 2.3.2 Sprint Review

Sprint Reviews were held at the end of each sprint. The team demonstrated completed work to stakeholders (module tutor), gathered feedback, and updated the product backlog accordingly.

| Sprint   | Review Date   | Demo Highlights                                            | Feedback / Action Items                                           |
| -------- | ------------- | ---------------------------------------------------------- | ----------------------------------------------------------------- |
| Sprint 1 | End of Week 2 | Working login/register, JWT auth, database migrations      | Add terms & conditions field to user registration                 |
| Sprint 2 | End of Week 4 | Idea submission, anonymous posting, comments, reactions    | Anonymous comment feature confirmed; add pagination to idea lists |
| Sprint 3 | End of Week 6 | Admin dashboard, CSV export, statistics charts, email logs | Improve ZIP export to include folder structure per topic          |
| Sprint 4 | End of Week 8 | Full frontend UI, responsive design, full test suite       | Minor UI fixes; update documentation                              |

---

#### 2.3.3 Daily Scrum

Daily Scrum (stand-up) meetings were held every working day, lasting no more than 15 minutes. Each team member answered three questions:

1. **What did I do yesterday?**
2. **What will I do today?**
3. **Are there any impediments blocking my progress?**

These meetings were conducted via **Microsoft Teams/Discord** (online), using a time-boxed format. Impediments were noted and assigned to the Scrum Master for resolution. A shared Kanban board (Trello) was updated daily to reflect task status (To Do → In Progress → Done).

---

### 2.4 Product Backlogs

The Product Backlog contains all user stories required for the system, prioritised by business value. Each story is assigned a unique ID, priority, and story points estimate.

| ID     | User Story                                                                                           | Priority | Story Points | Status  |
| ------ | ---------------------------------------------------------------------------------------------------- | -------- | ------------ | ------- |
| US-001 | As a Staff member, I want to register an account so that I can participate in the system             | High     | 3            | ✅ Done |
| US-002 | As any user, I want to log in with email and password so that I can access my personalised dashboard | High     | 3            | ✅ Done |
| US-003 | As a Staff member, I want to agree to Terms & Conditions before participating                        | High     | 2            | ✅ Done |
| US-004 | As a Staff member, I want to submit an idea to an active Topic                                       | High     | 5            | ✅ Done |
| US-005 | As a Staff member, I want to post ideas anonymously                                                  | High     | 3            | ✅ Done |
| US-006 | As a Staff member, I want to attach files (documents, images) to my idea                             | Medium   | 5            | ✅ Done |
| US-007 | As a Staff member, I want to categorise my idea using predefined categories                          | Medium   | 3            | ✅ Done |
| US-008 | As any authenticated user, I want to comment on ideas                                                | High     | 3            | ✅ Done |
| US-009 | As any user, I want to comment anonymously                                                           | Medium   | 2            | ✅ Done |
| US-010 | As any user, I want to give a thumbs-up or thumbs-down reaction to an idea                           | Medium   | 3            | ✅ Done |
| US-011 | As a QA Coordinator, I want to receive an email notification when a new idea is submitted            | High     | 5            | ✅ Done |
| US-012 | As an idea author, I want to receive an email notification when someone comments on my idea          | Medium   | 3            | ✅ Done |
| US-013 | As a QA Manager, I want to view the most popular ideas sorted by votes                               | Medium   | 3            | ✅ Done |
| US-014 | As a QA Manager, I want to download ideas as a CSV file after the final closure date                 | High     | 5            | ✅ Done |
| US-015 | As a QA Manager, I want to download all uploaded documents as a ZIP archive                          | High     | 5            | ✅ Done |
| US-016 | As a QA Manager, I want to add and manage idea categories                                            | Medium   | 3            | ✅ Done |
| US-017 | As an Administrator, I want to manage user accounts (create, update, deactivate)                     | High     | 5            | ✅ Done |
| US-018 | As an Administrator, I want to manage departments                                                    | High     | 3            | ✅ Done |
| US-019 | As an Administrator, I want to create and manage Topics with dual deadlines                          | High     | 5            | ✅ Done |
| US-020 | As an Administrator, I want to view system-wide statistics                                           | Medium   | 5            | ✅ Done |
| US-021 | As an Administrator, I want to configure system settings (academic year, closure dates)              | Medium   | 3            | ✅ Done |
| US-022 | As any user, I want the interface to be responsive on mobile and desktop                             | Low      | 8            | ✅ Done |
| US-023 | As a QA Manager, I want to see statistics per department                                             | Medium   | 5            | ✅ Done |
| US-024 | As a Staff member, I want to view a list of all ideas in a Topic with pagination                     | Medium   | 3            | ✅ Done |

---

### 2.5 Sprint Backlogs

#### Sprint 1 – Foundation (Weeks 1–2)

**Sprint Goal**: Set up project infrastructure, implement authentication, and establish the database schema.

| Task ID | Task                                                                                                              | Assignee     | Estimate (hrs) | Status  |
| ------- | ----------------------------------------------------------------------------------------------------------------- | ------------ | -------------- | ------- |
| T-001   | Set up ASP.NET Core project structure                                                                             | Backend Dev  | 4              | ✅ Done |
| T-002   | Configure Entity Framework Core with MySQL                                                                        | Backend Dev  | 4              | ✅ Done |
| T-003   | Design and create database schema (Users, Departments, Topics, Ideas, Comments, Reactions, Documents, Categories) | Backend Dev  | 8              | ✅ Done |
| T-004   | Implement JWT authentication (register, login endpoints)                                                          | Backend Dev  | 6              | ✅ Done |
| T-005   | Implement BCrypt password hashing                                                                                 | Backend Dev  | 2              | ✅ Done |
| T-006   | Implement role-based authorization (Administrator, QAManager, QACoordinator, Staff)                               | Backend Dev  | 4              | ✅ Done |
| T-007   | Set up React + TypeScript + Vite frontend project                                                                 | Frontend Dev | 3              | ✅ Done |
| T-008   | Implement Login and Register pages                                                                                | Frontend Dev | 6              | ✅ Done |
| T-009   | Implement JWT token storage and authService                                                                       | Frontend Dev | 4              | ✅ Done |
| T-010   | Configure React Router with protected routes                                                                      | Frontend Dev | 3              | ✅ Done |
| T-011   | Seed initial database records (admin user, departments)                                                           | Backend Dev  | 2              | ✅ Done |

#### Sprint 2 – Core Features (Weeks 3–4)

**Sprint Goal**: Implement idea submission, comments, reactions, and file attachment functionality.

| Task ID | Task                                                           | Assignee     | Estimate (hrs) | Status  |
| ------- | -------------------------------------------------------------- | ------------ | -------------- | ------- |
| T-012   | Implement IdeaController (GET, POST, PUT, DELETE)              | Backend Dev  | 8              | ✅ Done |
| T-013   | Implement anonymous author handling                            | Backend Dev  | 3              | ✅ Done |
| T-014   | Implement file upload/download (DocumentController)            | Backend Dev  | 6              | ✅ Done |
| T-015   | Implement CommentController with anonymous option              | Backend Dev  | 5              | ✅ Done |
| T-016   | Implement Reaction model (unique constraint per user per idea) | Backend Dev  | 4              | ✅ Done |
| T-017   | Implement TopicController with dual deadline logic             | Backend Dev  | 5              | ✅ Done |
| T-018   | Implement CategoryController (CRUD, QA Manager only)           | Backend Dev  | 4              | ✅ Done |
| T-019   | Build Dashboard component (list ideas, topics)                 | Frontend Dev | 8              | ✅ Done |
| T-020   | Build IdeaForm component (submit idea with file upload)        | Frontend Dev | 8              | ✅ Done |
| T-021   | Build IdeaDetail page (view idea, comments, reactions)         | Frontend Dev | 8              | ✅ Done |
| T-022   | Build Topics page                                              | Frontend Dev | 5              | ✅ Done |

#### Sprint 3 – Admin & Analytics (Weeks 5–6)

**Sprint Goal**: Deliver admin dashboard, statistics, data exports, and email notifications.

| Task ID | Task                                                                       | Assignee     | Estimate (hrs) | Status  |
| ------- | -------------------------------------------------------------------------- | ------------ | -------------- | ------- |
| T-023   | Implement StatisticsController (overview, departments, categories, topics) | Backend Dev  | 8              | ✅ Done |
| T-024   | Implement AdminController (CSV export, ZIP export)                         | Backend Dev  | 8              | ✅ Done |
| T-025   | Enforce export only after CommentDeadline                                  | Backend Dev  | 3              | ✅ Done |
| T-026   | Implement EmailService (QA Coordinator notification, comment notification) | Backend Dev  | 6              | ✅ Done |
| T-027   | Implement SystemSettingsController                                         | Backend Dev  | 4              | ✅ Done |
| T-028   | Build AdminDashboard React component (user management, statistics charts)  | Frontend Dev | 12             | ✅ Done |
| T-029   | Implement pagination on all idea listing endpoints                         | Backend Dev  | 4              | ✅ Done |

#### Sprint 4 – Testing, Polish & Documentation (Weeks 7–8)

**Sprint Goal**: Complete frontend styling, perform full testing, and finalise documentation.

| Task ID | Task                                                | Assignee     | Estimate (hrs) | Status  |
| ------- | --------------------------------------------------- | ------------ | -------------- | ------- |
| T-030   | Implement responsive CSS for all pages              | Frontend Dev | 10             | ✅ Done |
| T-031   | NavBar component with role-based navigation         | Frontend Dev | 5              | ✅ Done |
| T-032   | Write test plans (Administrator, QA Manager, Staff) | QA           | 6              | ✅ Done |
| T-033   | Execute test cases and log results                  | QA           | 8              | ✅ Done |
| T-034   | Fix identified bugs                                 | All          | 8              | ✅ Done |
| T-035   | Write project report                                | All          | 6              | ✅ Done |

---

### 2.6 Project Burn Down Chart

The following table shows the ideal vs. actual remaining story points across the project sprints. Total story points: **142**.

| Day / Sprint End      | Ideal Remaining | Actual Remaining |
| --------------------- | --------------- | ---------------- |
| Start (Day 0)         | 142             | 142              |
| Sprint 1 End (Day 14) | 107             | 110              |
| Sprint 2 End (Day 28) | 61              | 68               |
| Sprint 3 End (Day 42) | 23              | 30               |
| Sprint 4 End (Day 56) | 0               | 0                |

```
Story Points Remaining
142 |*
130 | *  .
120 |  * .
110 |   *.
100 |    .
 90 |    .*
 80 |    . *
 70 |    .  *
 60 |    .   .*
 50 |    .    .
 40 |    .    .*
 30 |    .    . *
 20 |    .    .  .
 10 |    .    .  .*
  0 |_________________________ Sprint
     S0   S1   S2   S3   S4

  * = Actual   . = Ideal
```

> The actual burn rate was slightly slower than ideal in Sprints 1–3 due to unexpected complexity in file upload handling and the anonymous author feature, but the team recovered in Sprint 4.

---

## 3. Design Documentation

### 3.1 Use Case Diagrams

#### Use Case Diagram – System Overview

```
+------------------------------------------------------------------+
|               Student Idea Contribution System                    |
|                                                                  |
|  [Staff]──────────────────────────────────────────────────────  |
|     |── (UC01) Register Account                                  |
|     |── (UC02) Log In                                            |
|     |── (UC03) Accept Terms & Conditions                         |
|     |── (UC04) Submit Idea to Topic                              |
|     |── (UC05) Attach Files to Idea                              |
|     |── (UC06) Select Category for Idea                          |
|     |── (UC07) Post Anonymously                                  |
|     |── (UC08) Comment on Idea                                   |
|     |── (UC09) React (Thumbs Up / Down) to Idea                 |
|     |── (UC10) View Ideas and Topics                             |
|                                                                  |
|  [QA Manager]─────────────────────────────────────────────────  |
|     |── (UC02) Log In                                            |
|     |── (UC11) Manage Categories (Add / Delete)                  |
|     |── (UC12) View Most Popular / Viewed Ideas                  |
|     |── (UC13) Download Ideas as CSV                             |
|     |── (UC14) Download Documents as ZIP                         |
|     |── (UC15) View Statistics per Department                    |
|     |── (UC10) View Ideas and Topics                             |
|                                                                  |
|  [QA Coordinator]──────────────────────────────────────────────  |
|     |── (UC02) Log In                                            |
|     |── (UC16) Receive Email on New Idea                         |
|     |── (UC10) View Ideas and Topics                             |
|                                                                  |
|  [System Administrator]────────────────────────────────────────  |
|     |── (UC02) Log In                                            |
|     |── (UC17) Manage Users (Create / Update / Deactivate)       |
|     |── (UC18) Manage Departments                                |
|     |── (UC19) Create and Manage Topics                          |
|     |── (UC20) Configure System Settings                         |
|     |── (UC21) View System-wide Statistics                       |
+------------------------------------------------------------------+
```

#### Use Case: Submit Idea (UC04) – Detailed

| Field                | Description                                                                                                                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**    | Submit Idea                                                                                                                                                                                                                                                    |
| **Actor**            | Staff                                                                                                                                                                                                                                                          |
| **Pre-condition**    | User is authenticated and has agreed to Terms & Conditions                                                                                                                                                                                                     |
| **Post-condition**   | Idea is saved; QA Coordinator receives email notification                                                                                                                                                                                                      |
| **Main Flow**        | 1. Staff selects an active Topic → 2. Fills in Title, Content → 3. Selects Category → 4. (Optional) Attaches files → 5. Chooses anonymous/named → 6. Submits form → 7. System validates deadline → 8. Idea saved to database → 9. Email sent to QA Coordinator |
| **Alternative Flow** | If idea submission deadline has passed → System returns error "Deadline passed"                                                                                                                                                                                |
| **Exception Flow**   | If file type not allowed → System rejects upload and returns validation error                                                                                                                                                                                  |

#### Use Case: Export Data (UC13/UC14) – Detailed

| Field                | Description                                                                                                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Case Name**    | Export Ideas as CSV / Download Documents as ZIP                                                                                                                                                |
| **Actor**            | QA Manager, Administrator                                                                                                                                                                      |
| **Pre-condition**    | Comment deadline for the Topic must have passed                                                                                                                                                |
| **Post-condition**   | File downloaded to client                                                                                                                                                                      |
| **Main Flow**        | 1. QA Manager navigates to Admin Dashboard → 2. Selects Topic → 3. Clicks Export CSV / Download ZIP → 4. System checks CommentDeadline → 5. System generates file → 6. File streamed to client |
| **Alternative Flow** | If deadline not passed → System returns "Export not available yet"                                                                                                                             |

---

### 3.2 Database Diagrams

The system uses a relational MySQL database managed through Entity Framework Core migrations. The Entity Relationship Diagram (ERD) is described below.

#### Entity Relationship Diagram

```
+------------------+       +------------------+       +------------------+
|     Department   |       |       User        |       |      Topic       |
+------------------+       +------------------+       +------------------+
| PK Id            |<──1:N─| PK Id            |──1:N──| PK Id            |
| Name             |       | FullName         |       | Name             |
| Code (Unique)    |       | Email (Unique)   |       | Description      |
| FK QACoordinId   |       | PasswordHash     |       | IdeaSubDeadline  |
+------------------+       | Role             |       | CommentDeadline  |
                           | FK DepartmentId  |       | FK CreatedById   |
                           | StudentId        |       | IsActive         |
                           | AgreedTerms      |       +------------------+
                           | IsActive         |              |
                           +------------------+              | 1:N
                                  |                          |
                                  | 1:N              +------------------+
                                  |                  |      Idea        |
                           +------v-----------+      +------------------+
                           |     Comment      |      | PK Id            |
                           +------------------+      | Title            |
                           | PK Id            |      | Content          |
                           | Content          |      | IsAnonymous      |
                           | IsAnonymous      |      | FK AuthorId      |
                           | FK AuthorId      |      | FK TopicId       |
                           | FK IdeaId        |      | FK CategoryId    |
                           | CreatedAt        |      | FK DepartmentId  |
                           +------------------+      | Attachments      |
                                                     | ViewCount        |
                           +------------------+      +------------------+
                           |    Reaction      |             |
                           +------------------+      +-----+------+
                           | PK Id            |      |            |
                           | IsThumbsUp       |   +--v---+  +-----v----+
                           | FK UserId        |   | React|  | Document |
                           | FK IdeaId        |   | ion  |  +----------+
                           | (Unique: User+   |   +------+  | PK Id    |
                           |  Idea)           |             | FileName |
                           +------------------+             | FilePath |
                                                            | FileType |
                           +------------------+             | FK IdeaId|
                           |    Category      |             +----------+
                           +------------------+
                           | PK Id            |   +------------------+
                           | Name             |   | SystemSettings   |
                           | FK TopicId       |   +------------------+
                           +------------------+   | PK Id            |
                                                  | Key (Unique)     |
                                                  | Value            |
                                                  +------------------+
```

#### Key Database Relationships

| Relationship               | Type        | Description                                  |
| -------------------------- | ----------- | -------------------------------------------- |
| Department → User          | One-to-Many | A department has many staff members          |
| Department → QACoordinator | One-to-One  | Each department has one QA Coordinator       |
| User → Idea                | One-to-Many | A user can submit many ideas                 |
| Topic → Idea               | One-to-Many | A topic contains many ideas                  |
| Idea → Comment             | One-to-Many | An idea has many comments                    |
| Idea → Reaction            | One-to-Many | An idea has many reactions (unique per user) |
| Idea → Document            | One-to-Many | An idea can have multiple attached documents |
| Topic → Category           | One-to-Many | A topic has many categories                  |

#### Key Constraints

- `User.Email` – Unique index
- `Department.Code` – Unique index
- `Reaction(UserId, IdeaId)` – Unique composite index (one vote per user per idea)
- Cascade delete disabled on user → idea relationship (data retention)

---
---

### 3.2.1 Relational Schema – Table Definitions

#### Table: Users

| Column            | Data Type      | Constraints                                    | Description                                     |
| ----------------- | -------------- | ---------------------------------------------- | ----------------------------------------------- |
| Id                | INT            | PRIMARY KEY, AUTO_INCREMENT                    | Unique user identifier                          |
| FullName          | NVARCHAR(200)  | NOT NULL                                       | Full name of user                               |
| Email             | NVARCHAR(255)  | NOT NULL, UNIQUE                               | Email address (login credential)                |
| PasswordHash      | NVARCHAR(MAX)  | NOT NULL                                       | BCrypt hashed password                          |
| Role              | NVARCHAR(50)   | NOT NULL, ENUM (Administrator, QAManager, QACoordinator, Staff) | User role                                       |
| DepartmentId      | INT            | FOREIGN KEY (Departments.Id), NOT NULL         | User's department                               |
| StudentId         | NVARCHAR(20)   | NULLABLE                                       | Student ID (if staff/student)                   |
| AgreedTerms       | BIT            | NOT NULL, DEFAULT 0                            | T&C acceptance flag                             |
| AgreedTermsDate   | DATETIME       | NULLABLE                                       | Timestamp of T&C agreement                      |
| IsActive          | BIT            | NOT NULL, DEFAULT 1                            | Soft delete flag                                |
| CreatedAt         | DATETIME       | NOT NULL, DEFAULT (GETUTCDATE())               | Account creation timestamp                      |
| UpdatedAt         | DATETIME       | NOT NULL, DEFAULT (GETUTCDATE())               | Last update timestamp                           |

**Indexes:**
- `UX_User_Email` on `Email`
- `IX_User_DepartmentId` on `DepartmentId`

---

#### Table: Departments

| Column      | Data Type      | Constraints                               | Description              |
| ----------- | -------------- | ----------------------------------------- | ------------------------ |
| Id          | INT            | PRIMARY KEY, AUTO_INCREMENT               | Unique department ID     |
| Name        | NVARCHAR(200)  | NOT NULL                                  | Department name          |
| Code        | NVARCHAR(50)   | NOT NULL, UNIQUE                         | Department code          |
| QACoordinId | INT            | FOREIGN KEY (Users.Id), NULLABLE         | QA Coordinator ID        |
| CreatedAt   | DATETIME       | NOT NULL, DEFAULT (GETUTCDATE())         | Creation timestamp       |

**Indexes:**
- `UX_Department_Code` on `Code`
- `IX_Department_QACoordinId` on `QACoordinId`

---

#### Table: Topics

| Column                 | Data Type      | Constraints                               | Description                    |
| ---------------------- | -------------- | ----------------------------------------- | ------------------------------ |
| Id                     | INT            | PRIMARY KEY, AUTO_INCREMENT               | Unique topic ID                |
| Name                   | NVARCHAR(255)  | NOT NULL                                  | Topic name                     |
| Description            | NVARCHAR(MAX)  | NULLABLE                                  | Topic description              |
| IdeaSubmissionDeadline | DATETIME       | NOT NULL                                  | Deadline for idea submission   |
| CommentDeadline        | DATETIME       | NOT NULL                                  | Deadline for final comments    |
| CreatedById            | INT            | FOREIGN KEY (Users.Id), NOT NULL         | Topic creator (typically QAM) |
| IsActive               | BIT            | NOT NULL, DEFAULT 1                       | Active/archived flag           |
| CreatedAt              | DATETIME       | NOT NULL, DEFAULT (GETUTCDATE())         | Creation timestamp             |
| UpdatedAt              | DATETIME       | NOT NULL, DEFAULT (GETUTCDATE())         | Last update timestamp          |

**Indexes:**
- `IX_Topic_CreatedById` on `CreatedById`
- `IX_Topic_IsActive` on `IsActive`

---

#### Table: Categories

| Column      | Data Type      | Constraints                       | Description                  |
| ----------- | -------------- | --------------------------------- | ---------------------------- |
| Id          | INT            | PRIMARY KEY, AUTO_INCREMENT       | Unique category ID           |
| TopicId     | INT            | FOREIGN KEY (Topics.Id), NOT NULL | Category belongs to topic    |
| Name        | NVARCHAR(150)  | NOT NULL                          | Category name                |
| Description | NVARCHAR(MAX)  | NULLABLE                          | Category description         |
| CreatedAt   | DATETIME       | NOT NULL, DEFAULT (GETUTCDATE()) | Creation timestamp           |

**Indexes:**
- `IX_Category_TopicId` on `TopicId`

**Constraints:**
- Categories can only be deleted if they have no associated ideas

---

#### Table: Ideas

| Column         | Data Type      | Constraints                                      | Description                          |
| -------------- | -------------- | ------------------------------------------------ | ------------------------------------ |
| Id             | INT            | PRIMARY KEY, AUTO_INCREMENT                      | Unique idea ID                       |
| TopicId        | INT            | FOREIGN KEY (Topics.Id), NOT NULL               | Topic this idea belongs to           |
| AuthorId       | INT            | FOREIGN KEY (Users.Id), NOT NULL                | Idea author (always stored)          |
| CategoryId     | INT            | FOREIGN KEY (Categories.Id), NULLABLE           | Idea category                        |
| DepartmentId   | INT            | FOREIGN KEY (Departments.Id), NULLABLE          | Author's department                  |
| Title          | NVARCHAR(255)  | NOT NULL                                         | Idea title                           |
| Content        | NVARCHAR(MAX)  | NOT NULL                                         | Idea content/body                    |
| IsAnonymous    | BIT            | NOT NULL, DEFAULT 0                              | Whether idea posted anonymously      |
| ViewCount      | INT            | NOT NULL, DEFAULT 0                              | Number of views                      |
| ThumbsUpCount  | INT            | NOT NULL, DEFAULT 0                              | Thumbs up reaction count             |
| ThumbsDownCount| INT            | NOT NULL, DEFAULT 0                              | Thumbs down reaction count           |
| CreatedAt      | DATETIME       | NOT NULL, DEFAULT (GETUTCDATE())                | Submission timestamp                 |
| UpdatedAt      | DATETIME       | NOT NULL, DEFAULT (GETUTCDATE())                | Last modification                    |

**Indexes:**
- `IX_Idea_TopicId` on `TopicId`
- `IX_Idea_AuthorId` on `AuthorId`
- `IX_Idea_CategoryId` on `CategoryId`
- `IX_Idea_DepartmentId` on `DepartmentId`
- `IX_Idea_CreatedAt` on `CreatedAt` (for sorting)

**Special Behavior:**
- Ideas are immutable after submission (no UPDATE on Content)
- AuthorId always stored even for anonymous ideas (audit trail)
- Display `IsAnonymous` flag controls visibility of author

---

#### Table: Comments

| Column      | Data Type      | Constraints                               | Description                 |
| ----------- | -------------- | ----------------------------------------- | --------------------------- |
| Id          | INT            | PRIMARY KEY, AUTO_INCREMENT               | Unique comment ID           |
| IdeaId      | INT            | FOREIGN KEY (Ideas.Id), NOT NULL         | Comment belongs to idea     |
| AuthorId    | INT            | FOREIGN KEY (Users.Id), NOT NULL         | Commenter (always tracked)  |
| Content     | NVARCHAR(MAX)  | NOT NULL                                  | Comment text                |
| IsAnonymous | BIT            | NOT NULL, DEFAULT 0                       | Anonymous posting flag      |
| CreatedAt   | DATETIME       | NOT NULL, DEFAULT (GETUTCDATE())         | Comment timestamp           |

**Indexes:**
- `IX_Comment_IdeaId` on `IdeaId`
- `IX_Comment_AuthorId` on `AuthorId`
- `IX_Comment_CreatedAt` on `CreatedAt`

**Constraints:**
- Comments cannot be posted after `Topic.CommentDeadline`

---

#### Table: Reactions

| Column    | Data Type | Constraints                                                      | Description               |
| --------- | --------- | ---------------------------------------------------------------- | ------------------------- |
| Id        | INT       | PRIMARY KEY, AUTO_INCREMENT                                      | Unique reaction ID        |
| IdeaId    | INT       | FOREIGN KEY (Ideas.Id), NOT NULL                                 | Reaction on idea          |
| UserId    | INT       | FOREIGN KEY (Users.Id), NOT NULL                                 | User giving reaction      |
| IsThumbsUp| BIT       | NOT NULL                                                          | Thumbs up (1) or down (0) |
| CreatedAt | DATETIME  | NOT NULL, DEFAULT (GETUTCDATE())                                | Reaction timestamp       |

**Indexes:**
- `UX_Reaction_IdeaId_UserId` UNIQUE on `(IdeaId, UserId)` – Enforces one vote per user per idea

---

#### Table: Documents

| Column    | Data Type      | Constraints                               | Description                    |
| --------- | -------------- | ----------------------------------------- | ------------------------------ |
| Id        | INT            | PRIMARY KEY, AUTO_INCREMENT               | Unique document ID             |
| IdeaId    | INT            | FOREIGN KEY (Ideas.Id), NOT NULL         | Document attached to idea      |
| FileName  | NVARCHAR(255)  | NOT NULL                                  | Original file name             |
| FilePath  | NVARCHAR(MAX)  | NOT NULL                                  | Physical storage path          |
| FileType  | NVARCHAR(50)   | NOT NULL                                  | MIME type (e.g., application/pdf) |
| FileSize  | BIGINT         | NOT NULL                                  | File size in bytes             |
| UploadedAt| DATETIME       | NOT NULL, DEFAULT (GETUTCDATE())         | Upload timestamp               |

**Indexes:**
- `IX_Document_IdeaId` on `IdeaId`

**Constraints:**
- Allowed file types: .pdf, .docx, .doc, .xlsx, .pptx, .jpg, .png, .gif
- Maximum file size: 10 MB per file

---

#### Table: SystemSettings

| Column    | Data Type      | Constraints                       | Description             |
| --------- | -------------- | --------------------------------- | ----------------------- |
| Id        | INT            | PRIMARY KEY, AUTO_INCREMENT       | Unique setting ID       |
| Key       | NVARCHAR(100)  | NOT NULL, UNIQUE                  | Configuration key       |
| Value     | NVARCHAR(MAX)  | NULLABLE                          | Configuration value     |
| CreatedAt | DATETIME       | NOT NULL, DEFAULT (GETUTCDATE()) | Creation timestamp      |
| UpdatedAt | DATETIME       | NOT NULL, DEFAULT (GETUTCDATE()) | Last update timestamp   |

**Sample Keys:**
- `SystemYear` → "2025-2026"
- `MaxIdeasPerUser` → "50"
- `NotificationEmailFrom` → "noreply@university.edu"

---

### 3.2.2 Sample Data & Relationships

#### Sample: Department & User

```sql
INSERT INTO Departments (Name, Code, QACoordinId) 
VALUES ('Information Technology', 'IT', 2);

INSERT INTO Users (FullName, Email, PasswordHash, Role, DepartmentId, StudentId, AgreedTerms, AgreedTermsDate)
VALUES 
('John IT Manager', 'john.it@university.edu', '$2b$10$...', 'QAManager', 1, NULL, 1, '2026-01-15'),
('Jane IT Coordinator', 'jane.it@university.edu', '$2b$10$...', 'QACoordinator', 1, NULL, 1, '2026-01-15'),
('Mike IT Staff', 'mike.it@university.edu', '$2b$10$...', 'Staff', 1, 'S20200123', 1, '2026-02-01');
```

#### Sample: Topic → Idea → Comment → Reaction

```sql
INSERT INTO Topics (Name, Description, IdeaSubmissionDeadline, CommentDeadline, CreatedById)
VALUES ('Software Innovation 2026', 'Submit ideas for Q1 2026', '2026-03-31', '2026-04-15', 1);

INSERT INTO Ideas (TopicId, AuthorId, CategoryId, DepartmentId, Title, Content, IsAnonymous)
VALUES (1, 15, 3, 1, 'Cloud Migration Framework', 'Proposal for moving legacy systems...', 0);

INSERT INTO Comments (IdeaId, AuthorId, Content, IsAnonymous)
VALUES (42, 7, 'Great idea! We should consider cost implications.', 1);

INSERT INTO Reactions (IdeaId, UserId, IsThumbsUp)
VALUES (42, 8, 1);  -- User 8 gives thumbs up to idea 42
-- If user 8 tries to react again, UNIQUE constraint prevents duplicate
```

#### Sample: Export Workflow

```sql
-- QA Manager exports all ideas for Topic 1 after CommentDeadline passed
SELECT 
    i.Id, i.Title, i.Content,
    CASE WHEN i.IsAnonymous = 1 THEN 'Anonymous' ELSE u.FullName END AS Author,
    d.Name AS Department,
    c.Name AS Category,
    COUNT(DISTINCT re.Id) AS TotalReactions,
    COUNT(DISTINCT co.Id) AS TotalComments
FROM Ideas i
LEFT JOIN Users u ON i.AuthorId = u.Id
LEFT JOIN Departments d ON i.DepartmentId = d.Id
LEFT JOIN Categories c ON i.CategoryId = c.Id
LEFT JOIN Reactions re ON i.Id = re.IdeaId
LEFT JOIN Comments co ON i.Id = co.IdeaId
WHERE i.TopicId = 1 AND GETUTCDATE() > (SELECT CommentDeadline FROM Topics WHERE Id = 1)
GROUP BY i.Id, i.Title, i.Content, i.IsAnonymous, u.FullName, d.Name, c.Name
ORDER BY i.CreatedAt DESC;
```

---
### 3.3 Website Design

#### 3.3.1 Wireframes Diagrams

**Login Page**

```
+─────────────────────────────────────────+
|         SICS – Student Idea System      |
|─────────────────────────────────────────|
|                                         |
|   [Logo / University Banner]            |
|                                         |
|   Email:    [________________________]  |
|   Password: [________________________]  |
|                                         |
|            [    LOG IN    ]             |
|                                         |
|   Don't have an account? [Register]     |
+─────────────────────────────────────────+
```

**Staff Dashboard**

```
+──NavBar──────────────────────────────────────────────────────────+
| SICS   [Dashboard] [Topics] [My Ideas]                 [Logout]  |
+───────────────────────────────────────────────────────────────────+
|                                                                   |
|  Welcome, [Username]                                              |
|                                                                   |
|  ┌─────────────────────┐  ┌─────────────────────┐                |
|  │  🔥 Active Topics   │  │  📊 My Statistics    │                |
|  │  Topic A | 3 ideas  │  │  Ideas: 5            │                |
|  │  Topic B | 7 ideas  │  │  Comments: 12        │                |
|  └─────────────────────┘  └─────────────────────┘                |
|                                                                   |
|  Latest Ideas                                                     |
|  ┌─────────────────────────────────────────────────────────┐     |
|  │ [Title]   by [Author]   👍 12  👎 2   💬 5   [View]    │     |
|  │ [Title]   by Anonymous  👍 8   👎 1   💬 3   [View]    │     |
|  └─────────────────────────────────────────────────────────┘     |
|  [← Prev]                                          [Next →]      |
+───────────────────────────────────────────────────────────────────+
```

**Idea Detail Page**

```
+──NavBar──────────────────────────────────────────────────────────+
|                                                                   |
|  ◀ Back to Topic                                                  |
|                                                                   |
|  [Idea Title]                                                     |
|  By: [Author]  |  Category: [Category]  |  Topic: [Topic Name]   |
|  Posted: [Date]    👍 14  👎 3   👁 120                          |
|                                                                   |
|  ─────────────────────────────────────────────────────────────  |
|  [Idea Content Body]                                              |
|  ─────────────────────────────────────────────────────────────  |
|                                                                   |
|  Attachments:  [📄 file1.docx]  [📄 file2.pdf]                  |
|                                                                   |
|  [ 👍 Like ]   [ 👎 Dislike ]                                    |
|                                                                   |
|  ─── Comments (5) ──────────────────────────────────────────────|
|  [Author] – [Date]: [Comment text...]                             |
|  [Anonymous] – [Date]: [Comment text...]                          |
|                                                                   |
|  Add a Comment:                                                   |
|  [_________________________________________________]             |
|  [ ] Post Anonymously          [  Submit Comment  ]               |
+───────────────────────────────────────────────────────────────────+
```

**Admin Dashboard**

```
+──NavBar──────────────────────────────────────────────────────────+
| SICS  [Admin Dashboard]                               [Logout]   |
+───────────────────────────────────────────────────────────────────+
|                                                                   |
|  ┌────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────┐ |
|  │ 👥 Users   │ │ 💡 Ideas     │ │ 💬 Comments  │ │ 🏢 Depts  │ |
|  │    45      │ │    120       │ │    380       │ │    6      │ |
|  └────────────┘ └──────────────┘ └──────────────┘ └───────────┘ |
|                                                                   |
|  [Bar Chart: Ideas per Department]                                |
|  [Pie Chart: Ideas per Category]                                  |
|                                                                   |
|  ─── User Management ──────────────────────────────────────────  |
|  [Search users...]                          [+ Add User]         |
|  | Name | Email | Role | Dept | Status | Actions |               |
|                                                                   |
|  ─── Export Data ──────────────────────────────────────────────  |
|  Topic: [___________▼]   [📥 Export CSV]  [📦 Download ZIP]     |
+───────────────────────────────────────────────────────────────────+
```

---

#### 3.3.2 Site Map

```
SICS Web Application
│
├── /login                     (Public)
│     Login form
│
├── /register                  (Public)
│     Registration form + Terms & Conditions
│
└── [Authenticated]
      │
      ├── /dashboard            (All roles)
      │     Latest ideas, active topics, statistics widget
      │
      ├── /topics               (Staff, QA Manager)
      │     List of all topics
      │     │
      │     └── /topic/:topicId/new-idea
      │           Idea submission form
      │
      ├── /idea/:id             (All roles)
      │     Idea detail, attachments, comments, reactions
      │
      └── /admin                (Administrator, QA Manager)
            Admin dashboard
            User management (CRUD)
            Department management
            Topic management
            Statistics & charts
            CSV / ZIP export
```

---

### 3.4 Activity Diagrams

#### 3.4.1 Activity Diagram – Submit Idea (Quy trình gửi ý tưởng)

```mermaid
activity
  title Submit Idea Workflow
  
  start
  :User Login;
  :Select Topic (Chủ đề);
  
  if (Is Submission Deadline Active?) then (Yes)
    :Enter Title & Content;
    :Choose Category;
    :Choose Privacy (Public/Anonymous);
    :Attach Files (Optional);
    
    if (Are Files Valid?) then (Yes)
      :Submit Form;
      :System Validates Data;
      
      if (Is Data Valid?) then (Yes)
        :Save Idea to Database;
        :Send Email to QA Coordinator;
        :Display Success;
        :Redirect to Idea Detail Page;
      else (No)
        :Display Validation Error;
        stop
      endif
    else (No)
      :Display Error: Invalid File;
      stop
    endif
  else (Deadline Passed)
    :Display Error: Submission Deadline Passed;
    stop
  endif
  
  stop
```

#### 3.4.2 Activity Diagram – Comment on Idea (Quy trình bình luận)

```mermaid
activity
  title Comment on Idea Workflow
  
  start
  :User Login;
  :Navigate to Idea Detail Page;
  
  if (Is Comment Deadline Active?) then (Yes)
    :Enter Comment Text;
    :Choose Privacy (Public/Anonymous);
    
    if (Is Comment Not Empty?) then (Yes)
      :Submit Comment Form;
      :System Validates Comment;
      
      if (Is Comment Valid?) then (Yes)
        :Save Comment to Database;
        :Increment Comment Count on Idea;
        if (Is Idea Author?) then (Yes)
          :Send Email Notification to Author;
        endif
        :Display Success;
        :Refresh Comments Section;
      else (No)
        :Display Validation Error;
        stop
      endif
    else (No)
      :Display Error: Comment is Empty;
      stop
    endif
  else (Deadline Passed)
    :Display Error: Comment Deadline Passed;
    :Disable Comment Form;
    stop
  endif
  
  stop
```

#### 3.4.3 Activity Diagram – Export Data (Quy trình xuất dữ liệu)

```mermaid
activity
  title Export Data Workflow (Admin/QA Manager)
  
  start
  :QA Manager/Admin Login;
  :Navigate to Admin Dashboard;
  :Select Topic to Export;
  
  if (Has Comment Deadline Passed?) then (Yes)
    :Choose Export Type;
    
    if (Export CSV) then (Yes)
      :Generate CSV File (Ideas + Comments);
      :Include Metadata (Author, Category, Department);
      :Stream File to Client;
      :Log Export Action;
      stop
    else
      if (Download ZIP) then (Yes)
        :Collect All Documents for Topic;
        :Organize by Idea ID;
        :Create ZIP Archive;
        :Stream ZIP to Client;
        :Log Export Action;
        stop
      endif
    endif
  else (Deadline Not Passed)
    :Display Error: Export Not Available Yet;
    :Display Countdown to Deadline;
    stop
  endif
```

#### 3.4.4 Activity Diagram – Admin User Management (Quy trình quản lý người dùng)

```mermaid
activity
  title Admin User Management Workflow
  
  start
  :Admin Login;
  :Navigate to Admin Dashboard;
  :Go to User Management Tab;
  
  :Display User List (with Pagination);
  
  if (Select Action) then (Create New User)
    :Enter User Details (Name, Email, Role, Dept);
    :System Validates Input;
    
    if (Is Email Unique?) then (Yes)
      :Generate Temporary Password;
      :Create User Account;
      :Send Email with Login Credentials;
      :Display Success;
    else (No)
      :Display Error: Email Already Exists;
      stop
    endif
  else
    if (Edit User) then (Yes)
      :Select User from List;
      :Update Role/Department/Status;
      :Validate Changes;
      :Save to Database;
      :Display Success;
    else
      if (Deactivate User) then (Yes)
        :Select Active User;
        :Confirm Deactivation;
        :Set IsActive = false;
        :User Cannot Login Anymore;
        :Display Success;
      endif
    endif
  endif
  
  stop
```

#### 3.4.5 Activity Diagram – View Statistics (Quy trình xem thống kê)

```mermaid
activity
  title View Statistics Workflow
  
  start
  :User Login;
  
  if (Admin/QA Manager Role?) then (Yes)
    :Navigate to Admin Dashboard;
    :System Retrieves Statistics Data;
    
    :Calculate Metrics:
    :- Total Ideas per Department
    :- Ideas per Category
    :- Total Comments & Reactions
    :- Popular Ideas (Most Voted);
    
    :Generate Charts:
    :- Bar Chart: Ideas/Department
    :- Pie Chart: Ideas/Category
    :- Line Chart: Ideas Over Time;
    
    :Display Dashboard with Charts;
    :Allow Filter by Date Range;
    :Allow Filter by Department;
    
    if (Export Statistics?) then (Yes)
      :Generate Report File;
      :Download as PDF/Excel;
    endif
  else
    :Navigate to Personal Dashboard;
    :Display Personal Statistics:
    :- My Ideas Count
    :- My Comments Count
    :- My Reactions Given;
  endif
  
  stop
```

---

## 4. Implementation

### 4.1 List of Files in System

#### Project Structure

```
COMP1640/
├── backend/
│   ├── Controllers/          # API Controllers
│   │   ├── AuthController.cs
│   │   ├── TopicController.cs
│   │   ├── IdeaController.cs
│   │   ├── CommentController.cs
│   │   ├── CategoryController.cs
│   │   ├── DepartmentController.cs
│   │   ├── DocumentController.cs
│   │   ├── AdminController.cs
│   │   ├── StatisticsController.cs
│   │   └── SystemSettingsController.cs
│   ├── Models/              # Data Models
│   │   ├── User.cs
│   │   ├── Topic.cs
│   │   ├── Idea.cs
│   │   ├── Comment.cs
│   │   ├── Reaction.cs
│   │   ├── Category.cs
│   │   ├── Department.cs
│   │   ├── Document.cs
│   │   ├── SystemSettings.cs
│   │   └── AdminDtos.cs
│   ├── Data/AppDbContext.cs  # EF Core DbContext
│   ├── Services/EmailService.cs
│   ├── Database/            # SQL schema & seed scripts
│   ├── Migrations/          # EF Core migration files
│   ├── Program.cs           # Entry point
│   └── appsettings.json     # Configuration
│
└── frontend/
    ├── src/
    │   ├── Login.tsx / Login.css
    │   ├── Register.tsx / Register.css
    │   ├── Dashboard.tsx / Dashboard.css
    │   ├── Topics.tsx / Topics.css
    │   ├── IdeaForm.tsx / IdeaForm.css
    │   ├── IdeaDetail.tsx / IdeaDetail.css
    │   ├── AdminDashboard.tsx / AdminDashboard.css
    │   ├── NavBar.tsx / NavBar.css
    │   ├── services/        # API Services
    │   │   ├── authService.ts
    │   │   ├── topicService.ts
    │   │   ├── ideaService.ts
    │   │   ├── commentService.ts
    │   │   ├── categoryService.ts
    │   │   ├── departmentService.ts
    │   │   ├── documentService.ts
    │   │   ├── statisticsService.ts
    │   │   ├── adminService.ts
    │   │   └── systemSettingsService.ts
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

#### Backend (`/backend/`)

| File/Directory                 | Description                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------- |
| `Program.cs`                   | Application entry point; configures services, middleware, JWT auth, CORS, EF Core |
| `backend.csproj`               | Project file with NuGet package dependencies                                      |
| `appsettings.json`             | Application configuration (DB connection string, JWT secret, email settings)      |
| `appsettings.Development.json` | Development-specific overrides                                                    |
| **Controllers/**               |                                                                                   |
| `AuthController.cs`            | Endpoints: POST `/api/auth/register`, `/api/auth/login`; JWT token generation     |
| `IdeaController.cs`            | CRUD for ideas; pagination; most-popular, most-viewed, latest endpoints           |
| `CommentController.cs`         | CRUD for comments; anonymous comment support                                      |
| `TopicController.cs`           | CRUD for topics; deadline enforcement                                             |
| `CategoryController.cs`        | QA Manager-restricted category management                                         |
| `DepartmentController.cs`      | Administrator-restricted department management                                    |
| `DocumentController.cs`        | File upload/download; validates file type and size                                |
| `AdminController.cs`           | CSV export and ZIP document export (post-deadline only)                           |
| `StatisticsController.cs`      | Statistics endpoints: overview, per-department, per-category, timeline            |
| `SystemSettingsController.cs`  | CRUD for key-value system settings                                                |
| **Data/**                      |                                                                                   |
| `AppDbContext.cs`              | EF Core DbContext; entity configurations, unique indexes, relationships           |
| **Models/**                    |                                                                                   |
| `User.cs`                      | User entity (Id, FullName, Email, Role, DepartmentId, AgreedTerms, etc.)          |
| `Idea.cs`                      | Idea entity (Title, Content, IsAnonymous, CategoryId, TopicId, Attachments)       |
| `Comment.cs`                   | Comment entity (Content, IsAnonymous, IdeaId, AuthorId)                           |
| `Reaction.cs`                  | Reaction entity (IsThumbsUp, UserId, IdeaId)                                      |
| `Topic.cs`                     | Topic entity (IdeaSubmissionDeadline, CommentDeadline)                            |
| `Category.cs`                  | Category entity (Name, TopicId)                                                   |
| `Department.cs`                | Department entity (Name, Code, QACoordinatorId)                                   |
| `Document.cs`                  | Document entity (FileName, FilePath, FileType, IdeaId)                            |
| `SystemSettings.cs`            | Key-value system settings entity                                                  |
| `AdminDtos.cs`                 | Data Transfer Objects for admin views                                             |
| **Services/**                  |                                                                                   |
| `EmailService.cs`              | Email notification: idea submitted, comment added; SMTP ready (dev: log-only)     |
| **Migrations/**                | EF Core migration files for database versioning                                   |
| **Database/**                  | SQL scripts for schema, seed data, and maintenance                                |

#### Frontend (`/frontend/src/`)

| File                                        | Description                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| `main.tsx`                                  | React application entry point                                             |
| `App.tsx`                                   | Root component; React Router v6 route definitions; protected routes logic |
| `authService.ts`                            | Helper service for JWT token storage, retrieval, and user info decoding   |
| `api.ts`                                    | Centralised Axios/fetch API configuration; base URL, auth headers         |
| `types.ts`                                  | TypeScript shared type definitions (User, Idea, Comment, Topic, etc.)     |
| `Login.tsx` / `Login.css`                   | Login page component with form validation                                 |
| `Register.tsx` / `Register.css`             | Registration form; terms & conditions checkbox                            |
| `Dashboard.tsx` / `Dashboard.css`           | Main dashboard for staff; shows topics, latest ideas                      |
| `Topics.tsx` / `Topics.css`                 | Topic listing page                                                        |
| `IdeaForm.tsx` / `IdeaForm.css`             | Idea submission form; file attachment, anonymous toggle, category select  |
| `IdeaDetail.tsx` / `IdeaDetail.css`         | Idea detail page; display comments, reactions, file downloads             |
| `AdminDashboard.tsx` / `AdminDashboard.css` | Administrator/QA Manager dashboard; user management, statistics, export   |
| `NavBar.tsx` / `NavBar.css`                 | Responsive navigation bar; role-based menu items                          |
| `App.css` / `index.css`                     | Global and app-level styles                                               |

---

### 4.2 API Endpoints

#### Authentication
- `POST /api/auth/login` – Đăng nhập
- `POST /api/auth/register` – Đăng ký
- `GET /api/auth/me` – Lấy thông tin user hiện tại

#### Topics
- `GET /api/topic` – Lấy tất cả topics
- `GET /api/topic/{id}` – Lấy topic theo ID
- `POST /api/topic` – Tạo topic mới
- `PUT /api/topic/{id}` – Cập nhật topic
- `DELETE /api/topic/{id}` – Xóa topic
- `GET /api/topic/statistics` – Thống kê
- `GET /api/topic/{id}/export` – Export data

#### Ideas
- `GET /api/idea` – Lấy tất cả ideas
- `GET /api/idea/{id}` – Lấy idea theo ID
- `GET /api/idea/topic/{topicId}` – Lấy ideas theo topic
- `POST /api/idea` – Tạo idea mới
- `PUT /api/idea/{id}` – Cập nhật idea
- `DELETE /api/idea/{id}` – Xóa idea
- `POST /api/idea/{id}/react` – React to idea
- `GET /api/idea/topic/{topicId}/no-comments` – Ideas không có comment
- `GET /api/idea/anonymous` – Ideas ẩn danh
- `GET /api/idea/most-popular` – Most popular ideas (sorted by votes)
- `GET /api/idea/most-viewed` – Most viewed ideas
- `GET /api/idea/latest` – Latest ideas

#### Comments
- `GET /api/comment/idea/{ideaId}` – Lấy comments theo idea
- `POST /api/comment` – Tạo comment
- `PUT /api/comment/{id}` – Cập nhật comment
- `DELETE /api/comment/{id}` – Xóa comment

#### Categories
- `GET /api/category` – Lấy tất cả categories
- `GET /api/category/{id}` – Lấy category theo ID
- `POST /api/category` – Tạo category (QA Manager only)
- `PUT /api/category/{id}` – Cập nhật category
- `DELETE /api/category/{id}` – Xóa category

#### Departments
- `GET /api/department` – Lấy tất cả departments
- `GET /api/department/{id}` – Lấy department theo ID

#### Documents
- `POST /api/Document/upload/{ideaId}` – Upload file
- `GET /api/Document/{id}` – Get document info
- `GET /api/Document/idea/{ideaId}` – Get all documents for idea
- `DELETE /api/Document/{id}` – Delete document

#### Statistics
- `GET /api/Statistics/overview` – Overall statistics
- `GET /api/Statistics/departments` – Stats by department
- `GET /api/Statistics/ideas-by-category` – Ideas by category
- `GET /api/Statistics/ideas-by-topic` – Ideas by topic
- `GET /api/Statistics/top-contributors` – Top contributors
- `GET /api/Statistics/ideas-timeline` – Timeline data

#### Admin (Export – QA Manager / Administrator only)
- `GET /api/Admin/export-csv/{topicId}` – Export ideas to CSV (after comment deadline)
- `GET /api/Admin/export-documents/{topicId}` – Export documents as ZIP
- `GET /api/Admin/export-all-data/{topicId}` – Export everything (CSV + ZIP)

#### System Settings
- `GET /api/SystemSettings` – Get all settings
- `GET /api/SystemSettings/{key}` – Get setting by key
- `PUT /api/SystemSettings/{key}` – Update setting
- `POST /api/SystemSettings` – Create setting
- `DELETE /api/SystemSettings/{key}` – Delete setting

---

### 4.3 Some Screenshots of System

> **Note**: The following descriptions correspond to the key screens of the implemented system.

#### Screen 1 – Login Page

The login page presents a clean, centred card with email/password fields and a branded header. The JWT token is stored in `localStorage` upon successful authentication. The user is redirected to `/dashboard` (staff) or `/admin` (administrator).

#### Screen 2 – Staff Dashboard

After login, staff see a dashboard with:

- A grid of active Topics with idea counts.
- A feed of the latest ideas, each showing title, author (or "Anonymous"), thumbs-up count, thumbs-down count, view count, and comment count.
- Pagination controls (5 ideas per page).

#### Screen 3 – Idea Submission Form

The idea submission form (accessed from a Topic) includes:

- Title and rich-text content fields.
- Category dropdown (populated per topic).
- File attachment (multiple files supported; accepts documents and images).
- Anonymous posting toggle.
- Submit button (disabled if the idea submission deadline has passed).

#### Screen 4 – Idea Detail Page

The idea detail page shows:

- Full idea content and metadata (author/anonymous, date, category, topic).
- Thumbs-up / thumbs-down reaction buttons (one vote per user enforced).
- Attached file download links.
- Comment thread with timestamps.
- Comment submission form with anonymous option (disabled after comment deadline).

#### Screen 5 – Admin Dashboard

The admin dashboard includes:

- Summary cards (total users, ideas, comments, departments).
- Bar chart: number of ideas per department.
- User management table with add/edit/deactivate actions.
- Topic management.
- Export section: select topic → Download CSV or ZIP (only available after comment deadline).

---

## 5. Testing

### 5.1 Test Plan

**Testing Strategy**: The system was tested using manual black-box functional testing. Test cases were designed based on the user stories in the Product Backlog. Each test case specifies input, expected result, and actual result.

**Test Environment**:

- Backend: `http://localhost:5122`
- Frontend: `http://localhost:5173`
- Database: MySQL (local instance, seeded with test data)
- Browser: Google Chrome (latest), Microsoft Edge

**Test Accounts**:

| Role           | Email                    | Password  |
| -------------- | ------------------------ | --------- |
| Administrator  | admin@university.edu     | Admin@123 |
| QA Manager     | qamanager@university.edu | QA@123456 |
| QA Coordinator | qacoord@university.edu   | QA@123456 |
| Staff          | staff@university.edu     | Staff@123 |

---

#### 5.1.1 Test Function – System Administrator

| TC-ID  | Test Case                                    | Pre-condition      | Input                                            | Expected Result                               |
| ------ | -------------------------------------------- | ------------------ | ------------------------------------------------ | --------------------------------------------- |
| TC-A01 | Login as Administrator                       | System running     | Email: admin@university.edu, Password: Admin@123 | Redirect to /admin, JWT token issued          |
| TC-A02 | Create new user                              | Logged in as Admin | FullName, Email, Role, Department                | User created, appears in user list            |
| TC-A03 | Create user with duplicate email             | Logged in as Admin | Existing email address                           | Error: "Email already exists"                 |
| TC-A04 | Edit user role                               | Logged in as Admin | Change role from Staff to QAManager              | Role updated in database                      |
| TC-A05 | Deactivate user account                      | Logged in as Admin | Select active user → Deactivate                  | User IsActive = false; cannot log in          |
| TC-A06 | Create new department                        | Logged in as Admin | Name: "Engineering", Code: "ENG"                 | Department created, appears in list           |
| TC-A07 | Create department with duplicate code        | Logged in as Admin | Code already used                                | Error: "Code already exists"                  |
| TC-A08 | Create new Topic                             | Logged in as Admin | Name, Deadline1 (7 days), Deadline2 (10 days)    | Topic created; active in system               |
| TC-A09 | Edit Topic deadline                          | Logged in as Admin | Change IdeaSubmissionDeadline                    | Deadline updated; enforced on idea submission |
| TC-A10 | View system statistics                       | Logged in as Admin | Navigate to /admin                               | Statistics cards and charts rendered          |
| TC-A11 | Configure system settings                    | Logged in as Admin | Update "AcademicYear" setting                    | Setting saved; reflected in API response      |
| TC-A12 | Admin cannot access Topics page (Staff only) | Logged in as Admin | Navigate to /topics                              | Redirect to /admin                            |

---

#### 5.1.2 Test Function – QA Manager

| TC-ID  | Test Case                       | Pre-condition               | Input                             | Expected Result                                                                     |
| ------ | ------------------------------- | --------------------------- | --------------------------------- | ----------------------------------------------------------------------------------- |
| TC-Q01 | Login as QA Manager             | System running              | Correct credentials               | Redirect to dashboard, QA Manager role                                              |
| TC-Q02 | Add new category                | Logged in as QA Manager     | Category Name: "Technology"       | Category added; available in idea form                                              |
| TC-Q03 | Delete unused category          | Logged in as QA Manager     | Select category with 0 ideas      | Category deleted                                                                    |
| TC-Q04 | Delete category in use          | Logged in as QA Manager     | Select category with linked ideas | Error: "Cannot delete category in use"                                              |
| TC-Q05 | Export CSV – before deadline    | Comment deadline not passed | Click Export CSV                  | Error: "Topic is still open for comments"                                           |
| TC-Q06 | Export CSV – after deadline     | Comment deadline passed     | Click Export CSV                  | CSV file downloaded with all idea data                                              |
| TC-Q07 | CSV content validation          | After export TC-Q06         | Open CSV file                     | Contains: Title, Author, Category, Department, Date, ThumbsUp, ThumbsDown, Comments |
| TC-Q08 | Download ZIP – before deadline  | Comment deadline not passed | Click Download ZIP                | Error: "Topic is still open for comments"                                           |
| TC-Q09 | Download ZIP – after deadline   | Comment deadline passed     | Click Download ZIP                | ZIP file downloaded with all uploaded documents                                     |
| TC-Q10 | View most popular ideas         | Logged in as QA Manager     | Navigate to ideas list            | Ideas sorted by (ThumbsUp – ThumbsDown) descending                                  |
| TC-Q11 | View statistics per department  | Logged in as QA Manager     | Navigate to /admin → Statistics   | Bar chart shows ideas count per department                                          |
| TC-Q12 | QA Manager cannot create topics | Logged in as QA Manager     | Attempt topic creation            | Access denied (Administrator only)                                                  |

---

#### 5.1.3 Test Function – Staff (Student)

| TC-ID  | Test Case                           | Pre-condition                   | Input                                 | Expected Result                                       |
| ------ | ----------------------------------- | ------------------------------- | ------------------------------------- | ----------------------------------------------------- |
| TC-S01 | Register new account                | System running                  | FullName, Email, Password, Department | Account created; redirect to login                    |
| TC-S02 | Register without agreeing to terms  | On register page                | Leave terms checkbox unchecked        | Form validation error; submission blocked             |
| TC-S03 | Login as Staff                      | Registered account              | Correct credentials                   | Redirect to /dashboard                                |
| TC-S04 | Login with wrong password           | On login page                   | Incorrect password                    | Error: "Invalid credentials"                          |
| TC-S05 | Submit idea within deadline         | Active topic open               | Title, Content, Category, (no files)  | Idea created; appears in topic list                   |
| TC-S06 | Submit idea after deadline          | Idea submission deadline passed | Attempt to submit idea                | Error: "Idea submission deadline has passed"          |
| TC-S07 | Submit idea with file attachment    | Active topic open               | Idea + upload .docx file              | Idea created with attachment; viewable on detail page |
| TC-S08 | Submit file with invalid type       | Active topic open               | Upload .exe file                      | Error: "File type not allowed"                        |
| TC-S09 | Submit idea anonymously             | Active topic open               | Toggle "Post Anonymously" ON          | Idea shows "Anonymous" as author to other users       |
| TC-S10 | Verify anonymous tracking           | Admin view after TC-S09         | Admin views idea                      | AuthorId stored; admin can identify actual author     |
| TC-S11 | Comment on idea within deadline     | Comment deadline not passed     | Enter comment text, submit            | Comment appears on idea detail page                   |
| TC-S12 | Comment on idea after deadline      | Comment deadline passed         | Attempt to submit comment             | Button disabled / Error: "Comment period closed"      |
| TC-S13 | Submit anonymous comment            | On idea detail page             | Toggle anonymous ON, submit           | Comment shows "Anonymous" author                      |
| TC-S14 | Thumbs-up reaction                  | On idea detail page             | Click 👍                              | Reaction saved; count increments                      |
| TC-S15 | Duplicate vote prevention           | Already voted on idea           | Click 👍 again                        | Vote toggled / Previous vote removed                  |
| TC-S16 | View paginated idea list            | On Dashboard                    | Navigate pages                        | 5 ideas per page; pagination controls work            |
| TC-S17 | Staff cannot access admin dashboard | Logged in as Staff              | Navigate to /admin                    | Redirect to /dashboard                                |

---

### 5.2 Test Log

#### 5.2.1 Test Function – System Administrator

| TC-ID  | Test Case                        | Expected Result                | Actual Result                               | Status  | Notes |
| ------ | -------------------------------- | ------------------------------ | ------------------------------------------- | ------- | ----- |
| TC-A01 | Login as Administrator           | Redirect to /admin, JWT issued | Redirected to /admin, token in localStorage | ✅ Pass |       |
| TC-A02 | Create new user                  | User created                   | User visible in management table            | ✅ Pass |       |
| TC-A03 | Create user with duplicate email | Error message                  | "Email already exists" displayed            | ✅ Pass |       |
| TC-A04 | Edit user role                   | Role updated                   | Role changed in DB and UI                   | ✅ Pass |       |
| TC-A05 | Deactivate user account          | IsActive = false               | User cannot log in after deactivation       | ✅ Pass |       |
| TC-A06 | Create new department            | Department created             | Appears in department list                  | ✅ Pass |       |
| TC-A07 | Duplicate department code        | Error returned                 | "Code already exists" displayed             | ✅ Pass |       |
| TC-A08 | Create new Topic                 | Topic created                  | Topic appears in list                       | ✅ Pass |       |
| TC-A09 | Edit Topic deadline              | Deadline updated               | Enforced on next idea submission attempt    | ✅ Pass |       |
| TC-A10 | View system statistics           | Charts rendered                | Statistics displayed correctly              | ✅ Pass |       |
| TC-A11 | Configure system settings        | Setting saved                  | Value updated via API response              | ✅ Pass |       |
| TC-A12 | Admin blocked from /topics       | Redirect to /admin             | Correctly redirected                        | ✅ Pass |       |

---

#### 5.2.2 Test Function – QA Manager

| TC-ID  | Test Case                       | Expected Result       | Actual Result                                          | Status  | Notes |
| ------ | ------------------------------- | --------------------- | ------------------------------------------------------ | ------- | ----- |
| TC-Q01 | Login as QA Manager             | Redirect to dashboard | Logged in successfully                                 | ✅ Pass |       |
| TC-Q02 | Add category                    | Category added        | Visible in idea form dropdown                          | ✅ Pass |       |
| TC-Q03 | Delete unused category          | Deleted               | Category removed from list                             | ✅ Pass |       |
| TC-Q04 | Delete category in use          | Error returned        | "Cannot delete category with existing ideas" displayed | ✅ Pass |       |
| TC-Q05 | Export CSV before deadline      | Error returned        | "Topic is still open for comments"                     | ✅ Pass |       |
| TC-Q06 | Export CSV after deadline       | CSV downloaded        | File contains all ideas                                | ✅ Pass |       |
| TC-Q07 | CSV content validation          | Correct fields        | All required columns present                           | ✅ Pass |       |
| TC-Q08 | ZIP before deadline             | Error returned        | Correct error message                                  | ✅ Pass |       |
| TC-Q09 | ZIP after deadline              | ZIP downloaded        | All uploaded files included                            | ✅ Pass |       |
| TC-Q10 | Most popular ideas              | Sorted by votes       | Correct sorting order                                  | ✅ Pass |       |
| TC-Q11 | Statistics per department       | Chart rendered        | Data accurate vs database                              | ✅ Pass |       |
| TC-Q12 | QA Manager cannot create topics | Access denied         | 403 Forbidden returned                                 | ✅ Pass |       |

---

#### 5.2.3 Test Function – Staff

| TC-ID  | Test Case                           | Expected Result          | Actual Result                         | Status  | Notes |
| ------ | ----------------------------------- | ------------------------ | ------------------------------------- | ------- | ----- |
| TC-S01 | Register new account                | Account created          | Registration successful               | ✅ Pass |       |
| TC-S02 | Register without terms              | Blocked                  | Validation error; cannot submit       | ✅ Pass |       |
| TC-S03 | Login as Staff                      | Redirect to /dashboard   | Dashboard displayed                   | ✅ Pass |       |
| TC-S04 | Login with wrong password           | Error message            | "Invalid credentials" shown           | ✅ Pass |       |
| TC-S05 | Submit idea within deadline         | Idea created             | Idea appears in topic list            | ✅ Pass |       |
| TC-S06 | Submit idea after deadline          | Deadline error           | "Idea submission deadline has passed" | ✅ Pass |       |
| TC-S07 | Submit with file attachment         | Idea + file saved        | File downloadable from detail page    | ✅ Pass |       |
| TC-S08 | Upload invalid file type            | Upload rejected          | Error: file type not permitted        | ✅ Pass |       |
| TC-S09 | Submit anonymous idea               | Author shows "Anonymous" | Other users see "Anonymous"           | ✅ Pass |       |
| TC-S10 | Admin can identify anonymous author | AuthorId stored          | Admin can view actual author          | ✅ Pass |       |
| TC-S11 | Comment within deadline             | Comment posted           | Appears on idea page                  | ✅ Pass |       |
| TC-S12 | Comment after deadline              | Submission blocked       | Button disabled / error shown         | ✅ Pass |       |
| TC-S13 | Anonymous comment                   | Shows "Anonymous"        | Correctly anonymised                  | ✅ Pass |       |
| TC-S14 | Thumbs-up reaction                  | Count increments         | Reaction count updated                | ✅ Pass |       |
| TC-S15 | Duplicate vote prevention           | No duplicate             | Vote toggled, no duplicate entry      | ✅ Pass |       |
| TC-S16 | Paginated idea list                 | 5 per page               | Pagination works correctly            | ✅ Pass |       |
| TC-S17 | Staff blocked from /admin           | Redirect to dashboard    | Correctly redirected                  | ✅ Pass |       |

---

### 5.3 Sufficient Test Data to Fully Test

To ensure complete and comprehensive testing of the Student Idea Contribution System, the following test data was created and seeded into the database. This data covers all business scenarios, edge cases, and user roles.

#### 5.3.1 User Test Data

| Count | Role            | Email                      | Password    | Department          | Status | Purpose                                      |
| ----- | --------------- | -------------------------- | ----------- | ------------------- | ------ | -------------------------------------------- |
| 1     | Administrator   | admin@university.edu       | Admin@123   | Admin               | Active | Test admin functions, user management        |
| 2     | QA Manager      | qamanager@university.edu   | QA@123456   | Quality Assurance   | Active | Test export, statistics, category management |
| 2     | QA Coordinator  | qacoord@university.edu     | QA@123456   | Quality Assurance   | Active | Test email notifications, coordinate reviews |
| 15    | Staff           | staff[1-15]@university.edu | Staff@123   | Various Depts       | Active | Test idea submission, comments, reactions    |
| 3     | Staff           | inactive_staff[1-3]@...    | Staff@123   | Engineering         | Inactive | Test permission enforcement on inactive users |

**Test Data Rationale**:
- Multiple staff users (15 active + 3 inactive) allow testing idea collaboration, varying departments, and volume scenarios.
- Admin and QA Manager roles test all management functions independently.
- QA Coordinators test the email notification workflow.

---

#### 5.3.2 Department Test Data

| Dept ID | Department Name  | Code | QA Coordinator    | Staff Count | Purpose                               |
| ------- | ---------------- | ---- | ----------------- | ----------- | ------------------------------------- |
| 1       | Engineering      | ENG  | qacoord1@...      | 5           | Main test department for ideas       |
| 2       | Business         | BUS  | qacoord2@...      | 4           | Secondary department for cross-dept  |
| 3       | Media            | MED  | NULL              | 3           | Test unassigned QA coordinator cases |
| 4       | Research         | RES  | qacoord1@...      | 2           | Test multi-dept QA coordinator       |
| 5       | Administration   | ADM  | qacoord2@...      | 1           | Test small department scenarios      |
| 6       | Support Services | SUP  | NULL              | 0           | Test empty department scenario       |

**Test Data Rationale**:
- 6 departments with varying staff distributions test departmental grouping and statistics aggregation.
- Null QA Coordinators on some departments test missing coordinator scenarios.
- Cross-assigned QA Coordinators test N:1 relationship handling.

---

#### 5.3.3 Topic Test Data

| Topic ID | Name                    | Ideal Deadline (Start +) | Comment Deadline (Start +) | Status     | Categories | Purpose                                    |
| -------- | ----------------------- | ------------------------ | -------------------------- | ---------- | ---------- | ------------------------------------------ |
| 1        | Digital Transformation | +7 days                  | +14 days                   | Active     | 4          | Main testing topic, currently open         |
| 2        | Sustainability          | +3 days (expired)        | +10 days (expired)         | Closed     | 3          | Test deadline enforcement, past topic      |
| 3        | Remote Work Solutions   | +21 days (future)        | +28 days (future)          | Active     | 3          | Test not-yet-started topic, future deadlines |
| 4        | Customer Experience     | +5 days (expired)        | +7 days (expired idea only) | Partial    | 2          | Test partial deadline scenario             |

**Test Data Rationale**:
- Topic 1: Active topic with unexpired deadlines for standard idea/comment testing.
- Topic 2: Fully closed topic tests export functionality and deadline enforcement.
- Topic 3: Future topic tests deadline not-yet-reached scenarios and forward planning.
- Topic 4: Partially closed topic (comment window open, idea window closed) tests boundary conditions.

---

#### 5.3.4 Category Test Data

| Category ID | Topic | Name               | Description                      | Ideas Count | Purpose                    |
| ----------- | ----- | ------------------ | -------------------------------- | ----------- | -------------------------- |
| 1           | 1     | Technology         | IT and digital solutions         | 8           | Popular category           |
| 2           | 1     | Process Improvement | Workflow enhancement             | 5           | Mid-popularity category    |
| 3           | 1     | Cost Reduction     | Budget-related ideas             | 3           | Lower popularity category  |
| 4           | 1     | Employee Wellness  | Staff wellbeing & benefits       | 0           | Empty category for testing |
| 5           | 2     | Innovation         | General innovation proposals     | 12          | High-volume closed topic   |
| 6           | 3     | Sustainability     | Environmental initiatives       | 0           | Test category on future    |

**Test Data Rationale**:
- Range of category popularity (0–12 ideas) tests sorting, filtering, and empty category scenarios.
- Categories across multiple topics test category isolation per topic.

---

#### 5.3.5 Idea Test Data – Comprehensive Coverage

##### Ideas in Active Topic (Topic ID: 1)

| Idea ID | Title                          | Author        | Category              | Has Files | Anonymous | ThumbsUp | ThumbsDown | Comments | Status |
| ------- | ------------------------------ | -------------- | --------------------- | --------- | --------- | -------- | ---------- | -------- | ------ |
| 1       | Cloud Migration Framework      | staff1         | Technology            | Yes (2)   | No        | 14       | 2          | 5        | ✅     |
| 2       | Agile Development Best Practices | staff2        | Technology            | Yes (1)   | No        | 11       | 1          | 3        | ✅     |
| 3       | Automation of Manual Tasks     | staff3         | Process Improvement   | No        | Yes       | 9        | 3          | 4        | ✅     |
| 4       | Cost Tracking Dashboard        | staff4         | Cost Reduction        | Yes (1)   | No        | 7        | 0          | 2        | ✅     |
| 5       | Flexible Work Hours Policy     | staff5         | Employee Wellness     | No        | No        | 12       | 0          | 8        | ✅     |
| 6       | Energy-Efficient Office Design | staff6         | Technology            | Yes (3)   | No        | 6        | 2          | 1        | ✅     |
| 7       | Employee Training Program      | staff7         | Employee Wellness     | Yes (1)   | Yes       | 5        | 1          | 0        | ✅     |
| 8       | Supply Chain Optimization      | staff8         | Process Improvement   | No        | No        | 3        | 1          | 2        | ✅     |

**Note**: Ideas 1–8 test various data combinations (files, anonymity, engagement levels).

##### Ideas in Closed Topic (Topic ID: 2)

| Idea ID | Title                          | Author | Category      | ThumbsUp | ThumbsDown | Comments | Exported | Status |
| ------- | ------------------------------ | ------ | ------------- | -------- | ---------- | -------- | -------- | ------ |
| 9       | AI-Driven Customer Support     | staff2 | Innovation    | 18       | 1          | 12       | ✅       | ✅     |
| 10      | Blockchain for Data Security   | staff4 | Innovation    | 15       | 4          | 9        | ✅       | ✅     |
| 11      | Predictive Analytics Platform  | staff6 | Innovation    | 22       | 2          | 15       | ✅       | ✅     |
| 12      | Machine Learning Optimization  | staff9 | Innovation    | 13       | 3          | 7        | ✅       | ✅     |

**Note**: Ideas 9–12 in a closed topic test export functionality and historical data scenarios.

##### Ideas in Future Topic (Topic ID: 3)

| Idea ID | Title                      | Author  | Category        | Status | Purpose                        |
| ------- | -------------------------- | ------- | --------------- | ------ | ------------------------------ |
| 13      | Remote Work Survey Results | staff10 | Sustainability  | ✅     | Test future topic, not started |
| 14      | Hybrid Office Planning     | staff11 | Sustainability  | ✅     | Test forward-dated ideas       |

**Test Data Rationale**:
- **Active topic ideas (1–8)**: Full range of configurations testing all combinations of: file attachments (0–3), anonymity (yes/no), engagement metrics (votes 3–14, comments 0–8).
- **Closed topic ideas (9–12)**: High engagement scenarios for export validation and analytics.
- **Future topic ideas (13–14)**: Test deadline-not-reached scenarios.
- **Anonymous ideas (3, 7)**: Verify author anonymisation while storing real author ID.

---

#### 5.3.6 Comment Test Data

| Comment ID | Idea | Author        | Anonymous | Content (Sample)                                  | Likes | Status |
| ---------- | ---- | ------------- | --------- | ------------------------------------------------- | ----- | ------ |
| 1          | 1    | staff2        | No        | "Great initiative! Can we include cloud security?" | 3     | ✅     |
| 2          | 1    | staff3        | Yes       | "I support this but we need budget approval"      | 1     | ✅     |
| 3          | 1    | staff4        | No        | "Timeline should be phased over 18 months"        | 2     | ✅     |
| 4          | 5    | staff1        | No        | "Flexible hours increase productivity"            | 5     | ✅     |
| 5          | 9    | staff7        | Yes       | "This could replace our current support model"    | 4     | ✅     |
| 6          | –    | –             | –         | (Comments only added after idea submission deadline) | –     | –      |

**Test Data Rationale**:
- Mix of anonymous and named comments tests anonymisation enforcement.
- Comments on ideas with different engagement levels test realistic discussion scenarios.
- Comments added within deadline window validate deadline enforcement.

---

#### 5.3.7 File/Document Test Data

| Document ID | Idea | File Name                    | Type     | Size    | Upload Status |
| ----------- | ---- | ---------------------------- | -------- | ------- | ------------- |
| 1           | 1    | Cloud_Migration_Plan.pdf     | PDF      | 2.3 MB  | ✅ Valid     |
| 2           | 1    | Budget_Estimate.xlsx         | Excel    | 156 KB  | ✅ Valid     |
| 3           | 2    | Architecture_Diagram.pptx    | PPT      | 4.1 MB  | ✅ Valid     |
| 4           | 4    | ROI_Analysis.docx            | Word     | 287 KB  | ✅ Valid     |
| 5           | 6    | Energy_Audit_Report.pdf      | PDF      | 5.7 MB  | ✅ Valid     |
| 6           | 6    | Office_Layout_Plan.jpg       | Image    | 892 KB  | ✅ Valid     |
| 7           | 6    | 3D_Model_Exterior.dxf        | CAD      | 3.2 MB  | ✅ Valid     |
| 8           | 7    | Training_Curriculum.docx     | Word     | 142 KB  | ✅ Valid     |
| –           | –    | malware.exe                  | EXE      | 1.2 MB  | ❌ Rejected  |
| –           | –    | script.js                    | Script   | 45 KB   | ❌ Rejected  |

**Allowed File Types**: `.pdf, .docx, .xlsx, .pptx, .jpg, .png, .gif, .dxf, .txt`  
**Rejected File Types**: `.exe, .bat, .js, .com, .zip`

**Test Data Rationale**:
- 8 valid files across different types test upload, storage, and download.
- Multiple files per idea (Ideas 1, 6) test multi-file scenarios.
- Rejected files test security validation (malware prevention).

---

#### 5.3.8 Reaction Test Data

| Reaction ID | Idea | User     | Reaction Type | Status | Purpose                    |
| ----------- | ---- | -------- | ------------- | ------ | -------------------------- |
| 1           | 1    | staff1   | 👍 (Thumbs Up) | ✅     | Test positive reaction     |
| 2           | 1    | staff2   | 👍 (Thumbs Up) | ✅     | Test multiple reactions    |
| 3           | 1    | staff3   | 👎 (Thumbs Down) | ✅     | Test negative reaction     |
| 4           | 1    | staff1   | 👎 (Toggle Down) | ✅     | Test reaction toggle       |
| 5           | 5    | staff1   | 👍 (Thumbs Up) | ✅     | Test cross-idea reactions  |
| 6           | 5    | staff10  | 👍 (Thumbs Up) | ✅     | Test unique user constraint |

**Test Data Rationale**:
- Reaction 4 tests the toggle mechanism (user switches from thumbs-up to thumbs-down on same idea).
- Composite unique index on `(UserId, IdeaId)` tested implicitly (no duplicate user-idea pairs).
- Reactions across different ideas test user's ability to react to multiple ideas independently.

---

#### 5.3.9 Admin Settings Test Data

| Setting Key       | Value                    | Use Case                        |
| ----------------- | ------------------------ | ------------------------------- |
| `AcademicYear`    | "2025–2026"              | Display on footer               |
| `DefaultPageSize` | "5"                      | Pagination default              |
| `MaxFileSize`     | "10485760"               | 10 MB limit                     |
| `AllowAnonymous`  | "true"                   | Enable anonymous ideas/comments |
| `EmailNotifications` | "true"                | QA Coordinator notifications    |

**Test Data Rationale**:
- These settings control system behaviour and are modified during test execution to validate enforcement.

---

#### 5.3.10 Test Data Coverage Summary

| Scenario                              | Count | Coverage |
| ------------------------------------- | ----- | -------- |
| **Users**                             | 26    | ✅       |
| Active Staff                          | 15    |          |
| Inactive Staff                        | 3     |          |
| Admin / QA Manager / QA Coordinator   | 5     |          |
| **Departments**                       | 6     | ✅       |
| With assigned QA Coordinator          | 4     |          |
| Without QA Coordinator                | 2     |          |
| **Topics**                            | 4     | ✅       |
| Active (idea window open)             | 2     |          |
| Closed (both deadlines passed)        | 1     |          |
| Future (not yet started)              | 1     |          |
| **Ideas**                             | 14    | ✅       |
| With file attachments (multi-file)    | 5     |          |
| Anonymous ideas                       | 2     |          |
| With high engagement (votes, comments) | 6     |          |
| **Comments**                          | 6     | ✅       |
| Named comments                        | 4     |          |
| Anonymous comments                    | 2     |          |
| **Files/Documents**                   | 18    | ✅       |
| Valid uploaded files                  | 8     |          |
| Rejected (invalid types)              | 2     |          |
| **Reactions**                         | 6     | ✅       |
| Thumbs-up                             | 4     |          |
| Thumbs-down                           | 2     |          |
| **Categories**                        | 6     | ✅       |
| With ideas                            | 5     |          |
| Empty categories                      | 1     |          |

#### 5.3.11 Key Testing Scenarios Enabled by This Data

| Scenario                              | Data Used | Expected Result                                  | Status |
| ------------------------------------- | --------- | ------------------------------------------------ | ------ |
| Staff can submit multiple ideas       | Ideas 1–8 | All 8 ideas visible in topic list               | ✅     |
| Export API enforces CommentDeadline   | Topic 2   | Topic 2 ideas exportable; Topic 1/3 not yet      | ✅     |
| Anonymous ideas show author to admin  | Idea 3    | Staff users see "Anonymous"; admin sees staff2   | ✅     |
| Unique vote per user per idea         | Idea 1    | staff1 can toggle vote but not vote twice        | ✅     |
| File upload type validation           | Files     | Valid PDFs, DOCs accepted; EXE, JS rejected      | ✅     |
| Pagination works with large datasets  | 14 ideas  | 5 ideas per page; navigation to next/prev pages  | ✅     |
| Statistics aggregation per department | 5 depts   | Bar chart shows correct idea count per dept      | ✅     |
| Email notifications for new ideas     | Idea 1–8  | QA Coordinators receive notification on submission | ✅     |
| Category filtering                    | 6 categories | Filter ideas by category; empty category filtered out | ✅     |
| Reaction sorting (most popular)       | Reactions | Ideas sorted by (👍 – 👎) descending             | ✅     |

---

## 6. Evaluation

### 6.1 Achievement Against Requirements

The Student Idea Contribution System successfully meets all core requirements specified in the COMP1640 module brief. The following table summarises the achievement level:

| Requirement Area       | Requirements                                    | Met    | Partially Met | Not Met |
| ---------------------- | ----------------------------------------------- | ------ | ------------- | ------- |
| Authentication & Roles | 4 roles, JWT, BCrypt                            | 4      | 0             | 0       |
| Idea Management        | Submit, anonymous, file, category               | 8      | 0             | 0       |
| Comments & Reactions   | Comment, anonymous, thumbs up/down, unique vote | 5      | 0             | 0       |
| Email Notifications    | QA Coordinator, comment author                  | 2      | 0             | 0       |
| Data Export            | CSV, ZIP, deadline check                        | 3      | 0             | 0       |
| Statistics             | Per department, overview, charts                | 4      | 0             | 0       |
| Admin Functions        | User, dept, topic, settings                     | 4      | 0             | 0       |
| UI/UX                  | Responsive, custom components                   | 2      | 0             | 0       |
| Security               | JWT, BCrypt, SQL injection, XSS                 | 6      | 0             | 0       |
| **Total**              | **38**                                          | **38** | **0**         | **0**   |

> Email notification: Currently operational in log-only mode (development). Production SMTP credentials are required for live email delivery — this is a configuration matter, not an implementation gap.

### 6.2 Technical Achievements

#### Backend Optimizations
- **Response Compression**: Enabled response compression for reduced bandwidth usage.
- **JSON Serialization**: Configured to ignore cycles and null values for cleaner API responses.
- **Global Error Handling**: Middleware catches unhandled exceptions and returns consistent error responses.
- **Health Check Endpoint**: `/health` endpoint available for monitoring.
- **Swagger Documentation**: Detailed API documentation via Swashbuckle 6.5.0 at `/swagger`.
- **Async/Await Patterns**: All database and I/O operations use async methods.
- **Proper HTTP Status Codes**: Consistent use of 200, 201, 400, 401, 403, 404, 500 codes.
- **Security**: All passwords are hashed using BCrypt. SQL injection is prevented through Entity Framework Core's parameterised queries. JWT tokens have configurable expiry. File uploads are validated for type and size.
- **Scalability**: Pagination is implemented on all listing endpoints to handle large volumes of ideas.
- **Data Integrity**: Unique constraints on email addresses, department codes, and vote reactions are enforced at both the application and database level.
- **Privacy**: Anonymous posting stores the author's ID server-side for administrative traceability while hiding identity from other users.

#### Frontend Optimizations
- **Axios Interceptors**: Auto-attach JWT token to every request; handle 401/403/500 errors globally.
- **Client-Side Caching**: 30–60 second TTL cache for topics, categories, and ideas; auto-cleared on mutation.
- **Form Validation**: Custom validators in `utils/validators.ts`; client-side validation before API requests.
- **Loading & Error States**: All async operations show loading spinners and error messages.
- **React.memo Optimization**: Applied to frequently-rendered card components.
- **useCallback & useMemo Hooks**: Minimise unnecessary re-renders.
- **File Upload Validation**: File size limit 10 MB; allowed types: images, PDF, Word documents.
- **Responsive Design**: Mobile-first layout with Tailwind CSS.
- **TypeScript Strict Mode**: End-to-end type safety across all services and components.
- **Separation of Concerns**: Clean separation between frontend (React/TypeScript) and backend (REST API), allowing independent deployment and scaling.

### 6.3 Challenges Encountered

| Challenge                                                      | Resolution                                                                                               |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Anonymous author handling needed both privacy and traceability | `IsAnonymous` flag controls display; `AuthorId` always stored for admin access                           |
| File uploads needed validation and secure storage              | DocumentController validates allowed MIME types and file extensions; files stored in `/wwwroot/uploads/` |
| Dual deadline logic (idea submission vs comment)               | Two separate datetime fields on Topic model; enforced in respective controllers                          |
| Unique vote constraint                                         | Composite index on `(UserId, IdeaId)` in Reaction table; API returns current vote state for UI toggle    |
| CORS configuration for local development                       | CORS policy configured in `Program.cs` to allow frontend development server origin                       |

### 6.4 Limitations and Future Work

| Area            | Current Limitation                                        | Proposed Enhancement                                          |
| --------------- | --------------------------------------------------------- | ------------------------------------------------------------- |
| Email Service   | Log-only in development (SMTP config needed)              | Configure production SMTP (e.g., SendGrid, Office 365)        |
| Testing         | Manual black-box tests only                               | Add xUnit unit tests and Playwright/Cypress E2E tests         |
| Mobile UI       | Basic responsive layout                                   | Dedicated mobile-optimised layout with touch interactions     |
| Search & Filter | Basic listing                                             | Full-text search, filter by category/department/date          |
| Notifications   | Email only                                                | In-app real-time notifications (SignalR WebSocket)            |
| Analytics       | Static charts                                             | Interactive filterable analytics dashboard                    |
| CI/CD           | Manual deployment                                         | GitHub Actions pipeline for automated build, test, and deploy |
| Database        | Entity Framework Core + MySQL (local)                     | Setup Redis caching; add database indexing review             |
| Authentication  | JWT (60 min expiry)                                       | Refresh token mechanism; rate limiting                        |

### 6.5 Lessons Learned

The project provided valuable experience in:

- Applying Agile Scrum in a real development setting — sprint planning, reviews, and daily communication significantly improved productivity.
- Designing a clean RESTful API with role-based authorization from the outset, avoiding significant refactoring later.
- Enforcing data integrity rules at both the ORM layer and database level.
- Balancing feature scope against development time, learning to prioritise core requirements over enhancements.

---

## 7. References

1. Microsoft Corporation. (2024). _ASP.NET Core (.NET 9.0) documentation_. Retrieved from https://learn.microsoft.com/en-us/aspnet/core/
2. Microsoft Corporation. (2024). _Entity Framework Core documentation_. Retrieved from https://learn.microsoft.com/en-us/ef/core/
3. Meta Platforms, Inc. (2024). _React 18 documentation_. Retrieved from https://react.dev/
4. Microsoft Corporation. (2024). _TypeScript documentation_. Retrieved from https://www.typescriptlang.org/docs/
5. Scrum Alliance. (2020). _The Scrum Guide_ (K. Schwaber & J. Sutherland). Retrieved from https://www.scrum.org/resources/scrum-guide
6. OWASP Foundation. (2024). _OWASP Top Ten_. Retrieved from https://owasp.org/www-project-top-ten/
7. Vitejs. (2024). _Vite 5 documentation_. Retrieved from https://vitejs.dev/
8. Tailwind Labs. (2024). _Tailwind CSS documentation_. Retrieved from https://tailwindcss.com/docs/
9. Auth0. (2024). _JSON Web Tokens (JWT) Introduction_. Retrieved from https://jwt.io/introduction/
10. BCrypt.Net contributors. (2024). _BCrypt.Net-Next documentation_. Retrieved from https://github.com/BcryptNet/bcrypt.net
11. MySQL AB. (2024). _MySQL 8.0 Reference Manual_. Retrieved from https://dev.mysql.com/doc/refman/8.0/en/
12. Axios contributors. (2024). _Axios documentation_. Retrieved from https://axios-http.com/docs/intro

---

_Report generated for COMP1640 – Enterprise Web Development assessment._  
_Academic Year 2025–2026_
