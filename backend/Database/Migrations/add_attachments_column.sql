-- Add Attachments column to Ideas table only if it does not exist
USE comp1640_ideahub;

SET @db_name = 'comp1640_ideahub';
SET @sql = (
	SELECT IF(
		EXISTS (
			SELECT 1
			FROM information_schema.COLUMNS
			WHERE TABLE_SCHEMA = @db_name
				AND TABLE_NAME = 'Ideas'
				AND COLUMN_NAME = 'Attachments'
		),
		'SELECT ''Attachments already exists'' AS status',
		'ALTER TABLE Ideas ADD COLUMN Attachments TEXT NULL COMMENT ''Comma-separated list of attachment filenames'''
	)
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
