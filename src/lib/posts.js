import { supabase } from './supabase';
import { sanitizeString } from './validation';
import { deleteImage } from './storage';
import {
  fetchPostsFromGitHub,
  fetchPostFromGitHub,
  syncPostToGitHub,
  deletePostFromGitHub,
  syncPostsToGitHub,
} from './github';

// ─── Reads (Supabase-first, GitHub fallback) ──────────────────────────────────

export async function getPosts({ includeDrafts = false, page = 1, pageSize = 10 } = {}) {
  try {
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
  } catch (supabaseErr) {
    console.warn('[Fallback] Supabase unavailable for getPosts, trying GitHub:', supabaseErr.message);
    try {
      const all = await fetchPostsFromGitHub();
      // GitHub mirror only contains published posts; respect includeDrafts=false
      const filtered = includeDrafts ? all : all.filter(p => p.is_published);
      const start = (page - 1) * pageSize;
      const paged = filtered.slice(start, start + pageSize);
      return { data: paged, count: filtered.length };
    } catch (ghErr) {
      console.error('[Fallback] GitHub fallback also failed for getPosts:', ghErr.message);
      throw supabaseErr; // surface the original error
    }
  }
}

export async function getPostBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (supabaseErr) {
    console.warn('[Fallback] Supabase unavailable for getPostBySlug, trying GitHub:', supabaseErr.message);
    try {
      const post = await fetchPostFromGitHub(slug);
      return post;
    } catch (ghErr) {
      console.error('[Fallback] GitHub fallback also failed for getPostBySlug:', ghErr.message);
      throw supabaseErr;
    }
  }
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

// ─── Writes (Supabase + fire-and-forget GitHub sync) ─────────────────────────

export async function createPost(post) {
  const sanitized = {
    ...post,
    title: sanitizeString(post.title),
    slug: sanitizeString(post.slug),
    excerpt: sanitizeString(post.excerpt),
    content: sanitizeString(post.content),
  };
  const { data, error } = await supabase
    .from('posts')
    .insert(sanitized)
    .select();

  if (error) throw error;
  const created = data?.[0] ?? null;
  if (created?.is_published) {
    syncPostToGitHub(created); // fire-and-forget
  } else {
    syncPostsToGitHub();
  }
  return created;
}

export async function updatePost(id, post) {
  const sanitized = {
    ...post,
    title: sanitizeString(post.title),
    slug: sanitizeString(post.slug),
    excerpt: sanitizeString(post.excerpt),
    content: sanitizeString(post.content),
  };
  const { data, error } = await supabase
    .from('posts')
    .update(sanitized)
    .eq('id', id)
    .select();

  if (error) throw error;
  const updated = data?.[0] ?? null;
  if (updated) {
    if (updated.is_published) {
      syncPostToGitHub(updated); // fire-and-forget
    } else {
      deletePostFromGitHub(updated.slug); // remove from GitHub if unpublished
    }
  }
  return updated;
}

export async function deletePost(id) {
  const post = await getPostById(id);
  if (post && post.cover_image) {
    await deleteImage(post.cover_image);
  }
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  if (post?.slug) {
    deletePostFromGitHub(post.slug); // fire-and-forget
  }
}

