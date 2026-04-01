-- Insert admin user if not exists
USE comp1640_ideahub;

-- Check and insert departments if not exist
INSERT INTO Departments (Id, Name, Code, CreatedAt) VALUES
(1, 'Computer Science', 'CS', NOW()),
(2, 'Business Administration', 'BA', NOW()),
(3, 'Engineering', 'ENG', NOW()),
(4, 'Arts & Design', 'AD', NOW()),
(5, 'Science', 'NS', NOW())
ON DUPLICATE KEY UPDATE Name=VALUES(Name), Code=VALUES(Code);

-- Insert/Update admin users (no DELETE needed - safer!)
-- Password: password123
-- Hash: $2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO
INSERT INTO Users (Id, FullName, Email, PasswordHash, Role, DepartmentId, AgreedTerms, AgreedTermsDate, CreatedAt, IsActive) VALUES
(1, 'System Administrator', 'admin@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Administrator', 1, TRUE, NOW(), NOW(), TRUE),
(2, 'QA Manager', 'qamanager@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'QAManager', 1, TRUE, NOW(), NOW(), TRUE),
(3, 'John Doe', 'john@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 1, TRUE, NOW(), NOW(), TRUE)
ON DUPLICATE KEY UPDATE
    FullName = VALUES(FullName),
    PasswordHash = VALUES(PasswordHash),
    Role = VALUES(Role),
    AgreedTerms = TRUE,
    IsActive = TRUE;

-- Verify
SELECT Id, FullName, Email, Role, AgreedTerms, IsActive FROM Users WHERE Email IN ('admin@university.edu', 'qamanager@university.edu', 'john@university.edu');
