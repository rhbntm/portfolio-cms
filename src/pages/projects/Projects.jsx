import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useProjects } from '../../hooks';
import { Loading, ErrorMessage, Pagination } from '../../components';
import { isValidHttpsUrl } from '../../lib/validation';
import { techList } from '../../lib/format';
import styles from './Projects.module.css';

export default function Projects() {
  const [page, setPage] = useState(1);
  const { data: projects, count, loading, error } = useProjects(page, 6);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.description}>
          Systems I’ve built for real users, each with a write-up of the problem, the decisions, and what I’d change.
          More experiments are on{' '}
          <a href="https://github.com/rhbntm" target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
            GitHub ↗
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
                  {isValidHttpsUrl(project.image_url) && (
                    <img className={styles.cardImage} src={project.image_url} alt={project.title} loading="lazy" />
                  )}
                </div>
                <div className={styles.cardBody}>
                  {project.created_at && (
                    <span className={styles.cardDate}>
                      {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                  <h2 className={styles.cardTitle}>{project.title}</h2>
                  {project.summary && <p className={styles.cardSummary}>{project.summary}</p>}
                  {techList(project.tech_stack).length > 0 && (
                    <div className={styles.cardTechStack}>
                      {techList(project.tech_stack).map(tech => (
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