import styles from './PageMessage.module.css';

export default function PageMessage({ eyebrow, title, children, actions }) {
  return (
    <section className={styles.wrapper}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h1 className={styles.title}>{title}</h1>
      {children && <p className={styles.text}>{children}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </section>
  );
}
