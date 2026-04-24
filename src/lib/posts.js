import { supabase } from './supabase';

export async function getPosts() {
  return supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
}

export async function getPostBySlug(slug) {
  return supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
}

export async function getPostById(id) {
  return supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
}

export async function createPost(post) {
  return supabase
    .from('posts')
    .insert(post)
    .select()
    .single();
}

export async function updatePost(id, post) {
  return supabase
    .from('posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();
}

export async function deletePost(id) {
  return supabase
    .from('posts')
    .delete()
    .eq('id', id);
}
