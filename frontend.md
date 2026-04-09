# Individual Report – COMP1640

## Student Idea Contribution System (SICS)

**Module:** COMP1640 – Enterprise Web Development  
**Role:** Frontend Developer  
**Technology Stack:** React 18 (TypeScript) · Vite · Axios · CSS · React Router v6  
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

## 1. Evaluation of Product and Process

### 1.1 Product Evaluation

#### 1.1.1 Requirements Coverage

The Student Idea Contribution System (SICS) was developed to meet the full functional specification of the COMP1640 module brief. A detailed mapping of requirements against implementation is maintained in the group document `REQUIREMENTS_CHECKLIST.md`. From the frontend perspective, the summary is:

| Category                  | Required | Implemented | Status      |
| ------------------------- | -------- | ----------- | ----------- |
| Role-based UI (4 roles)   | 4        | 4           | ✅ Complete |
| Idea Management UI        | 6        | 6           | ✅ Complete |
| Comments & Reactions UI   | 5        | 5           | ✅ Complete |
| Deadline Enforcement (UI) | 2        | 2           | ✅ Complete |
| Email Notifications (UI)  | 2        | 1           | ⚠️ Partial  |
| Lists & Pagination        | 5        | 5           | ✅ Complete |
| Data Export UI            | 3        | 3           | ✅ Complete |
| Admin Dashboard           | 4        | 4           | ✅ Complete |
| Statistics & Charts       | 3        | 3           | ✅ Complete |
| Responsive Design         | 3        | 2           | ⚠️ Partial  |

**Overall: 31 out of 35 requirements fully implemented (88.6%).** The two outstanding items are full SMTP email delivery (a backend configuration dependency) and complete mobile responsiveness below 480 px viewport width (cross-ref: `FRONTEND_AND_TESTING_REPORT_EN.md` Section 3.2).

---

#### 1.1.2 Key Feature Walkthroughs with Screenshots

The following screenshots were taken from the running system and cross-reference the group documents `Report.md` (Section 4.2), `FRONTEND_AND_TESTING_REPORT_EN.md`, and `FRONTEND_TESTER_REPORT.md`.

---

**Screenshot 1 – Login and Register Pages**

> _The Login page presents a centred card with email and password fields, a "Remember me" toggle, and a link to the Register page. The Register page adds a department selector and a Terms & Conditions acceptance checkbox. Successful login redirects users to their role-specific dashboard._

Authentication state is managed by `authService.ts`, which stores the JWT token in `localStorage` after a successful `POST /api/auth/login` call. The `api.ts` Axios instance injects the token as a Bearer header on every subsequent request. Protected routes in `App.tsx` use a `PrivateRoute` wrapper that redirects unauthenticated users back to `/login`.

**Evaluative comment:** The login and registration flow is smooth and handles all common error cases (wrong password, duplicate email, inactive account) with user-facing messages (cross-ref: `FRONTEND_TESTER_REPORT.md`, tests AT-001 to AT-008). One weakness is that JWT tokens are stored in `localStorage` rather than an `HttpOnly` cookie, making them accessible to JavaScript — a known XSS risk that could be mitigated in a production deployment.

---

**Screenshot 2 – Main Dashboard (Staff View)**

> _The dashboard displays a paginated list of idea cards, a topic filter dropdown, sort controls (Most Popular, Most Viewed, Latest), and a statistics overview panel showing total idea count, active topics, and comment count. Each idea card shows title, anonymous/named author, category badge, reaction counts, and a "days remaining" indicator._

The dashboard (`Dashboard.tsx`) calls `GET /api/idea/topic/{topicId}?page=1&pageSize=5` and renders cards from the JSON response. Sorting switches query parameters; topic filtering replaces the `topicId` path segment. The statistics panel sources its data from `GET /api/statistics/overview`.

**Evaluative comment:** Pagination works correctly for all tested scenarios (cross-ref: `FRONTEND_AND_TESTING_REPORT_EN.md` Section 3.1 B). Sorting and filtering are fully functional. The card layout is clear and information-dense without being cluttered. One area for improvement is loading state feedback — currently a spinner is shown for the full page rather than skeleton cards, which creates a noticeable visual jump on initial load.

---

**Screenshot 3 – Idea Submission Form**

> _The IdeaForm page displays a topic dropdown (showing the deadline and a days-remaining countdown beneath each option), a title input, a content textarea, a category dropdown, an anonymous toggle, a Terms & Conditions checkbox, and a drag-and-drop file upload zone that accepts up to five files. The Submit button turns red and is disabled when the selected topic's deadline has passed._

Deadline detection is computed client-side in `IdeaForm.tsx`:

```typescript
const isDeadlinePassed = topic
  ? new Date(topic.ideaSubmissionDeadline) < new Date()
  : false;
```

When `isDeadlinePassed` is `true`, all form inputs are disabled and the button displays "Deadline Closed". File uploads validate type (`.pdf`, `.doc`, `.docx`, `.jpg`, `.png`) and size (10 MB) before adding to the upload queue. The backend enforces the same rules independently (cross-ref: `DocumentController.cs`, `IdeaController.cs`).

**Evaluative comment:** The dual-layer deadline enforcement (client + server) is a robust design and matches the requirement. All file upload validation test cases passed (cross-ref: `FRONTEND_TESTER_REPORT.md`, tests IM-004 to IM-007). The T&C checkbox correctly prevents submission and persists the acceptance timestamp server-side (`User.AgreedTermsDate`). One gap: there is no rich-text editor for idea content — the textarea is plain text, which limits formatting options for staff submitting detailed proposals.

---

**Screenshot 4 – Idea Detail Page**

> _The idea detail view shows the full idea content, an author field that displays "Anonymous" when the author chose to hide their identity, a view-count badge, a download list for all attached documents, a thumbs-up/thumbs-down voting panel, and an inline paginated comment thread with an "Add comment" form at the bottom. The comment form is disabled after the topic's comment deadline._

The `IdeaDetail.tsx` component fetches `GET /api/idea/{id}` which returns the idea with its comments and reactions. The anonymous masking is enforced server-side — the API response contains `authorName: "Anonymous"` and a null `authorId` for anonymous ideas, so the frontend cannot accidentally expose identity even through developer tools. The view count is incremented via a separate `PATCH /api/idea/{id}/view` call on component mount.

**Evaluative comment:** The anonymous privacy guarantee is correctly carried through from backend to UI — there is no way to reveal the real author through the frontend because the data is never sent (cross-ref: `REQUIREMENTS_CHECKLIST.md` Security section). The comment deadline lock (cross-ref: test CR-002) works correctly. The vote toggle behaviour (like → remove like → dislike) was the most complex interaction to implement and was tested thoroughly (cross-ref: tests CR-006 to CR-009).

---

**Screenshot 5 – Admin Dashboard**

> _The Admin Dashboard is accessible only to Administrator and QAManager roles (cross-ref: `Report.md` Section 2.1). It displays a four-card quick stats row (Total Ideas, Active Topics, Total Users, Total Departments), a user management table with Create/Edit/Deactivate/Role-change actions, a category management section, and export buttons for CSV and ZIP. A statistics section renders idea-per-week and category-distribution charts._

The admin dashboard (`AdminDashboard.tsx`) combines data from five API endpoints: `GET /api/statistics/overview`, `GET /api/statistics/departments`, `GET /api/admin/users`, `GET /api/category`, and `GET /api/topic`. Role-based navigation ensures that Staff and Coordinator users cannot reach `/admin` — the route guard redirects them with a 403 message.

**Evaluative comment:** All administrative CRUD operations were tested and passed (cross-ref: `FRONTEND_AND_TESTING_REPORT_EN.md` Section 3.1 F). The export buttons correctly invoke `GET /api/admin/export-csv` and `GET /api/admin/export-zip`, and the backend enforces the CommentDeadline gate before generating the file. The statistics charts render correctly on desktop. On tablet viewport the charts compress acceptably, but on mobile (below 480 px) they overflow their container — an open responsive work item.

---

#### 1.1.3 Overall Product Assessment

**Strengths:**

- All high-priority user-facing features are functional and tested (authentication, idea submission, anonymous posting, voting, commenting, admin management, data export).
- Role-based UI is cleanly implemented: menus, routes, and buttons adapt correctly per role without exposing restricted functionality in the DOM.
- Client-side deadline enforcement paired with server-side validation provides a good user experience (no confusing server error on deadline-locked forms) while maintaining correct security (the client check is never the sole guard).
- The API service layer (`api.ts`) is well-structured with a single Axios instance that centrally handles token injection and 401 redirect — this prevented token-related bugs across all components.
- File upload with type and size validation, progress indication, and removable queued files gives a polished submission experience.

**Weaknesses / Gaps:**

- Responsive CSS is incomplete for sub-480 px screens — the dashboard card grid and admin statistics charts overflow on small mobile viewports (cross-ref: `FRONTEND_AND_TESTING_REPORT_EN.md` Section 3.2).
- No accessibility (a11y) compliance audit was completed. ARIA labels and keyboard navigation are partially implemented but not systematically verified.
- JWT stored in `localStorage` is vulnerable to XSS. An `HttpOnly` cookie strategy would be more secure for production.
- There is no toast notification system — success/error feedback relies on inline text alerts that are easy to miss on larger screens.
- Dark mode is planned but not implemented (cross-ref: `FRONTEND_AND_TESTING_REPORT_EN.md` Section 3.2).

---

### 1.2 Process Evaluation

#### 1.2.1 Agile Scrum Process

The team ran four two-week sprints using the Scrum framework, managed via a Trello board and daily Discord stand-ups (cross-ref: `Report.md` Sections 2.3–2.6).

**Sprint allocation from the frontend perspective:**

| Sprint   | Frontend Tasks Completed                                                 | Story Points |
| -------- | ------------------------------------------------------------------------ | ------------ |
| Sprint 1 | Login, Register pages, JWT storage, React Router setup, Protected routes | 16 pts       |
| Sprint 2 | Dashboard, IdeaForm, IdeaDetail, Topics page                             | 29 pts       |
| Sprint 3 | AdminDashboard, NavBar (role-aware), Statistics charts                   | 17 pts       |
| Sprint 4 | Responsive CSS, bug fixes, end-to-end testing support                    | 15 pts       |

**Total frontend story points: ~57 out of 142** (cross-ref: `Report.md` Section 2.5).

**What worked well in the Scrum process:**

- Sprint reviews with working demos gave early visibility of integration issues. After Sprint 2, the tutor's feedback prompted the addition of a "days remaining" count to topic cards — this was a small, targeted change that improved usability significantly.
- Tight two-week cycles forced prioritisation. When the AdminDashboard statistics charts took longer than estimated in Sprint 3, the team agreed to cut dark mode from scope rather than miss the Sprint 3 goal.
- The backend developer surfacing the JSON circular reference bug via the stand-up allowed a same-day fix that unblocked the IdeaDetail component's comment rendering.

**What could be improved:**

- The Trello board was not consistently updated between stand-ups. On several days the board reflected Sprint 2 state while the team was already working on Sprint 3 tasks, which made progress invisible to anyone checking the board asynchronously.
- Sprint retrospectives were informal and verbal — no structured artefact (such as a Start/Stop/Continue board) was produced. This meant recurring friction (e.g., unclear API response shapes leading to frontend integration delays) was identified but not formally tracked or resolved with a process change.
- Estimation for frontend components was consistently optimistic. IdeaForm was estimated at 8 hours (T-020) but required approximately 13 hours once the file upload queue, deadline logic, and T&C validation were complete.

#### 1.2.2 Design Methods

**Wireframes and site map:**
UI wireframes for the main screens were sketched during Sprint 1 planning (cross-ref: `Report.md` Section 3.3, Website Design). These were low-fidelity ASCII layouts that established the page structure before development. Having agreed wireframes reduced rework — for example, the Admin Dashboard layout (four stat cards + table + charts) was agreed upfront, preventing later disagreement on component placement.

**Component-driven development:**
Each page was built as an independent React component with its own CSS file (`Dashboard.tsx` / `Dashboard.css`, `IdeaForm.tsx` / `IdeaForm.css`, etc.). This kept styling scoped, avoided CSS class conflicts, and made it straightforward to hand off completed components to QA for testing independently of the rest of the application.

**API-contract-first integration:**
Before building any component that contacted the backend, the expected API response shape was agreed with the backend developer (confirmed via Swagger and Postman). This contract approach prevented the most common integration failure mode — building a component around an assumed response structure that differs from the actual API output.

**Evaluative comment on design methods:**
The wireframe-first approach was highly effective for the more complex screens (IdeaDetail, AdminDashboard). For simpler screens (NavBar, Topics list), the wireframe step was skipped, and those components were built directly — this was a reasonable trade-off. The one design method that was conspicuously absent was a formal style guide or design token system. Colours, font sizes, and spacing were defined ad-hoc per component, leading to minor visual inconsistencies across pages that would require a CSS audit to resolve.

---

## 2. Evaluation of Team

### 2.1 Scoring Criteria and Weighting

To evaluate individual team contributions fairly and transparently, I selected five criteria with explicit weights reflecting the priorities of an Agile student project. Both technical output and collaborative behaviour are included, since the Scrum framework depends on both.

| #   | Criterion                     | Weight | Rationale                                                          |
| --- | ----------------------------- | ------ | ------------------------------------------------------------------ |
| 1   | Technical Contribution        | 30%    | Volume, quality, and complexity of work delivered                  |
| 2   | Code / Work Quality           | 20%    | Correctness, robustness, and alignment with requirements           |
| 3   | Reliability & Commitment      | 20%    | Meeting sprint commitments, attending stand-ups, hitting deadlines |
| 4   | Communication & Collaboration | 20%    | Sharing context, raising blockers early, supporting other members  |
| 5   | Problem Solving & Initiative  | 10%    | Independently resolving blockers and identifying risks proactively |

Each criterion is scored out of **10**. The weighted total is:

$$\text{Weighted Score} = \sum_{i=1}^{5} (\text{Score}_i \times \text{Weight}_i)$$

### 2.2 Individual Scores and Weighted Model

The team comprised four members. Role labels are used in place of names to comply with anonymous marking policy.

| Criterion                     | Weight | Frontend Dev (Me) | Backend Dev | QA / Frontend | Product Owner / Scrum Master |
| ----------------------------- | ------ | ----------------- | ----------- | ------------- | ---------------------------- |
| Technical Contribution        | 30%    | 8                 | 9           | 7             | 6                            |
| Code / Work Quality           | 20%    | 8                 | 9           | 7             | 7                            |
| Reliability & Commitment      | 20%    | 8                 | 9           | 8             | 8                            |
| Communication & Collaboration | 20%    | 8                 | 7           | 9             | 9                            |
| Problem Solving & Initiative  | 10%    | 7                 | 9           | 7             | 8                            |

**Weighted Score Calculation:**

| Member                       | Calculation                                                             | Final Score |
| ---------------------------- | ----------------------------------------------------------------------- | ----------- |
| Frontend Dev (Me)            | (8×0.30)+(8×0.20)+(8×0.20)+(8×0.20)+(7×0.10) = 2.40+1.60+1.60+1.60+0.70 | **7.90**    |
| Backend Dev                  | (9×0.30)+(9×0.20)+(9×0.20)+(7×0.20)+(9×0.10) = 2.70+1.80+1.80+1.40+0.90 | **8.60**    |
| QA / Frontend                | (7×0.30)+(7×0.20)+(8×0.20)+(9×0.20)+(7×0.10) = 2.10+1.40+1.60+1.80+0.70 | **7.60**    |
| Product Owner / Scrum Master | (6×0.30)+(7×0.20)+(8×0.20)+(9×0.20)+(8×0.10) = 1.80+1.40+1.60+1.80+0.80 | **7.40**    |

The model produces a range of **7.40 – 8.60**, providing clear differentiation between individual contributions.

### 2.3 Commentary on Each Member

#### Frontend Developer (Me)

Responsible for: all React/TypeScript components (Login, Register, Dashboard, IdeaForm, IdeaDetail, Topics, AdminDashboard, NavBar), the Axios API service layer (`api.ts`, `authService.ts`), React Router v6 route structure with role-based protected routes, and custom CSS for all pages.

Delivered all core UI components to a functional standard within the sprint schedule. The deadline-enforcement logic in `IdeaForm.tsx`, the anonymous author display in `IdeaDetail.tsx`, and the role-based navigation in `NavBar.tsx` are all implemented correctly and match the backend contract. The main weaknesses were optimistic time estimation (particularly for IdeaForm) and incomplete responsive CSS — the mobile layout was not finished to the same quality as desktop. Communication with the backend developer was generally good but could have been more proactive around API response shape agreements earlier in Sprint 2.

**Score: 7.90 / 10**

---

#### Backend Developer

Responsible for: the full server-side — 10 ASP.NET Core controllers, 9-table MySQL schema, Entity Framework Core migrations, JWT authentication, BCrypt password hashing, RBAC, IEmailService with SMTP email, secure file upload/download, ZIP export, and statistics endpoints.

The backend developer was the highest technical contributor on the team. All backend tasks in Sprints 1–3 were completed on time and to a high standard. Security design was consistently thoughtful — the anonymous author masking at the API layer (preventing leakage even through raw API inspection), file GUID renaming, and parameterised EF Core queries are all the right production-level choices. The one collaborative friction point was making schema and delete-behaviour decisions in isolation; a 15-minute sync at the start of Sprint 2 would have avoided a brief mismatch with frontend assumptions on user deactivation behaviour. Highest score on technical contribution and problem solving.

**Score: 8.60 / 10**

---

#### QA / Frontend Support

Responsible for: writing and executing the full test plan across all four user roles (60 test cases, 93.3% pass rate), logging defects with clear reproduction steps, and supporting responsive CSS work in Sprint 4.

The QA member's systematic testing added genuine confidence to the shipped product. The test matrix covered authentication, idea submission, files, voting, comments, role access control, data validation, performance benchmarks, and browser compatibility (cross-ref: `FRONTEND_AND_TESTING_REPORT_EN.md` Section 4.2). Defects were communicated clearly and promptly, enabling targeted fixes in the Sprint 4 bug-fix cycle. Communication and collaboration scores are the joint highest on the team. Technical contribution is appropriately lower given the QA-primary role, but more proactive identification of UI/UX issues earlier in the sprints — rather than waiting for the formal test phase — would have been valuable.

**Score: 7.60 / 10**

---

#### Product Owner / Scrum Master

Responsible for: product backlog creation and prioritisation, Sprint Planning and Review facilitation, Trello board maintenance, stakeholder liaison (module tutor), and overall team coordination.

The Product Owner kept the team aligned on priorities and made pragmatic scope decisions under time pressure — most notably deferring SMTP production configuration and dark mode to avoid blocking Sprint 3. Sprint ceremonies were run efficiently, and the Product Backlog (24 user stories, cross-ref: `Report.md` Section 2.4) was well-structured with clear priority and story-point assignments. Areas for improvement: the Trello board was inconsistently maintained between stand-ups, and retrospectives were informal and verbal rather than producing actionable written artefacts. Technical contribution was the lowest of the four members, which is appropriate for this role, but hands-on support during Sprint 4 bug-fixing would have been welcome. Tied for highest communication/collaboration score.

**Score: 7.40 / 10**

---

## 3. Self-Evaluation

### 3.1 Description of My Contribution

My role was **full frontend development** for the Student Idea Contribution System. I was the sole engineer responsible for the entire client-side of the application, covering:

**Project setup and architecture:**
I initialised the React 18 + TypeScript project using Vite (`frontend/` directory), configured TypeScript strict mode (`tsconfig.app.json`), set up ESLint (`eslint.config.js`), and established the folder structure and routing skeleton using React Router v6. All public and authenticated routes were defined in `App.tsx` with role-aware `PrivateRoute` wrappers.

**Authentication and API integration:**
I implemented `authService.ts` (login, register, logout, token persistence in `localStorage`) and `api.ts` (a configured Axios instance with request interceptors for Bearer token injection and response interceptors for 401 handling with automatic redirect to `/login`). This centralised API layer is used by every component in the application (cross-ref: `FRONTEND_AND_TESTING_REPORT_EN.md` Section 3.1 H).

**Core UI components (Sprint 2):**

| Component       | File(s)                            | Key responsibilities                                                                        |
| --------------- | ---------------------------------- | ------------------------------------------------------------------------------------------- |
| Dashboard       | `Dashboard.tsx`, `Dashboard.css`   | Paginated idea list, sorting, topic filter, overview stats                                  |
| Idea Submission | `IdeaForm.tsx`, `IdeaForm.css`     | Topic selector, deadline enforcement, file upload queue, T&C, anonymous toggle              |
| Idea Detail     | `IdeaDetail.tsx`, `IdeaDetail.css` | Full content view, anonymous masking, view-count increment, vote toggle, paginated comments |
| Topics          | `Topics.tsx`, `Topics.css`         | Topic list with deadline status, admin CRUD, search                                         |

**Admin Dashboard (Sprint 3):**
I built `AdminDashboard.tsx` and `AdminDashboard.css` — the most complex component in the application, combining user management CRUD (create/edit/deactivate/role-change), category management, system settings, CSV/ZIP export triggers, and a statistics panel with charts. The component conditionally renders sections based on the authenticated user's role (cross-ref: `ADMIN_DASHBOARD_GUIDE.md`).

**Navigation (Sprint 3):**
`NavBar.tsx` and `NavBar.css` provide the global navigation bar with role-based menu items (Staff sees Dashboard and My Ideas; QA Manager additionally sees the Admin Dashboard link; Administrator sees all links). The hamburger menu for mobile collapses the navigation on narrow viewports.

**Responsive CSS and bug fixes (Sprint 4):**
I applied responsive media queries across all component CSS files and fixed defects identified during QA testing, including the form-locking bug (deadline check not disabling all input fields) and a sorting dropdown reset issue on topic change.

In terms of Sprint Backlogs (cross-ref: `Report.md` Section 2.5), I was the primary assignee for tasks **T-007, T-008, T-009, T-010, T-019, T-020, T-021, T-022, T-028, T-030, T-031** — covering all frontend development tasks across Sprints 1–4, totalling approximately **57 of the 142 story points** (40%).

---

### 3.2 Reflection on Performance

**What I did well:**

I delivered all core UI components in a state where they correctly integrated with the backend API. The IdeaForm component — the most complex frontend feature — handles the full submission flow including multi-file upload with type/size validation, deadline detection and form locking, anonymous toggle, and T&C enforcement. All file-upload and deadline test cases passed (cross-ref: `FRONTEND_TESTER_REPORT.md`). I am also satisfied with the API service layer design: centralising Axios configuration in a single `api.ts` module meant that token handling, base URL, and error interception were consistent across all 30+ API calls in the application.

The role-based UI worked correctly from the first integration test — Staff users cannot see Admin navigation items, cannot reach `/admin` via direct URL, and receive clear 403 feedback when attempting restricted API calls. Building role-awareness into the routing and navigation early in Sprint 1 prevented a class of access-control bugs that are common when RBAC is added retroactively.

**Where I fell short:**

The most significant gap is the **incomplete responsive CSS**. I underestimated the effort required to make the admin dashboard and statistics charts fully responsive on mobile. The dashboard card grid uses fixed pixel widths that break below 480 px, and the bar charts overflow their container on small screens. This was identified by QA in Sprint 4 (cross-ref: `FRONTEND_AND_TESTING_REPORT_EN.md` Section 3.2) but was not fully resolved before submission.

My **time estimation was consistently optimistic**. IdeaForm was estimated at 8 hours but took approximately 13. AdminDashboard was estimated at 12 hours and took closer to 18 once the user management table, role-change logic, chart integration, and export triggers were all complete. Better techniques — breaking tasks to a finer granularity, or applying a 40% complexity buffer — would have produced more accurate estimates.

I also relied on the QA member to discover accessibility issues rather than building accessibility practices into my development workflow. All interactive elements have visible focus states, but ARIA labels, landmark roles, and keyboard navigation for the file upload zone and modal dialogs are incomplete.

---

### 3.3 Lessons Learnt

**1. Agree API contracts in writing before building components.**
The most productive integration sessions happened when the backend developer and I had already agreed on the exact JSON response shape (field names, types, nullable vs. non-nullable) before I started building the consuming component. When this was skipped — most notably for the statistics endpoints in Sprint 3 — I built the chart component against an assumed shape that differed from the actual response, requiring a refactor mid-sprint. In future projects I would maintain a simple shared API contract document (even a JSON example file) that both sides sign off on before development begins.

**2. Treat responsive design as a core requirement, not a finishing step.**
I built all components desktop-first and planned to add responsive CSS in Sprint 4. This left too little time to properly handle complex layouts (statistics charts, admin tables). A mobile-first approach from Sprint 2 onwards — designing the narrow-viewport layout first and expanding to desktop — would have produced better results without requiring a dedicated Sprint 4 pass.

**3. Break large component estimates into sub-tasks.**
Estimating "Build AdminDashboard" at 12 hours treats a complex multi-section page as a single unit. Breaking it into "User management table (4h)", "Category management (3h)", "Statistics charts (4h)", "Export buttons (2h)" produces more accurate totals and reveals hidden complexity early. This is standard practice in mature Scrum teams but I did not apply it consistently.

**4. Validate accessibility incrementally.**
Retrofitting ARIA labels and keyboard navigation at the end of the project is harder than adding them during initial component development. In future I will use the axe DevTools browser extension during component development as a lightweight real-time accessibility linter, catching issues at the point of creation rather than at the QA stage.

**5. Centralised state management is worth the setup cost for medium-complexity SPAs.**
Managing authentication state, the current user object, and shared topic/category data via prop-drilling between components created several unnecessary re-render issues and made component tests harder to write. A lightweight global state solution (React Context with `useReducer`, or Zustand) would have simplified data flow significantly. I will adopt this pattern from the start in future React projects of similar scale.
