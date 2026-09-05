import { Link } from 'react-router-dom';
import { useState } from 'react';
import { usePosts } from '../../hooks';
import { Loading, ErrorMessage, Pagination } from '../../components';
import styles from './Blog.module.css';

export default function Blog() {
  const [page, setPage] = useState(1);
  const { data: posts, count, loading, error } = usePosts(page, 6);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.description}>
          This blog is one of the ways I practice writing and improve my ability to use AI effectively.
        </p>
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
                  {post.excerpt && <p className={styles.postExcerpt}>{post.excerpt}</p>}
                  {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className={styles.tagRow}>
                      {post.tags.map(tag => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )
      )}
      {!loading && !error && count > 6 && (
        <Pagination page={page} pageSize={6} total={count} setPage={setPage} />
      )}
    </div>
  );
}