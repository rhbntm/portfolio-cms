import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostById, updatePost, uploadImage, getPostBySlug, deleteImage } from "../../lib";
import styles from './AdminForm.module.css';

const PRESET_TAGS = ['Business', 'Tech', 'Reflection', 'Personal', 'Design', 'Life'];

export default function AdminPostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [originalCoverImage, setOriginalCoverImage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [contentUploading, setContentUploading] = useState(false);

  // ── Load post ────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPostById(id);
        if (data) {
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setExcerpt(data.excerpt || '');
          setContent(data.content || '');
          setTags(Array.isArray(data.tags) ? data.tags : []);
          setIsPublished(!!data.is_published);
          setCoverImage(data.cover_image || '');
          setOriginalCoverImage(data.cover_image || '');
        } else {
          setError("Post not found.");
        }
      } catch {
        setError("Failed to load post. Please try again.");
      }
      setLoading(false);
    }
    load();
  }, [id]);

  // ── Tag helpers ──────────────────────────────────────────────

  function toggleTag(tag) {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  function addCustomTag() {
    const t = customTag.trim();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setCustomTag('');
  }

  function handleCustomTagKey(e) {
    if (e.key === 'Enter') { e.preventDefault(); addCustomTag(); }
  }

  // ── Cover image helpers ──────────────────────────────────────

  function handleRemoveImage() {
    setImageFile(null);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
    setCoverImage('');
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }

  // ── Content image: shared upload + insert ───────────────────

  async function insertContentImage(file) {
    if (!file || !file.type.startsWith('image/')) return;
    setContentUploading(true);
    try {
      const url = await uploadImage(file, 'posts');
      const textarea = contentRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = content.slice(0, start);
      const after = content.slice(end);
      const insertion = `![image](${url})`;
      const newContent = before + insertion + after;
      setContent(newContent);
      requestAnimationFrame(() => {
        textarea.focus();
        const pos = start + insertion.length;
        textarea.setSelectionRange(pos, pos);
      });
    } catch (err) {
      setError(`Image upload failed: ${err.message}`);
    } finally {
      setContentUploading(false);
    }
  }

  function handleContentDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleContentDragLeave() {
    setIsDragging(false);
  }

  function handleContentDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) insertContentImage(file);
  }

  function handleContentPaste(e) {
    const items = Array.from(e.clipboardData?.items ?? []);
    const imageItem = items.find(i => i.type.startsWith('image/'));
    if (imageItem) {
      e.preventDefault();
      insertContentImage(imageItem.getAsFile());
    }
  }

  // ── Form submit ──────────────────────────────────────────────

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
          const existing = await getPostBySlug(uniqueSlug);
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

      let finalCoverImage = coverImage;
      if (imageFile) finalCoverImage = await uploadImage(imageFile, "posts");

      await updatePost(id, { title, slug: finalSlug, excerpt, content, tags, is_published: isPublished, cover_image: finalCoverImage || null });

      if (originalCoverImage && originalCoverImage !== finalCoverImage) {
        await deleteImage(originalCoverImage);
      }
      navigate("/admin/posts");
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
        <Link to="/admin/posts" className={styles.back}>← posts</Link>
        <h1 className={styles.pageTitle}>Edit Post</h1>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Title <span className={styles.required}>*</span></label>
            <input className={styles.input} type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" required maxLength={200} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Slug</label>
            <input className={styles.input} type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated" maxLength={200} />
            <span className={styles.hint}>Leave blank to auto-generate</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Excerpt</label>
          <textarea className={styles.textarea} value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short summary shown in listings" />
        </div>

        {/* ── Tags ── */}
        <div className={styles.field}>
          <label className={styles.label}>Tags</label>
          <div className={styles.tagChips}>
            {PRESET_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                className={`${styles.tagChip} ${tags.includes(tag) ? styles.tagChipActive : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tags.includes(tag) && <span className={styles.tagChipRemove}>✕</span>}
                {tag}
              </button>
            ))}
            {/* custom tags not in preset */}
            {tags.filter(t => !PRESET_TAGS.includes(t)).map(t => (
              <button
                key={t}
                type="button"
                className={`${styles.tagChip} ${styles.tagChipActive}`}
                onClick={() => toggleTag(t)}
              >
                <span className={styles.tagChipRemove}>✕</span>
                {t}
              </button>
            ))}
          </div>
          <div className={styles.tagCustomRow}>
            <input
              className={styles.tagCustomInput}
              type="text"
              value={customTag}
              onChange={e => setCustomTag(e.target.value)}
              onKeyDown={handleCustomTagKey}
              placeholder="Custom tag…"
              maxLength={40}
            />
            <button type="button" className={styles.tagAddBtn} onClick={addCustomTag}>+ Add</button>
          </div>
        </div>

        {/* ── Content editor ── */}
        <div className={styles.field}>
          <div className={styles.contentLabelRow}>
            <label className={styles.label}>
              Content <span className={styles.required}>*</span>
              {contentUploading && <span className={styles.contentUploadingHint}>&nbsp;· uploading image…</span>}
            </label>
            <button
              type="button"
              className={`${styles.previewToggle} ${showPreview ? styles.previewToggleActive : ''}`}
              onClick={() => setShowPreview(p => !p)}
            >
              {showPreview ? 'Hide Preview' : 'Preview'}
            </button>
          </div>
          <div className={showPreview ? styles.editorSplit : undefined}>
            <textarea
              ref={contentRef}
              className={`${styles.textarea} ${styles.contentTextarea} ${isDragging ? styles.contentTextareaDragging : ''}`}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your post content here… Drop or paste images to embed them."
              required
              onDragOver={handleContentDragOver}
              onDragLeave={handleContentDragLeave}
              onDrop={handleContentDrop}
              onPaste={handleContentPaste}
            />
            {showPreview && (
              <div className={styles.mdPreview}>
                {content
                  ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  : <span className={styles.mdPreviewEmpty}>Nothing to preview yet…</span>
                }
              </div>
            )}
          </div>
        </div>

        {/* ── Cover Image ── */}
        <div className={styles.field}>
          <label className={styles.label}>Cover Image</label>
          <div className={styles.imageSection}>
            <input type="file" className={styles.fileInput} accept="image/*" onChange={handleImageChange} />
            {(previewUrl || coverImage) && (
              <div className={styles.previewContainer}>
                <img className={styles.imagePreview} src={previewUrl || coverImage} alt="Preview" />
                <button type="button" className={styles.removeImageBtn} onClick={handleRemoveImage}>
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>

        <label className={styles.checkboxField}>
          <input type="checkbox" className={styles.checkboxInput} checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />
          <span className={styles.checkboxLabel}>Publish immediately</span>
        </label>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save Post'}
          </button>
          <Link to="/admin/posts" className={styles.cancelBtn}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
