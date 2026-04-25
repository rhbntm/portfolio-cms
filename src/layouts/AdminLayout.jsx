import { Outlet, Link, useNavigate } from "react-router-dom";
import { signOut } from "../lib/auth";

export default function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await signOut();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <div>
      <nav style={{ marginBottom: "1rem" }}>
        <strong>Admin</strong> |{" "}
        <Link to="/admin">Dashboard</Link> |{" "}
        <Link to="/admin/projects">Projects</Link> |{" "}
        <Link to="/admin/posts">Posts</Link> |{" "}
        <Link to="/">← Back to Site</Link> |{" "}
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <Outlet />
    </div>
  );
}