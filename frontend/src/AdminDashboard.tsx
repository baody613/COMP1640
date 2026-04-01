import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { authService } from "./authService";
import {
  adminService,
  categoryService,
  ideaService,
  statisticsService,
  topicService,
  type CategoryStatistics,
  type DepartmentStatistics,
  type OverviewStatistics,
  type TopicFormData,
  type TopicStatistics,
  type AdminTopicIdeasResponse,
} from "./services";
import type { Category, Idea, Topic } from "./types";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  departmentId?: number;
  departmentName?: string;
  agreedTerms: boolean;
  isActive: boolean;
  createdAt: string;
}

type TabType =
  | "overview"
  | "users"
  | "topics"
  | "categories"
  | "statistics"
  | "topicIdeas";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(false);
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  // Overview data
  const [overviewStats, setOverviewStats] = useState<OverviewStatistics | null>(
    null,
  );

  // Users data
  const [users, setUsers] = useState<User[]>([]);

  // Topics data
  const [topics, setTopics] = useState<Topic[]>([]);

  // Categories data
  const [categories, setCategories] = useState<Category[]>([]);

  // Statistics data
  const [deptStats, setDeptStats] = useState<DepartmentStatistics[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStatistics[]>([]);
  const [topicStats, setTopicStats] = useState<TopicStatistics[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | "">("");
  const [topicIdeasData, setTopicIdeasData] =
    useState<AdminTopicIdeasResponse | null>(null);

  useEffect(() => {
    if (user?.role !== "Administrator") {
      alert("You don't have permission to access this page!");
      navigate("/dashboard");
      return;
    }
    loadOverviewData();
  }, [user, navigate]);

  const loadOverviewData = async () => {
    try {
      const stats = await statisticsService.getOverview();
      setOverviewStats(stats);
    } catch (error) {
      console.error("Failed to load overview:", error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Backend needs this endpoint: GET /api/Admin/users
      const response = await fetch("http://localhost:5000/api/Admin/users", {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async () => {
    setLoading(true);
    try {
      const data = await topicService.getAllTopics();
      setTopics(data);
    } catch (error) {
      console.error("Failed to load topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const [dept, cat, topic] = await Promise.all([
        statisticsService.getDepartmentStatistics(),
        statisticsService.getIdeasByCategory(),
        statisticsService.getIdeasByTopic(),
      ]);
      setDeptStats(dept);
      setCategoryStats(cat);
      setTopicStats(topic);
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTopicIdeasByTopic = async (topicId: number) => {
    setLoading(true);
    try {
      const data = await adminService.getIdeasWithDocumentsByTopic(topicId);
      setTopicIdeasData(data);
    } catch (error) {
      console.error("Failed to load topic ideas and documents:", error);
      setTopicIdeasData(null);
      alert("Không thể tải dữ liệu ý tưởng và file đính kèm của topic này");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") loadUsers();
    else if (activeTab === "topics") loadTopics();
    else if (activeTab === "categories") loadCategories();
    else if (activeTab === "statistics") loadStatistics();
    else if (activeTab === "topicIdeas") {
      loadTopics();
    }
  }, [activeTab]);

  const handleExportCSV = async (topicId: number) => {
    try {
      await adminService.exportIdeasToCSV(topicId);
      alert("CSV export successful!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed!");
    }
  };

  const handleExportDocuments = async (topicId: number) => {
    try {
      await adminService.exportDocumentsZIP(topicId);
      alert("Documents export successful!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed!");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          👥 Manage Users
        </button>
        <button
          className={`tab ${activeTab === "topics" ? "active" : ""}`}
          onClick={() => setActiveTab("topics")}
        >
          📚 Manage Topics
        </button>
        <button
          className={`tab ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          🏷️ Manage Categories
        </button>
        <button
          className={`tab ${activeTab === "statistics" ? "active" : ""}`}
          onClick={() => setActiveTab("statistics")}
        >
          📈 Statistics
        </button>
        <button
          className={`tab ${activeTab === "topicIdeas" ? "active" : ""}`}
          onClick={() => setActiveTab("topicIdeas")}
        >
          📎 Ý tưởng & File Upload
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "overview" && (
          <OverviewTab stats={overviewStats} loading={loading} />
        )}
        {activeTab === "users" && (
          <UsersTab users={users} loading={loading} onRefresh={loadUsers} />
        )}
        {activeTab === "topics" && (
          <TopicsTab
            topics={topics}
            loading={loading}
            onRefresh={loadTopics}
            onExportCSV={handleExportCSV}
            onExportDocs={handleExportDocuments}
          />
        )}
        {activeTab === "categories" && (
          <CategoriesTab
            categories={categories}
            loading={loading}
            onRefresh={loadCategories}
          />
        )}
        {activeTab === "statistics" && (
          <StatisticsTab
            deptStats={deptStats}
            categoryStats={categoryStats}
            topicStats={topicStats}
            loading={loading}
          />
        )}
        {activeTab === "topicIdeas" && (
          <TopicIdeasFilesTab
            topics={topics}
            loading={loading}
            selectedTopicId={selectedTopicId}
            topicIdeasData={topicIdeasData}
            onSelectTopic={(topicId) => {
              setSelectedTopicId(topicId);
              setTopicIdeasData(null);
            }}
            onLoadTopicIdeas={loadTopicIdeasByTopic}
            onRefreshTopics={loadTopics}
          />
        )}
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Topic Ideas + Files Tab Component
function TopicIdeasFilesTab({
  topics,
  loading,
  selectedTopicId,
  topicIdeasData,
  onSelectTopic,
  onLoadTopicIdeas,
  onRefreshTopics,
}: {
  topics: Topic[];
  loading: boolean;
  selectedTopicId: number | "";
  topicIdeasData: AdminTopicIdeasResponse | null;
  onSelectTopic: (topicId: number | "") => void;
  onLoadTopicIdeas: (topicId: number) => void;
  onRefreshTopics: () => void;
}) {
  return (
    <div className="topic-ideas-tab">
      <div className="tab-header">
        <h2>📎 Ý tưởng của Staff và file upload theo Topic</h2>
        <button className="btn-secondary" onClick={onRefreshTopics}>
          🔄 Làm mới topics
        </button>
      </div>

      <div className="topic-ideas-controls">
        <label htmlFor="topic-select">Chọn topic:</label>
        <select
          id="topic-select"
          value={selectedTopicId}
          onChange={(e) =>
            onSelectTopic(e.target.value ? Number(e.target.value) : "")
          }
        >
          <option value="">-- Chọn một topic --</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
        <button
          className="btn-primary"
          disabled={selectedTopicId === "" || loading}
          onClick={() => {
            if (selectedTopicId !== "") onLoadTopicIdeas(selectedTopicId);
          }}
        >
          {loading ? "Đang tải..." : "Xem dữ liệu"}
        </button>
      </div>

      {topicIdeasData && (
        <div className="topic-ideas-summary">
          <div className="summary-card">
            <span className="summary-label">Topic</span>
            <strong>{topicIdeasData.topicName}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Tổng ý tưởng</span>
            <strong>{topicIdeasData.totalIdeas}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Tổng file upload</span>
            <strong>{topicIdeasData.totalDocuments}</strong>
          </div>
        </div>
      )}

      {topicIdeasData && topicIdeasData.ideas.length === 0 && (
        <div className="empty">Topic này chưa có ý tưởng nào.</div>
      )}

      <div className="topic-ideas-list">
        {topicIdeasData?.ideas.map((idea) => (
          <div key={idea.id} className="idea-doc-card">
            <div className="idea-doc-header">
              <h3>{idea.title}</h3>
              <span className="idea-doc-meta">
                {new Date(idea.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>

            <div className="idea-doc-info-grid">
              <div>
                <span className="label">Tác giả</span>
                <strong>{idea.authorName}</strong>
              </div>
              <div>
                <span className="label">Email</span>
                <strong>{idea.authorEmail || "Ẩn"}</strong>
              </div>
              <div>
                <span className="label">Phòng ban</span>
                <strong>{idea.departmentName}</strong>
              </div>
              <div>
                <span className="label">Category</span>
                <strong>{idea.categoryName}</strong>
              </div>
            </div>

            <p className="idea-doc-content">{idea.content}</p>

            <div className="documents-block">
              <h4>📁 File upload ({idea.documents.length})</h4>
              {idea.documents.length === 0 ? (
                <p className="no-docs">Không có file đính kèm.</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tên file</th>
                      <th>Kích thước</th>
                      <th>Ngày tải lên</th>
                      <th>Liên kết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {idea.documents.map((doc) => (
                      <tr key={doc.id}>
                        <td>{doc.fileName}</td>
                        <td>{formatFileSize(doc.fileSize)}</td>
                        <td>{new Date(doc.uploadedAt).toLocaleString("vi-VN")}</td>
                        <td>
                          <a
                            href={`http://localhost:5000${doc.filePath}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Mở file
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({
  stats,
  loading,
}: {
  stats: OverviewStatistics | null;
  loading: boolean;
}) {
  if (loading) return <div className="loading">Loading...</div>;
  if (!stats) return <div className="empty">No data available</div>;

  return (
    <div className="overview-tab">
      <h2>📊 System Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💡</div>
          <div className="stat-value">{stats.totalIdeas}</div>
          <div className="stat-label">Total Ideas</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-value">{stats.totalComments}</div>
          <div className="stat-label">Total Comments</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-value">{stats.totalDepartments}</div>
          <div className="stat-label">Total Departments</div>
        </div>
      </div>
    </div>
  );
}

// Users Tab Component
function UsersTab({
  users,
  loading,
  onRefresh,
}: {
  users: User[];
  loading: boolean;
  onRefresh: () => void;
}) {
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="users-tab">
      <div className="tab-header">
        <h2>👥 Manage Users</h2>
        <button className="btn-primary" onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Agreed T&C</th>
              <th>Status</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.departmentName || "N/A"}</td>
                <td>{user.agreedTerms ? "✅" : "❌"}</td>
                <td>{user.isActive ? "🟢 Active" : "🔴 Inactive"}</td>
                <td>{new Date(user.createdAt).toLocaleDateString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Topics Tab Component
function TopicsTab({
  topics,
  loading,
  onRefresh,
  onExportCSV,
  onExportDocs,
}: {
  topics: Topic[];
  loading: boolean;
  onRefresh: () => void;
  onExportCSV: (id: number) => void;
  onExportDocs: (id: number) => void;
}) {
  const navigate = useNavigate();
  
  // Helper: convert ISO string → value for <input type="datetime-local">
  const toInputVal = (iso: string | undefined) => {
    if (!iso) return "";
    const d = new Date(iso);
    // Format: YYYY-MM-DDTHH:mm
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const emptyForm: TopicFormData = {
    name: "",
    description: "",
    ideaSubmissionDeadline: "",
    commentDeadline: "",
  };

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<TopicFormData>(emptyForm);
  const [createErr, setCreateErr] = useState("");
  const [creating, setCreating] = useState(false);

  // editingId: id of topic being edited, null = not editing any
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<TopicFormData>(emptyForm);
  const [editErr, setEditErr] = useState("");
  const [saving, setSaving] = useState(false);

  // Popular and Latest Ideas
  const [popularIdeas, setPopularIdeas] = useState<Idea[]>([]);
  const [latestIdeas, setLatestIdeas] = useState<Idea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(false);

  // Load popular and latest ideas
  useEffect(() => {
    const loadIdeas = async () => {
      setIdeasLoading(true);
      try {
        const [popular, latest] = await Promise.all([
          ideaService.getPopularIdeas(5),
          ideaService.getLatestIdeas(5),
        ]);
        setPopularIdeas(popular);
        setLatestIdeas(latest);
      } catch (error) {
        console.error("Failed to load ideas:", error);
      } finally {
        setIdeasLoading(false);
      }
    };
    loadIdeas();
  }, []);

  const openEdit = (topic: Topic) => {
    setEditingId(topic.id);
    setEditErr("");
    setEditForm({
      name: topic.name,
      description: topic.description,
      ideaSubmissionDeadline: toInputVal(
        topic.ideaSubmissionDeadline || topic.closureDate,
      ),
      commentDeadline: toInputVal(
        topic.commentDeadline || topic.finalClosureDate,
      ),
    });
  };

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      setCreateErr("Please enter topic name");
      return;
    }
    if (!createForm.ideaSubmissionDeadline) {
      setCreateErr("Please select idea submission deadline");
      return;
    }
    if (!createForm.commentDeadline) {
      setCreateErr("Please select comment deadline");
      return;
    }
    if (
      new Date(createForm.commentDeadline) <=
      new Date(createForm.ideaSubmissionDeadline)
    ) {
      setCreateErr("Comment deadline must be after idea submission deadline");
      return;
    }
    setCreating(true);
    setCreateErr("");
    try {
      await topicService.createTopic({
        ...createForm,
        ideaSubmissionDeadline: new Date(
          createForm.ideaSubmissionDeadline,
        ).toISOString(),
        commentDeadline: new Date(createForm.commentDeadline).toISOString(),
      });
      setShowCreate(false);
      setCreateForm(emptyForm);
      onRefresh();
    } catch {
      setCreateErr("Failed to create topic. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async () => {
    if (!editingId) return;
    if (!editForm.name.trim()) {
      setEditErr("Please enter topic name");
      return;
    }
    if (!editForm.ideaSubmissionDeadline) {
      setEditErr("Please select idea submission deadline");
      return;
    }
    if (!editForm.commentDeadline) {
      setEditErr("Please select comment deadline");
      return;
    }
    if (
      new Date(editForm.commentDeadline) <=
      new Date(editForm.ideaSubmissionDeadline)
    ) {
      setEditErr("Comment deadline must be after idea submission deadline");
      return;
    }
    setSaving(true);
    setEditErr("");
    try {
      await topicService.updateTopic(editingId, {
        ...editForm,
        ideaSubmissionDeadline: new Date(
          editForm.ideaSubmissionDeadline,
        ).toISOString(),
        commentDeadline: new Date(editForm.commentDeadline).toISOString(),
      });
      setEditingId(null);
      onRefresh();
    } catch {
      setEditErr("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      !window.confirm(`Delete topic "${name}"? This action cannot be undone.`)
    )
      return;
    try {
      await topicService.deleteTopic(id);
      onRefresh();
    } catch {
      alert("Delete failed. Topic may contain data.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="topics-tab">
      <div className="tab-header">
        <h2>📚 Manage Topics</h2>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <button
            className="btn-primary"
            onClick={() => {
              setShowCreate(true);
              setCreateForm(emptyForm);
              setCreateErr("");
            }}
          >
            + Create New Topic
          </button>
          <button className="btn-secondary" onClick={onRefresh}>
            🔄 Refresh
          </button>
        </div>
        
      </div>
      
      {/* Popular and Latest Ideas Sections */}
      {!ideasLoading && (
        <div className="content-grid" style={{ marginBottom: "2rem" }}>
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
                    style={{ cursor: "pointer" }}
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
                    style={{ cursor: "pointer" }}
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
                      <span>{new Date(idea.createdAt).toLocaleDateString("en-US")}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">No data</p>
              )}
            </div>
          </div>
        </div>
      )}

      
      {showCreate && (
        <div className="topic-form-box">
          <h3>Create New Topic</h3>
          <div className="form-row">
            <label>
              Topic Name <span className="req">*</span>
            </label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, name: e.target.value }))
              }
              placeholder="Enter topic name..."
            />
          </div>
          <div className="form-row">
            <label>Description</label>
            <textarea
              value={createForm.description}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Brief description of topic..."
              rows={2}
            />
          </div>
          <div className="form-row-2col">
            <div className="form-row">
              <label>
                📅 Idea Submission Deadline <span className="req">*</span>
              </label>
              <input
                type="datetime-local"
                value={createForm.ideaSubmissionDeadline}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    ideaSubmissionDeadline: e.target.value,
                  }))
                }
              />
            </div>
            <div className="form-row">
              <label>
                💬 Comment Deadline <span className="req">*</span>
              </label>
              <input
                type="datetime-local"
                value={createForm.commentDeadline}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    commentDeadline: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          {createErr && <p className="form-error">{createErr}</p>}
          <div className="form-actions">
            <button
              className="btn-primary"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? "Creating..." : "✓ Create Topic"}
            </button>
            <button className="btn-ghost" onClick={() => setShowCreate(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── List of topics ── */}
      <div className="topics-grid">
        {topics.map((topic) =>
          editingId === topic.id ? (
            /* ── Inline edit form ── */
            <div key={topic.id} className="topic-card-admin topic-card-edit">
              <h3>✏️ Edit Topic</h3>
              <div className="form-row">
                <label>
                  Topic Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="form-row">
                <label>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={2}
                />
              </div>
              <div className="form-row">
                <label>
                  📅 Idea Submission Deadline <span className="req">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={editForm.ideaSubmissionDeadline}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      ideaSubmissionDeadline: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-row">
                <label>
                  💬 Comment Deadline <span className="req">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={editForm.commentDeadline}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      commentDeadline: e.target.value,
                    }))
                  }
                />
              </div>
              {editErr && <p className="form-error">{editErr}</p>}
              <div className="form-actions">
                <button
                  className="btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "✓ Save"}
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* ── View card ── */
            <div key={topic.id} className="topic-card-admin">
              <div className="topic-card-title-row">
                <h3>{topic.name}</h3>
                <span
                  className={`topic-status-dot ${topic.isActive ? "active" : "inactive"}`}
                >
                  {topic.isActive ? "Active" : "Closed"}
                </span>
              </div>
              <p>{topic.description}</p>
              <div className="topic-dates">
                <div className="deadline-item">
                  <span className="deadline-label">📅 Idea Submission Deadline</span>
                  <strong className="deadline-val">
                    {new Date(
                      topic.ideaSubmissionDeadline || topic.closureDate || "",
                    ).toLocaleString("en-US")}
                  </strong>
                </div>
                <div className="deadline-item">
                  <span className="deadline-label">💬 Comment Deadline</span>
                  <strong className="deadline-val">
                    {new Date(
                      topic.commentDeadline || topic.finalClosureDate || "",
                    ).toLocaleString("en-US")}
                  </strong>
                </div>
              </div>
              <div className="topic-stats-admin">
                <span>💡 {topic.ideaCount || 0} ideas</span>
                <span>🏷️ {topic.categories?.length || 0} categories</span>
              </div>
              <div className="topic-actions">
                <button className="btn-edit" onClick={() => openEdit(topic)}>
                  ✏️ Edit Deadline
                </button>
                <button
                  className="btn-export"
                  onClick={() => onExportCSV(topic.id)}
                >
                  📥 CSV
                </button>
                <button
                  className="btn-export"
                  onClick={() => onExportDocs(topic.id)}
                >
                  📦 Docs
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(topic.id, topic.name)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

// Categories Tab Component
function CategoriesTab({
  categories,
  loading,
  onRefresh,
}: {
  categories: Category[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatTopicId, setNewCatTopicId] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    topicService.getAllTopics().then(setTopics).catch(console.error);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || newCatTopicId === "") return;
    setSubmitting(true);
    try {
      await categoryService.createCategory(newCatName.trim(), Number(newCatTopicId), newCatDesc.trim() || undefined);
      setNewCatName("");
      setNewCatDesc("");
      setNewCatTopicId("");
      setShowForm(false);
      onRefresh();
    } catch {
      alert("Failed to create category!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await categoryService.deleteCategory(cat.id);
      onRefresh();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || "Failed to delete category (may already be in use)!");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="categories-tab">
      <div className="tab-header">
        <h2>🏷️ Manage Categories</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Close" : "➕ Add Category"}
          </button>
          <button className="btn-secondary" onClick={onRefresh}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="create-form" style={{ marginBottom: 24, padding: 16, background: "#f8f9fa", borderRadius: 8 }}>
          <h3>Create New Category</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 480 }}>
            <input
              className="form-input"
              placeholder="Category name *"
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              required
            />
            <input
              className="form-input"
              placeholder="Description (optional)"
              value={newCatDesc}
              onChange={e => setNewCatDesc(e.target.value)}
            />
            <select
              className="form-input"
              value={newCatTopicId}
              onChange={e => setNewCatTopicId(e.target.value === "" ? "" : Number(e.target.value))}
              required
            >
              <option value="">-- Select Topic *</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      )}

      <div className="categories-grid">
        {categories.length === 0 && <p>No categories available.</p>}
        {categories.map((cat) => (
          <div key={cat.id} className="category-card-admin">
            <div style={{ flex: 1 }}>
              <h3>{cat.name}</h3>
              {cat.description && <p>{cat.description}</p>}
            </div>
            <button
              className="btn-delete"
              onClick={() => handleDelete(cat)}
              title="Delete category"
              style={{ marginTop: 8 }}
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Statistics Tab Component
function StatisticsTab({
  deptStats,
  categoryStats,
  topicStats,
  loading,
}: {
  deptStats: DepartmentStatistics[];
  categoryStats: CategoryStatistics[];
  topicStats: TopicStatistics[];
  loading: boolean;
}) {
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="statistics-tab">
      <h2>📈 Detailed Statistics</h2>

      <div className="stats-section">
        <h3>🏢 Statistics by Department</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Staff Count</th>
              <th>Idea Count</th>
              <th>Comment Count</th>
              <th>Views</th>
            </tr>
          </thead>
          <tbody>
            {deptStats.map((dept) => (
              <tr key={dept.departmentId}>
                <td>
                  <strong>{dept.departmentName}</strong>
                </td>
                <td>{dept.staffCount}</td>
                <td>{dept.ideaCount}</td>
                <td>{dept.commentCount}</td>
                <td>{dept.totalViews}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="stats-section">
        <h3>🏷️ Statistics by Category</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Idea Count</th>
              <th>Comment Count</th>
              <th>👍 Thumbs Up</th>
              <th>👎 Thumbs Down</th>
            </tr>
          </thead>
          <tbody>
            {categoryStats.map((cat) => (
              <tr key={cat.categoryId}>
                <td>
                  <strong>{cat.categoryName}</strong>
                </td>
                <td>{cat.ideaCount}</td>
                <td>{cat.commentCount}</td>
                <td className="thumbs-up">{cat.thumbsUpCount}</td>
                <td className="thumbs-down">{cat.thumbsDownCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="stats-section">
        <h3>📚 Statistics by Topic</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Idea Count</th>
              <th>Comment Count</th>
              <th>Views</th>
              <th>Participants</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {topicStats.map((topic) => (
              <tr key={topic.topicId}>
                <td>
                  <strong>{topic.topicName}</strong>
                </td>
                <td>{topic.ideaCount}</td>
                <td>{topic.commentCount}</td>
                <td>{topic.totalViews}</td>
                <td>{topic.participantCount}</td>
                <td>
                  {topic.isActive ? (
                    <span className="status-active">🟢 Active</span>
                  ) : (
                    <span className="status-inactive">🔴 Inactive</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
