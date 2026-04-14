-- Clear existing database first
DROP DATABASE IF EXISTS comp1640_ideahub;
CREATE DATABASE comp1640_ideahub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE comp1640_ideahub;

-- ============================================
-- Table: Departments
-- ============================================
CREATE TABLE Departments (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Code VARCHAR(50) NOT NULL UNIQUE,
    QACoordinatorId INT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY UK_Department_Name (Name)
) ENGINE=InnoDB;

-- ============================================
-- Table: Users
-- ============================================
CREATE TABLE Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('Staff', 'QACoordinator', 'QAManager', 'Administrator') NOT NULL DEFAULT 'Staff',
    DepartmentId INT NULL,
    StudentId VARCHAR(50) NULL,
    AgreedTerms BOOLEAN NOT NULL DEFAULT FALSE,
    AgreedTermsDate DATETIME NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    
    INDEX IX_Users_Email (Email),
    INDEX IX_Users_DepartmentId (DepartmentId),
    INDEX IX_Users_Role (Role),
    
    CONSTRAINT FK_Users_Department 
        FOREIGN KEY (DepartmentId) 
        REFERENCES Departments(Id) 
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Add QACoordinator foreign key to Departments
ALTER TABLE Departments 
    ADD CONSTRAINT FK_Departments_QACoordinator 
    FOREIGN KEY (QACoordinatorId) 
    REFERENCES Users(Id) 
    ON DELETE SET NULL;

-- ============================================
-- Table: Topics
-- ============================================
CREATE TABLE Topics (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Description TEXT,
    IdeaSubmissionDeadline DATETIME NOT NULL,
    CommentDeadline DATETIME NOT NULL,
    CreatedById INT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    
    INDEX IX_Topics_IsActive (IsActive),
    INDEX IX_Topics_CreatedById (CreatedById),
    
    CONSTRAINT FK_Topics_CreatedBy 
        FOREIGN KEY (CreatedById) 
        REFERENCES Users(Id) 
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================
-- Table: Categories
-- ============================================
CREATE TABLE Categories (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(500),
    TopicId INT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX IX_Categories_TopicId (TopicId),
    UNIQUE KEY UK_Categories_TopicName (TopicId, Name),
    
    CONSTRAINT FK_Categories_Topic 
        FOREIGN KEY (TopicId) 
        REFERENCES Topics(Id) 
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- Table: Ideas
-- ============================================
CREATE TABLE Ideas (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Content TEXT NOT NULL,
    IsAnonymous BOOLEAN NOT NULL DEFAULT FALSE,
    ApprovalStatus INT NOT NULL DEFAULT 0 COMMENT '0=Pending, 1=Approved, 2=Rejected',
    ReviewedById INT NULL,
    ReviewedAt DATETIME NULL,
    RejectionReason TEXT NULL,
    Attachments TEXT NULL COMMENT 'Comma-separated list of attachment filenames',
    AuthorId INT NOT NULL,
    TopicId INT NOT NULL,
    CategoryId INT NOT NULL,
    DepartmentId INT NULL,
    ViewCount INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX IX_Ideas_AuthorId (AuthorId),
    INDEX IX_Ideas_TopicId (TopicId),
    INDEX IX_Ideas_CategoryId (CategoryId),
    INDEX IX_Ideas_DepartmentId (DepartmentId),
    INDEX IX_Ideas_CreatedAt (CreatedAt DESC),
    INDEX IX_Ideas_ViewCount (ViewCount DESC),
    
    CONSTRAINT FK_Ideas_Author 
        FOREIGN KEY (AuthorId) 
        REFERENCES Users(Id) 
        ON DELETE RESTRICT,
    CONSTRAINT FK_Ideas_Topic 
        FOREIGN KEY (TopicId) 
        REFERENCES Topics(Id) 
        ON DELETE CASCADE,
    CONSTRAINT FK_Ideas_Category 
        FOREIGN KEY (CategoryId) 
        REFERENCES Categories(Id) 
        ON DELETE RESTRICT,
    CONSTRAINT FK_Ideas_Department 
        FOREIGN KEY (DepartmentId) 
        REFERENCES Departments(Id) 
        ON DELETE RESTRICT,
    CONSTRAINT FK_Ideas_ReviewedBy
        FOREIGN KEY (ReviewedById)
        REFERENCES Users(Id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- Table: Documents
-- ============================================
CREATE TABLE Documents (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    IdeaId INT NOT NULL,
    FileName VARCHAR(255) NOT NULL,
    FilePath VARCHAR(500) NOT NULL,
    FileSize BIGINT NOT NULL,
    MimeType VARCHAR(100) NOT NULL,
    UploadedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX IX_Documents_IdeaId (IdeaId),
    
    CONSTRAINT FK_Documents_Idea 
        FOREIGN KEY (IdeaId) 
        REFERENCES Ideas(Id) 
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- Table: Comments
-- ============================================
CREATE TABLE Comments (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Content VARCHAR(1000) NOT NULL,
    IsAnonymous BOOLEAN NOT NULL DEFAULT FALSE,
    AuthorId INT NOT NULL,
    IdeaId INT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX IX_Comments_IdeaId (IdeaId),
    INDEX IX_Comments_AuthorId (AuthorId),
    INDEX IX_Comments_CreatedAt (CreatedAt DESC),
    
    CONSTRAINT FK_Comments_Author 
        FOREIGN KEY (AuthorId) 
        REFERENCES Users(Id) 
        ON DELETE RESTRICT,
    CONSTRAINT FK_Comments_Idea 
        FOREIGN KEY (IdeaId) 
        REFERENCES Ideas(Id) 
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- Table: Reactions
-- ============================================
CREATE TABLE Reactions (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    IsThumbsUp BOOLEAN NOT NULL,
    UserId INT NOT NULL,
    IdeaId INT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX IX_Reactions_IdeaId (IdeaId),
    INDEX IX_Reactions_UserId (UserId),
    UNIQUE KEY UK_Reactions_UserIdea (UserId, IdeaId),
    
    CONSTRAINT FK_Reactions_User 
        FOREIGN KEY (UserId) 
        REFERENCES Users(Id) 
        ON DELETE RESTRICT,
    CONSTRAINT FK_Reactions_Idea 
        FOREIGN KEY (IdeaId) 
        REFERENCES Ideas(Id) 
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- Table: SystemSettings
-- ============================================
CREATE TABLE SystemSettings (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    SettingKey VARCHAR(100) NOT NULL UNIQUE,
    SettingValue TEXT,
    Description VARCHAR(500),
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy INT NULL,
    
    INDEX IX_SystemSettings_Key (SettingKey),
    
    CONSTRAINT FK_SystemSettings_UpdatedBy 
        FOREIGN KEY (UpdatedBy) 
        REFERENCES Users(Id) 
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- Insert Departments
-- ============================================
INSERT INTO Departments (Id, Name, Code, CreatedAt) VALUES
(1, 'Computer Science', 'CS', NOW()),
(2, 'Business Administration', 'BA', NOW()),
(3, 'Engineering', 'ENG', NOW()),
(4, 'Arts & Design', 'AD', NOW()),
(5, 'Science', 'NS', NOW());

-- ============================================
-- Insert Admin Users
-- ============================================
-- Password for all users: password123
-- BCrypt hash of "password123": $2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO
INSERT INTO Users (Id, FullName, Email, PasswordHash, Role, DepartmentId, AgreedTerms, AgreedTermsDate, CreatedAt, IsActive) VALUES
(1, 'System Administrator', 'admin@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Administrator', 1, TRUE, NOW(), NOW(), TRUE),
(2, 'QA Manager', 'qamanager@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'QAManager', 1, TRUE, NOW(), NOW(), TRUE),
(3, 'QA Coordinator', 'coordinator@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'QACoordinator', 2, TRUE, NOW(), NOW(), TRUE),
(4, 'John Doe', 'john@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 1, TRUE, NOW(), NOW(), TRUE),
(5, 'Jane Smith', 'jane@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 2, TRUE, NOW(), NOW(), TRUE);

-- ============================================
-- Insert Sample Topic
-- ============================================
INSERT INTO Topics (Id, Name, Description, IdeaSubmissionDeadline, CommentDeadline, CreatedById, CreatedAt, IsActive) VALUES
(1, 'Innovation Ideas 2025', 'Share your innovative ideas for 2025', DATE_ADD(NOW(), INTERVAL 30 DAY), DATE_ADD(NOW(), INTERVAL 45 DAY), 1, NOW(), TRUE);

-- ============================================
-- Insert Sample Categories
-- ============================================
INSERT INTO Categories (Id, Name, Description, TopicId, CreatedAt) VALUES
(1, 'Technology', 'Technology and IT innovations', 1, NOW()),
(2, 'Sustainability', 'Sustainability and environmental initiatives', 1, NOW()),
(3, 'Education', 'Education and learning improvements', 1, NOW()),
(4, 'Other', 'Other ideas and suggestions', 1, NOW());
