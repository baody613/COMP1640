import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authService } from "./authService";
import "./IdeaForm.css";
import { categoryService, ideaService, topicService } from "./services";
import type { Category, Topic } from "./types";

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
      alert("You have successfully agreed to Terms & Conditions!");
      // Reload the page to refresh user state
      window.location.reload();
    } catch (error) {
      console.error("Failed to agree terms:", error);
      alert("Unable to update status. Please try again.");
    } finally {
      setAgreeingTerms(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user?.agreedTerms) {
      alert("You need to agree to Terms & Conditions before submitting an idea!");
      return;
    }

    if (!topicId) {
      alert("Please select a topic!");
      return;
    }

    if (!categoryId) {
      alert("Please select a category!");
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
        "Successfully created an idea! A notification email has been sent to the QA Coordinator.",
      );
      navigate(`/idea/${newIdea.id}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Failed to create idea:", error);
      alert(
        err.response?.data?.message ||
          "Unable to create idea. Please check the deadline.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user?.agreedTerms) {
    return (
      <div className="terms-warning">
        <h2>⚠️ Terms & Conditions Not Agreed</h2>
        <p>You need to agree to Terms & Conditions before submitting an idea.</p>
        <div className="terms-warning-content">
          <p>
            Please read and agree to the{" "}
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
            {agreeingTerms ? "Processing..." : "✓ I Agree"}
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="idea-form-container">
      <header className="form-header">
        <div className="form-header-left">
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
            ⌂
          </button>
        </div>
        <span className="form-header-title">Submit New Idea</span>
        <div className="form-header-right" />
      </header>

      <div className="form-content">
        <div className="form-card">
          {topic && (
            <div className="topic-info">
              <h3>📚 Topic: {topic.name}</h3>
              <p>{topic.description}</p>
              <div className="topic-deadlines">
                <span>
                  📅 Idea Submission Deadline:{" "}
                  {new Date(topic.ideaSubmissionDeadline).toLocaleDateString(
                    "en-US",
                  )}
                </span>
                <span>
                  💬 Comment Deadline:{" "}
                  {new Date(topic.commentDeadline).toLocaleDateString("en-US")}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="idea-form">
            <div className="form-group">
              <label htmlFor="title">Idea Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter idea title..."
                required
                maxLength={200}
              />
              <small>{title.length}/200 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="content">Idea Content *</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your idea in detail..."
                rows={10}
                required
              />
              <small>{content.length} characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
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
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="files">Attachments (Optional)</label>
              <input
                id="files"
                type="file"
                onChange={(e) => setFiles(e.target.files)}
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
              />
              <small>
                Accepted: PDF, Word, Excel, PowerPoint, images. Max 10MB per file.
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
                <span>Submit Anonymously</span>
              </label>
              <small>
                If selected, your name will not be displayed to others.
              </small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-cancel"
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Idea"}
              </button>
            </div>
          </form>

          <div className="form-notice">
            <h4>📌 Important:</h4>
            <ul>
              <li>Ideas must be submitted before the topic deadline</li>
              <li>After submission, the QA Coordinator will receive a notification email</li>
              <li>Ideas cannot be edited after submission</li>
              <li>If submitted anonymously, only QA Manager/Admin will know your identity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IdeaForm;
