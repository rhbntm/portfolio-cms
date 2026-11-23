import { Link } from 'react-router-dom';
import { trackResumeDownload } from '../analytics';
import { AVAILABILITY, SKILL_GROUPS } from '../content/profile';
import styles from './About.module.css';

const BIO = [
  "I'm a 4th-year IT student who builds web apps for small businesses. I like the whole stack — database design, APIs, and the screens people actually tap on — but what I care about most is whether the thing gets used.",
  "I built and deployed an inventory system for a live-selling clothing business, and I'm lead developer of a five-member capstone team building an offline-first point-of-sale with a machine-learning customer-count forecast for Ruzzco Barbers.",
];

const FACTS = [
  { label: 'Based in', value: 'Manila, Philippines' },
  { label: 'Studying', value: 'BS Information Technology, graduating June 2027' },
  { label: 'Looking for', value: 'Software development internship (500-hour OJT) from December 2026' },
];

// Lessons taken from real projects — see the JR Inventory case study.
const PRINCIPLES = [
  {
    title: 'Build for the real user',
    text: 'My first inventory system went unused because it ran on a slow laptop. Rebuilding it phone-first, on the device the owner already used, is what got it adopted.',
  },
  {
    title: 'Measure before rewriting',
    text: "I once rewrote a Laravel app because pages felt slow; the cause was my own dev setup. Now I profile first and change the stack last.",
  },
  {
    title: 'Ship, then iterate',
    text: 'The first version of the inventory system was in daily use three days into a one-week build. Real feedback beats a longer plan.',
  },
];

const EXPERIENCE = [
  {
    period: 'Sep 2026 – Present',
    role: 'Lead Developer, Capstone',
    org: 'Ruzzco Barbers',
    description: 'Leading a five-member team building an offline-first point-of-sale and a Random Forest customer-count forecast for a Caloocan barbershop.',
    links: [{ href: '/projects', label: 'See the project' }],
  },
  {
    period: 'Dec 2025 – Present',
    role: 'Web Developer & E-commerce Operations Assistant',
    org: 'Live-selling clothing business',
    description: 'Built a custom inventory management system and support stock and order management during live sales.',
    links: [
      { href: 'https://shopee.ph/mr.silentwhite', label: 'Shopee shop', external: true },
      { href: 'https://www.tiktok.com/@justinrosieclothingshop', label: 'TikTok shop', external: true },
    ],
  },
  {
    period: '2022 – Jun 2027',
    role: 'BS Information Technology',
    org: 'Student',
    description: 'Expected graduation: June 2027.',
  },
];

export default function About() {
  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <div className={styles.introText}>
          <p className={styles.eyebrow}>
            {AVAILABILITY.short}
            <span className={styles.eyebrowDetail}> · {AVAILABILITY.detail}</span>
          </p>
          <h1 className={styles.pageTitle}>About me</h1>
          <div className={styles.bio}>
            {BIO.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className={styles.actions}>
            <a href="/resume.pdf" download="Marcelo_Ralph_Brent_Resume.pdf" className={styles.primaryBtn} onClick={() => trackResumeDownload()}>Download resume</a>
            <Link to="/contact" className={styles.secondaryBtn}>Get in touch</Link>
          </div>
        </div>

        <aside className={styles.introAside}>
          <dl className={styles.facts}>
            {FACTS.map(fact => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      <section className={styles.section} aria-labelledby="principles-heading">
        <h2 id="principles-heading" className={styles.sectionTitle}>How I work</h2>
        <div className={styles.principles}>
          {PRINCIPLES.map(p => (
            <div key={p.title} className={styles.principle}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="experience-heading">
        <h2 id="experience-heading" className={styles.sectionTitle}>Experience &amp; education</h2>
        <ol className={styles.timeline}>
          {EXPERIENCE.map(item => (
            <li key={item.role} className={styles.timelineItem}>
              <span className={styles.timelinePeriod}>{item.period}</span>
              <div>
                <h3 className={styles.timelineRole}>{item.role}</h3>
                <p className={styles.timelineOrg}>{item.org}</p>
                <p className={styles.timelineDesc}>{item.description}</p>
                {item.links?.length > 0 && (
                  <div className={styles.timelineLinks}>
                    {item.links.map(link => link.external ? (
                      <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.timelineLink}>
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link key={link.href} to={link.href} className={styles.timelineLink}>{link.label} →</Link>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="skills-heading">
        <h2 id="skills-heading" className={styles.sectionTitle}>Skills</h2>
        <div className={styles.skillsGrid}>
          {SKILL_GROUPS.map(group => (
            <div key={group.label} className={styles.skillGroup}>
              <h3 className={styles.skillLabel}>{group.label}</h3>
              <ul className={styles.skillList}>
                {group.items.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
