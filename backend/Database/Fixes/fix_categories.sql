USE comp1640_ideahub;

-- Check current state
SELECT 'Current categories:' as info;
SELECT * FROM categories;

SELECT 'Current topics:' as info;
SELECT Id, Name FROM topics;

-- Insert categories with explicit IDs
INSERT INTO categories (Id, Name, Description, TopicId, CreatedAt) VALUES
(1, 'Technology', 'Technology related ideas', 1, NOW()),
(2, 'Education', 'Education related ideas', 1, NOW()),
(3, 'Environment', 'Environment related ideas', 1, NOW()),
(4, 'Health', 'Health related ideas', 1, NOW()),
(5, 'Finance', 'Finance related ideas', 1, NOW()),
(6, 'Social', 'Social related ideas', 1, NOW())
ON DUPLICATE KEY UPDATE 
    Name = VALUES(Name),
    Description = VALUES(Description),
    TopicId = VALUES(TopicId);

SELECT 'Categories after insert:' as info;
SELECT * FROM categories;
