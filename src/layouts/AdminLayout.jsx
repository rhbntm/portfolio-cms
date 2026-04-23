import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <nav style={{ marginBottom: "1rem" }}>
        <strong>Admin</strong> |{" "}
        <Link to="/admin">Dashboard</Link> |{" "}
        <Link to="/admin/projects">Projects</Link> |{" "}
        <Link to="/admin/posts">Posts</Link> |{" "}
        <Link to="/">← Back to Site</Link>
      </nav>

      <Outlet />
    </div>
  );
}