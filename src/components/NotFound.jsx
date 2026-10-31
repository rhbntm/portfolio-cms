import { Link } from 'react-router-dom';
import PageMessage from './ui/PageMessage';
import styles from './ui/PageMessage.module.css';

const DEFAULT_LINKS = [{ to: '/projects', label: 'View Projects' }];

export default function NotFound({
  title = 'Page not found',
  message = "This page doesn't exist or may have moved.",
  links = DEFAULT_LINKS,
}) {
  return (
    <PageMessage
      eyebrow="404"
      title={title}
      actions={
        <>
          {links.map(link => (
            <Link key={link.to} to={link.to} className={styles.action}>{link.label}</Link>
          ))}
          <Link to="/" className={`${styles.action} ${styles.actionSecondary}`}>Home</Link>
        </>
      }
    >
      {message}
    </PageMessage>
  );
}
