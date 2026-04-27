import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPost, uploadImage } from "../../lib";
import styles from './AdminForm.module.css';

export default function AdminPostCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
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
      let coverImageUrl = null;
      if (imageFile) {
        coverImageUrl = await uploadImage(imageFile, "posts");
      }
      await createPost({ title, slug, excerpt, content, is_published: isPublished, cover_image: coverImageUrl });
      navigate("/admin/posts");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <Link to="/admin/posts" className={styles.back}>← posts</Link>
        <h1 className={styles.pageTitle}>New Post</h1>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Title <span className={styles.required}>*</span></label>
            <input className={styles.input} type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Slug</label>
            <input className={styles.input} type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated" />
            <span className={styles.hint}>Leave blank to auto-generate</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Excerpt</label>
          <textarea className={styles.textarea} value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short summary shown in listings" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Content <span className={styles.required}>*</span></label>
          <textarea
            className={`${styles.textarea} ${styles.contentTextarea}`}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your post content here…"
            required
          />
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

        <label className={styles.checkboxField}>
          <input type="checkbox" className={styles.checkboxInput} checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />
          <span className={styles.checkboxLabel}>Publish immediately</span>
        </label>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Saving…' : 'Save Post'}
          </button>
          <Link to="/admin/posts" className={styles.cancelBtn}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
