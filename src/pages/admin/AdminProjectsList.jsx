import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../hooks";
import { deleteProject } from "../../lib";

export default function AdminProjectsList() {
  const { data: projects, loading, error } = useProjects();
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  async function handleDelete(id) {
    if (!window.confirm("Delete this project?")) return;

    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteProject(id);
      window.location.reload();
    } catch (err) {
      setDeleteError(err.message);
      setDeletingId(null);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Admin — Projects</h1>
      <Link to="/admin/projects/new">
        <button>Create New Project</button>
      </Link>

      {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
      {projects.length === 0 && <p>No projects found.</p>}

      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.title}
                style={{ width: "60px", height: "60px", objectFit: "cover", marginRight: "8px", verticalAlign: "middle" }}
              />
            )}
            <strong>{p.title}</strong> ({p.slug}){" "}
            <Link to={`/admin/projects/${p.id}/edit`}>
              <button>Edit</button>
            </Link>{" "}
            <button
              onClick={() => handleDelete(p.id)}
              disabled={deletingId === p.id}
            >
              {deletingId === p.id ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
