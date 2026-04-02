import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { label: "Home", path: "/dashboard", show: true },
    { label: "Topics", path: "/topics", show: !isAdmin },
    {
      label: "Management",
      path: "/admin",
      show: isManager || isAdmin,
      green: true,
    },
  ].filter((t) => t.show);

  // Calculate indicator position when route changes
  useEffect(() => {
    const update = () => {
      const nav = navRef.current;
      if (!nav) return;
      // Find active tab by current path
      const activeEl = nav.querySelector<HTMLElement>(".tab-btn.tab-active");
      if (activeEl) {
        setIndicator({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          ready: true,
        });
      }
    };
    // Use two requestAnimationFrames to ensure DOM is fully rendered
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(update);
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, [location.pathname]);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMenuOpen(false);
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
            // Tab is active if path matches or starts with path (for sub-routes)
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

        {/* Mobile Menu Button */}
        <button
          className={`hamburger-menu${menuOpen ? " active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
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
          Sign Out
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? " active" : ""}`}>
        {tabs.map((tab) => {
          const isActive =
            tab.path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(tab.path);
          return (
            <button
              key={tab.path}
              className={`tab-btn${isActive ? " tab-active" : ""}${tab.green ? " tab-green" : ""}`}
              onClick={() => handleNavigation(tab.path)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
