import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authService } from "./authService";
import { ideaService, categoryService, topicService } from "./services";
import type { Category, Topic } from "./types";
import "./IdeaForm.css";

function IdeaForm() {
  const { topicId } = useParams<{ topicId: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreeingTerms, setAgreeingTerms] = useState(false);
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, topicData] = await Promise.all([
          categoryService.getAllCategories(),
          topicId
            ? topicService.getTopicById(parseInt(topicId))
            : Promise.resolve(null),
        ]);
        setCategories(categoriesData);
        setTopic(topicData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, [topicId]);

  const handleAgreeTerms = async () => {
    setAgreeingTerms(true);
    try {
      await authService.agreeToTerms();
      // Update user in localStorage
      const updatedUser = await authService.getCurrentUserFromApi();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Bạn đã đồng ý với Terms & Conditions thành công!");
      // Reload the page to refresh user state
      window.location.reload();
    } catch (error) {
      console.error("Failed to agree terms:", error);
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    } finally {
      setAgreeingTerms(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user?.agreedTerms) {
      alert("Bạn cần đồng ý với Terms & Conditions trước khi gửi ý tưởng!");
      return;
    }

    if (!topicId) {
      alert("Vui lòng chọn topic!");
      return;
    }

    if (!categoryId) {
      alert("Vui lòng chọn danh mục!");
      return;
    }

    setLoading(true);

    try {
      const ideaData = {
        title,
        content,
        topicId: parseInt(topicId),
        categoryId,
        isAnonymous,
      };

      const newIdea = await ideaService.createIdea(ideaData);

      // Handle file uploads if any
      if (files && files.length > 0) {
        // Note: File upload would need to be implemented separately
        console.log("Files to upload:", files);
      }

      alert(
        "Đã tạo ý tưởng thành công! Email thông báo đã được gửi đến QA Coordinator.",
      );
      navigate(`/idea/${newIdea.id}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Failed to create idea:", error);
      alert(
        err.response?.data?.message ||
          "Không thể tạo ý tưởng. Vui lòng kiểm tra deadline.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user?.agreedTerms) {
    return (
      <div className="terms-warning">
        <h2>⚠️ Chưa đồng ý Terms & Conditions</h2>
        <p>Bạn cần đồng ý với Terms & Conditions trước khi gửi ý tưởng.</p>
        <div className="terms-warning-content">
          <p>
            Vui lòng đọc và đồng ý với{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms & Conditions
            </a>
          </p>
        </div>
        <div className="terms-warning-buttons">
          <button
            onClick={handleAgreeTerms}
            className="btn-primary"
            disabled={agreeingTerms}
          >
            {agreeingTerms ? "Đang xử lý..." : "✓ Tôi đồng ý"}
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-secondary"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="idea-form-container">
      <header className="form-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Quay lại
        </button>
        <h1>💡 Gửi ý tưởng mới</h1>
      </header>

      <div className="form-content">
        <div className="form-card">
          {topic && (
            <div className="topic-info">
              <h3>📚 Topic: {topic.name}</h3>
              <p>{topic.description}</p>
              <div className="topic-deadlines">
                <span>
                  📅 Deadline gửi ý tưởng:{" "}
                  {new Date(topic.ideaSubmissionDeadline).toLocaleDateString(
                    "vi-VN",
                  )}
                </span>
                <span>
                  💬 Deadline bình luận:{" "}
                  {new Date(topic.commentDeadline).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="idea-form">
            <div className="form-group">
              <label htmlFor="title">Tiêu đề ý tưởng *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề ý tưởng..."
                required
                maxLength={200}
              />
              <small>{title.length}/200 ký tự</small>
            </div>

            <div className="form-group">
              <label htmlFor="content">Nội dung ý tưởng *</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Mô tả chi tiết ý tưởng của bạn..."
                rows={10}
                required
              />
              <small>{content.length} ký tự</small>
            </div>

            <div className="form-group">
              <label htmlFor="category">Danh mục *</label>
              <select
                id="category"
                value={categoryId || ""}
                onChange={(e) =>
                  setCategoryId(
                    e.target.value ? parseInt(e.target.value) : undefined,
                  )
                }
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="files">Tệp đính kèm (tùy chọn)</label>
              <input
                id="files"
                type="file"
                onChange={(e) => setFiles(e.target.files)}
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
              />
              <small>
                Chấp nhận: PDF, Word, Excel, PowerPoint, hình ảnh. Tối đa
                10MB/file.
              </small>
            </div>

            <div className="form-group-checkbox">
              <label htmlFor="anonymous">
                <input
                  id="anonymous"
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <span>Gửi ẩn danh</span>
              </label>
              <small>
                Nếu chọn ẩn danh, tên của bạn sẽ không hiển thị với người khác.
              </small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-cancel"
                disabled={loading}
              >
                Hủy
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi ý tưởng"}
              </button>
            </div>
          </form>

          <div className="form-notice">
            <h4>📌 Lưu ý:</h4>
            <ul>
              <li>Ý tưởng phải được gửi trước deadline của topic</li>
              <li>Sau khi gửi, QA Coordinator sẽ nhận được email thông báo</li>
              <li>Ý tưởng không thể chỉnh sửa sau khi gửi</li>
              <li>Nếu gửi ẩn danh, chỉ QA Manager/Admin biết danh tính bạn</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IdeaForm;
