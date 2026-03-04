import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "./authService";
import "./NavBar.css";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const isAdmin = user?.role === "Administrator";
  const isManager = user?.role === "QAManager";

  const navRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    ready: false,
  });

  const tabs = [
    { label: "Trang chủ", path: "/dashboard", show: true },
    { label: "Topics", path: "/topics", show: !isAdmin },
    {
      label: "Quản lý",
      path: "/admin",
      show: isManager || isAdmin,
      green: true,
    },
  ].filter((t) => t.show);

  // Tính toán vị trí indicator sau mỗi lần route thay đổi
  useEffect(() => {
    const update = () => {
      const nav = navRef.current;
      if (!nav) return;
      // Tìm tab active theo đường dẫn hiện tại
      const activeEl = nav.querySelector<HTMLElement>(".tab-btn.tab-active");
      if (activeEl) {
        setIndicator({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          ready: true,
        });
      }
    };
    // Dùng hai requestAnimationFrame để đảm bảo DOM đã render xong
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(update);
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="brand" onClick={() => navigate("/dashboard")}>
          <span className="brand-mark">I</span>
          <span className="brand-name">IdeaHub</span>
        </div>

        <nav className="tab-nav" ref={navRef}>
          {indicator.ready && (
            <span
              className="tab-indicator"
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}
          {tabs.map((tab) => {
            // Tab được coi là active nếu đường dẫn khớp hoặc bắt đầu bằng path (cho sub-routes)
            const isActive =
              tab.path === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(tab.path);
            return (
              <button
                key={tab.path}
                className={`tab-btn${isActive ? " tab-active" : ""}${tab.green ? " tab-green" : ""}`}
                onClick={() => navigate(tab.path)}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="navbar-right">
        <div className="user-badge">
          <span className="user-avatar">
            {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
          </span>
          <div className="user-info-block">
            <span className="user-name">{user?.fullName}</span>
            <span className="user-role-tag">{user?.role}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
