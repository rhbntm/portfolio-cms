import { supabase } from './supabase';
import { sanitizeString, trimString, validateSlug, validateImageUrl } from './validation';
import { deleteImage } from './storage';
import { fetchPostsFromGitHub, fetchPostFromGitHub, withGitHubFallback } from './github';

// ─── Reads (Supabase-first, GitHub fallback) ──────────────────────────────────

export function getPosts({ includeDrafts = false, page = 1, pageSize = 10 } = {}) {
  return withGitHubFallback(
    'getPosts',
    async () => {
      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (!includeDrafts) {
        query = query.eq('is_published', true);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { data, count };
    },
    async () => {
      const all = await fetchPostsFromGitHub();
      // GitHub mirror only contains published posts; respect includeDrafts=false
      const filtered = includeDrafts ? all : all.filter(p => p.is_published);
      const start = (page - 1) * pageSize;
      return { data: filtered.slice(start, start + pageSize), count: filtered.length };
    },
  );
}

export function getPostBySlug(slug) {
  return withGitHubFallback(
    'getPostBySlug',
    async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    () => fetchPostFromGitHub(slug),
  );
}

export async function getPostById(id) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Checks slug uniqueness across ALL posts (drafts included), straight from Supabase.
 * Pass the current post's id as excludeId when editing.
 */
export async function isPostSlugTaken(slug, excludeId = null) {
  let query = supabase.from('posts').select('id').eq('slug', slug).limit(1);
  if (excludeId != null) query = query.neq('id', excludeId);

  const { data, error } = await query;
  if (error) throw error;
  return data.length > 0;
}

// ─── Writes (Supabase only; data/ mirror is refreshed by the sync-data Action) ─

function sanitizePost(post) {
  return {
    ...post,
    title: sanitizeString(post.title),
    slug: sanitizeString(post.slug),
    excerpt: sanitizeString(post.excerpt),
    // Markdown body: rendered through rehype-sanitize, so keep any <tags> (e.g. in code blocks)
    content: trimString(post.content),
  };
}

export async function createPost(post) {
  validateSlug(post.slug);
  validateImageUrl(post.cover_image, 'Cover image URL');

  const { data, error } = await supabase
    .from('posts')
    .insert(sanitizePost(post))
    .select();

  if (error) throw error;
  return data?.[0] ?? null;
}

export async function updatePost(id, post) {
  if (post.slug !== undefined) validateSlug(post.slug);
  if (post.cover_image !== undefined) validateImageUrl(post.cover_image, 'Cover image URL');

  const { data, error } = await supabase
    .from('posts')
    .update(sanitizePost(post))
    .eq('id', id)
    .select();

  if (error) throw error;
  return data?.[0] ?? null;
}

export async function deletePost(id) {
  const post = await getPostById(id);
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  // Only remove the image once the row is gone, so a failed delete leaves the post intact
  if (post?.cover_image) {
    await deleteImage(post.cover_image);
  }
}
