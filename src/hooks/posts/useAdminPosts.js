import { useCallback } from 'react';
import { getPosts } from '../../lib/posts';
import { useAsync } from '../useAsync';

const EMPTY_PAGE = { data: [], count: 0 };

export function useAdminPosts(page = 1, pageSize = 10) {
  const load = useCallback(() => getPosts({ includeDrafts: true, page, pageSize }), [page, pageSize]);
  const { data: result, loading, error } = useAsync(load, EMPTY_PAGE);
  return { data: result.data ?? EMPTY_PAGE.data, count: result.count ?? 0, loading, error };
}
