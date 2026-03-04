import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "./authService";
import {
  statisticsService,
  categoryService,
  topicService,
  adminService,
  type TopicFormData,
  type OverviewStatistics,
  type DepartmentStatistics,
  type CategoryStatistics,
  type TopicStatistics,
} from "./services";
import type { Topic, Category } from "./types";
import "./AdminDashboard.css";

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

type TabType = "overview" | "users" | "topics" | "categories" | "statistics";

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

  useEffect(() => {
    if (user?.role !== "Administrator") {
      alert("Bạn không có quyền truy cập trang này!");
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
      // Backend cần có endpoint này: GET /api/Admin/users
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

  useEffect(() => {
    if (activeTab === "users") loadUsers();
    else if (activeTab === "topics") loadTopics();
    else if (activeTab === "categories") loadCategories();
    else if (activeTab === "statistics") loadStatistics();
  }, [activeTab]);

  const handleExportCSV = async (topicId: number) => {
    try {
      await adminService.exportIdeasToCSV(topicId);
      alert("Đã export CSV thành công!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export thất bại!");
    }
  };

  const handleExportDocuments = async (topicId: number) => {
    try {
      await adminService.exportDocumentsZIP(topicId);
      alert("Đã export documents thành công!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export thất bại!");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Tổng quan
        </button>
        <button
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          👥 Quản lý User
        </button>
        <button
          className={`tab ${activeTab === "topics" ? "active" : ""}`}
          onClick={() => setActiveTab("topics")}
        >
          📚 Quản lý Topic
        </button>
        <button
          className={`tab ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          🏷️ Quản lý Category
        </button>
        <button
          className={`tab ${activeTab === "statistics" ? "active" : ""}`}
          onClick={() => setActiveTab("statistics")}
        >
          📈 Thống kê
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
  if (loading) return <div className="loading">Đang tải...</div>;
  if (!stats) return <div className="empty">Không có dữ liệu</div>;

  return (
    <div className="overview-tab">
      <h2>📊 Tổng quan hệ thống</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💡</div>
          <div className="stat-value">{stats.totalIdeas}</div>
          <div className="stat-label">Tổng số ý tưởng</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-value">{stats.totalComments}</div>
          <div className="stat-label">Tổng số bình luận</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Tổng số người dùng</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-value">{stats.totalDepartments}</div>
          <div className="stat-label">Tổng số phòng ban</div>
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
  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="users-tab">
      <div className="tab-header">
        <h2>👥 Quản lý người dùng</h2>
        <button className="btn-primary" onClick={onRefresh}>
          🔄 Làm mới
        </button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phòng ban</th>
              <th>Đồng ý T&C</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
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
                <td>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
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
  // Helper: chuyển ISO string → giá trị cho <input type="datetime-local">
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

  // editingId: id của topic đang được chỉnh sửa, null = không sửa cái nào
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<TopicFormData>(emptyForm);
  const [editErr, setEditErr] = useState("");
  const [saving, setSaving] = useState(false);

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
      setCreateErr("Vui lòng nhập tên topic");
      return;
    }
    if (!createForm.ideaSubmissionDeadline) {
      setCreateErr("Vui lòng chọn deadline gửi ý tưởng");
      return;
    }
    if (!createForm.commentDeadline) {
      setCreateErr("Vui lòng chọn deadline bình luận");
      return;
    }
    if (
      new Date(createForm.commentDeadline) <=
      new Date(createForm.ideaSubmissionDeadline)
    ) {
      setCreateErr("Deadline bình luận phải sau deadline gửi ý tưởng");
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
      setCreateErr("Tạo topic thất bại. Vui lòng thử lại.");
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async () => {
    if (!editingId) return;
    if (!editForm.name.trim()) {
      setEditErr("Vui lòng nhập tên topic");
      return;
    }
    if (!editForm.ideaSubmissionDeadline) {
      setEditErr("Vui lòng chọn deadline gửi ý tưởng");
      return;
    }
    if (!editForm.commentDeadline) {
      setEditErr("Vui lòng chọn deadline bình luận");
      return;
    }
    if (
      new Date(editForm.commentDeadline) <=
      new Date(editForm.ideaSubmissionDeadline)
    ) {
      setEditErr("Deadline bình luận phải sau deadline gửi ý tưởng");
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
      setEditErr("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      !window.confirm(`Xóa topic "${name}"? Hành động này không thể hoàn tác.`)
    )
      return;
    try {
      await topicService.deleteTopic(id);
      onRefresh();
    } catch {
      alert("Xóa thất bại. Topic có thể đang chứa dữ liệu.");
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="topics-tab">
      <div className="tab-header">
        <h2>📚 Quản lý Topics</h2>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <button
            className="btn-primary"
            onClick={() => {
              setShowCreate(true);
              setCreateForm(emptyForm);
              setCreateErr("");
            }}
          >
            + Tạo topic mới
          </button>
          <button className="btn-secondary" onClick={onRefresh}>
            🔄 Làm mới
          </button>
        </div>
      </div>

      {/* ── Form tạo topic mới ── */}
      {showCreate && (
        <div className="topic-form-box">
          <h3>Tạo topic mới</h3>
          <div className="form-row">
            <label>
              Tên topic <span className="req">*</span>
            </label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, name: e.target.value }))
              }
              placeholder="Nhập tên topic..."
            />
          </div>
          <div className="form-row">
            <label>Mô tả</label>
            <textarea
              value={createForm.description}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Mô tả ngắn về topic..."
              rows={2}
            />
          </div>
          <div className="form-row-2col">
            <div className="form-row">
              <label>
                📅 Deadline gửi ý tưởng <span className="req">*</span>
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
                💬 Deadline bình luận <span className="req">*</span>
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
              {creating ? "Đang tạo..." : "✓ Tạo topic"}
            </button>
            <button className="btn-ghost" onClick={() => setShowCreate(false)}>
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* ── Danh sách topics ── */}
      <div className="topics-grid">
        {topics.map((topic) =>
          editingId === topic.id ? (
            /* ── Inline edit form ── */
            <div key={topic.id} className="topic-card-admin topic-card-edit">
              <h3>✏️ Chỉnh sửa topic</h3>
              <div className="form-row">
                <label>
                  Tên topic <span className="req">*</span>
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
                <label>Mô tả</label>
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
                  📅 Deadline gửi ý tưởng <span className="req">*</span>
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
                  💬 Deadline bình luận <span className="req">*</span>
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
                  {saving ? "Đang lưu..." : "✓ Lưu"}
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => setEditingId(null)}
                >
                  Hủy
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
                  {topic.isActive ? "Đang mở" : "Đã đóng"}
                </span>
              </div>
              <p>{topic.description}</p>
              <div className="topic-dates">
                <div className="deadline-item">
                  <span className="deadline-label">📅 Deadline ý tưởng</span>
                  <strong className="deadline-val">
                    {new Date(
                      topic.ideaSubmissionDeadline || topic.closureDate || "",
                    ).toLocaleString("vi-VN")}
                  </strong>
                </div>
                <div className="deadline-item">
                  <span className="deadline-label">💬 Deadline bình luận</span>
                  <strong className="deadline-val">
                    {new Date(
                      topic.commentDeadline || topic.finalClosureDate || "",
                    ).toLocaleString("vi-VN")}
                  </strong>
                </div>
              </div>
              <div className="topic-stats-admin">
                <span>💡 {topic.ideaCount || 0} ý tưởng</span>
                <span>🏷️ {topic.categories?.length || 0} categories</span>
              </div>
              <div className="topic-actions">
                <button className="btn-edit" onClick={() => openEdit(topic)}>
                  ✏️ Sửa deadline
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
                  🗑️ Xóa
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
  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="categories-tab">
      <div className="tab-header">
        <h2>🏷️ Quản lý Categories</h2>
        <button className="btn-primary" onClick={onRefresh}>
          🔄 Làm mới
        </button>
      </div>
      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="category-card-admin">
            <h3>{cat.name}</h3>
            {cat.description && <p>{cat.description}</p>}
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
  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="statistics-tab">
      <h2>📈 Thống kê chi tiết</h2>

      <div className="stats-section">
        <h3>🏢 Thống kê theo phòng ban</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Phòng ban</th>
              <th>Số nhân viên</th>
              <th>Số ý tưởng</th>
              <th>Số bình luận</th>
              <th>Lượt xem</th>
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
        <h3>🏷️ Thống kê theo danh mục</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Danh mục</th>
              <th>Số ý tưởng</th>
              <th>Số bình luận</th>
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
        <h3>📚 Thống kê theo topic</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Số ý tưởng</th>
              <th>Số bình luận</th>
              <th>Lượt xem</th>
              <th>Người tham gia</th>
              <th>Trạng thái</th>
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
