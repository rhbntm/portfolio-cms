import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import NotFound from './NotFound';
import PageMessage from './ui/PageMessage';
import styles from './ui/PageMessage.module.css';

/**
 * Route errorElement. Also catches lazy page chunks that fail to load, which happens
 * when a tab opened before a deploy requests a chunk that no longer exists, so it
 * must stay in the main bundle and offer a reload.
 */
export default function RouteError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />;

  console.error('Route error:', error);

  return (
    <PageMessage
      eyebrow="Something went wrong"
      title="This page couldn't load"
      actions={
        <>
          <button type="button" className={styles.action} onClick={() => window.location.reload()}>Reload Page</button>
          <Link to="/" className={`${styles.action} ${styles.actionSecondary}`}>Home</Link>
        </>
      }
    >
      The site may have just been updated. Reloading usually fixes this.
    </PageMessage>
  );
}
