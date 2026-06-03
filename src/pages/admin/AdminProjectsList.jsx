import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../hooks";
import { deleteProject, updateProjectsOrder } from "../../lib";
import { Loading, ErrorMessage, Pagination } from "../../components";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import styles from './AdminList.module.css';

export default function AdminProjectsList() {
  const [page, setPage] = useState(1);
  const { data: initialProjects, count, loading, error } = useProjects(page, 10);
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    if (initialProjects) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);

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

  function handleDragStart(e, index) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    if (index !== dragOverIndex) {
      setDragOverIndex(index);
    }
  }

  function handleDragLeave(e, index) {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  }

  function handleDrop(e, index) {
    e.preventDefault();
    setDragOverIndex(null);
    if (draggedIndex === null || draggedIndex === index) return;

    const newProjects = [...projects];
    const draggedItem = newProjects[draggedIndex];
    newProjects.splice(draggedIndex, 1);
    newProjects.splice(index, 0, draggedItem);
    
    setProjects(newProjects);
    setDraggedIndex(null);

    saveNewOrder(newProjects);
  }

  async function saveNewOrder(reorderedList) {
    setSavingOrder(true);
    try {
      const originalSortOrders = initialProjects.map(p => p.sort_order || 0).sort((a, b) => a - b);
      const updates = reorderedList.map((p, i) => ({
        id: p.id,
        sort_order: originalSortOrders[i] !== undefined && originalSortOrders[i] !== 0 
          ? originalSortOrders[i] 
          : ((page - 1) * 10 + i + 1)
      }));
      await updateProjectsOrder(updates);
    } catch (err) {
      alert("Failed to save order: " + err.message);
      setProjects(initialProjects);
    } finally {
      setSavingOrder(false);
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
                <th style={{ width: '30px' }}></th>
                <th>Image</th>
                <th>Title</th>
                <th>Slug</th>
                <th>
                  {savingOrder ? <span style={{ color: '#0070f3', fontSize: '0.85em' }}>Saving order...</span> : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => {
                const isDragging = draggedIndex === index;
                const isOver = dragOverIndex === index;

                return (
                  <tr 
                    key={project.id} 
                    className={`${styles.tableRow} ${isDragging ? styles.dragging : ''} ${isOver ? styles.dragOver : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={(e) => handleDragLeave(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
                  >
                    <td style={{ cursor: 'grab', width: '30px', color: '#888' }} title="Drag to reorder">
                      ☰
                    </td>
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
                );
              })}
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
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 4, wheelZoomDistanceFactor: 100 }}
      />
    </div>
  );
}
