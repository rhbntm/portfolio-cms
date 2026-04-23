import { useParams } from "react-router-dom";
import { useProject } from "../hooks/useProject";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading, error } = useProject(slug);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!project) return <p>Project not found</p>;

  return <h1>{project.title}</h1>;
}
