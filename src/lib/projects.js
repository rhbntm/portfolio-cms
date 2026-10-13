import { supabase } from './supabase';
import {
  sanitizeString,
  sanitizeStringArray,
  trimString,
  validateSlug,
  validateUrl,
  validateImageUrl,
} from './validation';
import { deleteImage } from './storage';
import { fetchProjectsFromGitHub, fetchProjectFromGitHub, withGitHubFallback } from './github';

// ─── Reads (Supabase-first, GitHub fallback) ──────────────────────────────────

export function getProjects({ page = 1, pageSize = 10 } = {}) {
  return withGitHubFallback(
    'getProjects',
    async () => {
      const { data, error, count } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;
      return { data, count };
    },
    async () => {
      const all = await fetchProjectsFromGitHub();
      const start = (page - 1) * pageSize;
      return { data: all.slice(start, start + pageSize), count: all.length };
    },
  );
}

export function getProjectBySlug(slug) {
  return withGitHubFallback(
    'getProjectBySlug',
    async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    () => fetchProjectFromGitHub(slug),
  );
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

/**
 * Checks slug uniqueness straight from Supabase (no GitHub fallback).
 * Pass the current project's id as excludeId when editing.
 */
export async function isProjectSlugTaken(slug, excludeId = null) {
  let query = supabase.from('projects').select('id').eq('slug', slug).limit(1);
  if (excludeId != null) query = query.neq('id', excludeId);

  const { data, error } = await query;
  if (error) throw error;
  return data.length > 0;
}

// ─── Writes (Supabase only; data/ mirror is refreshed by the sync-data Action) ─

function sanitizeProject(project) {
  return {
    ...project,
    title: sanitizeString(project.title),
    slug: sanitizeString(project.slug),
    tech_stack: sanitizeStringArray(project.tech_stack),
    // Markdown body: rendered through rehype-sanitize, so keep any <tags> (e.g. in code blocks)
    description: trimString(project.description),
    github_url: sanitizeString(project.github_url) || null,
    live_url: sanitizeString(project.live_url) || null,
  };
}

export async function createProject(project) {
  validateSlug(project.slug);
  validateUrl(project.github_url, 'GitHub URL');
  validateUrl(project.live_url, 'Live URL');
  validateImageUrl(project.image_url, 'Project image URL');

  const { data, error } = await supabase
    .from('projects')
    .insert(sanitizeProject(project))
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(id, project) {
  if (project.slug !== undefined) validateSlug(project.slug);
  if (project.github_url !== undefined) validateUrl(project.github_url, 'GitHub URL');
  if (project.live_url !== undefined) validateUrl(project.live_url, 'Live URL');
  if (project.image_url !== undefined) validateImageUrl(project.image_url, 'Project image URL');

  const { data, error } = await supabase
    .from('projects')
    .update(sanitizeProject(project))
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const project = await getProjectById(id);
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
  // Only remove the image once the row is gone, so a failed delete leaves the project intact
  if (project?.image_url) {
    await deleteImage(project.image_url);
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
}
