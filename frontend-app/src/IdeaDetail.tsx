import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "./authService";
import { ideaService, commentService } from "./services";
import type { Idea, Comment } from "./types";
import "./IdeaDetail.css";

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
      alert("Không thể thực hiện reaction. Vui lòng thử lại.");
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
      alert("Đã thêm comment thành công!");
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Không thể thêm comment. Vui lòng kiểm tra deadline.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa comment này?")) return;

    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
      alert("Đã xóa comment thành công!");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Không thể xóa comment.");
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!idea) {
    return (
      <div className="error-container">
        <h2>Không tìm thấy ý tưởng</h2>
        <button onClick={() => navigate("/topics")}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="idea-detail-container">
      <header className="idea-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Quay lại
        </button>
        <h1>💡 Chi tiết ý tưởng</h1>
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
              <span>👁️ {idea.viewCount} lượt xem</span>
              {idea.category && <span>🏷️ {idea.category.name}</span>}
            </div>
          </div>

          <div className="idea-body">
            <p>{idea.content}</p>
          </div>

          {idea.documents && idea.documents.length > 0 && (
            <div className="idea-documents">
              <h3>📎 Tệp đính kèm</h3>
              <div className="documents-list">
                {idea.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={`http://localhost:5001/api/document/download/${doc.id}`}
                    className="document-item"
                    download
                  >
                    📄 {doc.fileName} ({(doc.fileSize / 1024).toFixed(2)} KB)
                  </a>
                ))}
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
              placeholder="Viết comment của bạn..."
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
                Gửi ẩn danh
              </label>
              <button type="submit" className="btn-submit">
                Gửi comment
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
                        : `👤 ${comment.author?.fullName || "Unknown"}`}
                    </span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}{" "}
                      {new Date(comment.createdAt).toLocaleTimeString()}
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
                        🗑️ Xóa
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="empty-comments">
                Chưa có comment nào. Hãy là người đầu tiên!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IdeaDetail;
