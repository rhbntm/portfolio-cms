import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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

      const { data, error } = await supabase
        .from('posts')
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
