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
  type AdminTopicIdeasResponse,
  type CategoryStatistics,
  type DepartmentStatistics,
  type OverviewStatistics,
  type PendingIdeasResponse,
  type TopicFormData,
  type TopicStatistics,
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
  | "topicIdeas"
  | "pendingIdeas";

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

  // Pending ideas data (for QA Manager approval)
  const [pendingIdeasData, setPendingIdeasData] =
    useState<PendingIdeasResponse | null>(null);
  const [pendingPage, setPendingPage] = useState(1);

  useEffect(() => {
    if (user?.role !== "Administrator" && user?.role !== "QAManager") {
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
      const apiUrl = `http://${window.location.hostname}:5000/api/Admin/users`;
      const response = await fetch(apiUrl, {
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
      alert("Unable to load topic ideas and attached files for this topic");
    } finally {
      setLoading(false);
    }
  };

  const loadPendingIdeas = async (page: number = 1) => {
    setLoading(true);
    try {
      const data = await ideaService.getPendingIdeas(page, 10);
      setPendingIdeasData(data);
      setPendingPage(page);
    } catch (error) {
      console.error("Failed to load pending ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewIdea = async (
    ideaId: number,
    approve: boolean,
    rejectionReason?: string,
  ) => {
    try {
      await ideaService.reviewIdea(ideaId, approve, rejectionReason);
      // Reload current page of pending ideas
      await loadPendingIdeas(pendingPage);
    } catch (error) {
      console.error("Failed to review idea:", error);
      alert("Failed to review idea. Please try again.");
    }
  };

  useEffect(() => {
    if (activeTab === "users") loadUsers();
    else if (activeTab === "topics") loadTopics();
    else if (activeTab === "categories") loadCategories();
    else if (activeTab === "statistics") loadStatistics();
    else if (activeTab === "topicIdeas") {
      loadTopics();
    } else if (activeTab === "pendingIdeas") {
      loadPendingIdeas(1);
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
        {user?.role === "Administrator" && (
          <button
            className={`tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Manage Users
          </button>
        )}
        {user?.role === "Administrator" && (
          <button
            className={`tab ${activeTab === "topics" ? "active" : ""}`}
            onClick={() => setActiveTab("topics")}
          >
            📚 Manage Topics
          </button>
        )}
        {user?.role === "Administrator" && (
          <button
            className={`tab ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            🏷️ Manage Categories
          </button>
        )}
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
          📎 Ideas & File Upload
        </button>
        {(user?.role === "" || user?.role === "QAManager") && (
          <button
            className={`tab ${activeTab === "pendingIdeas" ? "active" : ""}`}
            onClick={() => setActiveTab("pendingIdeas")}
          >
            🕐 Pending Ideas
          </button>
        )}
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
        {activeTab === "pendingIdeas" && (
          <PendingIdeasTab
            data={pendingIdeasData}
            loading={loading}
            currentPage={pendingPage}
            onReview={handleReviewIdea}
            onPageChange={loadPendingIdeas}
          />
        )}
      </div>
    </div>
  );
}

// Pending Ideas Approval Tab Component
function PendingIdeasTab({
  data,
  loading,
  currentPage,
  onReview,
  onPageChange,
}: {
  data: PendingIdeasResponse | null;
  loading: boolean;
  currentPage: number;
  onReview: (
    ideaId: number,
    approve: boolean,
    rejectionReason?: string,
  ) => Promise<void>;
  onPageChange: (page: number) => void;
}) {
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleApprove = async (ideaId: number) => {
    setProcessingId(ideaId);
    await onReview(ideaId, true);
    setProcessingId(null);
  };

  const handleRejectSubmit = async (ideaId: number) => {
    if (!rejectionReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }
    setProcessingId(ideaId);
    await onReview(ideaId, false, rejectionReason);
    setRejectingId(null);
    setRejectionReason("");
    setProcessingId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="pending-ideas-tab">
      <div className="tab-header">
        <h2>🕐 Pending Ideas – Awaiting Approval</h2>
        <span className="badge-count">
          {data?.totalCount ?? 0} ideas pending
        </span>
      </div>

      {(!data || data.data.length === 0) && (
        <div className="empty">No ideas pending review. All caught up! ✅</div>
      )}

      <div className="pending-ideas-list">
        {data?.data.map((idea) => (
          <div key={idea.id} className="pending-idea-card">
            <div className="pending-idea-header">
              <h3>{idea.title}</h3>
              <span className="pending-meta">
                {idea.topicName} · {idea.categoryName} · {idea.departmentName}
              </span>
            </div>

            <div className="pending-author-row">
              <span>
                👤{" "}
                <strong>
                  {idea.isAnonymous ? "Anonymous" : idea.authorName}
                </strong>
                {!idea.isAnonymous && (
                  <span className="author-email"> ({idea.authorEmail})</span>
                )}
              </span>
              <span className="pending-date">
                {new Date(idea.createdAt).toLocaleString("en-US")}
              </span>
            </div>

            <p className="pending-idea-content">{idea.content}</p>

            {idea.attachments && (
              <div className="pending-attachments">
                📎 Attachments: {idea.attachments.split(",").length} file(s)
              </div>
            )}

            {rejectingId === idea.id ? (
              <div className="reject-form">
                <textarea
                  placeholder="Enter rejection reason (required)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
                <div className="reject-form-actions">
                  <button
                    className="btn-danger"
                    disabled={processingId === idea.id}
                    onClick={() => handleRejectSubmit(idea.id)}
                  >
                    {processingId === idea.id
                      ? "Rejecting..."
                      : "Confirm Reject"}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setRejectingId(null);
                      setRejectionReason("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="pending-idea-actions">
                <button
                  className="btn-success"
                  disabled={processingId === idea.id}
                  onClick={() => handleApprove(idea.id)}
                >
                  {processingId === idea.id ? "Approving..." : "✅ Approve"}
                </button>
                <button
                  className="btn-danger"
                  onClick={() => {
                    setRejectingId(idea.id);
                    setRejectionReason("");
                  }}
                >
                  ❌ Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {data && data.totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            ← Prev
          </button>
          <span>
            Page {currentPage} / {data.totalPages}
          </span>
          <button
            disabled={currentPage >= data.totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      )}
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
        <h2>📎 Staff Ideas and Uploaded Files by Topic</h2>
        <button className="btn-secondary" onClick={onRefreshTopics}>
          🔄 Refresh Topics
        </button>
      </div>

      <div className="topic-ideas-controls">
        <label htmlFor="topic-select">Select topic:</label>
        <select
          id="topic-select"
          value={selectedTopicId}
          onChange={(e) =>
            onSelectTopic(e.target.value ? Number(e.target.value) : "")
          }
        >
          <option value="">-- Select a topic --</option>
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
          {loading ? "Loading..." : "View Data"}
        </button>
      </div>

      {topicIdeasData && (
        <div className="topic-ideas-summary">
          <div className="summary-card">
            <span className="summary-label">Topic</span>
            <strong>{topicIdeasData.topicName}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Total Ideas</span>
            <strong>{topicIdeasData.totalIdeas}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Total Uploaded Files</span>
            <strong>{topicIdeasData.totalDocuments}</strong>
          </div>
        </div>
      )}

      {topicIdeasData && topicIdeasData.ideas.length === 0 && (
        <div className="empty">No ideas in this topic yet.</div>
      )}

      <div className="topic-ideas-list">
        {topicIdeasData?.ideas.map((idea) => (
          <div key={idea.id} className="idea-doc-card">
            <div className="idea-doc-header">
              <h3>{idea.title}</h3>
              <span className="idea-doc-meta">
                {new Date(idea.createdAt).toLocaleString("en-US")}
              </span>
            </div>

            <div className="idea-doc-info-grid">
              <div>
                <span className="label">Author</span>
                <strong>{idea.authorName}</strong>
              </div>
              <div>
                <span className="label">Email</span>
                <strong>{idea.authorEmail || "Hidden"}</strong>
              </div>
              <div>
                <span className="label">Department</span>
                <strong>{idea.departmentName}</strong>
              </div>
              <div>
                <span className="label">Category</span>
                <strong>{idea.categoryName}</strong>
              </div>
            </div>

            <p className="idea-doc-content">{idea.content}</p>

            <div className="documents-block">
              <h4>📁 Uploaded Files ({idea.documents.length})</h4>
              {idea.documents.length === 0 ? (
                <p className="no-docs">No attached files.</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Size</th>
                      <th>Uploaded At</th>
                      <th>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {idea.documents.map((doc) => (
                      <tr key={doc.id}>
                        <td>{doc.fileName}</td>
                        <td>{formatFileSize(doc.fileSize)}</td>
                        <td>
                          {new Date(doc.uploadedAt).toLocaleString("en-US")}
                        </td>
                        <td>
                          <a
                            href={`http://${window.location.hostname}:5000${doc.filePath}`}
                            onClick={async (e) => {
                              e.preventDefault();
                              const url = `http://${window.location.hostname}:5000${doc.filePath}`;
                              try {
                                const res = await fetch(url);
                                if (!res.ok) throw new Error("Download failed");
                                const blob = await res.blob();
                                const blobUrl =
                                  window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = blobUrl;
                                a.download = doc.fileName;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                window.URL.revokeObjectURL(blobUrl);
                              } catch (err) {
                                console.error("Fallback to open:", err);
                                window.open(url, "_blank");
                              }
                            }}
                          >
                            Download
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
  const currentUser = authService.getCurrentUser();
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [savingRole, setSavingRole] = useState(false);

  // Create/Edit user form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Staff",
    departmentId: "",
    isActive: true,
  });
  const [formError, setFormError] = useState("");
  const [formProcessing, setFormProcessing] = useState(false);

  const ROLES = ["Administrator", "QAManager", "QACoordinator", "Staff"];

  const handleOpenAssign = (user: User) => {
    setAssigningId(user.id);
    setSelectedRole(user.role);
  };

  const handleSaveRole = async (userId: number) => {
    if (!selectedRole) return;
    setSavingRole(true);
    try {
      await adminService.assignRole(userId, selectedRole);
      setAssigningId(null);
      onRefresh();
    } catch {
      alert("Failed to assign role. Please try again.");
    } finally {
      setSavingRole(false);
    }
  };

  // Handle Create/Edit form
  const handleOpenCreate = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: "Staff",
      departmentId: "",
      isActive: true,
    });
    setEditingUserId(null);
    setFormError("");
    setShowCreateForm(true);
  };

  const handleOpenEdit = (user: User) => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: "",
      role: user.role,
      departmentId: user.departmentId?.toString() || "",
      isActive: user.isActive,
    });
    setEditingUserId(user.id);
    setFormError("");
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingUserId(null);
    setFormError("");
    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: "Staff",
      departmentId: "",
      isActive: true,
    });
  };

  const handleSubmitForm = async () => {
    setFormError("");

    if (!formData.fullName.trim()) {
      setFormError("Full Name is required");
      return;
    }
    if (!formData.email.trim()) {
      setFormError("Email is required");
      return;
    }
    if (editingUserId === null && !formData.password.trim()) {
      setFormError("Password is required for new users");
      return;
    }

    setFormProcessing(true);
    try {
      const userData: any = {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
      };

      if (formData.departmentId) {
        userData.departmentId = parseInt(formData.departmentId);
      }

      if (formData.password) {
        userData.password = formData.password;
      }

      if (editingUserId) {
        await adminService.updateUser(editingUserId, userData);
        alert("User updated successfully!");
      } else {
        await adminService.createUser(userData);
        alert("User created successfully!");
      }

      handleCloseForm();
      onRefresh();
    } catch (error: any) {
      setFormError(
        error.response?.data?.message ||
          "Failed to save user. Please try again.",
      );
    } finally {
      setFormProcessing(false);
    }
  };

  const handleDelete = async (userId: number, userName: string) => {
    if (userId === Number(currentUser?.id)) {
      alert("You cannot delete your own account!");
      return;
    }

    if (!window.confirm(`Delete user "${userName}"?`)) return;

    try {
      await adminService.deleteUser(userId);
      alert("User deactivated successfully!");
      onRefresh();
    } catch (error) {
      alert("Failed to delete user. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="users-tab">
      <div className="tab-header">
        <h2>👥 Manage Users</h2>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <button className="btn-primary" onClick={handleOpenCreate}>
            ➕ Add User
          </button>
          <button className="btn-secondary" onClick={onRefresh}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="user-form-box">
          <h3>{editingUserId ? "Edit User" : "Create New User"}</h3>
          <div className="form-row">
            <label>
              Full Name <span className="req">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Enter full name..."
              disabled={formProcessing}
            />
          </div>
          <div className="form-row">
            <label>
              Email <span className="req">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter email..."
              disabled={formProcessing}
            />
          </div>
          <div className="form-row">
            <label>
              Password{" "}
              {editingUserId ? (
                "(leave empty to keep current)"
              ) : (
                <span className="req">*</span>
              )}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter password..."
              disabled={formProcessing}
            />
          </div>
          <div className="form-row-2col">
            <div className="form-row">
              <label>Role</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                disabled={formProcessing}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Department ID</label>
              <input
                type="number"
                value={formData.departmentId}
                onChange={(e) =>
                  setFormData({ ...formData, departmentId: e.target.value })
                }
                placeholder="Optional..."
                disabled={formProcessing}
              />
            </div>
          </div>
          {editingUserId && (
            <div className="form-row">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  disabled={formProcessing}
                />
                Active
              </label>
            </div>
          )}
          {formError && <p className="form-error">{formError}</p>}
          <div className="form-actions">
            <button
              className="btn-primary"
              onClick={handleSubmitForm}
              disabled={formProcessing}
            >
              {formProcessing
                ? "Processing..."
                : editingUserId
                  ? "✓ Update User"
                  : "✓ Create User"}
            </button>
            <button
              className="btn-ghost"
              onClick={handleCloseForm}
              disabled={formProcessing}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td data-label="ID">{user.id}</td>
                <td data-label="Full Name">{user.fullName}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Role">
                  {assigningId === user.id ? (
                    <div className="role-assign-inline">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="role-select"
                        disabled={savingRole}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn-save-role"
                        disabled={savingRole}
                        onClick={() => handleSaveRole(user.id)}
                        title="Save role"
                      >
                        {savingRole ? "..." : "✔"}
                      </button>
                      <button
                        className="btn-cancel-role"
                        disabled={savingRole}
                        onClick={() => setAssigningId(null)}
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td data-label="Department">{user.departmentName || "N/A"}</td>
                <td data-label="Agreed T&C">
                  {user.agreedTerms ? "✅" : "❌"}
                </td>
                <td data-label="Status">
                  {user.isActive ? "🟢 Active" : "🔴 Inactive"}
                </td>
                <td data-label="Created Date">
                  {new Date(user.createdAt).toLocaleDateString("en-US")}
                </td>
                <td data-label="Actions">
                  <div style={{ display: "flex", gap: ".5rem" }}>
                    {user.id !== Number(currentUser?.id) &&
                      assigningId !== user.id && (
                        <>
                          <button
                            className="btn-edit"
                            onClick={() => handleOpenEdit(user)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-assign-role"
                            onClick={() => handleOpenAssign(user)}
                            title="Assign Role"
                          >
                            🔑
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(user.id, user.fullName)}
                            title="Deactivate"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                  </div>
                </td>
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
                      <span>
                        {new Date(idea.createdAt).toLocaleDateString("en-US")}
                      </span>
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
                  <span className="deadline-label">
                    📅 Idea Submission Deadline
                  </span>
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
      await categoryService.createCategory(
        newCatName.trim(),
        Number(newCatTopicId),
        newCatDesc.trim() || undefined,
      );
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
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      alert(msg || "Failed to delete category (may already be in use)!");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="categories-tab">
      <div className="tab-header">
        <h2>🏷️ Manage Categories</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "✕ Close" : "➕ Add Category"}
          </button>
          <button className="btn-secondary" onClick={onRefresh}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="create-form"
          style={{
            marginBottom: 24,
            padding: 16,
            background: "#f8f9fa",
            borderRadius: 8,
          }}
        >
          <h3>Create New Category</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              maxWidth: 480,
            }}
          >
            <input
              className="form-input"
              placeholder="Category name *"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              required
            />
            <input
              className="form-input"
              placeholder="Description (optional)"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
            />
            <select
              className="form-input"
              value={newCatTopicId}
              onChange={(e) =>
                setNewCatTopicId(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              required
            >
              <option value="">-- Select Topic *</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
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
                <td data-label="Department">
                  <strong>{dept.departmentName}</strong>
                </td>
                <td data-label="Staff Count">{dept.staffCount}</td>
                <td data-label="Idea Count">{dept.ideaCount}</td>
                <td data-label="Comment Count">{dept.commentCount}</td>
                <td data-label="Views">{dept.totalViews}</td>
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
                <td data-label="Category">
                  <strong>{cat.categoryName}</strong>
                </td>
                <td data-label="Idea Count">{cat.ideaCount}</td>
                <td data-label="Comment Count">{cat.commentCount}</td>
                <td className="thumbs-up" data-label="👍 Thumbs Up">
                  {cat.thumbsUpCount}
                </td>
                <td className="thumbs-down" data-label="👎 Thumbs Down">
                  {cat.thumbsDownCount}
                </td>
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
                <td data-label="Topic">
                  <strong>{topic.topicName}</strong>
                </td>
                <td data-label="Idea Count">{topic.ideaCount}</td>
                <td data-label="Comment Count">{topic.commentCount}</td>
                <td data-label="Views">{topic.totalViews}</td>
                <td data-label="Participants">{topic.participantCount}</td>
                <td data-label="Status">
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
