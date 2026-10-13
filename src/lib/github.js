/**
 * github.js — read-only GitHub Raw CDN helpers (fallback when Supabase is unavailable)
 *
 * Reads go through unauthenticated raw.githubusercontent.com. The browser never
 * writes to GitHub: the data/ mirror is refreshed by the scheduled
 * .github/workflows/sync-data.yml Action (scripts/sync-data.mjs).
 *
 * Stored structure:
 *   data/posts/<slug>.md        — individual Markdown file with YAML frontmatter
 *   data/posts/index.json       — fast index array of all published posts
 *   data/projects/<slug>.md     — individual Markdown file with YAML frontmatter
 *   data/projects/index.json    — fast index array of all projects
 */

import { markdownToPost, markdownToProject } from './frontmatter';

const OWNER  = import.meta.env.VITE_GITHUB_OWNER  || 'rhbntm';
const REPO   = import.meta.env.VITE_GITHUB_REPO   || 'portfolio-cms';
const BRANCH = import.meta.env.VITE_GITHUB_BRANCH || 'main';

/** 'github' = read only from the data/ mirror and never contact Supabase for public content. */
export const GITHUB_ONLY = import.meta.env.VITE_DATA_SOURCE === 'github';

/**
 * Reads from Supabase, falling back to the GitHub mirror if Supabase fails.
 * With VITE_DATA_SOURCE=github, skips Supabase entirely.
 */
export async function withGitHubFallback(label, fromSupabase, fromGitHub) {
  if (GITHUB_ONLY) return fromGitHub();

  try {
    return await fromSupabase();
  } catch (supabaseErr) {
    console.warn(`[Fallback] Supabase unavailable for ${label}, trying GitHub:`, supabaseErr.message);
    try {
      return await fromGitHub();
    } catch (ghErr) {
      console.error(`[Fallback] GitHub fallback also failed for ${label}:`, ghErr.message);
      throw supabaseErr; // surface the original error
    }
  }
}

// ─── Raw CDN Reads (Public, No Auth, High Rate Limits) ────────────────────────

export async function fetchFromGitHubRaw(path) {
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}?cb=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GitHub fetch failed for ${path}: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

export async function fetchPostsFromGitHub() {
  const text = await fetchFromGitHubRaw('data/posts/index.json');
  return JSON.parse(text);
}

export async function fetchPostFromGitHub(slug) {
  try {
    const text = await fetchFromGitHubRaw(`data/posts/${slug}.md`);
    const post = markdownToPost(text, slug);
    return post.is_published ? post : null;
  } catch {
    // Fallback to searching posts index
    const all = await fetchPostsFromGitHub();
    return all.find(p => p.slug === slug && p.is_published) ?? null;
  }
}

export async function fetchProjectsFromGitHub() {
  const text = await fetchFromGitHubRaw('data/projects/index.json');
  return JSON.parse(text);
}

export async function fetchProjectFromGitHub(slug) {
  try {
    const text = await fetchFromGitHubRaw(`data/projects/${slug}.md`);
    return markdownToProject(text, slug);
  } catch {
    const all = await fetchProjectsFromGitHub();
    return all.find(p => p.slug === slug) ?? null;
  }
}

// ─── Links ───────────────────────────────────────────────────────────────────

export function getGitHubDataUrl() {
  return `https://github.com/${OWNER}/${REPO}/tree/${BRANCH}/data`;
}

export function getGitHubSyncWorkflowUrl() {
  return `https://github.com/${OWNER}/${REPO}/actions/workflows/sync-data.yml`;
}
