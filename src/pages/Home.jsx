import { Link } from 'react-router-dom';
import { useProjects } from '../hooks';
import { usePosts } from '../hooks';
import styles from './Home.module.css';

export default function Home() {
  const { data: projects = [] } = useProjects();
  const { data: posts = [] } = usePosts();

  return (
    <>
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>Portfolio</p>
        <h1 className={styles.heroTitle}>Defining space through structure.</h1>
        <p className={styles.heroSub}>A curated collection of digital environments and minimalist interfaces.</p>
        <Link to="/projects" className={styles.heroCta}>View Work</Link>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Selected Works</h2>
          <Link to="/projects" className={styles.sectionLink}>All Projects →</Link>
        </div>
        <div className={styles.bentoGrid}>
          {projects[0] && (
            <Link to={`/projects/${projects[0]?.slug}`} className={`${styles.projectCard} ${styles.projectCardLarge}`}>
              <img className={styles.projectImage} src={projects[0]?.image_url} alt={projects[0]?.title} />
              <div className={styles.projectOverlay} />
              <div className={styles.projectInfo}>
                <h3 className={styles.projectTitle}>{projects[0]?.title}</h3>
                <p className={styles.projectCategory}>Digital Platform</p>
              </div>
            </Link>
          )}
          {projects[1] && (
            <Link to={`/projects/${projects[1]?.slug}`} className={`${styles.projectCard} ${styles.projectCardSmall}`}>
              <img className={styles.projectImage} src={projects[1]?.image_url} alt={projects[1]?.title} />
              <div className={styles.projectOverlay} />
              <div className={styles.projectInfo}>
                <h3 className={styles.projectTitle}>{projects[1]?.title}</h3>
                <p className={styles.projectCategory}>Design</p>
              </div>
            </Link>
          )}
          {projects[2] && (
            <Link to={`/projects/${projects[2]?.slug}`} className={`${styles.projectCard} ${styles.projectCardFull}`}>
              <img className={styles.projectImage} src={projects[2]?.image_url} alt={projects[2]?.title} />
              <div className={styles.projectOverlay} />
              <div className={styles.projectInfo}>
                <h3 className={styles.projectTitle}>{projects[2]?.title}</h3>
                <p className={styles.projectCategory}>Visual Identity</p>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Blog</h2>
          <Link to="/blog" className={styles.sectionLink}>All Posts →</Link>
        </div>
        <div className={styles.journalList}>
          {posts.map(post => (
            <Link key={post.id} to={`/blog/${post.slug}`} className={styles.journalItem}>
              <span className={styles.journalDate}>
                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <div>
                <h3 className={styles.journalTitle}>{post.title}</h3>
                <p className={styles.journalExcerpt}>{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}