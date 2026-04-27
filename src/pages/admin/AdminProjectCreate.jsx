import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProject, uploadImage } from "../../lib";
import styles from './AdminForm.module.css';

export default function AdminProjectCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "projects");
      }
      await createProject({ title, slug, category, github_url: githubUrl, description, image_url: imageUrl });
      navigate("/admin/projects");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <Link to="/admin/projects" className={styles.back}>← projects</Link>
        <h1 className={styles.pageTitle}>New Project</h1>
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

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Tech Stack / Category</label>
            <input className={styles.input} type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. React • Laravel • Supabase" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>GitHub URL</label>
            <input className={styles.input} type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
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
            {previewUrl && (
              <img className={styles.imagePreview} src={previewUrl} alt="Preview" />
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Saving…' : 'Save Project'}
          </button>
          <Link to="/admin/projects" className={styles.cancelBtn}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
