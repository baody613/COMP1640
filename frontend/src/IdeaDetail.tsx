import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authService } from "./authService";
import "./IdeaDetail.css";
import { commentService, ideaService } from "./services";
import type { Comment, Idea } from "./types";

function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userReaction, setUserReaction] = useState<boolean | null>(null);
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loadIdeaData = async () => {
      if (!id) return;
      try {
        const [ideaData, commentsData] = await Promise.all([
          ideaService.getIdeaById(parseInt(id)),
          commentService.getCommentsByIdea(parseInt(id)),
        ]);
        setIdea(ideaData);
        setComments(commentsData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load idea:", error);
        setLoading(false);
      }
    };
    loadIdeaData();
  }, [id]);

  const handleReaction = async (isThumbsUp: boolean) => {
    if (!idea) return;
    try {
      if (userReaction === isThumbsUp) {
        // Remove reaction if clicking same button
        await ideaService.removeReaction(idea.id);
        setUserReaction(null);
        // Update counts
        if (isThumbsUp) {
          setIdea({ ...idea, thumbsUpCount: idea.thumbsUpCount - 1 });
        } else {
          setIdea({ ...idea, thumbsDownCount: idea.thumbsDownCount - 1 });
        }
      } else {
        // Add or change reaction
        await ideaService.addReaction(idea.id, isThumbsUp);
        const oldReaction = userReaction;
        setUserReaction(isThumbsUp);

        // Update counts
        const newIdea = { ...idea };
        if (oldReaction !== null) {
          // Changing reaction
          if (oldReaction) {
            newIdea.thumbsUpCount = idea.thumbsUpCount - 1;
            newIdea.thumbsDownCount = idea.thumbsDownCount + 1;
          } else {
            newIdea.thumbsUpCount = idea.thumbsUpCount + 1;
            newIdea.thumbsDownCount = idea.thumbsDownCount - 1;
          }
        } else {
          // New reaction
          if (isThumbsUp) {
            newIdea.thumbsUpCount = idea.thumbsUpCount + 1;
          } else {
            newIdea.thumbsDownCount = idea.thumbsDownCount + 1;
          }
        }
        setIdea(newIdea);
      }
    } catch (error) {
      console.error("Failed to react:", error);
      alert("Unable to perform reaction. Please try again.");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !idea) return;

    try {
      const comment = await commentService.createComment(idea.id, {
        content: newComment,
        isAnonymous,
      });
      setComments([...comments, comment]);
      setNewComment("");
      setIsAnonymous(false);
      alert("Successfully added comment!");
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Unable to add comment. Please check the deadline.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
      alert("Successfully deleted comment!");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Unable to delete comment.");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!idea) {
    return (
      <div className="error-container">
        <h2>Idea not found</h2>
        <button onClick={() => navigate("/topics")}>Back</button>
      </div>
    );
  }

  return (
    <div className="idea-detail-container">
      <header className="idea-header">
        <div className="idea-header-left">
          <button
            onClick={() => navigate(-1)}
            className="btn-back-sm"
            title="Back"
          >
            ←
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-home-sm"
            title="Home"
          >
            ⌄
          </button>
        </div>
        <span className="idea-header-title">Idea Details</span>
        <div className="idea-header-right" />
      </header>

      <div className="idea-content">
        <div className="idea-main">
          <div className="idea-title-section">
            <h2>{idea.title}</h2>
            <div className="idea-metadata">
              <span>
                {idea.isAnonymous
                  ? "👤 Anonymous"
                  : `👤 ${idea.author?.fullName || "Unknown"}`}
              </span>
              <span>📅 {new Date(idea.createdAt).toLocaleDateString()}</span>
              <span>👁️ {idea.viewCount} views</span>
              {idea.category && <span>🏷️ {idea.category.name}</span>}
            </div>
          </div>

          <div className="idea-body">
            <p>{idea.content}</p>
          </div>

          {idea.documents && idea.documents.length > 0 && (
            <div className="idea-documents">
              <h3>📎 Attachments</h3>
              <div className="documents-list">
                {idea.documents.map((doc) => {
                  const url = `http://${window.location.hostname}:5000${doc.filePath}`;
                  return (
                    <a
                      key={doc.id}
                      href={url}
                      className="document-item"
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          const res = await fetch(url);
                          if (!res.ok) throw new Error("Network error");
                          const blob = await res.blob();
                          const blobUrl = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = blobUrl;
                          a.download = doc.fileName;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          window.URL.revokeObjectURL(blobUrl);
                        } catch (err) {
                          console.error(
                            "Direct download failed, falling back to new tab:",
                            err,
                          );
                          window.open(url, "_blank");
                        }
                      }}
                    >
                      📄 {doc.fileName} ({(doc.fileSize / 1024).toFixed(2)} KB)
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <div className="reaction-section">
            <button
              className={`reaction-btn ${userReaction === true ? "active" : ""}`}
              onClick={() => handleReaction(true)}
            >
              👍 Thumbs Up ({idea.thumbsUpCount})
            </button>
            <button
              className={`reaction-btn ${userReaction === false ? "active" : ""}`}
              onClick={() => handleReaction(false)}
            >
              👎 Thumbs Down ({idea.thumbsDownCount})
            </button>
          </div>
        </div>

        <div className="comments-section">
          <h3>💬 Comments ({comments.length})</h3>

          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              rows={4}
              required
            />
            <div className="comment-form-footer">
              <label className="anonymous-checkbox">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                Submit Anonymously
              </label>
              <button type="submit" className="btn-submit">
                Submit Comment
              </button>
            </div>
          </form>

          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">
                      {comment.isAnonymous
                        ? "👤 Anonymous"
                        : `👤 ${comment.authorName || comment.author?.fullName || "Unknown"}`}
                    </span>
                    <span className="comment-date">
                      {comment.createdAt
                        ? `${new Date(comment.createdAt).toLocaleDateString("en-US")} ${new Date(comment.createdAt).toLocaleTimeString("en-US")}`
                        : "Just now"}
                    </span>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                  {(user?.id === comment.authorId ||
                    user?.role === "QAManager" ||
                    user?.role === "Administrator") && (
                    <div className="comment-actions">
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="btn-delete"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="empty-comments">No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IdeaDetail;
