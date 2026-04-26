import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, uploadImage } from "../../lib";

export default function AdminPostCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    is_published: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let coverImageUrl = null;
      if (imageFile) {
        coverImageUrl = await uploadImage(imageFile, "posts");
      }
      await createPost({ ...form, cover_image: coverImageUrl });
      navigate("/admin/posts");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Slug</label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Excerpt</label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={10}
          />
        </div>
        <div>
          <label>Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="is_published"
              checked={form.is_published}
              onChange={handleChange}
            />{" "}
            Published
          </label>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Create"}
        </button>
      </form>
    </div>
  );
}
