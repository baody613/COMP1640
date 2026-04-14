USE comp1640_ideahub;

-- Translate Vietnamese sample ideas to English (title + content)
-- This script is safe to run multiple times.

START TRANSACTION;

-- Ideas from insert_sample_ideas.sql
UPDATE Ideas
SET
  Title = 'Smart Document Management System',
  Content = 'Propose building an online document management system for the whole university, allowing lecturers and students to easily share, search, and store learning materials. The system should include full-text search, automatic classification by subject, and real-time collaboration features.'
WHERE Title = 'Hệ thống quản lý tài liệu thông minh';

UPDATE Ideas
SET
  Title = 'Mentorship Program Connecting Students and Industry',
  Content = 'Build a mentorship program that connects final-year students with industry professionals. Each student is paired with a mentor and meets every two weeks for career guidance and practical skill development.'
WHERE Title = 'Chương trình mentorship kết nối sinh viên - doanh nghiệp';

UPDATE Ideas
SET
  Title = 'Electronic Waste Recycling on Campus',
  Content = 'Place e-waste collection bins (used batteries and broken devices) in each building. Partner with certified recycling companies for proper processing and organize awareness sessions to promote environmental responsibility among students.'
WHERE Title = 'Tái chế rác thải điện tử trong khuôn viên trường';

UPDATE Ideas
SET
  Title = 'Mental Health Tracking App for Students',
  Content = 'Develop a free mobile app for students to monitor mental well-being, access breathing and mindfulness exercises, and connect with university counselors when needed. All personal data must remain private and secure.'
WHERE Title = 'Ứng dụng theo dõi sức khỏe tâm thần cho sinh viên';

UPDATE Ideas
SET
  Title = 'Install Solar Panels on Campus Buildings',
  Content = 'Install solar panel systems on building rooftops to reduce electricity costs by 30-40 percent and lower carbon emissions. Estimated investment payback is within 5-7 years.'
WHERE Title = 'Lắp đặt tấm pin năng lượng mặt trời trên mái nhà';

UPDATE Ideas
SET
  Title = 'Online Group Study Room Booking System',
  Content = 'Build a web/app platform for students to reserve group study rooms, labs, and computer rooms by schedule. This helps avoid room conflicts and improves facility utilization.'
WHERE Title = 'Hệ thống đặt phòng học nhóm trực tuyến';

UPDATE Ideas
SET
  Title = 'Student Startup Support Fund',
  Content = 'Establish an internal startup fund providing grants from 5 to 20 million VND for student startup projects. A committee of lecturers and industry representatives reviews applications each semester.'
WHERE Title = 'Quỹ hỗ trợ sinh viên khởi nghiệp';

UPDATE Ideas
SET
  Title = 'Multicultural Language Exchange Club',
  Content = 'Create a language exchange club connecting Vietnamese and international students through weekly meetups, cultural events, and exchange activities to improve communication skills and cross-cultural understanding.'
WHERE Title = 'Câu lạc bộ trao đổi ngôn ngữ đa văn hóa';

UPDATE Ideas
SET
  Title = 'Digital Library - Cardless Borrowing',
  Content = 'Integrate library borrowing and returning with student ID cards or QR codes. Students can reserve books online, receive availability notifications, and renew loans through an app.'
WHERE Title = 'Số hóa thư viện - Mượn sách không cần thẻ';

UPDATE Ideas
SET
  Title = 'Free Gym and Yoga Space for Students',
  Content = 'Convert unused storage areas into a free gym and yoga space for students and staff. Equip basic facilities and hire part-time trainers for several sessions each week to improve physical and mental health.'
WHERE Title = 'Phòng gym và yoga miễn phí cho sinh viên';

-- Ideas from seed_real_data.sql (Topic 2 + 3)
UPDATE Ideas
SET
  Title = 'Extend Dormitory Access to 24/7',
  Content = 'Dormitories currently close at 11 PM, which is inconvenient for students studying late. Extend access to 24/7 with proper security coverage.'
WHERE Title = 'Mở rộng giờ ký túc xá 24/7';

UPDATE Ideas
SET
  Title = 'Improve Cafeteria Meal Quality',
  Content = 'The current cafeteria menu is limited and expensive. Partner with local restaurants to diversify meals and provide student discounts.'
WHERE Title = 'Cải thiện chất lượng bữa ăn căng tin';

UPDATE Ideas
SET
  Title = 'Digitize Library Materials',
  Content = 'Digitize all library materials and integrate an online borrowing system. Students can reserve, borrow, and return books remotely through a mobile app.'
WHERE Title = 'Thư viện số hóa tài liệu';

UPDATE Ideas
SET
  Title = 'Interdisciplinary Soft Skills Club',
  Content = 'Establish a cross-faculty soft skills club so students from different majors can connect and learn communication, presentation, and teamwork skills together.'
WHERE Title = 'Câu lạc bộ kỹ năng mềm liên khoa';

UPDATE Ideas
SET
  Title = 'Smart Classroom System',
  Content = 'Equip classrooms with touch displays, smart boards, and online room booking features. This improves classroom utilization and saves energy.'
WHERE Title = 'Hệ thống phòng học thông minh';

UPDATE Ideas
SET
  Title = 'Green Relaxation Area for Students',
  Content = 'Create outdoor relaxation areas with trees, seating, and free Wi-Fi so students can study and rest between classes.'
WHERE Title = 'Khu vực thư giãn xanh cho sinh viên';

UPDATE Ideas
SET
  Title = 'Integrated Study and Activity Tracking App',
  Content = 'Develop a mobile app integrating class schedules, activity notifications, library reservations, and credit management into a single platform.'
WHERE Title = 'Ứng dụng theo dõi lịch học và hoạt động';

UPDATE Ideas
SET
  Title = 'Student Mental Health Support Program',
  Content = 'Set up a free mental health counseling center with professional advisors to help students manage academic pressure, exams, and life challenges.'
WHERE Title = 'Chương trình hỗ trợ tâm lý sinh viên';

UPDATE Ideas
SET
  Title = 'Solar-Powered E-Bike Charging Stations',
  Content = 'Install solar-powered e-bike charging stations around campus to encourage sustainable transportation and reduce CO2 emissions.'
WHERE Title = 'Trạm sạc xe đạp điện năng lượng mặt trời';

UPDATE Ideas
SET
  Title = 'Smart Waste Sorting System',
  Content = 'Deploy smart bins with sensors that detect waste types and guide users. Integrate with an app to gamify recycling participation.'
WHERE Title = 'Hệ thống phân loại rác thông minh';

UPDATE Ideas
SET
  Title = 'Organic Campus Community Garden',
  Content = 'Build a student-managed organic garden on campus. Produce can support the cafeteria, with surplus shared among participating students.'
WHERE Title = 'Vườn rau hữu cơ trong khuôn viên trường';

UPDATE Ideas
SET
  Title = 'Rainwater Reuse System',
  Content = 'Install rainwater collection systems for irrigation and cleaning, with an estimated 40 percent monthly water saving.'
WHERE Title = 'Tái sử dụng nước mưa';

UPDATE Ideas
SET
  Title = 'Campus-wide LED Lighting Upgrade',
  Content = 'Replace legacy lighting with LED systems and motion sensors to reduce electricity costs by an estimated 60 percent.'
WHERE Title = 'Thay đèn LED toàn trường';

UPDATE Ideas
SET
  Title = 'Recycle-for-Rewards Program',
  Content = 'Students can earn points by bringing recyclables to collection stations and redeem rewards at the cafeteria, library, or other campus services.'
WHERE Title = 'Chương trình đổi rác lấy điểm thưởng';

UPDATE Ideas
SET
  Title = 'Graduation Memorial Forest',
  Content = 'Each graduating class plants a small memorial forest on campus with name plaques, creating long-term green space and legacy value.'
WHERE Title = 'Rừng cây kỷ niệm sinh viên tốt nghiệp';

COMMIT;

-- Quick verification
SELECT Id, Title
FROM Ideas
ORDER BY Id;
