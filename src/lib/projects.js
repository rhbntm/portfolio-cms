import { supabase } from './supabase';

export async function getProjects() {
  return supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
}

export async function getProjectBySlug(slug) {
  return supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
}

export async function getProjectById(id) {
  return supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();
}

export async function createProject(project) {
  return supabase
    .from('projects')
    .insert(project)
    .select()
    .single();
}

export async function updateProject(id, project) {
  return supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select()
    .single();
}

export async function deleteProject(id) {
  return supabase
    .from('projects')
    .delete()
    .eq('id', id);
}
