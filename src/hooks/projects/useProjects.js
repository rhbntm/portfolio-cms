import { useEffect, useState } from 'react';
import { getProjects } from '../../lib/projects';

export function useProjects(page = 1, pageSize = 10) {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      setLoading(true);
      setError(null);

      try {
        const result = await getProjects({ page, pageSize });
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

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [page, pageSize]);

  return { data, count, loading, error };
}
