
-- Create a new Topic with long deadline for testing
USE COMP1640_IdeaHub;

-- Delete old topic if exists
DELETE FROM Topics WHERE Id = 1;

-- Insert new topic with 60 days deadline (using correct column names!)
INSERT INTO Topics (Id, Name, Description, IdeaSubmissionDeadline, CommentDeadline, CreatedById, CreatedAt) VALUES
(1, 
 'Innovation Ideas 2026', 
 'Submit your innovative ideas to improve our university',
 DATE_ADD(NOW(), INTERVAL 30 DAY),   -- IdeaSubmissionDeadline: 30 days from now
 DATE_ADD(NOW(), INTERVAL 60 DAY),   -- CommentDeadline: 60 days from now
 1,                                    -- CreatedById: admin user
 NOW()
);

-- Verify
SELECT 
  Id, 
  Name,
  IdeaSubmissionDeadline,
  CommentDeadline,
  NOW() as CurrentTime,
  DATEDIFF(CommentDeadline, NOW()) as DaysRemaining,
  CASE 
    WHEN CommentDeadline > NOW() THEN '✅ CÒN HẠN - CÓ THỂ SUBMIT' 
    ELSE '❌ HẾT HẠN' 
  END as Status
FROM Topics;
