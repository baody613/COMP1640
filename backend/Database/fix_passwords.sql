-- Update all user passwords with a known working BCrypt hash for "password123"
-- This hash is tested in AuthController's test-bcrypt endpoint
USE comp1640_ideahub;

UPDATE Users SET PasswordHash = '$2a$11$8GvBJz9VX4qYq5T1kZXLmefL.p3yKYYR9.cOLKLvZJqVvJqWXqD8O'
WHERE Email IN (
    'admin@university.edu',
    'qamanager@university.edu', 
    'coordinator@university.edu',
    'john@university.edu',
    'jane@university.edu'
);

-- Verify the update
SELECT Id, Email, PasswordHash FROM Users WHERE Role IN ('Administrator', 'QAManager', 'QACoordinator');
