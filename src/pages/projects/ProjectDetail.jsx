import { Link, useParams } from 'react-router-dom';
import { useProject } from '../../hooks';
import { Loading, ErrorMessage } from '../../components';
import styles from './ProjectDetail.module.css';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading, error } = useProject(slug);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!project) return <p>Project not found</p>;

  return (
    <div className={styles.page}>
      <Link to="/projects" className={styles.back}>← Projects</Link>

      <div className={styles.hero}>
        {project.image_url
          ? <img className={styles.heroImage} src={project.image_url} alt={project.title} />
          : <div className={styles.heroPlaceholder}>No Image</div>
        }
      </div>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <p className={styles.category}>{project.tech_stack?.join(' / ') || 'Project'}</p>
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
            >
              GitHub →
            </a>
          )}
        </div>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.description}>{project.description}</p>
      </div>
    </div>
  );
}
