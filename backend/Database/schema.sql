-- ============================================
-- COMP1640 - Student Idea Contribution System
-- MySQL Database Schema
-- ============================================

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
-- Table: Topics (Academic Year/Collection Period)
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
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================
-- Table: Documents (File Uploads)
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
-- Table: Reactions (Thumbs Up/Down)
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
-- Views for Statistics
-- ============================================

-- View: Idea Statistics with Vote Counts
CREATE VIEW vw_IdeaStatistics AS
SELECT 
    i.Id,
    i.Title,
    i.AuthorId,
    i.DepartmentId,
    i.TopicId,
    i.CategoryId,
    i.ViewCount,
    i.CreatedAt,
    COUNT(DISTINCT c.Id) AS CommentCount,
    COUNT(DISTINCT CASE WHEN r.IsThumbsUp = 1 THEN r.Id END) AS ThumbsUpCount,
    COUNT(DISTINCT CASE WHEN r.IsThumbsUp = 0 THEN r.Id END) AS ThumbsDownCount,
    (COUNT(DISTINCT CASE WHEN r.IsThumbsUp = 1 THEN r.Id END) - 
     COUNT(DISTINCT CASE WHEN r.IsThumbsUp = 0 THEN r.Id END)) AS PopularityScore
FROM Ideas i
LEFT JOIN Comments c ON i.Id = c.IdeaId
LEFT JOIN Reactions r ON i.Id = r.IdeaId
GROUP BY i.Id, i.Title, i.AuthorId, i.DepartmentId, i.TopicId, i.CategoryId, i.ViewCount, i.CreatedAt;

-- View: Department Statistics
CREATE VIEW vw_DepartmentStatistics AS
SELECT 
    d.Id AS DepartmentId,
    d.Name AS DepartmentName,
    COUNT(DISTINCT u.Id) AS StaffCount,
    COUNT(DISTINCT i.Id) AS IdeaCount,
    COUNT(DISTINCT c.Id) AS CommentCount,
    COALESCE(SUM(i.ViewCount), 0) AS TotalViews
FROM Departments d
LEFT JOIN Users u ON d.Id = u.DepartmentId
LEFT JOIN Ideas i ON d.Id = i.DepartmentId
LEFT JOIN Comments c ON i.Id = c.IdeaId
GROUP BY d.Id, d.Name;

-- ============================================
-- Stored Procedures
-- ============================================

DELIMITER //

-- Get Most Popular Ideas
CREATE PROCEDURE sp_GetMostPopularIdeas(
    IN p_TopicId INT,
    IN p_PageNumber INT,
    IN p_PageSize INT
)
BEGIN
    DECLARE v_Offset INT;
    SET v_Offset = (p_PageNumber - 1) * p_PageSize;
    
    SELECT 
        i.*,
        u.FullName AS AuthorName,
        c.Name AS CategoryName,
        d.Name AS DepartmentName,
        vs.CommentCount,
        vs.ThumbsUpCount,
        vs.ThumbsDownCount,
        vs.PopularityScore
    FROM Ideas i
    INNER JOIN Users u ON i.AuthorId = u.Id
    INNER JOIN Categories c ON i.CategoryId = c.Id
    LEFT JOIN Departments d ON i.DepartmentId = d.Id
    LEFT JOIN vw_IdeaStatistics vs ON i.Id = vs.Id
    WHERE i.TopicId = p_TopicId
    ORDER BY vs.PopularityScore DESC, i.CreatedAt DESC
    LIMIT p_PageSize OFFSET v_Offset;
END //

-- Get Most Viewed Ideas
CREATE PROCEDURE sp_GetMostViewedIdeas(
    IN p_TopicId INT,
    IN p_PageNumber INT,
    IN p_PageSize INT
)
BEGIN
    DECLARE v_Offset INT;
    SET v_Offset = (p_PageNumber - 1) * p_PageSize;
    
    SELECT 
        i.*,
        u.FullName AS AuthorName,
        c.Name AS CategoryName,
        d.Name AS DepartmentName,
        vs.CommentCount,
        vs.ThumbsUpCount,
        vs.ThumbsDownCount,
        vs.PopularityScore
    FROM Ideas i
    INNER JOIN Users u ON i.AuthorId = u.Id
    INNER JOIN Categories c ON i.CategoryId = c.Id
    LEFT JOIN Departments d ON i.DepartmentId = d.Id
    LEFT JOIN vw_IdeaStatistics vs ON i.Id = vs.Id
    WHERE i.TopicId = p_TopicId
    ORDER BY i.ViewCount DESC, i.CreatedAt DESC
    LIMIT p_PageSize OFFSET v_Offset;
END //

-- Get Latest Ideas
CREATE PROCEDURE sp_GetLatestIdeas(
    IN p_TopicId INT,
    IN p_PageNumber INT,
    IN p_PageSize INT
)
BEGIN
    DECLARE v_Offset INT;
    SET v_Offset = (p_PageNumber - 1) * p_PageSize;
    
    SELECT 
        i.*,
        u.FullName AS AuthorName,
        c.Name AS CategoryName,
        d.Name AS DepartmentName,
        vs.CommentCount,
        vs.ThumbsUpCount,
        vs.ThumbsDownCount,
        vs.PopularityScore
    FROM Ideas i
    INNER JOIN Users u ON i.AuthorId = u.Id
    INNER JOIN Categories c ON i.CategoryId = c.Id
    LEFT JOIN Departments d ON i.DepartmentId = d.Id
    LEFT JOIN vw_IdeaStatistics vs ON i.Id = vs.Id
    WHERE i.TopicId = p_TopicId
    ORDER BY i.CreatedAt DESC
    LIMIT p_PageSize OFFSET v_Offset;
END //

DELIMITER ;

-- ============================================
-- Initial Data
-- ============================================

-- Insert default system settings
INSERT INTO SystemSettings (SettingKey, SettingValue, Description) VALUES
('CurrentAcademicYear', '2025-2026', 'Current academic year'),
('EnableEmailNotifications', 'true', 'Enable/disable email notifications'),
('MaxFileUploadSize', '10485760', 'Maximum file upload size in bytes (10MB)'),
('AllowedFileTypes', '.pdf,.doc,.docx,.jpg,.jpeg,.png,.zip', 'Allowed file upload types');

-- Insert sample departments
INSERT INTO Departments (Name, Code) VALUES
('Computer Science', 'CS'),
('Business Administration', 'BA'),
('Engineering', 'ENG'),
('Arts and Design', 'AD'),
('Natural Sciences', 'NS');

-- Insert Administrator account
-- Password: Admin@123 (hashed with BCrypt)
INSERT INTO Users (FullName, Email, PasswordHash, Role, AgreedTerms, AgreedTermsDate) VALUES
('System Administrator', 'admin@university.edu', '$2a$11$XwM8RJPBxqRy.jE5vLJLdeQZ6vN1E6rVYxKwJjRVvS8CQ9JbUP7vC', 'Administrator', TRUE, NOW());

-- Insert QA Manager account  
-- Password: QAManager@123
INSERT INTO Users (FullName, Email, PasswordHash, Role, AgreedTerms, AgreedTermsDate) VALUES
('QA Manager', 'qamanager@university.edu', '$2a$11$XwM8RJPBxqRy.jE5vLJLdeQZ6vN1E6rVYxKwJjRVvS8CQ9JbUP7vC', 'QAManager', TRUE, NOW());

-- Insert Staff account
-- Password: password123
INSERT INTO Users (FullName, Email, PasswordHash, Role, DepartmentId, AgreedTerms, AgreedTermsDate) VALUES
('John Doe', 'john@university.edu', '$2a$11$8GvBJz9VX4qYq5T1kZXLmefL.p3yKYYR9.cOLKLvZJqVvJqWXqD8O', 'Staff', 1, TRUE, NOW());

-- Insert Topic
INSERT INTO Topics (Name, Description, IdeaSubmissionDeadline, CommentDeadline, CreatedById, IsActive, CreatedAt) VALUES
('Nâng cao trải nghiệm sinh viên toàn trường', 
 'Thu thập các ý tưởng từ nhân viên (giảng viên và nhân viên hỗ trợ) nhằm cải thiện chất lượng dịch vụ, môi trường học tập, cơ sở vật chất, quy trình hành chính và hỗ trợ học tập cho sinh viên.',
 '2026-06-30 23:59:59',
 '2026-07-31 23:59:59',
 2,
 TRUE,
 NOW());

-- Insert Categories for Topic 1
INSERT INTO Categories (Name, Description, TopicId, CreatedAt) VALUES
('Công nghệ & Cơ sở vật chất', 'Ý tưởng về cải thiện trang thiết bị, phòng lab, wifi, thiết bị học tập', 1, NOW()),
('Môi trường học tập', 'Ý tưởng về không gian học tập, thư viện, khu tự học, không gian xanh', 1, NOW()),
('Dịch vụ sinh viên', 'Ý tưởng về hỗ trợ sinh viên, tư vấn học tập, câu lạc bộ, hoạt động ngoại khóa', 1, NOW()),
('Quy trình hành chính', 'Ý tưởng về đơn giản hóa thủ tục, online services, one-stop service', 1, NOW()),
('Giảng dạy & Học tập', 'Ý tưởng về phương pháp giảng dạy, tài liệu học tập, công cụ hỗ trợ học tập', 1, NOW()),
('Khác', 'Các ý tưởng khác không thuộc các danh mục trên', 1, NOW());

-- ============================================
-- End of Schema
-- ============================================
