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
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(id, project) {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
