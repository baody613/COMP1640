import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "./authService";
import {
  statisticsService,
  categoryService,
  topicService,
  adminService,
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

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <h1>🛡️ Admin Dashboard</h1>
          <span className="admin-badge">{user?.role}</span>
        </div>
        <div className="header-right">
          <span className="user-info">👤 {user?.fullName}</span>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-secondary"
          >
            Dashboard
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Đăng xuất
          </button>
        </div>
      </header>

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
  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="topics-tab">
      <div className="tab-header">
        <h2>📚 Quản lý Topics</h2>
        <button className="btn-primary" onClick={onRefresh}>
          🔄 Làm mới
        </button>
      </div>
      <div className="topics-grid">
        {topics.map((topic) => (
          <div key={topic.id} className="topic-card-admin">
            <h3>{topic.name}</h3>
            <p>{topic.description}</p>
            <div className="topic-dates">
              <div>
                📅 Deadline ý tưởng:{" "}
                <strong>
                  {new Date(
                    topic.ideaSubmissionDeadline || topic.closureDate || "",
                  ).toLocaleDateString("vi-VN")}
                </strong>
              </div>
              <div>
                💬 Deadline bình luận:{" "}
                <strong>
                  {new Date(
                    topic.commentDeadline || topic.finalClosureDate || "",
                  ).toLocaleDateString("vi-VN")}
                </strong>
              </div>
            </div>
            <div className="topic-stats-admin">
              <span>💡 {topic.ideaCount || 0} ideas</span>
              <span>🏷️ {topic.categories?.length || 0} categories</span>
            </div>
            <div className="topic-actions">
              <button
                className="btn-export"
                onClick={() => onExportCSV(topic.id)}
              >
                📥 Export CSV
              </button>
              <button
                className="btn-export"
                onClick={() => onExportDocs(topic.id)}
              >
                📦 Export Docs
              </button>
            </div>
          </div>
        ))}
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
