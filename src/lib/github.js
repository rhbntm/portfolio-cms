/**
 * github.js — GitHub Contents API helpers
 *
 * Read path:  unauthenticated raw.githubusercontent.com (no rate-limit issues for public repos)
 * Write path: authenticated GitHub Contents API (requires VITE_GITHUB_TOKEN)
 *
 * Data files committed to:
 *   data/posts.json    — array of all published posts
 *   data/projects.json — array of all projects (sorted by sort_order, then created_at)
 */

const OWNER  = import.meta.env.VITE_GITHUB_OWNER  || 'rhbntm';
const REPO   = import.meta.env.VITE_GITHUB_REPO   || 'portfolio-cms';
const BRANCH = import.meta.env.VITE_GITHUB_BRANCH || 'main';
const TOKEN  = import.meta.env.VITE_GITHUB_TOKEN;

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Fetch a JSON data file from GitHub via the raw CDN.
 * No authentication required; works for public repos.
 * Appends a cache-buster so we always get the latest committed version.
 *
 * @param {string} path - File path inside the repo, e.g. "data/posts.json"
 * @returns {Promise<any>} Parsed JSON content
 */
export async function fetchFromGitHub(path) {
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}?cb=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GitHub fetch failed for ${path}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Commit a JSON file to GitHub via the Contents API.
 * Creates the file if it doesn't exist; updates it otherwise.
 *
 * @param {string} path    - File path inside the repo, e.g. "data/posts.json"
 * @param {any}    content - Data to serialise and commit
 * @param {string} message - Commit message
 */
async function syncToGitHub(path, content, message) {
  if (!TOKEN) {
    console.warn('[GitHub Sync] VITE_GITHUB_TOKEN is not set — skipping sync.');
    return;
  }

  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };

  // Fetch the current SHA (required to update an existing file).
  let sha;
  try {
    const existing = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers });
    if (existing.ok) {
      const existingData = await existing.json();
      sha = existingData.sha;
    }
  } catch {
    // File may not exist yet — that's fine, sha stays undefined.
  }

  const body = {
    message,
    branch: BRANCH,
    content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
    ...(sha ? { sha } : {}),
  };

  const res = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub sync failed for ${path}: ${res.status} — ${err.message || res.statusText}`);
  }
}

// ─── Sync helpers (called after every admin write) ────────────────────────────

/**
 * Snapshot all projects from Supabase and commit to data/projects.json.
 * Imported lazily to avoid circular deps with projects.js.
 * Fire-and-forget: errors are logged, not re-thrown.
 */
export async function syncProjectsToGitHub() {
  if (!TOKEN) return;
  try {
    // Dynamic import to avoid circular dependency
    const { supabase } = await import('./supabase');
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    await syncToGitHub(
      'data/projects.json',
      data ?? [],
      'chore(data): sync projects snapshot [bot]',
    );
    console.info('[GitHub Sync] ✓ projects synced');
  } catch (err) {
    console.error('[GitHub Sync] ✗ projects sync failed:', err.message);
  }
}

/**
 * Snapshot all published posts from Supabase and commit to data/posts.json.
 * Fire-and-forget: errors are logged, not re-thrown.
 */
export async function syncPostsToGitHub() {
  if (!TOKEN) return;
  try {
    const { supabase } = await import('./supabase');
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    await syncToGitHub(
      'data/posts.json',
      data ?? [],
      'chore(data): sync posts snapshot [bot]',
    );
    console.info('[GitHub Sync] ✓ posts synced');
  } catch (err) {
    console.error('[GitHub Sync] ✗ posts sync failed:', err.message);
  }
}

/** Returns true if the GitHub token env var is present. */
export function isGitHubSyncConfigured() {
  return Boolean(TOKEN);
}
