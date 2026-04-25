import { useProjects } from '../../hooks/projects/useProjects';

export default function Projects() {
  const { data: projects, loading, error } = useProjects();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {projects.map(p => (
        <div key={p.id}>{p.title}</div>
      ))}
    </div>
  );
}