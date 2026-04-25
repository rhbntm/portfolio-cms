import { useEffect, useState } from 'react';
import { getPosts } from '../../lib/posts';

export function useAdminPosts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const posts = await getPosts({ includeDrafts: true });
        if (!isMounted) return;
        setData(posts || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message);
        setData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
