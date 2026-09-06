import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { usePost } from '../../hooks';
import { Loading, ErrorMessage } from '../../components';
import { isValidHttpsUrl } from '../../lib';
import styles from './BlogPost.module.css';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = usePost(slug);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [slug]);

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
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className={styles.tagRow}>
            {post.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
        {isValidHttpsUrl(post.cover_image) && (
          <>
            <img 
              className={styles.coverImage} 
              src={post.cover_image} 
              alt={post.title} 
              style={{ cursor: 'pointer' }}
              onClick={() => setLightboxOpen(true)}
            />
            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              slides={[{ src: post.cover_image }]}
              plugins={[Zoom]}
              zoom={{ maxZoomPixelRatio: 4, wheelZoomDistanceFactor: 100 }}
            />
          </>
        )}
        <div className={styles.content}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}