import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ideaService, topicService } from "./services";
import "./Topics.css";
import type { Idea, Topic } from "./types";

function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const data = await topicService.getAllTopics();
        setTopics(data);
        setLoading(false);
      } catch {
        setError("Unable to load topics list");
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
      setError("Unable to load ideas list");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="topics-container">
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
                    ).toLocaleDateString("en-US")}
                  </span>
                  <span>
                    💬 Comment:{" "}
                    {new Date(
                      topic.commentDeadline || topic.finalClosureDate || "",
                    ).toLocaleDateString("en-US")}
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
                <h2>💡 Ideas in "{selectedTopic.name}"</h2>
                <button
                  className="btn-add-idea"
                  onClick={() =>
                    navigate(`/topic/${selectedTopic.id}/new-idea`)
                  }
                >
                  + Add Idea
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
                    <p>No ideas yet in this topic</p>
                    <button
                      className="btn-primary"
                      onClick={() =>
                        navigate(`/topic/${selectedTopic.id}/new-idea`)
                      }
                    >
                      Create First Idea →
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
                    ← Previous
                  </button>
                  <span>
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => loadIdeas(selectedTopic, currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="select-topic">
              <h2>👈 Select a topic to view ideas</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topics;
