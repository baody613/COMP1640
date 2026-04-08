# Database Relationship Schema — COMP1640 IdeaHub

## Bảng & Quan hệ

| Table              | Columns chính                                                                                                            | Quan hệ                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| **Departments**    | `Id` PK, `Name`, `Code`, `QACoordinatorId` FK                                                                            | → Users (QACoordinator)                  |
| **Users**          | `Id` PK, `FullName`, `Email`, `PasswordHash`, `Role`, `DepartmentId` FK, `IsActive`                                      | → Departments                            |
| **Topics**         | `Id` PK, `Name`, `IdeaSubmissionDeadline`, `CommentDeadline`, `CreatedById` FK, `IsActive`                               | → Users (creator)                        |
| **Categories**     | `Id` PK, `Name`, `Description`, `TopicId` FK                                                                             | → Topics (CASCADE DELETE)                |
| **Ideas**          | `Id` PK, `Title`, `Content`, `IsAnonymous`, `AuthorId` FK, `TopicId` FK, `CategoryId` FK, `DepartmentId` FK, `ViewCount` | → Users, Topics, Categories, Departments |
| **Documents**      | `Id` PK, `IdeaId` FK, `FileName`, `FilePath`, `FileSize`, `MimeType`                                                     | → Ideas (CASCADE DELETE)                 |
| **Comments**       | `Id` PK, `Content`, `IsAnonymous`, `AuthorId` FK, `IdeaId` FK                                                            | → Users, Ideas (CASCADE DELETE)          |
| **Reactions**      | `Id` PK, `IsThumbsUp`, `UserId` FK, `IdeaId` FK                                                                          | → Users, Ideas (CASCADE DELETE)          |
| **SystemSettings** | `Id` PK, `SettingKey` UNIQUE, `SettingValue`, `UpdatedBy` FK                                                             | → Users                                  |

---

## Sơ đồ quan hệ (ERD)

```
Departments ──────────────────────────────────────────┐
  │ Id (PK)                                           │
  │ QACoordinatorId ──→ Users.Id (SET NULL)           │
  └──────────────────────────────────────────────────┘
         │ 1
         │
         │ N
       Users
         │ Id (PK)
         │ DepartmentId ──→ Departments.Id
         │ Role: Staff | QACoordinator | QAManager | Administrator
         │
    ┌────┴──────────────────────────────────────┐
    │                                           │
    │ (CreatedById)                             │ (AuthorId / UserId)
    ▼                                           ▼
  Topics ──────────────────────────────→ Ideas  ←──── Categories
    │ Id (PK)                             │ Id (PK)        │ Id (PK)
    │ IdeaSubmissionDeadline              │ AuthorId FK     │ TopicId FK
    │ CommentDeadline                     │ TopicId FK      │
    │                                     │ CategoryId FK   │
    │ 1──→N Categories                    │ DepartmentId FK │
    └─────────────────────────────────────┘                 │
                                          │                 │
                         ┌────────────────┤                 │
                         │                │                 │
                         ▼                ▼                 │
                     Documents        Comments              │
                     (N:1 → Ideas)    (N:1 → Ideas)         │
                                          │                 │
                                          ▼                 │
                                      Reactions             │
                                      (N:1 → Ideas)         │
                                      UNIQUE(UserId,IdeaId) │

SystemSettings
  UpdatedBy FK ──→ Users.Id
```

---

## Chi tiết từng bảng

### Departments

```sql
CREATE TABLE Departments (
    Id               INT AUTO_INCREMENT PRIMARY KEY,
    Name             VARCHAR(100) NOT NULL UNIQUE,
    Code             VARCHAR(50)  NOT NULL UNIQUE,
    QACoordinatorId  INT NULL,
    CreatedAt        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Departments_QACoordinator
        FOREIGN KEY (QACoordinatorId) REFERENCES Users(Id) ON DELETE SET NULL
);
```

### Users

```sql
CREATE TABLE Users (
    Id            INT AUTO_INCREMENT PRIMARY KEY,
    FullName      VARCHAR(100) NOT NULL,
    Email         VARCHAR(150) NOT NULL UNIQUE,
    PasswordHash  VARCHAR(255) NOT NULL,
    Role          ENUM('Staff','QACoordinator','QAManager','Administrator') NOT NULL DEFAULT 'Staff',
    DepartmentId  INT NULL,
    AgreedTerms   BOOLEAN NOT NULL DEFAULT FALSE,
    AgreedTermsDate DATETIME NULL,
    CreatedAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt     DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    IsActive      BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT FK_Users_Department
        FOREIGN KEY (DepartmentId) REFERENCES Departments(Id) ON DELETE RESTRICT
);
```

### Topics

```sql
CREATE TABLE Topics (
    Id                       INT AUTO_INCREMENT PRIMARY KEY,
    Name                     VARCHAR(200) NOT NULL,
    Description              TEXT,
    IdeaSubmissionDeadline   DATETIME NOT NULL,
    CommentDeadline          DATETIME NOT NULL,
    CreatedById              INT NOT NULL,
    CreatedAt                DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    IsActive                 BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT FK_Topics_CreatedBy
        FOREIGN KEY (CreatedById) REFERENCES Users(Id) ON DELETE RESTRICT
);
```

### Categories

```sql
CREATE TABLE Categories (
    Id          INT AUTO_INCREMENT PRIMARY KEY,
    Name        VARCHAR(100) NOT NULL,
    Description VARCHAR(500),
    TopicId     INT NOT NULL,
    CreatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY UK_Categories_TopicName (TopicId, Name),
    CONSTRAINT FK_Categories_Topic
        FOREIGN KEY (TopicId) REFERENCES Topics(Id) ON DELETE CASCADE
);
```

### Ideas

```sql
CREATE TABLE Ideas (
    Id           INT AUTO_INCREMENT PRIMARY KEY,
    Title        VARCHAR(200) NOT NULL,
    Content      TEXT NOT NULL,
    IsAnonymous  BOOLEAN NOT NULL DEFAULT FALSE,
    AuthorId     INT NOT NULL,
    TopicId      INT NOT NULL,
    CategoryId   INT NOT NULL,
    DepartmentId INT NULL,
    ViewCount    INT NOT NULL DEFAULT 0,
    CreatedAt    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt    DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_Ideas_Author     FOREIGN KEY (AuthorId)     REFERENCES Users(Id)       ON DELETE RESTRICT,
    CONSTRAINT FK_Ideas_Topic      FOREIGN KEY (TopicId)      REFERENCES Topics(Id)      ON DELETE CASCADE,
    CONSTRAINT FK_Ideas_Category   FOREIGN KEY (CategoryId)   REFERENCES Categories(Id)  ON DELETE RESTRICT,
    CONSTRAINT FK_Ideas_Department FOREIGN KEY (DepartmentId) REFERENCES Departments(Id) ON DELETE RESTRICT
);
```

### Documents

```sql
CREATE TABLE Documents (
    Id          INT AUTO_INCREMENT PRIMARY KEY,
    IdeaId      INT NOT NULL,
    FileName    VARCHAR(255) NOT NULL,
    FilePath    VARCHAR(500) NOT NULL,
    FileSize    BIGINT NOT NULL,
    MimeType    VARCHAR(100) NOT NULL,
    UploadedAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Documents_Idea
        FOREIGN KEY (IdeaId) REFERENCES Ideas(Id) ON DELETE CASCADE
);
```

### Comments

```sql
CREATE TABLE Comments (
    Id          INT AUTO_INCREMENT PRIMARY KEY,
    Content     VARCHAR(1000) NOT NULL,
    IsAnonymous BOOLEAN NOT NULL DEFAULT FALSE,
    AuthorId    INT NOT NULL,
    IdeaId      INT NOT NULL,
    CreatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt   DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_Comments_Author FOREIGN KEY (AuthorId) REFERENCES Users(Id)  ON DELETE RESTRICT,
    CONSTRAINT FK_Comments_Idea   FOREIGN KEY (IdeaId)   REFERENCES Ideas(Id)  ON DELETE CASCADE
);
```

### Reactions

```sql
CREATE TABLE Reactions (
    Id          INT AUTO_INCREMENT PRIMARY KEY,
    IsThumbsUp  BOOLEAN NOT NULL,
    UserId      INT NOT NULL,
    IdeaId      INT NOT NULL,
    CreatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY UK_Reactions_UserIdea (UserId, IdeaId),
    CONSTRAINT FK_Reactions_User FOREIGN KEY (UserId) REFERENCES Users(Id)  ON DELETE RESTRICT,
    CONSTRAINT FK_Reactions_Idea FOREIGN KEY (IdeaId) REFERENCES Ideas(Id)  ON DELETE CASCADE
);
```

### SystemSettings

```sql
CREATE TABLE SystemSettings (
    Id           INT AUTO_INCREMENT PRIMARY KEY,
    SettingKey   VARCHAR(100) NOT NULL UNIQUE,
    SettingValue TEXT,
    Description  VARCHAR(500),
    UpdatedAt    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy    INT NULL,
    CONSTRAINT FK_SystemSettings_UpdatedBy
        FOREIGN KEY (UpdatedBy) REFERENCES Users(Id) ON DELETE SET NULL
);
```

---

## Cascade Rules

| Quan hệ                             | Hành động khi xóa parent                                |
| ----------------------------------- | ------------------------------------------------------- |
| Topics → Categories                 | **CASCADE** — xóa hết categories theo topic             |
| Topics → Ideas                      | **CASCADE** — xóa hết ideas theo topic                  |
| Ideas → Documents                   | **CASCADE** — xóa hết file đính kèm                     |
| Ideas → Comments                    | **CASCADE** — xóa hết bình luận                         |
| Ideas → Reactions                   | **CASCADE** — xóa hết reactions                         |
| Users → Ideas                       | **RESTRICT** — không cho xóa user nếu còn idea          |
| Users → Comments                    | **RESTRICT** — không cho xóa user nếu còn comment       |
| Departments → Users                 | **RESTRICT** — không cho xóa dept nếu còn user          |
| Users → Departments (QACoordinator) | **SET NULL** — xóa user thì dept.QACoordinatorId = NULL |
| Users → SystemSettings (UpdatedBy)  | **SET NULL**                                            |

---

## Cardinality tóm tắt

| Bảng A      | Quan hệ | Bảng B                |
| ----------- | ------- | --------------------- |
| Departments | 1 : N   | Users                 |
| Departments | 1 : 1   | Users (QACoordinator) |
| Users       | 1 : N   | Topics (CreatedById)  |
| Users       | 1 : N   | Ideas (AuthorId)      |
| Users       | 1 : N   | Comments (AuthorId)   |
| Users       | 1 : N   | Reactions (UserId)    |
| Topics      | 1 : N   | Categories            |
| Topics      | 1 : N   | Ideas                 |
| Categories  | 1 : N   | Ideas                 |
| Ideas       | 1 : N   | Documents             |
| Ideas       | 1 : N   | Comments              |
| Ideas       | 1 : N   | Reactions             |
