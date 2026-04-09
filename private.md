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

#### 1.1.2 Key Feature Walkthroughs

- **Screenshot 1 – Login Page (Cross-ref: Report.md 4.2):** Clean JWT-based authentication via `AuthController.cs`. Future improvement: add a "remember me" feature and account lockout.
- **Screenshot 2 – Staff Dashboard:** Paginated idea list implemented via `page` query parameters in `IdeaController.cs`. Card layout stacks well, though sub-480px mobile responsiveness requires improvement.
- **Screenshot 3 – Idea Submission:** High security with dual-layer topic deadline validation (client + server). Safe file attachments through whitelisting and 10MB caps enforced in `DocumentController.cs`.
- **Screenshot 4 – Idea Detail:** API-level anonymity enforcement. `AuthorId` is nullified via LINQ projection before serialization. Functional comment thread, though missing nested replies.
- **Screenshot 5 – Admin Dashboard:** Summarises stats via `StatisticsController.cs`. Secure data export (CSV/ZIP) correctly gated behind the `CommentDeadline` passing.

#### 1.1.3 Overall Product Assessment

- **Strengths:** Met all high-priority requirements; strong security (JWT, BCrypt, RBAC, parameterised queries); accurate dual-deadline logic; reliable exports.
- **Gaps:** Production SMTP not configured; sub-480px CSS incomplete; lacking automated tests (xUnit); no JWT refresh mechanism.

---

### 1.2 Process Evaluation

#### 1.2.1 Agile Scrum Process

The team adopted the **Scrum** framework, delivering 142 story points across four two-week sprints.

- **What worked well:** Short sprint cycles made scope creep visible early (e.g. SMTP config deferment). Daily Discord stand-ups quickly resolved blockers like circular JSON serialisation within 24 hours.
- **What could improve:** Initial story-point estimates using Fibonacci points lacked reference stories, causing Sprint 1 spillover. Retrospectives were informal; a structured framework would have made process improvement deliberate.

#### 1.2.2 Design Methods

- **Entity Relationship Diagram (ERD):** A 9-table schema was established in Sprint 1 (`relation.md`). This upfront design prevented integration issues (e.g. consistently saving `AuthorId` even anonymously).
- **Layered Architecture:** Kept concerns separated across Controllers, AppDbContext, and MySQL, allowing services like `IEmailService` to be logically decoupled.

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

- **Role:** Full backend API, DB schema (EF Core), auth/RBAC, file I/O, email service, statistics.
- **Strengths:** Delivered tasks on time. Implemented high-security features (anonymous masking, deadline enforcement, path traversal prevention) effectively.
- **Areas to Improve:** Made isolated design decisions (e.g., cascade-delete strategies) without consulting the frontend developer, causing minor integration friction.
- **Score: 84%**

#### Frontend Developer

- **Role:** React/TS components, Axios integration, route protection, and CSS styling.
- **Strengths:** Handled the complex idea submission flow accurately. Built a well-structured UI that connected smoothly to all API endpoints.
- **Areas to Improve:** Admin dashboard chart integration in Sprint 3 took longer than estimated, requiring scope adjustment.
- **Score: 77%**

#### QA / Frontend Support

- **Role:** Test planning/execution, logging defects, CSS responsiveness fixes.
- **Strengths:** Systematic test coverage directly enabled targeted bug fixing. Outstanding communication—actively relayed defects with clear reproduction steps.
- **Areas to Improve:** Technical code contribution was naturally lower given the QA focus, but fulfilled the required role effectively.
- **Score: 76%**

#### Product Owner / Scrum Master

- **Role:** Backlog prioritization, Sprint facilitation, Trello management.
- **Strengths:** Kept the team focused; made smart scope trade-offs (e.g., deferring SMTP to hit the Sprint 3 goal).
- **Areas to Improve:** Retrospectives lacked formal structure. More hands-on code support during bug fixing would have been beneficial.
- **Score: 74%**

---

## 3. Self-Evaluation

### 3.1 Description of My Contribution

My role in this project was **full backend development**. I was the sole engineer responsible for the server-side of the system, which encompasses approximate 62% of project story points (88 of 142 points):

- **Database Design:** Created a full 9-table schema with EF Core migrations, utilizing `DeleteBehavior.Restrict` defensively and composite constraints for voting integrity (cross-ref: `relation.md`, `AppDbContext.cs`).
- **Auth & Security:** Implemented JWT Bearer auth, BCrypt hashing, file whitelisting, preventing SQL injection via parameterized queries, and API-layer anonymous author masking.
- **API Controllers:** Built 10 controllers (Idea, Comment, Document, Admin, Statistics, etc.) managing thorough CRUD operations, pagination, file I/O, and system analytics.
- **Services:** Decoupled and built extensible email notifications via `IEmailService`.

---

### 3.2 Reflection on Performance

**What I did well:**

- The backend API was sufficiently robust and ready by Sprint 3. Security configurations were integrated tightly from day one, rather than deferred.
- The anonymous identity masking—handled comprehensively via LINQ projections across all API endpoints—worked flawlessly and prevented identity leaks to non-admin users.

**Where I fell short:**

- Made isolated, siloed design choices (such as cascading delete restrictions) without discussing thoroughly with frontend developers early on, leading to minor integration friction.
- Underestimated complex external integrations (the ZIP export module required almost double the estimated timeframe). Failed to integrate automated software testing scripts (e.g. xUnit), depending rather on manual QA reviews.

---

### 3.3 Lessons Learnt

1. **Communicate Architecture Early:** Backend schema strategies uniquely influence frontend behaviors. Create brief Architecture Decision Records (ADRs) to align the entire team structurally.
2. **Buffer Integrations:** Enhance padding estimates by 30-40% specifically tailored toward tasks handling data I/O or external systems integration complexity.
3. **Test-First for Core Logic:** Manual QA remains vulnerable for high-risk mechanisms (deadline enforcement, privacy masking). Automated unit test cases must be integrated.
4. **Define 'Done' strictly:** Skipping SMTP setup pushed the feature into a 'development-only' state. Defining a resolute "Definition of Done", demanding verified integration testing, forces actualization.
5. **Value of Abstraction:** Utilizing interfaces (like `IEmailService`) strictly decoupled software modules, minimizing disruption during potential refactoring. I will enforce Dependency Injection rigorously across future environments.
