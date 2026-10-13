import { Link } from 'react-router-dom';
import { useProjects, usePosts, useAdminPosts } from '../../hooks';
import { getGitHubDataUrl, getGitHubSyncWorkflowUrl } from '../../lib/github';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const { count: projectCount, loading: projectsLoading } = useProjects(1, 1);
  const { count: postCount, loading: postsLoading } = useAdminPosts(1, 1);
  const { count: publishedCount, loading: publishedLoading } = usePosts(1, 1);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>portfolio-cms / admin</p>
      </div>

      {/* GitHub backup banner */}
      <div className={styles.syncBanner}>
        <span className={styles.syncDot} />
        <span className={styles.syncText}>GitHub backup</span>
        <span className={styles.syncHint}>
          — published posts &amp; projects are mirrored to <code>data/</code> daily by a GitHub Action.{' '}
          <a
            href={getGitHubDataUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.syncLink}
          >
            View data/ on GitHub ↗
          </a>
        </span>
        <a
          href={getGitHubSyncWorkflowUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.syncBtn}
          title="Open the sync workflow on GitHub and click “Run workflow”"
        >
          ↑ Sync now ↗
        </a>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Projects</p>
          <p className={styles.statValue}>{projectsLoading ? '—' : projectCount}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Posts</p>
          <p className={styles.statValue}>{postsLoading ? '—' : postCount}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Published</p>
          <p className={styles.statValue}>{publishedLoading ? '—' : publishedCount}</p>
        </div>
      </div>

      <p className={styles.sectionLabel}>Quick Actions</p>
      <div className={styles.actionsGrid}>
        <Link to="/admin/projects/new" className={styles.actionCard}>
          <p className={styles.actionTitle}>New Project</p>
          <p className={styles.actionDesc}>Add a project to your portfolio</p>
          <span className={styles.actionBadge}>create</span>
        </Link>
        <Link to="/admin/posts/new" className={styles.actionCard}>
          <p className={styles.actionTitle}>New Post</p>
          <p className={styles.actionDesc}>Write a new journal entry</p>
          <span className={styles.actionBadge}>create</span>
        </Link>
        <Link to="/admin/projects" className={styles.actionCard}>
          <p className={styles.actionTitle}>Manage Projects</p>
          <p className={styles.actionDesc}>Edit or delete existing projects</p>
        </Link>
        <Link to="/admin/posts" className={styles.actionCard}>
          <p className={styles.actionTitle}>Manage Posts</p>
          <p className={styles.actionDesc}>Edit drafts and published posts</p>
        </Link>
      </div>
    </div>
  );
}
