import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "./authService";
import { topicService, ideaService } from "./services";
import type { Topic, Idea } from "./types";
import "./Topics.css";

function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const data = await topicService.getAllTopics();
        setTopics(data);
        setLoading(false);
      } catch {
        setError("Không thể tải danh sách topics");
        setLoading(false);
      }
    };
    loadTopics();
  }, []);

  const loadIdeas = async (topic: Topic, page: number = 1) => {
    setSelectedTopic(topic);
    setCurrentPage(page);
    try {
      const data = await ideaService.getIdeasByTopic(topic.id, page, 10);
      setIdeas(data.items || data);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError("Không thể tải danh sách ideas");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="topics-container">
      <header className="header">
        <div className="header-left">
          <h1>🎓 COMP1640 IdeaHub</h1>
          <nav className="main-nav">
            <button onClick={() => navigate("/dashboard")} className="nav-btn">
              Dashboard
            </button>
            <button
              onClick={() => navigate("/topics")}
              className="nav-btn active"
            >
              Topics
            </button>
          </nav>
        </div>
        <div className="user-info">
          <span>
            Xin chào, <strong>{user?.fullName}</strong>
          </span>
          <button onClick={handleLogout} className="btn-logout">
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="content">
        <div className="topics-section">
          <h2>📚 Topics ({topics.length})</h2>
          {error && <div className="error">{error}</div>}
          <div className="topics-list">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className={`topic-card ${selectedTopic?.id === topic.id ? "active" : ""}`}
                onClick={() => loadIdeas(topic)}
              >
                <h3>{topic.name}</h3>
                <p>{topic.description}</p>
                <div className="topic-meta">
                  <span>
                    📅 Deadline:{" "}
                    {new Date(
                      topic.ideaSubmissionDeadline || topic.closureDate || "",
                    ).toLocaleDateString("vi-VN")}
                  </span>
                  <span>
                    💬 Comment:{" "}
                    {new Date(
                      topic.commentDeadline || topic.finalClosureDate || "",
                    ).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="topic-stats">
                  <span>{topic.ideaCount || 0} ideas</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ideas-section">
          {selectedTopic ? (
            <>
              <div className="ideas-header">
                <h2>💡 Ý tưởng trong "{selectedTopic.name}"</h2>
                <button
                  className="btn-add-idea"
                  onClick={() =>
                    navigate(`/topic/${selectedTopic.id}/new-idea`)
                  }
                >
                  + Thêm ý tưởng
                </button>
              </div>
              <div className="ideas-list">
                {ideas.length > 0 ? (
                  ideas.map((idea) => (
                    <div
                      key={idea.id}
                      className="idea-card"
                      onClick={() => navigate(`/idea/${idea.id}`)}
                    >
                      <h3>{idea.title}</h3>
                      <p className="idea-content">
                        {idea.content.substring(0, 150)}...
                      </p>
                      <div className="idea-meta">
                        <span>
                          {idea.isAnonymous
                            ? "👤 Anonymous"
                            : `👤 ${idea.author?.fullName || "Unknown"}`}
                        </span>
                        <span>
                          📅 {new Date(idea.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="idea-stats">
                        <span>👁️ {idea.viewCount}</span>
                        <span>👍 {idea.thumbsUpCount}</span>
                        <span>👎 {idea.thumbsDownCount}</span>
                        <span>💬 {idea.commentCount || 0}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>Chưa có ý tưởng nào trong topic này</p>
                    <button
                      className="btn-primary"
                      onClick={() =>
                        navigate(`/topic/${selectedTopic.id}/new-idea`)
                      }
                    >
                      Tạo ý tưởng đầu tiên →
                    </button>
                  </div>
                )}
              </div>
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => loadIdeas(selectedTopic, currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Trước
                  </button>
                  <span>
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => loadIdeas(selectedTopic, currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="select-topic">
              <h2>👈 Chọn một topic để xem ý tưởng</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topics;
