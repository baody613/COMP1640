-- Add StudentId column to Users table if it does not exist
USE comp1640_ideahub;

SET @db_name = 'comp1640_ideahub';
SET @sql = (
	SELECT IF(
		EXISTS (
			SELECT 1
			FROM information_schema.COLUMNS
			WHERE TABLE_SCHEMA = @db_name
				AND TABLE_NAME = 'Users'
				AND COLUMN_NAME = 'StudentId'
		),
		'SELECT ''StudentId already exists'' AS status',
		'ALTER TABLE Users ADD COLUMN StudentId VARCHAR(50) NULL AFTER DepartmentId'
	)
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
