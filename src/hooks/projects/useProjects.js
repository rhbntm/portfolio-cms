import { useEffect, useState } from 'react';
import { getProjects } from '../../lib/projects';

export function useProjects() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      setLoading(true);
      setError(null);

      try {
        const projects = await getProjects();
        if (!isMounted) return;
        setData(projects || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message);
        setData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
