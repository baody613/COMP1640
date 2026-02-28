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

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🎓 COMP1640 IdeaHub</h1>
          <nav className="main-nav">
            <button
              onClick={() => navigate("/dashboard")}
              className="nav-btn active"
            >
              Dashboard
            </button>
            <button onClick={() => navigate("/topics")} className="nav-btn">
              Topics
            </button>
            {(user?.role === "QAManager" || user?.role === "Administrator") && (
              <button onClick={() => navigate("/admin")} className="nav-btn">
                Admin
              </button>
            )}
          </nav>
        </div>
        <div className="header-right">
          <span className="user-info">
            <strong>{user?.fullName}</strong> ({user?.role})
          </span>
          <button onClick={handleLogout} className="btn-logout">
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Chào mừng, {user?.fullName}! 👋</h2>
          <p>Hệ thống đóng góp ý tưởng trường đại học</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>{topics.length}</h3>
              <p>Active Topics</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💡</div>
            <div className="stat-info">
              <h3>{topics.reduce((sum, t) => sum + (t.ideaCount || 0), 0)}</h3>
              <p>Total Ideas</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <h3>{popularIdeas.length}</h3>
              <p>Popular Ideas</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>{user?.department?.name || "N/A"}</h3>
              <p>Your Department</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <h3>🔥 Ý tưởng phổ biến</h3>
            <div className="ideas-list">
              {popularIdeas.length > 0 ? (
                popularIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="idea-card"
                    onClick={() => navigate(`/idea/${idea.id}`)}
                  >
                    <h4>{idea.title}</h4>
                    <p className="idea-excerpt">
                      {idea.content.substring(0, 100)}...
                    </p>
                    <div className="idea-meta">
                      <span>👁️ {idea.viewCount}</span>
                      <span>👍 {idea.thumbsUpCount}</span>
                      <span>👎 {idea.thumbsDownCount}</span>
                      <span>💬 {idea.commentCount || 0}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-message">Chưa có ý tưởng phổ biến</p>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <h3>🆕 Ý tưởng mới nhất</h3>
            <div className="ideas-list">
              {latestIdeas.length > 0 ? (
                latestIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="idea-card"
                    onClick={() => navigate(`/idea/${idea.id}`)}
                  >
                    <h4>{idea.title}</h4>
                    <p className="idea-excerpt">
                      {idea.content.substring(0, 100)}...
                    </p>
                    <div className="idea-meta">
                      <span>
                        {idea.isAnonymous
                          ? "👤 Anonymous"
                          : `👤 ${idea.author?.fullName}`}
                      </span>
                      <span>
                        📅 {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-message">Chưa có ý tưởng mới</p>
              )}
            </div>
          </div>
        </div>

        <div className="topics-section">
          <div className="section-header">
            <h3>📚 Active Topics</h3>
            <button className="btn-primary" onClick={() => navigate("/topics")}>
              Xem tất cả →
            </button>
          </div>
          <div className="topics-grid">
            {topics.slice(0, 4).map((topic) => (
              <div
                key={topic.id}
                className="topic-card"
                onClick={() => navigate(`/topic/${topic.id}`)}
              >
                <h4>{topic.name}</h4>
                <p>{topic.description}</p>
                <div className="topic-dates">
                  <small>
                    📅 Deadline:{" "}
                    {new Date(
                      topic.ideaSubmissionDeadline || topic.closureDate || "",
                    ).toLocaleDateString("vi-VN")}
                  </small>
                  <small>
                    💬 Final:{" "}
                    {new Date(
                      topic.commentDeadline || topic.finalClosureDate || "",
                    ).toLocaleDateString("vi-VN")}
                  </small>
                </div>
                <div className="topic-stats">
                  <span className="idea-count">
                    {topic.ideaCount || 0} ideas
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
