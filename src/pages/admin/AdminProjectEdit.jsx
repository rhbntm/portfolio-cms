import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, updateProject, uploadImage } from "../../lib";

export default function AdminProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", slug: "", description: "", image_url: "" });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const project = await getProjectById(id);
      if (project) {
        setForm({
          title: project.title || "",
          slug: project.slug || "",
          description: project.description || "",
          image_url: project.image_url || "",
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      if (imageFile) {
        payload.image_url = await uploadImage(imageFile, "projects");
      }
      await updateProject(id, payload);
      navigate("/admin/projects");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Project</h1>
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
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        {form.image_url && (
          <div>
            <img src={form.image_url} alt="Current" style={{ maxWidth: "200px", maxHeight: "200px" }} />
          </div>
        )}
        <div>
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
