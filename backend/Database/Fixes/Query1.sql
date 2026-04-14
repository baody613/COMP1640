USE comp1640_ideahub;

-- Update existing users OR insert if not exist
INSERT INTO Users (FullName, Email, PasswordHash, Role, DepartmentId, AgreedTerms, AgreedTermsDate, CreatedAt, IsActive) VALUES
('System Administrator', 'admin@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Administrator', 1, TRUE, NOW(), NOW(), TRUE),
('QA Manager', 'qamanager@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'QAManager', 1, TRUE, NOW(), NOW(), TRUE),
('John Doe', 'john@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 1, TRUE, NOW(), NOW(), TRUE)
ON DUPLICATE KEY UPDATE
    PasswordHash = VALUES(PasswordHash),
    Role = VALUES(Role),
    AgreedTerms = TRUE,
    IsActive = TRUE;

-- Verify
SELECT Id, FullName, Email, Role, IsActive FROM Users WHERE Email IN ('admin@university.edu', 'qamanager@university.edu', 'john@university.edu');