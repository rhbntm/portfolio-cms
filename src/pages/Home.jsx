import { Link } from 'react-router-dom';
import { useProjects, usePosts } from '../hooks';
import { Loading } from '../components/ui';
import { isValidHttpsUrl, isValidUrl } from '../lib/validation';
import heroImage from '../assets/hero.jpg';

import styles from './Home.module.css';

export default function Home() {
  const { data: projects = [], loading: projectsLoading } = useProjects();
  const { data: posts = [], loading: postsLoading } = usePosts();

  if (projectsLoading || postsLoading) {
    return <div className={styles.loadingState}><Loading /></div>;
  }

  const featuredPosts = posts.slice(0, 3);

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
            <a href="/resume.pdf" className={styles.heroSecondaryCta}>Resume</a>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <img src={heroImage} alt="Hero" className={styles.heroImage} />
        </div>
      </section>
      <div className={styles.divider}>
        <div className={styles.dividerInner}>Technologies</div>
      </div>

      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {[...Array(2)].map((_, i) => (
            <div className={styles.marqueeGroup} key={i} aria-hidden={i > 0}>
              {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Laravel', 'PHP', 'Node.js', 'Express', 'REST APIs', 'Supabase', 'MySQL', 'PostgreSQL', 'Docker'].map(tech => (
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

        {!projects.length ? (
          <p className={styles.emptyState}>No projects to show yet.</p>
        ) : (
          <div className={styles.bentoGrid}>
            {projects[0] && (
              <div className={`${styles.projectCard} ${styles.projectCardLarge}`}>
                <Link to={`/projects/${projects[0]?.slug}`} className={styles.projectImageWrapper}>
                  {projects[0]?.image_url && <img className={styles.projectImage} src={projects[0].image_url} alt={projects[0].title} />}
                  <div className={styles.projectOverlay} />
                </Link>
                <div className={styles.projectInfo}>
                  <div className={styles.projectMeta}>
                    {projects[0]?.created_at && (
                      <span className={styles.projectDate}>
                        {new Date(projects[0].created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    <h3 className={styles.projectTitle}>{projects[0]?.title}</h3>
                    {projects[0]?.tech_stack?.length > 0 ? (
                      <div className={styles.cardTechStack}>
                        {projects[0].tech_stack.slice(0, 3).map(tech => (
                          <span key={tech} className={styles.techTag}>{tech}</span>
                        ))}
                      </div>
                    ) : (
                      <p className={styles.projectCategory}>Full-stack Platform</p>
                    )}
                  </div>
                  <div className={styles.projectActions}>
                    {isValidUrl(projects[0]?.live_url) && (
                      <a href={projects[0].live_url} target="_blank" rel="noopener noreferrer" className={styles.projectLive}>Live ↗</a>
                    )}
                    {isValidHttpsUrl(projects[0]?.github_url, ['github.com']) && (
                      <a href={projects[0].github_url} target="_blank" rel="noopener noreferrer" className={styles.projectGithub}>GitHub ↗</a>
                    )}
                  </div>
                </div>
              </div>
            )}
            {projects[1] && (
              <div className={`${styles.projectCard} ${styles.projectCardSmall}`}>
                <Link to={`/projects/${projects[1]?.slug}`} className={styles.projectImageWrapper}>
                  {projects[1]?.image_url && <img className={styles.projectImage} src={projects[1].image_url} alt={projects[1].title} />}
                  <div className={styles.projectOverlay} />
                </Link>
                <div className={styles.projectInfo}>
                  <div className={styles.projectMeta}>
                    {projects[1]?.created_at && (
                      <span className={styles.projectDate}>
                        {new Date(projects[1].created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    <h3 className={styles.projectTitle}>{projects[1]?.title}</h3>
                    {projects[1]?.tech_stack?.length > 0 ? (
                      <div className={styles.cardTechStack}>
                        {projects[1].tech_stack.slice(0, 3).map(tech => (
                          <span key={tech} className={styles.techTag}>{tech}</span>
                        ))}
                      </div>
                    ) : (
                      <p className={styles.projectCategory}>Web Application</p>
                    )}
                  </div>
                  <div className={styles.projectActions}>
                    {isValidUrl(projects[1]?.live_url) && (
                      <a href={projects[1].live_url} target="_blank" rel="noopener noreferrer" className={styles.projectLive}>Live ↗</a>
                    )}
                    {isValidHttpsUrl(projects[1]?.github_url, ['github.com']) && (
                      <a href={projects[1].github_url} target="_blank" rel="noopener noreferrer" className={styles.projectGithub}>GitHub ↗</a>
                    )}
                  </div>
                </div>
              </div>
            )}
            {projects[2] && (
              <div className={`${styles.projectCard} ${styles.projectCardFull}`}>
                <Link to={`/projects/${projects[2]?.slug}`} className={styles.projectImageWrapper}>
                  {projects[2]?.image_url && <img className={styles.projectImage} src={projects[2].image_url} alt={projects[2].title} />}
                  <div className={styles.projectOverlay} />
                </Link>
                <div className={styles.projectInfo}>
                  <div className={styles.projectMeta}>
                    {projects[2]?.created_at && (
                      <span className={styles.projectDate}>
                        {new Date(projects[2].created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    <h3 className={styles.projectTitle}>{projects[2]?.title}</h3>
                    {projects[2]?.tech_stack?.length > 0 ? (
                      <div className={styles.cardTechStack}>
                        {projects[2].tech_stack.slice(0, 3).map(tech => (
                          <span key={tech} className={styles.techTag}>{tech}</span>
                        ))}
                      </div>
                    ) : (
                      <p className={styles.projectCategory}>System Implementation</p>
                    )}
                  </div>
                  <div className={styles.projectActions}>
                    {isValidUrl(projects[2]?.live_url) && (
                      <a href={projects[2].live_url} target="_blank" rel="noopener noreferrer" className={styles.projectLive}>Live ↗</a>
                    )}
                    {isValidHttpsUrl(projects[2]?.github_url, ['github.com']) && (
                      <a href={projects[2].github_url} target="_blank" rel="noopener noreferrer" className={styles.projectGithub}>GitHub ↗</a>
                    )}
                  </div>
                </div>
              </div>
            )}
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
          {!featuredPosts.length ? (
            <p className={styles.emptyState}>No posts published yet.</p>
          ) : (
            featuredPosts.map(post => (
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