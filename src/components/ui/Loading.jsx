import styles from './Loading.module.css';

export default function Loading({ message = 'Loading' }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <span className={styles.message}>{message}</span>
    </div>
  );
}
