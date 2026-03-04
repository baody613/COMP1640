USE comp1640_ideahub;

-- ============================================
-- Sample Ideas submitted by Staff
-- Users:  3 = John Doe (Staff), 5 = Duy (Staff)
-- Departments: 1=CNTT, 2=Kinh doanh, 3=Kế toán, 4=Thiết kế, 5=Marketing
-- Categories: 13=Technology, 14=Education, 15=Environment, 16=Health, 17=Finance, 18=Social
-- Topic: 1
-- ============================================

INSERT INTO ideas (Title, Content, IsAnonymous, AuthorId, TopicId, CategoryId, DepartmentId, ViewCount, CreatedAt) VALUES

-- John Doe ideas (AuthorId = 3)
(
  'Hệ thống quản lý tài liệu thông minh',
  'Đề xuất xây dựng hệ thống quản lý tài liệu trực tuyến cho toàn trường, giúp giảng viên và sinh viên dễ dàng chia sẻ, tìm kiếm và lưu trữ tài liệu học tập. Hệ thống sẽ tích hợp tìm kiếm toàn văn, phân loại tự động theo môn học và khả năng cộng tác nhóm theo thời gian thực.',
  FALSE, 3, 1, 13, 1, 47, NOW() - INTERVAL 25 DAY
),
(
  'Chương trình mentorship kết nối sinh viên - doanh nghiệp',
  'Xây dựng chương trình kết nối sinh viên năm cuối với các chuyên gia trong ngành thông qua hình thức mentorship. Mỗi sinh viên sẽ được ghép cặp với một mentor từ doanh nghiệp đối tác, gặp gỡ định kỳ 2 tuần/lần để định hướng nghề nghiệp và phát triển kỹ năng thực tế.',
  FALSE, 3, 1, 14, 1, 32, NOW() - INTERVAL 20 DAY
),
(
  'Tái chế rác thải điện tử trong khuôn viên trường',
  'Đặt các thùng thu gom rác thải điện tử (pin cũ, thiết bị hỏng) tại mỗi tòa nhà. Phối hợp với công ty tái chế để xử lý đúng quy chuẩn môi trường. Tổ chức các buổi tuyên truyền nâng cao ý thức bảo vệ môi trường cho sinh viên.',
  FALSE, 3, 1, 15, 1, 18, NOW() - INTERVAL 15 DAY
),
(
  'Ứng dụng theo dõi sức khỏe tâm thần cho sinh viên',
  'Phát triển ứng dụng mobile miễn phí cho sinh viên để theo dõi sức khỏe tâm thần, cung cấp bài tập thiền và thở, kết nối với tư vấn viên của trường khi cần. Dữ liệu được bảo mật hoàn toàn, không chia sẻ với bên thứ ba.',
  TRUE, 3, 1, 16, 1, 55, NOW() - INTERVAL 10 DAY
),

-- Duy ideas (AuthorId = 5)
(
  'Lắp đặt tấm pin năng lượng mặt trời trên mái nhà',
  'Đề xuất lắp đặt hệ thống pin mặt trời trên toàn bộ mái nhà của các tòa nhà học tập. Ước tính tiết kiệm được 30-40% chi phí điện hàng tháng, đồng thời giảm lượng khí CO2 thải ra môi trường. Vốn đầu tư hoàn vốn trong 5-7 năm.',
  FALSE, 5, 1, 15, 1, 89, NOW() - INTERVAL 22 DAY
),
(
  'Hệ thống đặt phòng học nhóm trực tuyến',
  'Xây dựng website/app cho phép sinh viên đặt trước phòng học nhóm, phòng thực hành, phòng máy tính theo lịch cụ thể. Tránh tình trạng tranh giành phòng học, tối ưu hóa việc sử dụng cơ sở vật chất của trường và giảm tải cho bộ phận quản lý.',
  FALSE, 5, 1, 13, 1, 63, NOW() - INTERVAL 18 DAY
),
(
  'Quỹ hỗ trợ sinh viên khởi nghiệp',
  'Thành lập quỹ khởi nghiệp nội bộ với mức hỗ trợ từ 5-20 triệu đồng cho các dự án khởi nghiệp của sinh viên. Hội đồng gồm giảng viên và đại diện doanh nghiệp xét duyệt hồ sơ mỗi học kỳ. Đây là cơ hội để sinh viên trải nghiệm thực tế kinh doanh ngay khi còn ngồi trên ghế nhà trường.',
  FALSE, 5, 1, 17, 1, 41, NOW() - INTERVAL 12 DAY
),
(
  'Câu lạc bộ trao đổi ngôn ngữ đa văn hóa',
  'Thành lập câu lạc bộ Language Exchange kết nối sinh viên Việt Nam với sinh viên quốc tế đang học tại trường. Tổ chức buổi gặp gỡ hàng tuần, các sự kiện văn hóa và chương trình trao đổi để tăng cường kỹ năng ngoại ngữ và hiểu biết đa văn hóa.',
  FALSE, 5, 1, 18, 1, 27, NOW() - INTERVAL 8 DAY
),
(
  'Số hóa thư viện - Mượn sách không cần thẻ',
  'Tích hợp hệ thống mượn trả sách thư viện với thẻ sinh viên thông minh (hoặc QR code). Sinh viên có thể đặt mượn sách online, nhận thông báo khi sách về kho, gia hạn mượn qua app. Giảm thời gian chờ đợi và thủ tục hành chính không cần thiết.',
  TRUE, 5, 1, 14, 1, 74, NOW() - INTERVAL 5 DAY
),
(
  'Phòng gym và yoga miễn phí cho sinh viên',
  'Cải tạo khu vực kho không sử dụng thành phòng tập gym và yoga miễn phí cho sinh viên và cán bộ. Trang bị thiết bị cơ bản, thuê huấn luyện viên part-time 3 buổi/tuần. Góp phần cải thiện sức khỏe thể chất và giảm stress cho cộng đồng trường học.',
  FALSE, 3, 1, 16, 1, 36, NOW() - INTERVAL 3 DAY
);

-- Verify
SELECT 
  i.Id,
  i.Title,
  u.FullName AS Author,
  c.Name AS Category,
  d.Name AS Department,
  i.IsAnonymous,
  i.ViewCount,
  i.CreatedAt
FROM ideas i
JOIN users u ON i.AuthorId = u.Id
JOIN categories c ON i.CategoryId = c.Id
LEFT JOIN departments d ON i.DepartmentId = d.Id
ORDER BY i.CreatedAt DESC;
