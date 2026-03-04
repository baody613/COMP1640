-- =============================================
-- Setup Admin Users for COMP1640 IdeaHub
-- =============================================
-- Run this script after creating database and running schema.sql
-- Password for all users: password123

USE COMP1640_IdeaHub;

-- Step 1: Ensure departments exist
INSERT INTO Departments (Id, Name, Code, CreatedAt) VALUES
(1, 'Computer Science', 'CS', NOW()),
(2, 'Business Administration', 'BA', NOW()),
(3, 'Engineering', 'ENG', NOW()),
(4, 'Arts & Design', 'AD', NOW()),
(5, 'Science', 'NS', NOW())
ON DUPLICATE KEY UPDATE Name=VALUES(Name);

-- Step 2: Insert/Update admin users
-- Password: password123 (BCrypt hash)
INSERT INTO Users (Id, FullName, Email, PasswordHash, Role, DepartmentId, AgreedTerms, AgreedTermsDate, CreatedAt, IsActive) VALUES
(1, 'System Administrator', 'admin@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Administrator', 1, TRUE, NOW(), NOW(), TRUE),
(2, 'QA Manager', 'qamanager@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'QAManager', 1, TRUE, NOW(), NOW(), TRUE),
(3, 'John Doe', 'john@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 1, TRUE, NOW(), NOW(), TRUE)
ON DUPLICATE KEY UPDATE
  FullName = VALUES(FullName),
  PasswordHash = VALUES(PasswordHash),
  Role = VALUES(Role);

-- Step 3: Verify users were created
SELECT 
  Id, 
  FullName, 
  Email, 
  Role, 
  DepartmentId,
  IsActive 
FROM Users 
WHERE Email IN ('admin@university.edu', 'qamanager@university.edu', 'john@university.edu');

-- =============================================
-- Test Credentials:
-- =============================================
-- Email: admin@university.edu
-- Password: password123
-- =============================================
