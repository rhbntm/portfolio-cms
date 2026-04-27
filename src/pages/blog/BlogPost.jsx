import { Link, useParams } from 'react-router-dom';
import { usePost } from '../../hooks';
import { Loading, ErrorMessage } from '../../components';
import styles from './BlogPost.module.css';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = usePost(slug);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return <p>Blog post not found</p>;

  return (
    <div className={styles.page}>
      <Link to="/blog" className={styles.back}>← Journal</Link>

      <article className={styles.article}>
        <p className={styles.meta}>
          {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <h1 className={styles.title}>{post.title}</h1>
        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
        {post.cover_image && (
          <img className={styles.coverImage} src={post.cover_image} alt={post.title} />
        )}
        <div className={styles.content}>{post.content}</div>
      </article>
    </div>
  );
}