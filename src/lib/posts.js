import { supabase } from './supabase';
import { sanitizeString } from './validation';
import { deleteImage } from './storage';

export async function getPosts({ includeDrafts = false, page = 1, pageSize = 10 } = {}) {
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
  const post = await getPostById(id);
  if (post && post.cover_image) {
    await deleteImage(post.cover_image);
  }
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
