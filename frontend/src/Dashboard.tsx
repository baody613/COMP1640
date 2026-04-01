import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "./authService";
import "./Dashboard.css";
import { ideaService, topicService } from "./services";
import type { Idea, Topic } from "./types";

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
    return new Date(dateStr).toLocaleDateString("en-US", {
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
            <h2>Hello, {user?.fullName?.split(" ").slice(-1)[0]}!</h2>
            <p>
              {isAdmin
                ? "Administrator Dashboard"
                : "Explore and contribute your ideas"}
            </p>
          </div>
          {!isAdmin && (
            <button
              className="btn-new-idea"
              onClick={() => navigate("/topics")}
            >
              + Submit an Idea
            </button>
          )}
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-num">{topics.length}</span>
            <span className="stat-label">Active Topics</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">
              {topics.reduce((sum, t) => sum + (t.ideaCount || 0), 0)}
            </span>
            <span className="stat-label">Total Ideas</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{popularIdeas.length}</span>
            <span className="stat-label">Popular Ideas</span>
          </div>
          <div className="stat-card">
            <span className="stat-num stat-dept">
              {user?.department?.name ?? "N/A"}
            </span>
            <span className="stat-label">Your Department</span>
          </div>
        </div>



        <div className="content-grid">
          <div className="panel">
            <div className="panel-head">
              <h3>Popular Ideas</h3>
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
                <p className="empty-state">No data</p>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Latest</h3>
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
                        {idea.isAnonymous ? "Anonymous" : idea.author?.fullName}
                      </span>
                      <span>{formatDate(idea.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">No data</p>
              )}
            </div>
          </div>
        </div>

        {!isAdmin && topics.length > 0 && (
          <div className="topics-panel">
            <div className="panel-head">
              <h3>Active Topics</h3>
              <button className="link-btn" onClick={() => navigate("/topics")}>
                View All →
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
                      Deadline:{" "}
                      {formatDate(
                        topic.ideaSubmissionDeadline ?? topic.closureDate,
                      )}
                    </span>
                    <span className="topic-count">
                      {topic.ideaCount ?? 0} ideas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="admin-quick-panel">
            <h3>Quick Access</h3>
            <div className="quick-links">
              <button
                className="quick-link-card"
                onClick={() => navigate("/admin")}
              >
                <span className="ql-icon">👥</span>
                <span>Manage Users</span>
              </button>
              <button
                className="quick-link-card"
                onClick={() => navigate("/admin")}
              >
                <span className="ql-icon">📋</span>
                <span>Manage Topics</span>
              </button>
              <button
                className="quick-link-card"
                onClick={() => navigate("/admin")}
              >
                <span className="ql-icon">💡</span>
                <span>Ideas List</span>
              </button>
              <button
                className="quick-link-card"
                onClick={() => navigate("/admin")}
              >
                <span className="ql-icon">📊</span>
                <span>Statistics</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
