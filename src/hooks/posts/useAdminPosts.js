import { useEffect, useState } from 'react';
import { getPosts } from '../../lib/posts';

export function useAdminPosts(page = 1, pageSize = 10) {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      setLoading(true);
      setError(null);

      try {
        const result = await getPosts({ includeDrafts: true, page, pageSize });
        if (!isMounted) return;
        setData(result.data || []);
        setCount(result.count || 0);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message);
        setData([]);
        setCount(0);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [page, pageSize]);

  return { data, count, loading, error };
}
