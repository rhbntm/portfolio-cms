import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminPosts } from "../../hooks";
import { deletePost } from "../../lib";
import { Loading, ErrorMessage } from "../../components";
import styles from './AdminList.module.css';

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

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Posts</h1>
        <Link to="/admin/posts/new" className={styles.createBtn}>+ New Post</Link>
      </div>

      {loading && <Loading />}
      {(error || deleteError) && <ErrorMessage message={error || deleteError} />}

      {!loading && !error && (
        posts.length === 0 ? (
          <p className={styles.empty}>No posts yet.</p>
        ) : (
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className={styles.tableRow}>
                  <td className={styles.cellPrimary}>{post.title}</td>
                  <td className={styles.cellMono}>{post.slug}</td>
                  <td>
                    <span className={`${styles.badge} ${post.is_published ? styles.badgePublished : styles.badgeDraft}`}>
                      {post.is_published ? 'live' : 'draft'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.cellActions}>
                      <Link to={`/admin/posts/${post.id}/edit`} className={styles.editBtn}>edit</Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                      >
                        {deletingId === post.id ? '…' : 'delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
