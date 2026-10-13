import { useCallback } from 'react';
import { getProjects } from '../../lib/projects';
import { useAsync } from '../useAsync';

const EMPTY_PAGE = { data: [], count: 0 };

export function useProjects(page = 1, pageSize = 10) {
  const load = useCallback(() => getProjects({ page, pageSize }), [page, pageSize]);
  const { data: result, loading, error } = useAsync(load, EMPTY_PAGE);
  return { data: result.data ?? EMPTY_PAGE.data, count: result.count ?? 0, loading, error };
}
