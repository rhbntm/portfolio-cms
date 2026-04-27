import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.sectionContainer}>
          <h1 className={styles.pageTitle}>About Me</h1>
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.aboutMain}>
            <h2 className={styles.aboutLabel}>The Story</h2>
            <p className={styles.aboutText}>
              I'm currently building projects to deepen my understanding of full-stack development. My focus is on creating structured, maintainable systems — from database design and APIs to clean frontend interfaces.
              <br /><br />
              Recently, I've been working on a portfolio CMS, an inventory management system, and exploring how SaaS platforms are designed. I'm also learning cloud concepts to better understand how real applications are deployed and scaled.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.techSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.techMain}>
            <h2 className={styles.techLabel}>Technologies</h2>
            <div className={styles.techGrid}>
              <div className={styles.techCategory}>
                <span>Frontend</span>
                <p>React, Next.js, TypeScript, Tailwind CSS</p>
              </div>
              <div className={styles.techCategory}>
                <span>Backend</span>
                <p>Laravel, PHP, Node.js, Express, REST APIs</p>
              </div>
              <div className={styles.techCategory}>
                <span>Database & Cloud</span>
                <p>Supabase, MySQL, SQLite3, PostgreSQL, Docker</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
