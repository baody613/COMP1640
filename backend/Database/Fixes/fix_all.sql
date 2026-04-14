-- =============================================
-- FIX ALL - Chạy file này để sửa tất cả vấn đề
-- =============================================
USE comp1640_ideahub;

-- 1. Update Topic deadline (còn 30 ngày)
UPDATE Topics 
SET 
  Name = 'Enhancing the student experience across the entire campus.',
  Description = 'Collect ideas from staff members (lecturers and support staff) to improve service quality, learning environment, facilities, administrative workflows, and academic support for students.',
  IdeaSubmissionDeadline = DATE_ADD(NOW(), INTERVAL 30 DAY),
  CommentDeadline = DATE_ADD(NOW(), INTERVAL 60 DAY),
  IsActive = TRUE
WHERE Id = 1;

-- 2. Ensure Categories exist
INSERT INTO Categories (Name, Description, TopicId, CreatedAt) VALUES
('Technology', 'Technology and IT innovations', 1, NOW()),
('Education', 'Educational improvements', 1, NOW()),
('Environment', 'Environmental sustainability', 1, NOW()),
('Health', 'Health and wellness initiatives', 1, NOW()),
('Finance', 'Financial solutions', 1, NOW()),
('Social', 'Social responsibility projects', 1, NOW())
ON DUPLICATE KEY UPDATE Name=VALUES(Name);

-- 3. Ensure admin user has correct settings
UPDATE Users 
SET 
  DepartmentId = 1,
  AgreedTerms = TRUE,
  AgreedTermsDate = NOW(),
  IsActive = TRUE
WHERE Email = 'admin@university.edu';

-- =============================================
-- VERIFY ALL
-- =============================================

-- Check Topic
SELECT 
  Id, Name,
  IdeaSubmissionDeadline,
  TIMESTAMPDIFF(DAY, NOW(), IdeaSubmissionDeadline) as DaysLeft,
  CASE WHEN NOW() <= IdeaSubmissionDeadline THEN '✅ OK' ELSE '❌ EXPIRED' END as Status
FROM Topics WHERE Id = 1;

-- Check Categories
SELECT COUNT(*) as CategoryCount FROM Categories WHERE TopicId = 1;

-- Check Admin User
SELECT Id, FullName, DepartmentId, AgreedTerms, IsActive 
FROM Users 
WHERE Email = 'admin@university.edu';

-- =============================================
-- Nếu tất cả OK, bạn có thể submit idea!
-- =============================================
