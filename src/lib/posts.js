import { supabase } from './supabase';
import { sanitizeString } from './validation';

export async function getPosts({ includeDrafts = false } = {}) {
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (!includeDrafts) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPostBySlug(slug) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) throw error;
  return data;
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
  return data?.[0] ?? null;
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
  return data?.[0] ?? null;
}

export async function deletePost(id) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
