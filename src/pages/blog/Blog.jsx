import { Link } from 'react-router-dom';
import { usePosts } from '../../hooks';
import { Loading, ErrorMessage } from '../../components';
import styles from './Blog.module.css';

export default function Blog() {
  const { data: posts, loading, error } = usePosts();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Writing</p>
        <h1 className={styles.title}>Journal</h1>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        posts.length === 0 ? (
          <p className={styles.empty}>No posts yet.</p>
        ) : (
          <div className={styles.postList}>
            {posts.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`} className={styles.postItem}>
                <span className={styles.postMeta}>
                  {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}