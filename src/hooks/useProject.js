import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useProject(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProject() {
      setLoading(true);
      setError(null);
      setData(null);

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        setError(error.message);
        setData(null);
      } else {
        setData(data);
      }

      setLoading(false);
    }

    if (slug) {
      fetchProject();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { data, loading, error };
}
