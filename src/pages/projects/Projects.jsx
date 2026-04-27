import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks';
import { Loading, ErrorMessage } from '../../components';
import styles from './Projects.module.css';

export default function Projects() {
  const { data: projects, loading, error } = useProjects();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Work</p>
        <h1 className={styles.title}>Projects</h1>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        projects.length === 0 ? (
          <p className={styles.empty}>No projects yet.</p>
        ) : (
          <div className={styles.grid}>
            {projects.map(project => (
              <Link key={project.id} to={`/projects/${project.slug}`} className={styles.card}>
                <div className={styles.cardImageWrap}>
                  {project.image_url && (
                    <img className={styles.cardImage} src={project.image_url} alt={project.title} />
                  )}
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{project.title}</h2>
                  <p className={styles.cardDescription}>{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}