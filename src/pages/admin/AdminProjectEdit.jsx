import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProjectById, updateProject, uploadImage, getProjectBySlug, deleteImage } from "../../lib";
import styles from './AdminForm.module.css';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function AdminProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [techStack, setTechStack] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const project = await getProjectById(id);
        if (project) {
          setTitle(project.title || '');
          setSlug(project.slug || '');
          setTechStack(project.tech_stack?.join(' • ') || '');
          setGithubUrl(project.github_url || '');
          setDescription(project.description || '');
          setImageUrl(project.image_url || '');
        } else {
          setError("Project not found.");
        }
      } catch (err) {
        setError("Failed to load project. Please try again.");
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let finalSlug = slug.trim();
      if (!finalSlug && title) {
        finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      if (finalSlug) {
        let uniqueSlug = finalSlug;
        let counter = 2;
        let collision = true;
        while (collision) {
          const existing = await getProjectBySlug(uniqueSlug);
          if (existing && existing.id !== parseInt(id, 10)) {
            uniqueSlug = `${finalSlug}-${counter}`;
            counter++;
          } else {
            collision = false;
          }
        }
        if (uniqueSlug !== finalSlug) {
          if (!window.confirm(`Slug collision detected. Use "${uniqueSlug}" instead?`)) {
            setSaving(false);
            setError("Slug generation cancelled.");
            return;
          }
        }
        finalSlug = uniqueSlug;
      }

      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile, "projects");
      }
      const techStackArray = techStack.split('•').map(s => s.trim()).filter(Boolean);
      await updateProject(id, { title, slug: finalSlug, tech_stack: techStackArray, github_url: githubUrl, description, image_url: finalImageUrl });
      if (imageFile && imageUrl) {
        await deleteImage(imageUrl);
      }
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
            <input className={styles.input} type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Project name" required maxLength={200} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Slug</label>
            <input className={styles.input} type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated" maxLength={200} />
            <span className={styles.hint}>Leave blank to auto-generate from title</span>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Tech Stack</label>
            <input className={styles.input} type="text" value={techStack} onChange={e => setTechStack(e.target.value)} placeholder="e.g. React • Laravel • Supabase" />
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
            {(previewUrl || imageUrl) && (
              previewUrl ? (
                <img className={styles.imagePreview} src={previewUrl} alt="Preview" />
              ) : (
                <>
                  <img 
                    className={styles.imagePreview} 
                    src={imageUrl} 
                    alt="Preview" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setLightboxOpen(true)}
                  />
                  <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={[{ src: imageUrl }]}
                  />
                </>
              )
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
