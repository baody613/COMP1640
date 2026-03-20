-- Add StudentId column to Users table if it doesn't exist
ALTER TABLE Users ADD COLUMN StudentId VARCHAR(50) NULL AFTER DepartmentId;
