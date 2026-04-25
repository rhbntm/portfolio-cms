import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getSession } from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const session = await getSession();
        if (!isMounted) return;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Failed to get session:', error);
        setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) setUser(session?.user ?? null);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
