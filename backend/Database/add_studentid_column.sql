-- Add StudentId column to Users table if it does not exist
USE comp1640_ideahub;
ALTER TABLE Users ADD COLUMN IF NOT EXISTS StudentId VARCHAR(50) NULL AFTER DepartmentId;
