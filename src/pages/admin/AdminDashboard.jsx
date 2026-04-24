import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/admin/projects">
          <button>Manage Projects</button>
        </Link>
        <Link to="/admin/posts">
          <button>Manage Posts</button>
        </Link>
      </div>
    </div>
  );
}