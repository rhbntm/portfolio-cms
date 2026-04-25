import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminPosts } from "../../hooks/posts/useAdminPosts";
import { deletePost } from "../../lib/posts";

export default function AdminPostsList() {
  const { data: posts, loading, error } = useAdminPosts();
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  async function handleDelete(id) {
    if (!window.confirm("Delete this post?")) return;

    setDeletingId(id);
    setDeleteError(null);
    try {
      await deletePost(id);
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
      <h1>Admin — Posts</h1>
      <Link to="/admin/posts/new">
        <button>Create New Post</button>
      </Link>

      {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
      {posts.length === 0 && <p>No posts found.</p>}

      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <strong>{p.title}</strong> ({p.slug}){" "}
            <Link to={`/admin/posts/${p.id}/edit`}>
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
