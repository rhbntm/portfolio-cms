import { supabase } from './supabase';
import { sanitizeString, sanitizeStringArray } from './validation';

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProjectBySlug(slug) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getProjectById(id) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createProject(project) {
  const sanitized = {
    ...project,
    title: sanitizeString(project.title),
    slug: sanitizeString(project.slug),
    tech_stack: sanitizeStringArray(project.tech_stack),
    description: sanitizeString(project.description),
  };
  const { data, error } = await supabase
    .from('projects')
    .insert(sanitized)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(id, project) {
  const sanitized = {
    ...project,
    title: sanitizeString(project.title),
    slug: sanitizeString(project.slug),
    tech_stack: sanitizeStringArray(project.tech_stack),
    description: sanitizeString(project.description),
  };
  const { data, error } = await supabase
    .from('projects')
    .update(sanitized)
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
