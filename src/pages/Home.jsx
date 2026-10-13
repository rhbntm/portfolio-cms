import { Link } from 'react-router-dom';
import { useProjects, usePosts } from '../hooks';
import { Loading } from '../components/ui';
import { isValidHttpsUrl, isValidUrl } from '../lib/validation';
import heroImage from '../assets/hero.webp';
import { trackResumeDownload } from '../analytics';

import styles from './Home.module.css';

const TECHNOLOGIES = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Laravel', 'PHP', 'Node.js', 'Express', 'REST APIs', 'Supabase', 'MySQL', 'PostgreSQL', 'Docker'];

// Bento layout for the first three projects: [size class, fallback category label]
const PROJECT_SLOTS = [
  [styles.projectCardLarge, 'Full-stack Platform'],
  [styles.projectCardSmall, 'Web Application'],
  [styles.projectCardFull, 'System Implementation'],
];

function ProjectCard({ project, sizeClass, fallbackCategory }) {
  return (
    <div className={`${styles.projectCard} ${sizeClass}`}>
      <Link to={`/projects/${project.slug}`} className={styles.projectImageWrapper}>
        {isValidHttpsUrl(project.image_url) && (
          <img className={styles.projectImage} src={project.image_url} alt={project.title} loading="lazy" />
        )}
        <div className={styles.projectOverlay} />
      </Link>
      <div className={styles.projectInfo}>
        <div className={styles.projectMeta}>
          {project.created_at && (
            <span className={styles.projectDate}>
              {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          )}
          <h3 className={styles.projectTitle}>{project.title}</h3>
          {project.tech_stack?.length > 0 ? (
            <div className={styles.cardTechStack}>
              {project.tech_stack.slice(0, 3).map(tech => (
                <span key={tech} className={styles.techTag}>{tech}</span>
              ))}
            </div>
          ) : (
            <p className={styles.projectCategory}>{fallbackCategory}</p>
          )}
        </div>
        <div className={styles.projectActions}>
          {isValidUrl(project.live_url) && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className={styles.projectLive}>Live ↗</a>
          )}
          {isValidHttpsUrl(project.github_url, ['github.com']) && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className={styles.projectGithub}>GitHub ↗</a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: projects, loading: projectsLoading } = useProjects(1, PROJECT_SLOTS.length);
  const { data: posts, loading: postsLoading } = usePosts(1, 3);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Open for internships</p>
          <h1 className={styles.heroTitle}>I build full-stack web applications using React and PHP frameworks such as CodeIgniter and Laravel.</h1>
          <p className={styles.heroSub}>
            3rd-year IT student focused on building functional websites and systems
            from CMS website to inventory management tools.
          </p>
          <div className={styles.heroActions}>
            <Link to="/projects" className={styles.heroCta}>View Projects</Link>
            <a href="https://github.com/rhbntm" target="_blank" rel="noopener noreferrer" className={styles.heroSecondaryCta}>GitHub</a>
            <a
              href="/resume.pdf"
              className={styles.heroSecondaryCta}
              onClick={() => trackResumeDownload()}
            >Resume</a>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <img
            src={heroImage}
            alt="Portrait of Ralph Brent Marcelo"
            className={styles.heroImage}
            width={800}
            height={1112}
            fetchPriority="high"
          />
        </div>
      </section>
      <div className={styles.divider}>
        <div className={styles.dividerInner}>Technologies</div>
      </div>

      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {[...Array(2)].map((_, i) => (
            <div className={styles.marqueeGroup} key={i} aria-hidden={i > 0}>
              {TECHNOLOGIES.map(tech => (
                <span className={styles.marqueeItem} key={`${tech}-${i}`}>
                  {tech}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.divider}>
        <div className={styles.dividerInner}>Curated Projects</div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <Link to="/projects" className={styles.sectionLink}>All Projects →</Link>
        </div>

        {projectsLoading ? (
          <div className={styles.loadingState}><Loading /></div>
        ) : !projects.length ? (
          <p className={styles.emptyState}>No projects to show yet.</p>
        ) : (
          <div className={styles.bentoGrid}>
            {projects.slice(0, PROJECT_SLOTS.length).map((project, i) => (
              <ProjectCard
                key={project.id ?? project.slug}
                project={project}
                sizeClass={PROJECT_SLOTS[i][0]}
                fallbackCategory={PROJECT_SLOTS[i][1]}
              />
            ))}
          </div>
        )}
      </section>

      <div className={styles.divider}>
        <div className={styles.dividerInner}>Blog & Thoughts</div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Latest Posts</h2>
          <Link to="/blog" className={styles.sectionLink}>All Posts →</Link>
        </div>
        <div className={styles.journalList}>
          {postsLoading ? (
            <div className={styles.loadingState}><Loading /></div>
          ) : !posts.length ? (
            <p className={styles.emptyState}>No posts published yet.</p>
          ) : (
            posts.slice(0, 3).map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`} className={styles.journalItem}>
                <span className={styles.journalDate}>
                  {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div className={styles.journalBody}>
                  <h3 className={styles.journalTitle}>{post.title}</h3>
                  <p className={styles.journalExcerpt}>{post.excerpt}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Let’s work together</h2>
          <p className={styles.ctaText}>I’m currently looking for internships and freelance opportunities.</p>
          <Link to="/contact" className={styles.ctaButton}>Get in Touch</Link>
        </div>
      </section>
    </>
  );
}
