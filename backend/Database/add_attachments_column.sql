-- Add missing Attachments column to Ideas table
ALTER TABLE Ideas 
ADD COLUMN Attachments TEXT NULL COMMENT 'Comma-separated list of attachment filenames';
