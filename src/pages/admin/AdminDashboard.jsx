import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks';
import { usePosts } from '../../hooks';
import { isGitHubSyncConfigured } from '../../lib';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const { data: projects } = useProjects();
  const { data: posts } = usePosts();

  const projectCount = projects?.length ?? null;
  const postCount = posts?.length ?? null;
  const publishedCount = posts?.filter(p => p.is_published).length ?? null;
  const githubReady = isGitHubSyncConfigured();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>portfolio-cms / admin</p>
      </div>

      {/* GitHub sync status banner */}
      <div className={githubReady ? styles.syncBannerOk : styles.syncBannerWarn}>
        <span className={styles.syncDot} />
        {githubReady ? (
          <>
            <span className={styles.syncText}>GitHub sync active</span>
            <span className={styles.syncHint}>— data is mirrored to the repo after every save</span>
          </>
        ) : (
          <>
            <span className={styles.syncText}>GitHub sync not configured</span>
            <span className={styles.syncHint}>— add <code>VITE_GITHUB_TOKEN</code> to your <code>.env</code> to enable fallback reads</span>
          </>
        )}
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Projects</p>
          <p className={styles.statValue}>{projectCount ?? '—'}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Posts</p>
          <p className={styles.statValue}>{postCount ?? '—'}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Published</p>
          <p className={styles.statValue}>{publishedCount ?? '—'}</p>
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