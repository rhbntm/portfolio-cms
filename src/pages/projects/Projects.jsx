import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useProjects } from '../../hooks';
import { Loading, ErrorMessage, Pagination } from '../../components';
import styles from './Projects.module.css';

export default function Projects() {
  const [page, setPage] = useState(1);
  const { data: projects, count, loading, error } = useProjects(page, 6);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.description}>
          <a
            href="https://github.com/rhbntm"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            My GitHub
          </a>
        </p>
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
                  {project.tech_stack?.length > 0 && (
                    <div className={styles.cardTechStack}>
                      {project.tech_stack.map(tech => (
                        <span key={tech} className={styles.techTag}>{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )
      )}
      {!loading && !error && count > 6 && (
        <Pagination page={page} pageSize={6} total={count} setPage={setPage} />
      )}
    </div>
  );
}