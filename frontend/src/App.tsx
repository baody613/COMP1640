import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Topics from "./Topics";
import IdeaDetail from "./IdeaDetail";
import IdeaForm from "./IdeaForm";
import AdminDashboard from "./AdminDashboard";
import { authService } from "./authService";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = authService.getToken();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/topics"
          element={
            <PrivateRoute>
              <Topics />
            </PrivateRoute>
          }
        />
        <Route
          path="/idea/:id"
          element={
            <PrivateRoute>
              <IdeaDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/topic/:topicId/new-idea"
          element={
            <PrivateRoute>
              <IdeaForm />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
