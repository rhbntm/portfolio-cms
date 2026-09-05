import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { useProject } from '../../hooks';
import { Loading, ErrorMessage } from '../../components';
import styles from './ProjectDetail.module.css';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading, error } = useProject(slug);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!project) return <p>Project not found</p>;

  return (
    <div className={styles.page}>
      <Link to="/projects" className={styles.back}>← Projects</Link>

      <div className={styles.hero}>
        {project.image_url
          ? (
            <>
              <img 
                className={styles.heroImage} 
                src={project.image_url} 
                alt={project.title} 
                style={{ cursor: 'pointer' }}
                onClick={() => setLightboxOpen(true)}
              />
              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={[{ src: project.image_url }]}
                plugins={[Zoom]}
                zoom={{ maxZoomPixelRatio: 4, wheelZoomDistanceFactor: 100 }}
              />
            </>
          )
          : <div className={styles.heroPlaceholder}>No Image</div>
        }
      </div>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          {project.tech_stack?.length > 0 ? (
            <div className={styles.cardTechStack}>
              {project.tech_stack.map(tech => (
                <span key={tech} className={styles.techTag}>{tech}</span>
              ))}
            </div>
          ) : (
            <p className={styles.category}>Project</p>
          )}
          <div className={styles.projectActions}>
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.liveButton}
              >
                Live Demo ↗
              </a>
            )}
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
        </div>
        <h1 className={styles.title}>{project.title}</h1>
        <div className={styles.description}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
