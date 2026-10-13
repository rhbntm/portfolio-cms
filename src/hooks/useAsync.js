import { useEffect, useState } from 'react';

/**
 * Runs an async loader and tracks { data, loading, error }.
 * `load` must be memoized (useCallback) — it re-runs whenever its identity changes.
 * On error, data falls back to `initialData`.
 */
export function useAsync(load, initialData = null) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const result = await load();
        if (!isMounted) return;
        setData(result);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message);
        setData(initialData);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    run();

    return () => {
      isMounted = false;
    };
    // initialData is only a fallback value; changing it should not trigger a refetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  return { data, loading, error };
}
