import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function usePosts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isMounted) return;

      if (error) {
        setError(error.message);
        setData([]);
      } else {
        setData(data || []);
      }

      setLoading(false);
    }

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
