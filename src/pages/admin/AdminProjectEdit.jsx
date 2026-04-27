import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProjectById, updateProject, uploadImage } from "../../lib";
import styles from './AdminForm.module.css';

export default function AdminProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const project = await getProjectById(id);
      if (project) {
        setTitle(project.title || '');
        setSlug(project.slug || '');
        setDescription(project.description || '');
        setImageUrl(project.image_url || '');
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile, "projects");
      }
      await updateProject(id, { title, slug, description, image_url: finalImageUrl });
      navigate("/admin/projects");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p style={{ padding: '2rem', color: '#52555e' }}>Loading…</p>;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <Link to="/admin/projects" className={styles.back}>← projects</Link>
        <h1 className={styles.pageTitle}>Edit Project</h1>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Title <span className={styles.required}>*</span></label>
            <input className={styles.input} type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Project name" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Slug</label>
            <input className={styles.input} type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated" />
            <span className={styles.hint}>Leave blank to auto-generate from title</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief project description" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Cover Image</label>
          <div className={styles.imageSection}>
            <input type="file" className={styles.fileInput} accept="image/*" onChange={handleImageChange} />
            {(previewUrl || imageUrl) && (
              <img className={styles.imagePreview} src={previewUrl || imageUrl} alt="Preview" />
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save Project'}
          </button>
          <Link to="/admin/projects" className={styles.cancelBtn}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
