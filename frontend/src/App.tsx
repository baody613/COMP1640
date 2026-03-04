import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Topics from "./Topics";
import IdeaDetail from "./IdeaDetail";
import IdeaForm from "./IdeaForm";
import AdminDashboard from "./AdminDashboard";
import NavBar from "./NavBar";
import { authService } from "./authService";

// Layout cho tất cả trang authenticated – luôn hiển thị NavBar
function PrivateLayout() {
  const token = authService.getToken();
  if (!token) return <Navigate to="/login" />;
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

// Chặn Admin khỏi các trang dành cho Staff
function StaffOnly() {
  const user = authService.getCurrentUser();
  if (user?.role === "Administrator") return <Navigate to="/admin" />;
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated – NavBar luôn hiển thị */}
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/idea/:id" element={<IdeaDetail />} />

          {/* Staff + QAManager only */}
          <Route element={<StaffOnly />}>
            <Route path="/topics" element={<Topics />} />
            <Route path="/topic/:topicId/new-idea" element={<IdeaForm />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
