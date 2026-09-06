import { supabase } from './supabase';
import { sanitizeString, sanitizeStringArray } from './validation';
import { deleteImage } from './storage';
import {
  fetchProjectsFromGitHub,
  fetchProjectFromGitHub,
  syncProjectToGitHub,
  deleteProjectFromGitHub,
  syncProjectsToGitHub,
} from './github';

// ─── Reads (Supabase-first, GitHub fallback) ──────────────────────────────────

export async function getProjects({ page = 1, pageSize = 10 } = {}) {
  try {
    const { data, error, count } = await supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;
    return { data, count };
  } catch (supabaseErr) {
    console.warn('[Fallback] Supabase unavailable for getProjects, trying GitHub:', supabaseErr.message);
    try {
      const all = await fetchProjectsFromGitHub();
      const start = (page - 1) * pageSize;
      const paged = all.slice(start, start + pageSize);
      return { data: paged, count: all.length };
    } catch (ghErr) {
      console.error('[Fallback] GitHub fallback also failed for getProjects:', ghErr.message);
      throw supabaseErr;
    }
  }
}

export async function getProjectBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (supabaseErr) {
    console.warn('[Fallback] Supabase unavailable for getProjectBySlug, trying GitHub:', supabaseErr.message);
    try {
      const project = await fetchProjectFromGitHub(slug);
      return project;
    } catch (ghErr) {
      console.error('[Fallback] GitHub fallback also failed for getProjectBySlug:', ghErr.message);
      throw supabaseErr;
    }
  }
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

// ─── Writes (Supabase + fire-and-forget GitHub sync) ─────────────────────────

export async function createProject(project) {
  const sanitized = {
    ...project,
    title: sanitizeString(project.title),
    slug: sanitizeString(project.slug),
    tech_stack: sanitizeStringArray(project.tech_stack),
    description: sanitizeString(project.description),
    github_url: sanitizeString(project.github_url) || null,
    live_url: sanitizeString(project.live_url) || null,
  };
  const { data, error } = await supabase
    .from('projects')
    .insert(sanitized)
    .select()
    .single();

  if (error) throw error;
  syncProjectToGitHub(data); // fire-and-forget
  return data;
}

export async function updateProject(id, project) {
  const sanitized = {
    ...project,
    title: sanitizeString(project.title),
    slug: sanitizeString(project.slug),
    tech_stack: sanitizeStringArray(project.tech_stack),
    description: sanitizeString(project.description),
    github_url: sanitizeString(project.github_url) || null,
    live_url: sanitizeString(project.live_url) || null,
  };
  const { data, error } = await supabase
    .from('projects')
    .update(sanitized)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  syncProjectToGitHub(data); // fire-and-forget
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
  if (project?.slug) {
    deleteProjectFromGitHub(project.slug); // fire-and-forget
  }
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
  syncProjectsToGitHub(); // fire-and-forget
}

