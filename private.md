# Individual Report – COMP1640

## Student Idea Contribution System (SICS)

**Module:** COMP1640 – Enterprise Web Development  
**Role:** Backend Developer  
**Technology Stack:** ASP.NET Core 8 (C#) · Entity Framework Core · MySQL · React 18 (TypeScript)  
**Academic Year:** 2025–2026  
**Date:** April 2026

---

## Table of Contents

1. [Evaluation of Product and Process](#1-evaluation-of-product-and-process)
   - 1.1 [Product Evaluation](#11-product-evaluation)
   - 1.2 [Process Evaluation](#12-process-evaluation)
2. [Evaluation of Team](#2-evaluation-of-team)
   - 2.1 [Scoring Criteria and Weighting](#21-scoring-criteria-and-weighting)
   - 2.2 [Individual Scores and Weighted Model](#22-individual-scores-and-weighted-model)
   - 2.3 [Commentary on Each Member](#23-commentary-on-each-member)
3. [Self-Evaluation](#3-self-evaluation)
   - 3.1 [Description of My Contribution](#31-description-of-my-contribution)
   - 3.2 [Reflection on Performance](#32-reflection-on-performance)
   - 3.3 [Lessons Learnt](#33-lessons-learnt)

---

---

## 1. Evaluation of Product and Process

### 1.1 Product Evaluation

#### 1.1.1 Requirements Coverage

The Student Idea Contribution System (SICS) was built to meet the functional specification defined in the COMP1640 module brief. A full comparison of requirements versus implementation is maintained in the group document `REQUIREMENTS_CHECKLIST.md`. The summary outcome is:

| Category                    | Required | Implemented | Status      |
| --------------------------- | -------- | ----------- | ----------- |
| Role-based Access (4 roles) | 4        | 4           | ✅ Complete |
| Idea Management             | 6        | 6           | ✅ Complete |
| Comments & Reactions        | 5        | 5           | ✅ Complete |
| Deadline Management         | 2        | 2           | ✅ Complete |
| Email Notifications         | 3        | 2           | ⚠️ Partial  |
| Lists & Pagination          | 5        | 5           | ✅ Complete |
| Data Export (CSV / ZIP)     | 3        | 3           | ✅ Complete |
| Administrator Features      | 4        | 4           | ✅ Complete |
| Statistics & Reporting      | 3        | 3           | ✅ Complete |
| Responsive UI               | 3        | 2           | ⚠️ Partial  |
| Security                    | 5        | 5           | ✅ Complete |

**Overall: 31 out of 35 requirements fully implemented (88.6%).** The two outstanding items are full SMTP email delivery in production (the service is implemented and logs correctly in development mode but requires a live SMTP server to be configured) and complete mobile responsiveness on all screen breakpoints.

#### 1.1.2 Key Feature Walkthroughs with Screenshots

The following screenshots were captured from the running application and are cross-referenced with `Report.md` Section 4.2 ("Screenshots of System").

---

**Screenshot 1 – Login Page**

> _The login screen presents email and password fields with JWT-based authentication. Entering incorrect credentials displays a clear error message. Successful login redirects the user to a role-appropriate dashboard._

The login flow is implemented in `AuthController.cs` (`POST /api/auth/login`). The backend verifies the BCrypt-hashed password, checks that `IsActive = true`, and returns a signed JWT containing the user's role claim. The frontend (`Login.tsx`) stores the token in `localStorage` and uses it for subsequent API calls.

**Evaluative comment:** The login experience is clean and functional. One improvement would be adding a "remember me" feature and account lockout after repeated failed attempts — neither is currently implemented (cross-ref: `FINAL_RECOMMENDATIONS.md`).

---

**Screenshot 2 – Staff Dashboard (Idea List)**

> _Staff users see a paginated list of ideas grouped by Topic. Each card shows the title, anonymous/named author, category, reaction counts, and a "Days remaining" badge. Sorting controls allow switching between Most Popular, Most Viewed, and Latest._

Pagination is handled server-side with `page` and `pageSize` query parameters (`IdeaController.cs`). The frontend (`Dashboard.tsx`) renders idea cards and communicates with `GET /api/idea/topic/{topicId}`. Cross-reference: `Report.md` Section 4.2, `FRONTEND_AND_TESTING_REPORT_EN.md` Section 3.2.

**Evaluative comment:** The paginated idea list works correctly for all tested cases (see `FRONTEND_TESTER_REPORT.md` testing results). The card layout is readable on desktop but the responsiveness on mobile viewport could be improved — cards stack but spacing is tight on screens below 480 px.

---

**Screenshot 3 – Idea Submission Form**

> _The IdeaForm page shows a topic selector (with the deadline displayed beneath it), a title field, a rich-text content area, a category dropdown, an anonymous toggle, a Terms & Conditions checkbox, and a multi-file upload zone. The Submit button is disabled if the topic deadline has passed._

Deadline enforcement is applied at two levels: the frontend disables the form, and the backend independently validates `topic.ClosureDate < DateTime.UtcNow` before persisting the idea (cross-ref: `Report.md` Section 3.1, Use Case UC04). File type whitelisting (`.pdf`, `.doc`, `.docx`, `.jpg`, `.png`) and a 10 MB size cap are enforced in `DocumentController.cs`.

**Evaluative comment:** The dual-layer validation (client + server) is a good security design. The Terms & Conditions gate matches the stated requirement (US-003 in `Report.md` Section 2.4) and is properly stored in the database (`User.AgreedTerms`, `User.AgreedTermsDate`).

---

**Screenshot 4 – Idea Detail Page**

> _Clicking an idea opens a detail view showing the full content, attached documents as download links, a thumbs-up/thumbs-down reaction bar, and an inline comment thread. Anonymous ideas show "Anonymous" as author name with no identifying information visible._

The anonymous privacy guarantee is enforced at the API layer, not just the UI. The LINQ projection in `IdeaController.cs` conditionally nullifies `AuthorId` and replaces `AuthorName` with `"Anonymous"` before serialisation — meaning even a raw API call cannot reveal the real author (cross-ref: `REQUIREMENTS_CHECKLIST.md`, Security section).

**Evaluative comment:** This is one of the strongest features of the product. Privacy is enforced correctly at the data layer. The comment thread is functional but lacks nested replies and rich-text formatting, which would improve the user experience.

---

**Screenshot 5 – Admin Dashboard**

> _The Admin Dashboard (accessible to QAManager and Administrator roles) displays system-wide statistics: total ideas, total comments, active users, and a per-department breakdown table. Charts show ideas submitted per week and the category distribution._

Statistics data is sourced from five endpoints in `StatisticsController.cs`. The frontend (`AdminDashboard.tsx`) renders bar charts and summary cards. User management (create, update role, deactivate) is available via `AdminController.cs`. Cross-reference: `ADMIN_DASHBOARD_GUIDE.md`, `Report.md` Section 4.2.

**Evaluative comment:** The admin dashboard covers all required statistics (cross-ref: `REQUIREMENTS_CHECKLIST.md` Statistics section). The CSV export and ZIP download are gated behind the `CommentDeadline` check, correctly preventing premature data export as required by the brief (US-014, US-015).

---

#### 1.1.3 Overall Product Assessment

**Strengths:**

- All high-priority and most medium-priority requirements are met.
- Security design is solid: JWT with short expiry, BCrypt hashing, RBAC enforced at the controller level, file type whitelisting, and EF Core parameterised queries preventing SQL injection.
- The system correctly enforces dual topic deadlines (idea submission vs. final comment deadline) — a nuanced requirement that was handled accurately on both client and server.
- Data export (CSV, ZIP) functions correctly and respects the final closure constraint.

**Weaknesses / Gaps:**

- SMTP email delivery works only in development log mode; a production SMTP server has not been configured. The QA Coordinator notification feature (US-011) therefore requires further deployment work (cross-ref: `REQUIREMENTS_CHECKLIST.md`, Email section).
- Responsive CSS is incomplete for sub-480 px viewports (cross-ref: `FRONTEND_AND_TESTING_REPORT_EN.md` Section 6).
- No unit or integration tests exist for the backend. The test coverage is entirely manual, documented in `FRONTEND_TESTER_REPORT.md`.
- There is no refresh-token mechanism; the JWT expires and forces re-login.

---

### 1.2 Process Evaluation

#### 1.2.1 Agile Scrum Process

The team adopted the **Scrum** framework across four two-week sprints (cross-ref: `Report.md` Section 2). The Scrum artefacts produced were:

- **Product Backlog** — 24 user stories with priority and story-point estimates (cross-ref: `Report.md` Section 2.4).
- **Sprint Backlogs** — task breakdowns per sprint with assignees and hour estimates (cross-ref: `Report.md` Section 2.5).
- **Burn-down Chart** — tracked ideal vs. actual story points remaining (cross-ref: `Report.md` Section 2.6).
- **Sprint Planning, Reviews, and Retrospectives** — documented meeting outcomes per sprint.

The burn-down data (cross-ref: `Report.md` Section 2.6) showed that the team ran slightly behind the ideal line in Sprints 1–3 due to underestimated complexity of the file upload module and the anonymous author feature, but recovered fully in Sprint 4. Total velocity across the project: **142 story points** in 8 weeks.

**What worked well in Scrum:**

- Short sprint cycles made scope creep visible early. When email notification testing revealed SMTP configuration complexity, the team decided to defer full production email to a post-sprint configuration task rather than blocking other features.
- Daily stand-ups (via Discord) were effective at surfacing blockers within 24 hours. For example, the JSON circular reference issue (Idea → Comments → Idea serialisation loop) was surfaced by the frontend developer and resolved within the same day.
- Sprint reviews with working software demoed to the tutor at the end of each sprint gave the team early feedback — the Terms & Conditions field was added after Sprint 1 review feedback.

**What could be improved:**

- Story-point estimation was inconsistent. The team used Fibonacci points but without prior reference stories, the estimates in Sprint 1 were too optimistic, leading to spillover.
- Retrospectives were informal and not formally documented. More structured retrospective artefacts (e.g., a Start/Stop/Continue board) would have made process improvement more deliberate.
- The Kanban board (Trello) was not always kept up to date between daily stand-ups, reducing its value as a real-time progress indicator.

#### 1.2.2 Design Methods

**Entity Relationship Diagram (ERD):**
The database schema was designed upfront during Sprint 1, documented in `relation.md` and cross-referenced in `Report.md` Section 3.2. The ERD covers all nine tables with their foreign key relationships, cascade/restrict rules, and unique constraints. Designing the schema before implementation prevented several integration issues (e.g., deciding early that `AuthorId` must always be stored even on anonymous ideas, so it can be used internally while being masked in API responses).

**Use Case Diagrams:**
System-level and detailed use case diagrams were produced during Sprint 1 (cross-ref: `Report.md` Section 3.1). These informed the API endpoint design — each use case was mapped to one or more controller actions. For example, UC04 (Submit Idea) maps directly to `POST /api/idea` with its pre-conditions (authenticated, agreed T&C, open topic) encoded as server-side validation.

**Layered Architecture:**
The backend follows a three-tier layered architecture (Controllers → AppDbContext → MySQL), which kept responsibilities separated. This made the email service easy to abstract behind `IEmailService` without coupling it to any specific controller.

**Evaluative comment on design methods:**
The ERD-first approach was particularly effective — having the schema finalised before writing controller code prevented costly model changes mid-sprint. If I were to repeat the project, I would also create sequence diagrams for the most complex flows (idea submission with email notification, ZIP export) to reduce ambiguity during implementation.

---

## 2. Evaluation of Team

### 2.1 Scoring Criteria and Weighting

To evaluate each team member's contribution fairly, I defined five criteria and assigned weights based on their relative impact on project success. The criteria reflect both technical output and collaborative behaviour, since both are essential in an Agile team.

| #   | Criterion                     | Weight | Rationale                                                                   |
| --- | ----------------------------- | ------ | --------------------------------------------------------------------------- |
| 1   | Technical Contribution        | 30%    | Volume and quality of functional features delivered                         |
| 2   | Code / Work Quality           | 20%    | Correctness, robustness, and alignment with requirements                    |
| 3   | Reliability & Commitment      | 20%    | Meeting sprint commitments, attending stand-ups, hitting deadlines          |
| 4   | Communication & Collaboration | 20%    | Sharing knowledge, raising blockers early, supporting other team members    |
| 5   | Problem Solving & Initiative  | 10%    | Independently resolving blockers, identifying risks, proposing improvements |

Each criterion is scored as a **percentage (0–100%)**. The weighted score is computed as:

$$\text{Weighted Score (\%)} = \sum_{i=1}^{5} (\text{Score}_i\% \times \text{Weight}_i)$$

---

### 2.2 Individual Scores and Weighted Model

The team consisted of four members. Member names have been replaced with Role labels to comply with the anonymous marking policy.

| Criterion                     | Weight | Backend Dev (Me) | Frontend Dev | QA / Frontend | Product Owner / Scrum Master |
| ----------------------------- | ------ | ---------------- | ------------ | ------------- | ---------------------------- |
| Technical Contribution        | 30%    | 90%              | 80%          | 70%           | 60%                          |
| Code / Work Quality           | 20%    | 80%              | 80%          | 70%           | 70%                          |
| Reliability & Commitment      | 20%    | 90%              | 70%          | 80%           | 80%                          |
| Communication & Collaboration | 20%    | 70%              | 80%          | 90%           | 90%                          |
| Problem Solving & Initiative  | 10%    | 90%              | 70%          | 70%           | 80%                          |

**Weighted Score Calculation:**

| Member                       | Weighted Score                                                         | Final (%) |
| ---------------------------- | ---------------------------------------------------------------------- | --------- |
| Backend Dev (Me)             | (90%×30%)+(80%×20%)+(90%×20%)+(70%×20%)+(90%×10%) = 27%+16%+18%+14%+9% | **84%**   |
| Frontend Dev                 | (80%×30%)+(80%×20%)+(70%×20%)+(80%×20%)+(70%×10%) = 24%+16%+14%+16%+7% | **77%**   |
| QA / Frontend                | (70%×30%)+(70%×20%)+(80%×20%)+(90%×20%)+(70%×10%) = 21%+14%+16%+18%+7% | **76%**   |
| Product Owner / Scrum Master | (60%×30%)+(70%×20%)+(80%×20%)+(90%×20%)+(80%×10%) = 18%+14%+16%+18%+8% | **74%**   |

The model produces a range of **74% – 84%**, reflecting genuine differences in individual contribution rather than a uniform distribution.

---

### 2.3 Commentary on Each Member

#### Backend Developer (Me)

Responsible for: the full backend API (10 controllers, 50+ endpoints), database schema design (9 tables, EF Core migrations), JWT authentication, RBAC, email service, file upload/download, statistics endpoints, and `Program.cs` configuration.

Strong technical output and reliable delivery — all Sprint 1 and Sprint 2 backend tasks were completed on time. The anonymous-idea privacy mechanism, topic deadline enforcement, and secure file upload with GUID renaming reflect careful security thinking. The main area for development is communication: there were instances where backend design decisions (e.g., the cascade-delete strategy) were made individually without consulting the frontend developer, causing minor integration friction that could have been avoided with earlier discussion.

**Score: 84%**

---

#### Frontend Developer

Responsible for: React/TypeScript components (Login, Register, Dashboard, IdeaForm, IdeaDetail, Topics, AdminDashboard, NavBar), Axios API integration, route protection, and CSS styling.

The frontend developer delivered a well-structured and functional UI that integrates correctly with all backend endpoints. The IdeaForm component handles the complex submission flow (deadline display, anonymous toggle, multi-file upload, T&C checkbox) accurately. Reliability dipped slightly in Sprint 3 when the admin dashboard took longer than estimated due to statistics chart integration, requiring some scope adjustment. Communication was good — the circular JSON serialisation bug was reported clearly and promptly, enabling a fast backend fix.

**Score: 77%**

---

#### QA / Frontend Support

Responsible for: test planning and execution across all four user roles (cross-ref: `FRONTEND_TESTER_REPORT.md`), logging defects, regression testing, and supporting frontend development in Sprint 4 (responsive CSS fixes).

This member's systematic test coverage was a genuine asset — the test plan covered authentication, idea submission, anonymous features, deadline behaviour, file upload, and export. Defects were logged clearly with reproduction steps. The QA member also actively communicated test results back to the team, enabling targeted bug fixes in Sprint 4. Technical contribution was lower than the developer roles (as expected for a QA-primary role), but their work enabled the team to ship with confidence. Communication and collaboration scores are the highest on the team.

**Score: 76%**

---

#### Product Owner / Scrum Master

Responsible for: maintaining and prioritising the product backlog, facilitating Sprint Planning and Review meetings, coordinating between team members, managing the Trello board, and liaising with the module tutor.

The Product Owner kept the team focused on the highest-priority stories and made sensible trade-off decisions when scope pressure arose (e.g., deferring full SMTP setup to avoid blocking the Sprint 3 goal). Facilitation of sprint ceremonies was effective, though retrospectives were not as structured as they could have been. Technical contribution was the lowest of the four members — which is appropriate for this role — but more hands-on support during Sprint 4 bug fixing would have been welcome. Strong on communication and initiative.

**Score: 74%**

---

## 3. Self-Evaluation

### 3.1 Description of My Contribution

My role in this project was **full backend development**. I was the sole engineer responsible for the server-side of the system, which encompasses:

**Database design:**
I designed the complete relational schema (9 tables: `Users`, `Departments`, `Topics`, `Categories`, `Ideas`, `Comments`, `Reactions`, `Documents`, `SystemSettings`) and implemented all EF Core entity models, Fluent API configurations, and the `InitialCreate` migration. Key design decisions included using `DeleteBehavior.Restrict` on the user-department relationship to prevent accidental data loss, and enforcing a unique composite index on `(UserId, IdeaId)` in the Reactions table to guarantee one-vote-per-user-per-idea at the database level (cross-ref: `relation.md`, `AppDbContext.cs`).

**Authentication and authorisation:**
I implemented JWT Bearer authentication with BCrypt password hashing. Registration validates email uniqueness, department existence, and minimum password length before hashing and storing credentials. Login returns a signed JWT with role claims that protect all route guarded by `[Authorize]` (cross-ref: `AuthController.cs`, `Program.cs`).

**Core API controllers:**
I implemented all 10 controllers (cross-ref: `backend/Controllers/`):

- `IdeaController` — full CRUD, pagination, anonymous masking, reaction toggling
- `CommentController` — full CRUD, latest-comments endpoint, post-comment email trigger
- `DocumentController` — secure file upload (type + size validation, GUID filename), download
- `AdminController` — user management (CRUD), CSV export, ZIP export (gated on CommentDeadline)
- `StatisticsController` — five analytics endpoints for the dashboard
- `TopicController`, `CategoryController`, `DepartmentController` — CRUD with validation
- `SystemSettingsController` — key-value configuration store
- `AuthController` — register, login, profile read/update

**Email service:**
I designed and implemented `IEmailService` / `EmailService` using SMTP with responsive HTML email templates. The service is registered via dependency injection and is resilient to SMTP failure — errors are logged but do not abort the primary request (cross-ref: `EmailService.cs`).

**Security hardening:**
Beyond authentication, I applied: file extension whitelisting, GUID renaming to prevent path traversal, EF Core parameterised queries (preventing SQL injection), CORS policy configuration, and API-layer anonymous masking to ensure sensitive fields are never leaked in responses.

In terms of story points from the Sprint Backlogs (`Report.md` Section 2.5), I was the assignee for **T-001 through T-018, T-023 through T-029** — covering all Sprint 1, Sprint 2, and Sprint 3 backend tasks, totalling approximately **88 of the 142 story points** in the project (62%).

---

### 3.2 Reflection on Performance

**What I did well:**

I delivered all committed backend tasks on time and to the required quality level. The backend API was functionally complete by the end of Sprint 3, giving the frontend and QA members sufficient time to integrate and test in Sprint 4. Security was treated as a first-class concern from the start, not retrofitted — all the OWASP-relevant protections (input validation, password hashing, parameterised queries, RBAC) were in place from Sprint 1.

The anonymous-idea privacy feature was technically the most nuanced implementation challenge. Keeping `AuthorId` stored in the database (for moderation purposes) while completely masking it in all API responses required deliberate LINQ projection at every query point — I am satisfied that this was handled consistently across all endpoints.

The email service decoupling via `IEmailService` interface was a good design decision. It meant the email provider could be swapped (or mocked in tests) without touching controller code.

**Where I fell short:**

My biggest gap was **communication about design decisions**. I made several backend design choices in isolation that should have been discussed with the frontend developer. The most notable example was the cascade-delete strategy: I chose `DeleteBehavior.Restrict` on the User → Idea relationship to preserve idea history when a user is deactivated. The frontend developer initially assumed ideas would be deleted with the user, leading to a mismatch in the user-deactivation UI. This was resolved, but a 15-minute discussion at the start of Sprint 2 would have avoided the confusion.

I also underestimated the complexity of the ZIP export feature. I estimated 4 hours (T-024) but the implementation took closer to 7 hours once the per-topic folder structure requirement (identified during the Sprint 3 review) was incorporated. This affected the Sprint 3 burn-down.

Finally, I did not write any automated tests. All backend validation was tested manually through Postman and via the frontend QA process. Given time, I would write xUnit tests for the anonymity masking logic, deadline enforcement, and file validation — these are high-risk behaviours where regression bugs would be difficult to catch manually.

---

### 3.3 Lessons Learnt

**1. Communicate design decisions cross-functionally.**
Backend decisions (schema design, delete behaviour, API response shape) directly affect the frontend. In future projects I will document and share these decisions explicitly — perhaps via a short ADR (Architecture Decision Record) — rather than assuming the team will infer them from the code.

**2. Estimate with a buffer for integration complexity.**
The file upload and ZIP export tasks both took significantly longer than estimated once integration edge cases emerged. I will apply a 30–40% buffer to estimates for tasks that involve external I/O or cross-component integration.

**3. Write tests alongside features, not after.**
Delaying test writing to "when there is time" meant tests were never written. In the next project I would adopt a test-first approach at least for business-critical logic (deadline enforcement, anonymous masking, role guards), even if full TDD is impractical under the module timeline.

**4. Defer only truly deferrable work.**
The SMTP production configuration was deferred as a reasonable Sprint trade-off, but it left the email feature in a "works in dev logs only" state at submission. A more disciplined approach would be to define a "Definition of Done" that includes at least a smoke test of the full SMTP path in a staging environment before marking a story complete.

**5. Service abstraction pays off.**
The `IEmailService` interface investment paid dividends when we needed to prevent email failures from crashing idea submissions. Designing with interfaces and dependency injection — even for a coursework project — makes the system easier to extend and test. I will apply this pattern more broadly in future projects (e.g., abstracting file storage behind an `IFileStorage` interface to make switching from local disk to cloud storage straightforward).
