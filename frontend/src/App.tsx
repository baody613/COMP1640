import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
} from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import Dashboard from "./Dashboard";
import IdeaDetail from "./IdeaDetail";
import IdeaForm from "./IdeaForm";
import Login from "./Login";
import NavBar from "./NavBar";
import Register from "./Register";
import Topics from "./Topics";
import { authService } from "./authService";

// Layout for all authenticated pages – always displays NavBar
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

// Block Admin from pages intended for Staff
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

        {/* Authenticated – NavBar always displayed */}
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
