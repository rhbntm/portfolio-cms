import { useCallback } from 'react';
import { getProjectBySlug } from '../../lib/projects';
import { useAsync } from '../useAsync';

export function useProject(slug) {
  const load = useCallback(() => (slug ? getProjectBySlug(slug) : Promise.resolve(null)), [slug]);
  return useAsync(load, null);
}
