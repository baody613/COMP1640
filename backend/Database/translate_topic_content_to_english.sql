USE comp1640_ideahub;

-- Translate currently displayed Topic 1 content to English
UPDATE Topics
SET
  Name = 'Enhancing the student experience across the entire campus.',
  Description = 'Collect ideas from staff members (lecturers and support staff) to improve service quality, learning environment, facilities, administrative workflows, and academic support for students.'
WHERE Id = 1;

-- Optional: translate Topic 1 category labels/descriptions to English
UPDATE Categories
SET Name = 'Technology & Facilities',
    Description = 'Ideas to improve equipment, labs, Wi-Fi, and learning tools'
WHERE TopicId = 1 AND (Id = 1 OR Name LIKE 'Công nghệ%');

UPDATE Categories
SET Name = 'Learning Environment',
    Description = 'Ideas for study spaces, library, self-study areas, and green zones'
WHERE TopicId = 1 AND (Id = 2 OR Name LIKE 'Môi trường%');

UPDATE Categories
SET Name = 'Student Services',
    Description = 'Ideas for student support, academic advising, clubs, and extracurricular activities'
WHERE TopicId = 1 AND (Id = 3 OR Name LIKE 'Dịch vụ%');

UPDATE Categories
SET Name = 'Administrative Processes',
    Description = 'Ideas for simplifying procedures, online services, and one-stop support'
WHERE TopicId = 1 AND (Id = 4 OR Name LIKE 'Quy trình%');

UPDATE Categories
SET Name = 'Teaching & Learning',
    Description = 'Ideas for teaching methods, learning materials, and academic support tools'
WHERE TopicId = 1 AND (Id = 5 OR Name LIKE 'Giảng dạy%');

UPDATE Categories
SET Name = 'Other',
    Description = 'Ideas that do not belong to the categories above'
WHERE TopicId = 1 AND (Id = 6 OR Name = 'Khác');

SELECT Id, Name, Description FROM Topics WHERE Id = 1;
SELECT Id, Name, Description FROM Categories WHERE TopicId = 1 ORDER BY Id;
