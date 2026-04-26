import { useEffect, useState } from 'react';
import { getPostBySlug } from '../../lib/posts';

export function usePost(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPost() {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const post = await getPostBySlug(slug);
        if (!isMounted) return;
        setData(post);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message);
        setData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { data, loading, error };
}
