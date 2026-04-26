import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost, uploadImage } from "../../lib";

export default function AdminPostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    is_published: false,
    cover_image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getPostById(id);
      if (data) {
        setForm({
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          is_published: !!data.is_published,
          cover_image: data.cover_image || "",
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

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
      const payload = { ...form };
      if (imageFile) {
        payload.cover_image = await uploadImage(imageFile, "posts");
      }
      await updatePost(id, payload);
      navigate("/admin/posts");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Post</h1>
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
        {form.cover_image && (
          <div>
            <img src={form.cover_image} alt="Current" style={{ maxWidth: "200px", maxHeight: "200px" }} />
          </div>
        )}
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
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
