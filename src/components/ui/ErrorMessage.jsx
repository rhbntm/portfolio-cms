import styles from './ErrorMessage.module.css';

export default function ErrorMessage({ message }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>ERR</span>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
