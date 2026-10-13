import { useCallback } from 'react';
import { getPostBySlug } from '../../lib/posts';
import { useAsync } from '../useAsync';

export function usePost(slug) {
  const load = useCallback(() => (slug ? getPostBySlug(slug) : Promise.resolve(null)), [slug]);
  return useAsync(load, null);
}
