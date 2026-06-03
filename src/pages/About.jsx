import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './About.module.css';

const BIO = `
I'm currently building projects to deepen my understanding of full-stack development. My focus is on creating structured, maintainable systems — from database design and APIs to clean frontend interfaces.

Recently, I've been working on a portfolio CMS, an inventory management system, and exploring how SaaS platforms are designed. I'm also learning cloud concepts to better understand how real applications are deployed and scaled.
`;

const EXPERIENCE = [
  {
    period: 'December 2025 – Present',
    role: 'Web Developer & E-commerce Operations Assistant',
    description: 'Developed a custom inventory management system and supported stock and order management during live sales operations.',
    link: 'https://shopee.ph/mr.silentwhite',
  },
  {
    period: '2022 – Present',
    role: 'BS Information Technology (Student)',
    description: 'The group developer and technical leader of every project in my group',
  },
];

export default function About() {
  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.sectionContainer}>
          <h1 className={styles.pageTitle}>About Me</h1>
          <p className={styles.pageSubtitle}>3rd-year IT student. Full-stack developer.</p>
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.aboutMain}>
            <h2 className={styles.aboutLabel}>The Story</h2>
            <div className={styles.aboutText}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{BIO}</ReactMarkdown>
            </div>
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
                <div className={styles.cardTechStack}>
                  {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map(tech => (
                    <span key={tech} className={styles.techTag}>{tech}</span>
                  ))}
                </div>
              </div>
              <div className={styles.techCategory}>
                <span>Backend</span>
                <div className={styles.cardTechStack}>
                  {['Laravel', 'PHP', 'Node.js', 'Express', 'REST APIs'].map(tech => (
                    <span key={tech} className={styles.techTag}>{tech}</span>
                  ))}
                </div>
              </div>
              <div className={styles.techCategory}>
                <span>Database &amp; Cloud</span>
                <div className={styles.cardTechStack}>
                  {['Supabase', 'MySQL', 'PostgreSQL', 'Docker'].map(tech => (
                    <span key={tech} className={styles.techTag}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className={styles.experienceSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.experienceMain}>
            <h2 className={styles.experienceLabel}>Experience</h2>
            <ul className={styles.timeline}>
              {EXPERIENCE.map((item) => (
                <li key={item.role} className={styles.timelineItem}>
                  <span className={styles.timelinePeriod}>{item.period}</span>
                  <div>
                    <h3 className={styles.timelineRole}>{item.role}</h3>
                    <p className={styles.timelineDesc}>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
