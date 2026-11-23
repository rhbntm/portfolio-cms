import { Link } from 'react-router-dom';
import { useProjects, usePosts } from '../hooks';
import { Loading } from '../components/ui';
import { isValidHttpsUrl, isValidUrl } from '../lib/validation';
import heroImage from '../assets/hero.webp';
import { trackResumeDownload } from '../analytics';
import { AVAILABILITY, SKILL_GROUPS } from '../content/profile';
import { techList } from '../lib/format';

import styles from './Home.module.css';

// Bento layout for the first three projects: [size class, fallback category label]
const PROJECT_SLOTS = [
  [styles.projectCardLarge, 'Full-stack Platform'],
  [styles.projectCardSmall, 'Web Application'],
  [styles.projectCardFull, 'System Implementation'],
];

function ProjectCard({ project, sizeClass, fallbackCategory }) {
  const tech = techList(project.tech_stack);
  const href = `/projects/${project.slug}`;

  return (
    <article className={`${styles.projectCard} ${sizeClass}`}>
      <div className={styles.projectImageWrapper}>
        {isValidHttpsUrl(project.image_url) && (
          <img className={styles.projectImage} src={project.image_url} alt="" loading="lazy" />
        )}
      </div>
      <div className={styles.projectInfo}>
        {project.created_at && (
          <span className={styles.projectDate}>
            {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        )}
        <h3 className={styles.projectTitle}>
          {/* Stretched link: its ::after covers the whole card, so the card is one click target */}
          <Link to={href} className={styles.projectLink}>{project.title}</Link>
        </h3>
        {project.summary && <p className={styles.projectSummary}>{project.summary}</p>}
        <div className={styles.projectFooter}>
          {tech.length > 0 ? (
            <ul className={styles.cardTechStack} aria-label="Tech stack">
              {tech.slice(0, 4).map(item => (
                <li key={item} className={styles.techTag}>{item}</li>
              ))}
              {tech.length > 4 && <li className={styles.techMore}>+{tech.length - 4}</li>}
            </ul>
          ) : (
            <p className={styles.projectCategory}>{fallbackCategory}</p>
          )}
          <div className={styles.projectActions}>
            {isValidUrl(project.live_url) && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className={styles.projectLive}>
                Live demo ↗
              </a>
            )}
            {isValidHttpsUrl(project.github_url, ['github.com']) && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className={styles.projectGithub}>
                Code ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const { data: projects, loading: projectsLoading } = useProjects(1, PROJECT_SLOTS.length);
  const { data: posts, loading: postsLoading } = usePosts(1, 3);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>{AVAILABILITY}</p>
          <h1 className={styles.heroTitle}>
            Hi, I’m Ralph. I build web apps that small businesses actually use.
          </h1>
          <p className={styles.heroSub}>
            4th-year IT student and full-stack developer (React, Next.js, Laravel). I led a
            five-person team on an offline-first point-of-sale with sales forecasting, and
            built a phone-first inventory system for a live-selling shop.
          </p>
          <div className={styles.heroActions}>
            <Link to="/projects" className={styles.heroCta}>View projects</Link>
            <a
              href="/resume.pdf" download="Marcelo_Ralph_Brent_Resume.pdf"
              className={styles.heroSecondaryCta}
              onClick={() => trackResumeDownload()}
            >Download resume</a>
            <a href="https://github.com/rhbntm" target="_blank" rel="noopener noreferrer" className={styles.heroTextLink}>
              GitHub ↗
            </a>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <img
            src={heroImage}
            alt="Portrait of Ralph Brent Marcelo"
            className={styles.heroImage}
            width={800}
            height={1000}
            fetchPriority="high"
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="skills-heading">
        <div className={styles.sectionHeader}>
          <h2 id="skills-heading" className={styles.sectionTitle}>What I work with</h2>
          <Link to="/about" className={styles.sectionLink}>More about me →</Link>
        </div>
        <div className={styles.skillsGrid}>
          {SKILL_GROUPS.map(group => (
            <div key={group.label} className={styles.skillGroup}>
              <h3 className={styles.skillLabel}>{group.label}</h3>
              <ul className={styles.skillList}>
                {group.items.map(item => <li key={item} className={styles.skillItem}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="projects-heading">
        <div className={styles.sectionHeader}>
          <h2 id="projects-heading" className={styles.sectionTitle}>Selected projects</h2>
          <Link to="/projects" className={styles.sectionLink}>All projects →</Link>
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

      <section className={styles.section} aria-labelledby="posts-heading">
        <div className={styles.sectionHeader}>
          <h2 id="posts-heading" className={styles.sectionTitle}>Latest writing</h2>
          <Link to="/blog" className={styles.sectionLink}>All posts →</Link>
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
                <span className={styles.journalArrow} aria-hidden="true">→</span>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Let’s work together</h2>
          <p className={styles.ctaText}>
            I’m looking for a software development internship starting December 2026, and I’m open to freelance work.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/contact" className={styles.ctaButton}>Get in touch</Link>
            <a href="/resume.pdf" download="Marcelo_Ralph_Brent_Resume.pdf" className={styles.ctaSecondary} onClick={() => trackResumeDownload()}>Resume</a>
          </div>
        </div>
      </section>
    </>
  );
}
