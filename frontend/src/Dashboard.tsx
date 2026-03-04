import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "./authService";
import { topicService, ideaService } from "./services";
import type { Topic, Idea } from "./types";
import "./Dashboard.css";

function Dashboard() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [popularIdeas, setPopularIdeas] = useState<Idea[]>([]);
  const [latestIdeas, setLatestIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const isAdmin = user?.role === "Administrator";

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [topicsData, popularData, latestData] = await Promise.all([
          topicService.getAllTopics(),
          ideaService.getPopularIdeas(5),
          ideaService.getLatestIdeas(5),
        ]);
        setTopics(topicsData);
        setPopularIdeas(popularData);
        setLatestIdeas(latestData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-body">
        <div className="welcome-bar">
          <div>
            <h2>Chào, {user?.fullName?.split(" ").slice(-1)[0]}!</h2>
            <p>
              {isAdmin
                ? "Bảng điều khiển quản trị viên"
                : "Khám phá và đóng góp ý tưởng của bạn"}
            </p>
          </div>
          {!isAdmin && (
            <button
              className="btn-new-idea"
              onClick={() => navigate("/topics")}
            >
              + Gửi ý tưởng
            </button>
          )}
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-num">{topics.length}</span>
            <span className="stat-label">Topics đang mở</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">
              {topics.reduce((sum, t) => sum + (t.ideaCount || 0), 0)}
            </span>
            <span className="stat-label">Tổng ý tưởng</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{popularIdeas.length}</span>
            <span className="stat-label">Ý tưởng nổi bật</span>
          </div>
          <div className="stat-card">
            <span className="stat-num stat-dept">
              {user?.department?.name ?? "N/A"}
            </span>
            <span className="stat-label">Khoa của bạn</span>
          </div>
        </div>

        <div className="content-grid">
          <div className="panel">
            <div className="panel-head">
              <h3>Ý tưởng phổ biến</h3>
            </div>
            <div className="idea-list">
              {popularIdeas.length > 0 ? (
                popularIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="idea-row"
                    onClick={() => navigate(`/idea/${idea.id}`)}
                  >
                    <div className="idea-row-main">
                      <span className="idea-row-title">{idea.title}</span>
                      <p className="idea-row-excerpt">
                        {idea.content?.substring(0, 90) ?? ""}
                      </p>
                    </div>
                    <div className="idea-row-stats">
                      <span>👁 {idea.viewCount}</span>
                      <span>↑ {idea.thumbsUpCount}</span>
                      <span>💬 {idea.commentCount ?? 0}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">Chưa có dữ liệu</p>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Mới nhất</h3>
            </div>
            <div className="idea-list">
              {latestIdeas.length > 0 ? (
                latestIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="idea-row"
                    onClick={() => navigate(`/idea/${idea.id}`)}
                  >
                    <div className="idea-row-main">
                      <span className="idea-row-title">{idea.title}</span>
                      <p className="idea-row-excerpt">
                        {idea.content?.substring(0, 90) ?? ""}
                      </p>
                    </div>
                    <div className="idea-row-meta">
                      <span>
                        {idea.isAnonymous ? "Ẩn danh" : idea.author?.fullName}
                      </span>
                      <span>{formatDate(idea.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">Chưa có dữ liệu</p>
              )}
            </div>
          </div>
        </div>

        {!isAdmin && topics.length > 0 && (
          <div className="topics-panel">
            <div className="panel-head">
              <h3>Topics đang mở</h3>
              <button className="link-btn" onClick={() => navigate("/topics")}>
                Xem tất cả →
              </button>
            </div>
            <div className="topics-grid">
              {topics.slice(0, 4).map((topic) => (
                <div
                  key={topic.id}
                  className="topic-tile"
                  onClick={() => navigate(`/topic/${topic.id}`)}
                >
                  <h4>{topic.name}</h4>
                  <p>{topic.description}</p>
                  <div className="topic-tile-footer">
                    <span className="topic-deadline">
                      Hạn:{" "}
                      {formatDate(
                        topic.ideaSubmissionDeadline ?? topic.closureDate,
                      )}
                    </span>
                    <span className="topic-count">
                      {topic.ideaCount ?? 0} ý tưởng
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="admin-quick-panel">
            <h3>Truy cập nhanh</h3>
            <div className="quick-links">
              <button
                className="quick-link-card"
                onClick={() => navigate("/admin")}
              >
                <span className="ql-icon">👥</span>
                <span>Quản lý người dùng</span>
              </button>
              <button
                className="quick-link-card"
                onClick={() => navigate("/admin")}
              >
                <span className="ql-icon">📋</span>
                <span>Quản lý Topics</span>
              </button>
              <button
                className="quick-link-card"
                onClick={() => navigate("/admin")}
              >
                <span className="ql-icon">💡</span>
                <span>Danh sách ý tưởng</span>
              </button>
              <button
                className="quick-link-card"
                onClick={() => navigate("/admin")}
              >
                <span className="ql-icon">📊</span>
                <span>Thống kê</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
