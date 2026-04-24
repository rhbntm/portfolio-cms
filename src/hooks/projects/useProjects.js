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

      const { data, error } = await getProjects();

      if (!isMounted) return;

      if (error) {
        setError(error.message);
        setData([]);
      } else {
        setData(data || []);
      }

      setLoading(false);
    }

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
