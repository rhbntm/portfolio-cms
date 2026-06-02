import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../hooks";
import { deleteProject } from "../../lib";
import { Loading, ErrorMessage, Pagination } from "../../components";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import styles from './AdminList.module.css';

export default function AdminProjectsList() {
  const [page, setPage] = useState(1);
  const { data: projects, count, loading, error } = useProjects(page, 10);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [lightboxUrl, setLightboxUrl] = useState(null);

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

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Projects</h1>
        <Link to="/admin/projects/new" className={styles.createBtn}>+ New Project</Link>
      </div>

      {loading && <Loading />}
      {(error || deleteError) && <ErrorMessage message={error || deleteError} />}

      {!loading && !error && (
        projects.length === 0 ? (
          <p className={styles.empty}>No projects yet.</p>
        ) : (
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id} className={styles.tableRow}>
                  <td>
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className={styles.thumbnail}
                        onClick={() => setLightboxUrl(project.image_url)}
                      />
                    ) : '-'}
                  </td>
                  <td className={styles.cellPrimary}>{project.title}</td>
                  <td className={styles.cellMono}>{project.slug}</td>
                  <td>
                    <div className={styles.cellActions}>
                      <Link to={`/admin/projects/${project.id}/edit`} className={styles.editBtn}>edit</Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                      >
                        {deletingId === project.id ? '…' : 'delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
      {!loading && !error && count > 10 && (
        <Pagination page={page} pageSize={10} total={count} setPage={setPage} />
      )}

      <Lightbox
        open={!!lightboxUrl}
        close={() => setLightboxUrl(null)}
        slides={lightboxUrl ? [{ src: lightboxUrl }] : []}
      />
    </div>
  );
}
