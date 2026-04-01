-- Insert sample Categories for testing
USE comp1640_ideahub;

-- Insert categories linked to Topic 1
INSERT INTO Categories (Name, Description, TopicId, CreatedAt) VALUES
('Technology', 'Technology and IT innovations', 1, NOW()),
('Education', 'Educational improvements', 1, NOW()),
('Environment', 'Environmental sustainability', 1, NOW()),
('Health', 'Health and wellness initiatives', 1, NOW()),
('Finance', 'Financial solutions', 1, NOW()),
('Social', 'Social responsibility projects', 1, NOW())
ON DUPLICATE KEY UPDATE Name=VALUES(Name);

-- Verify
SELECT Id, Name, TopicId FROM Categories WHERE TopicId = 1;
