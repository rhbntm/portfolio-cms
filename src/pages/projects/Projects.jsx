import { useProjects } from '../../hooks';
import { Loading, ErrorMessage } from '../../components';

export default function Projects() {
  const { data: projects, loading, error } = useProjects();

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {projects.map(p => (
        <div key={p.id}>
          {p.image_url ? (
            <img src={p.image_url} alt={p.title} style={{ width: "120px", height: "120px", objectFit: "cover", marginRight: "8px", verticalAlign: "middle" }} />
          ) : (
            <span style={{ display: "inline-block", width: "120px", height: "120px", background: "#eee", marginRight: "8px", verticalAlign: "middle" }} />
          )}
          {p.title}
        </div>
      ))}
    </div>
  );
}