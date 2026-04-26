import { useParams } from "react-router-dom";
import { useProject } from "../../hooks";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading, error } = useProject(slug);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div>
      {project.image_url && (
        <img src={project.image_url} alt={project.title} style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "cover" }} />
      )}
      <h1>{project.title}</h1>
      <p>{project.description}</p>
    </div>
  );
}
