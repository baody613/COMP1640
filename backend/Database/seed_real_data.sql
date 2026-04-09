-- ============================================================
-- SEED REAL DATA FOR COMP1640 IDEAHUB
-- Password for all sample users: password123
-- Hash: $2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO
-- ============================================================

USE comp1640_ideahub;

SET FOREIGN_KEY_CHECKS = 0;

-- ── 1. Assign QA Coordinator to each department ─────────────
-- Update existing users first
UPDATE Users SET DepartmentId = NULL WHERE Id = 2; -- QA Manager no department

-- ── 2. Add QA Coordinators ───────────────────────────────────
INSERT IGNORE INTO Users (Id, FullName, Email, PasswordHash, Role, DepartmentId, AgreedTerms, AgreedTermsDate, IsActive, CreatedAt) VALUES
(10, 'Nguyen Thi Lan',   'lan.cs@university.edu',   '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'QACoordinator', 1, 1, NOW(), 1, '2025-09-01'),
(11, 'Tran Van Nam',     'nam.ba@university.edu',   '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'QACoordinator', 2, 1, NOW(), 1, '2025-09-01'),
(12, 'Le Thi Hoa',       'hoa.eng@university.edu',  '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'QACoordinator', 3, 1, NOW(), 1, '2025-09-01'),
(13, 'Pham Minh Duc',    'duc.ad@university.edu',   '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'QACoordinator', 4, 1, NOW(), 1, '2025-09-01'),
(14, 'Vo Thi Bich',      'bich.ns@university.edu',  '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'QACoordinator', 5, 1, NOW(), 1, '2025-09-01');

-- ── 3. Add Staff across all departments ──────────────────────
INSERT IGNORE INTO Users (Id, FullName, Email, PasswordHash, Role, DepartmentId, StudentId, AgreedTerms, AgreedTermsDate, IsActive, CreatedAt) VALUES
-- CS (DeptId=1)
(20, 'Nguyen Van An',    'an.cs@university.edu',    '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 1, 'GCS210101', 1, NOW(), 1, '2025-09-05'),
(21, 'Tran Thi Bao',     'bao.cs@university.edu',   '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 1, 'GCS210102', 1, NOW(), 1, '2025-09-05'),
(22, 'Le Van Cuong',     'cuong.cs@university.edu', '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 1, 'GCS210103', 1, NOW(), 1, '2025-09-06'),
-- BA (DeptId=2)
(23, 'Pham Thi Dao',     'dao.ba@university.edu',   '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 2, 'GBA210201', 1, NOW(), 1, '2025-09-05'),
(24, 'Hoang Van Emy',    'emy.ba@university.edu',   '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 2, 'GBA210202', 1, NOW(), 1, '2025-09-05'),
(25, 'Nguyen Thi Fanh',  'fanh.ba@university.edu',  '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 2, 'GBA210203', 1, NOW(), 1, '2025-09-06'),
-- ENG (DeptId=3)
(26, 'Tran Van Gia',     'gia.eng@university.edu',  '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 3, 'GENG210301', 1, NOW(), 1, '2025-09-05'),
(27, 'Le Thi Han',       'han.eng@university.edu',  '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 3, 'GENG210302', 1, NOW(), 1, '2025-09-05'),
(28, 'Vo Van Ich',       'ich.eng@university.edu',  '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 3, 'GENG210303', 1, NOW(), 1, '2025-09-06'),
-- AD (DeptId=4)
(29, 'Dang Thi Kim',     'kim.ad@university.edu',   '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 4, 'GAD210401', 1, NOW(), 1, '2025-09-05'),
(30, 'Bui Van Long',     'long.ad@university.edu',  '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 4, 'GAD210402', 1, NOW(), 1, '2025-09-05'),
-- NS (DeptId=5)
(31, 'Nguyen Van Minh',  'minh.ns@university.edu',  '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 5, 'GNS210501', 1, NOW(), 1, '2025-09-05'),
(32, 'Tran Thi Ngoc',    'ngoc.ns@university.edu',  '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 5, 'GNS210502', 1, NOW(), 1, '2025-09-05'),
(33, 'Le Van Oanh',      'oanh.ns@university.edu',  '$2a$11$BgXFzT7ByJ9zHDu4WbZQ5eRxlk5k5Uq40UpTGey0HPn493ziNrEfO', 'Staff', 5, 'GNS210503', 1, NOW(), 1, '2025-09-06');

-- ── 4. Update QACoordinator reference in Departments ─────────
UPDATE Departments SET QACoordinatorId = 10 WHERE Id = 1;
UPDATE Departments SET QACoordinatorId = 11 WHERE Id = 2;
UPDATE Departments SET QACoordinatorId = 12 WHERE Id = 3;
UPDATE Departments SET QACoordinatorId = 13 WHERE Id = 4;
UPDATE Departments SET QACoordinatorId = 14 WHERE Id = 5;

-- ── 5. Add 2 more Topics ─────────────────────────────────────
INSERT IGNORE INTO Topics (Id, Name, Description, IdeaSubmissionDeadline, CommentDeadline, CreatedById, IsActive, CreatedAt) VALUES
(2, 'Campus Life Improvement 2026',
   'Ý tưởng cải thiện cuộc sống sinh viên trong khuôn viên trường – ký túc xá, căng tin, thư viện, không gian học tập.',
   '2026-04-30 23:59:59', '2026-05-15 23:59:59', 2, 1, '2026-01-10'),
(3, 'Green University Initiative',
   'Sáng kiến xanh – giảm rác thải, tiết kiệm năng lượng, phát triển bền vững trong môi trường đại học.',
   '2026-03-31 23:59:59', '2026-04-20 23:59:59', 2, 1, '2026-01-15');

-- ── 6. Add Categories for new topics ────────────────────────
INSERT IGNORE INTO Categories (Id, Name, Description, TopicId, CreatedAt) VALUES
-- Topic 2
(19, 'Ký túc xá',      'Cải thiện ký túc xá sinh viên',           2, '2026-01-10'),
(20, 'Căng tin',        'Dịch vụ ăn uống trong trường',            2, '2026-01-10'),
(21, 'Thư viện',        'Nâng cấp thư viện và tài nguyên học tập', 2, '2026-01-10'),
(22, 'Hoạt động ngoại khóa', 'Câu lạc bộ và hoạt động sinh viên', 2, '2026-01-10'),
-- Topic 3
(23, 'Tái chế',         'Chương trình tái chế và phân loại rác',   3, '2026-01-15'),
(24, 'Năng lượng',      'Sử dụng năng lượng tái tạo, tiết kiệm',  3, '2026-01-15'),
(25, 'Cây xanh',        'Trồng thêm cây xanh và vườn sinh thái',  3, '2026-01-15'),
(26, 'Nước',            'Tiết kiệm và tái sử dụng nước',           3, '2026-01-15');

-- ── 7. Add Ideas for Topic 2 (Campus Life) ──────────────────
INSERT IGNORE INTO Ideas (Id, Title, Content, IsAnonymous, AuthorId, TopicId, CategoryId, DepartmentId, ViewCount, CreatedAt) VALUES
(14, 'Mở rộng giờ ký túc xá 24/7',
 'Hiện tại ký túc xá đóng cửa lúc 11 giờ đêm, gây bất tiện cho sinh viên học muộn. Đề xuất mở rộng thời gian hoạt động 24/7 với bảo vệ túc trực.',
 0, 23, 2, 19, 2, 142, '2026-01-20'),
(15, 'Cải thiện chất lượng bữa ăn căng tin',
 'Thực đơn căng tin hiện tại khá đơn điệu và giá cao. Đề xuất hợp tác với các nhà hàng địa phương để đa dạng thực đơn và giảm giá cho sinh viên có thẻ.',
 0, 24, 2, 20, 2, 198, '2026-01-22'),
(16, 'Thư viện số hóa tài liệu',
 'Số hóa toàn bộ tài liệu thư viện và tích hợp hệ thống mượn sách online. Sinh viên có thể đặt trước, mượn và trả sách từ xa qua ứng dụng điện thoại.',
 0, 25, 2, 21, 2, 267, '2026-01-25'),
(17, 'Câu lạc bộ kỹ năng mềm liên khoa',
 'Thành lập CLB kỹ năng mềm liên khoa để sinh viên từ các ngành khác nhau có thể kết nối và học hỏi lẫn nhau về giao tiếp, thuyết trình và làm việc nhóm.',
 0, 26, 2, 22, 3, 89, '2026-01-28'),
(18, 'Hệ thống phòng học thông minh',
 'Trang bị các phòng học với màn hình cảm ứng, bảng thông minh và hệ thống đặt phòng online. Tối ưu hóa việc sử dụng phòng học và tiết kiệm điện năng.',
 0, 27, 2, 21, 3, 315, '2026-02-01'),
(19, 'Khu vực thư giãn xanh cho sinh viên',
 'Xây dựng khu vực thư giãn với cây xanh, ghế ngồi ngoài trời và wifi miễn phí để sinh viên có thể học tập và nghỉ ngơi giữa các buổi học.',
 1, 28, 2, 22, 3, 176, '2026-02-05'),
(20, 'Ứng dụng theo dõi lịch học và hoạt động',
 'Phát triển một ứng dụng di động tích hợp lịch học, thông báo hoạt động, đặt chỗ thư viện và quản lý tín chỉ trong một nền tảng duy nhất.',
 0, 29, 2, 21, 4, 423, '2026-02-08'),
(21, 'Chương trình hỗ trợ tâm lý sinh viên',
 'Thành lập trung tâm tư vấn tâm lý miễn phí với đội ngũ chuyên gia, giúp sinh viên vượt qua áp lực học tập, thi cử và cuộc sống.',
 0, 30, 2, 22, 4, 234, '2026-02-10');

-- ── 8. Add Ideas for Topic 3 (Green University) ─────────────
INSERT IGNORE INTO Ideas (Id, Title, Content, IsAnonymous, AuthorId, TopicId, CategoryId, DepartmentId, ViewCount, CreatedAt) VALUES
(22, 'Trạm sạc xe đạp điện năng lượng mặt trời',
 'Lắp đặt các trạm sạc xe đạp điện trong khuôn viên trường sử dụng năng lượng mặt trời. Khuyến khích sinh viên đi xe đạp điện, giảm lượng CO2.',
 0, 31, 3, 24, 5, 312, '2026-01-20'),
(23, 'Hệ thống phân loại rác thông minh',
 'Lắp đặt thùng rác thông minh có cảm biến nhận dạng loại rác và hướng dẫn phân loại. Kết nối với ứng dụng để game hóa việc phân loại rác.',
 0, 32, 3, 23, 5, 189, '2026-01-23'),
(24, 'Vườn rau hữu cơ trong khuôn viên trường',
 'Xây dựng vườn rau hữu cơ cộng đồng do sinh viên quản lý. Sản phẩm thu hoạch cung cấp cho căng tin, phần còn lại chia cho sinh viên tham gia.',
 0, 33, 3, 25, 5, 145, '2026-01-26'),
(25, 'Tái sử dụng nước mưa',
 'Lắp đặt hệ thống thu gom nước mưa để tưới cây và vệ sinh khuôn viên. Ước tính tiết kiệm 40% lượng nước sử dụng mỗi tháng.',
 0, 20, 3, 26, 1, 267, '2026-01-29'),
(26, 'Thay đèn LED toàn trường',
 'Thay thế toàn bộ hệ thống đèn chiếu sáng bằng đèn LED tiết kiệm điện và cảm biến chuyển động. Dự kiến giảm 60% chi phí điện năng hàng tháng.',
 0, 21, 3, 24, 1, 398, '2026-02-02'),
(27, 'Chương trình đổi rác lấy điểm thưởng',
 'Sinh viên đem rác tái chế đến các điểm thu gom sẽ được tích điểm đổi lấy ưu đãi tại căng tin, thư viện hoặc các dịch vụ của trường.',
 1, 22, 3, 23, 1, 521, '2026-02-05'),
(28, 'Rừng cây kỷ niệm sinh viên tốt nghiệp',
 'Mỗi khóa sinh viên tốt nghiệp sẽ trồng một khu rừng cây nhỏ trong khuôn viên trường có gắn bảng tên. Tạo không gian xanh và kỷ niệm lâu dài.',
 0, 23, 3, 25, 2, 187, '2026-02-08');

-- Update existing ideas' view counts to more realistic values
UPDATE Ideas SET ViewCount = 245 WHERE Id = 1;
UPDATE Ideas SET ViewCount = 312 WHERE Id = 2;
UPDATE Ideas SET ViewCount = 178 WHERE Id = 3;
UPDATE Ideas SET ViewCount = 89 WHERE Id = 4;
UPDATE Ideas SET ViewCount = 423 WHERE Id = 5;
UPDATE Ideas SET ViewCount = 156 WHERE Id = 6;
UPDATE Ideas SET ViewCount = 67 WHERE Id = 7;
UPDATE Ideas SET ViewCount = 234 WHERE Id = 8;
UPDATE Ideas SET ViewCount = 345 WHERE Id = 9;
UPDATE Ideas SET ViewCount = 112 WHERE Id = 10;
UPDATE Ideas SET ViewCount = 289 WHERE Id = 11;
UPDATE Ideas SET ViewCount = 198 WHERE Id = 12;
UPDATE Ideas SET ViewCount = 76 WHERE Id = 13;

-- ── 9. Add Comments ──────────────────────────────────────────
INSERT IGNORE INTO Comments (Id, Content, IdeaId, AuthorId, IsAnonymous, CreatedAt) VALUES
-- Idea 1
(1,  'Ý tưởng rất hay! Tôi nghĩ chúng ta nên bắt đầu từ việc tích hợp AI vào hệ thống LMS hiện có.', 1, 23, 0, '2026-02-15'),
(2,  'Đồng ý, nhưng cần đảm bảo quyền riêng tư dữ liệu sinh viên khi dùng AI.', 1, 24, 0, '2026-02-15'),
(3,  'Chi phí triển khai khá lớn, cần xem xét kỹ ngân sách.', 1, 25, 0, '2026-02-16'),
-- Idea 2
(4,  'Tôi đã thấy nhiều trường đại học áp dụng mô hình này rất hiệu quả!', 2, 26, 0, '2026-02-16'),
(5,  'Đề xuất kết hợp với các doanh nghiệp địa phương để tăng tính thực tiễn.', 2, 27, 0, '2026-02-17'),
-- Idea 3
(6,  'Việc số hóa tài liệu là xu hướng tất yếu. Rất ủng hộ!', 3, 28, 0, '2026-02-18'),
(7,  'Cần đảm bảo bản quyền tài liệu khi số hóa.', 3, 29, 0, '2026-02-18'),
(8,  'Tôi có thể tình nguyện tham gia dự án số hóa này.', 3, 30, 0, '2026-02-19'),
-- Idea 5
(9,  'Tuyệt vời! Đây là điều mà nhiều sinh viên mong đợi từ lâu.', 5, 31, 0, '2026-02-20'),
(10, 'Cần đào tạo cả nhân viên kỹ thuật để vận hành hệ thống mới.', 5, 32, 0, '2026-02-20'),
-- Idea 14
(11, 'Ký túc xá 24/7 sẽ rất tiện cho các bạn học ca muộn!', 14, 20, 0, '2026-02-10'),
(12, 'Vấn đề an ninh ban đêm cần được chú trọng hơn.', 14, 21, 0, '2026-02-10'),
(13, 'Đồng ý! Nhiều bạn phải về nhà lúc 10 giờ đêm vì ký túc đóng cửa sớm.', 14, 22, 1, '2026-02-11'),
-- Idea 15
(14, 'Tôi hoàn toàn ủng hộ! Đồ ăn căng tin bây giờ rất nhạt.', 15, 23, 0, '2026-02-12'),
(15, 'Nên có thực đơn chay riêng cho sinh viên ăn chay.', 15, 24, 0, '2026-02-12'),
-- Idea 20
(16, 'Ứng dụng này nếu làm tốt sẽ rất hữu ích, cần UX tốt.', 20, 25, 0, '2026-02-15'),
(17, 'Tôi muốn tham gia nhóm phát triển ứng dụng này!', 20, 26, 0, '2026-02-16'),
-- Idea 22
(18, 'Trạm sạc năng lượng mặt trời rất phù hợp với khí hậu Việt Nam!', 22, 27, 0, '2026-02-10'),
(19, 'Nên kết hợp với cho thuê xe đạp để sinh viên không xe có thể sử dụng.', 22, 28, 0, '2026-02-11'),
-- Idea 26
(20, 'Đèn LED + cảm biến chuyển động sẽ tiết kiệm điện rất nhiều!', 26, 29, 0, '2026-02-15'),
(21, 'Trường nên bắt đầu từ các tòa nhà dùng nhiều điện nhất.', 26, 30, 0, '2026-02-15'),
(22, 'Dự án này có thể xin tài trợ từ các tổ chức môi trường quốc tế.', 26, 31, 0, '2026-02-16'),
-- Idea 27
(23, 'Ý tưởng gamification này rất sáng tạo, sẽ thu hút giới trẻ!', 27, 32, 0, '2026-02-13'),
(24, 'Nên thiết kế bảng xếp hạng theo khoa để tạo tính cạnh tranh.', 27, 33, 0, '2026-02-14'),
(25, 'Đề xuất kết hợp với app điện thoại để quét QR khi nộp rác.', 27, 20, 1, '2026-02-14');

-- ── 10. Add Reactions ────────────────────────────────────────
INSERT IGNORE INTO Reactions (IdeaId, UserId, IsThumbsUp, CreatedAt) VALUES
-- Idea 1 (8 up, 1 down)
(1, 20, 1, '2026-02-15'), (1, 21, 1, '2026-02-15'), (1, 22, 1, '2026-02-16'),
(1, 23, 1, '2026-02-16'), (1, 24, 1, '2026-02-17'), (1, 25, 1, '2026-02-17'),
(1, 26, 1, '2026-02-18'), (1, 27, 1, '2026-02-18'), (1, 28, 0, '2026-02-19'),
-- Idea 2 (6 up, 2 down)
(2, 20, 1, '2026-02-16'), (2, 21, 1, '2026-02-16'), (2, 22, 1, '2026-02-17'),
(2, 29, 1, '2026-02-17'), (2, 30, 1, '2026-02-18'), (2, 31, 1, '2026-02-18'),
(2, 32, 0, '2026-02-19'), (2, 33, 0, '2026-02-19'),
-- Idea 3 (10 up)
(3, 20, 1, '2026-02-16'), (3, 21, 1, '2026-02-17'), (3, 23, 1, '2026-02-17'),
(3, 24, 1, '2026-02-18'), (3, 25, 1, '2026-02-18'), (3, 26, 1, '2026-02-19'),
(3, 27, 1, '2026-02-19'), (3, 29, 1, '2026-02-20'), (3, 30, 1, '2026-02-20'),
(3, 31, 1, '2026-02-21'),
-- Idea 5 (9 up, 1 down)
(5, 20, 1, '2026-02-18'), (5, 22, 1, '2026-02-18'), (5, 23, 1, '2026-02-19'),
(5, 25, 1, '2026-02-19'), (5, 26, 1, '2026-02-20'), (5, 28, 1, '2026-02-20'),
(5, 29, 1, '2026-02-21'), (5, 31, 1, '2026-02-21'), (5, 32, 1, '2026-02-22'),
(5, 33, 0, '2026-02-22'),
-- Idea 14 (12 up, 2 down)
(14, 23, 1, '2026-02-10'), (14, 24, 1, '2026-02-10'), (14, 25, 1, '2026-02-11'),
(14, 26, 1, '2026-02-11'), (14, 27, 1, '2026-02-12'), (14, 28, 1, '2026-02-12'),
(14, 29, 1, '2026-02-13'), (14, 30, 1, '2026-02-13'), (14, 31, 1, '2026-02-14'),
(14, 32, 1, '2026-02-14'), (14, 33, 1, '2026-02-15'), (14, 20, 1, '2026-02-15'),
(14, 21, 0, '2026-02-16'), (14, 22, 0, '2026-02-16'),
-- Idea 20 (14 up, 1 down)
(20, 20, 1, '2026-02-10'), (20, 21, 1, '2026-02-10'), (20, 22, 1, '2026-02-11'),
(20, 23, 1, '2026-02-11'), (20, 24, 1, '2026-02-12'), (20, 25, 1, '2026-02-12'),
(20, 26, 1, '2026-02-13'), (20, 27, 1, '2026-02-13'), (20, 28, 1, '2026-02-14'),
(20, 29, 1, '2026-02-14'), (20, 30, 1, '2026-02-15'), (20, 31, 1, '2026-02-15'),
(20, 32, 1, '2026-02-16'), (20, 33, 1, '2026-02-16'), (20, 3,  0, '2026-02-17'),
-- Idea 26 (11 up)
(26, 20, 1, '2026-02-10'), (26, 21, 1, '2026-02-11'), (26, 22, 1, '2026-02-11'),
(26, 23, 1, '2026-02-12'), (26, 24, 1, '2026-02-12'), (26, 25, 1, '2026-02-13'),
(26, 26, 1, '2026-02-13'), (26, 27, 1, '2026-02-14'), (26, 29, 1, '2026-02-14'),
(26, 31, 1, '2026-02-15'), (26, 33, 1, '2026-02-15'),
-- Idea 27 (13 up, 1 down)
(27, 20, 1, '2026-02-10'), (27, 21, 1, '2026-02-10'), (27, 22, 1, '2026-02-11'),
(27, 23, 1, '2026-02-11'), (27, 24, 1, '2026-02-12'), (27, 25, 1, '2026-02-12'),
(27, 26, 1, '2026-02-13'), (27, 28, 1, '2026-02-13'), (27, 29, 1, '2026-02-14'),
(27, 30, 1, '2026-02-14'), (27, 31, 1, '2026-02-15'), (27, 32, 1, '2026-02-15'),
(27, 33, 1, '2026-02-16'), (27, 3,  0, '2026-02-16');

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Seed completed!' AS result;
SELECT 
  (SELECT COUNT(*) FROM Users)     AS total_users,
  (SELECT COUNT(*) FROM Topics)    AS total_topics,
  (SELECT COUNT(*) FROM Ideas)     AS total_ideas,
  (SELECT COUNT(*) FROM Comments)  AS total_comments,
  (SELECT COUNT(*) FROM Reactions) AS total_reactions;
