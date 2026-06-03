import { supabase } from './supabase';
import { sanitizeString, sanitizeStringArray } from './validation';
import { deleteImage } from './storage';

export async function getProjects({ page = 1, pageSize = 10 } = {}) {
  const { data, error, count } = await supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) throw error;
  return { data, count };
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
  const project = await getProjectById(id);
  if (project && project.image_url) {
    await deleteImage(project.image_url);
  }
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateProjectsOrder(updates) {
  // updates is an array of { id, sort_order }
  const promises = updates.map(update => 
    supabase
      .from('projects')
      .update({ sort_order: update.sort_order })
      .eq('id', update.id)
  );
  
  const results = await Promise.all(promises);
  const errors = results.filter(r => r.error).map(r => r.error);
  if (errors.length > 0) {
    throw new Error("Failed to update order: " + errors[0].message);
  }
}
