/**
 * github.js — GitHub Contents API & Raw CDN helpers
 *
 * Read path:  unauthenticated raw.githubusercontent.com (no rate-limit issues for public repos)
 * Write path: authenticated GitHub Contents API (requires VITE_GITHUB_TOKEN)
 *
 * Stored structure:
 *   data/posts/<slug>.md        — individual Markdown file with YAML frontmatter
 *   data/posts/index.json       — fast index array of all published posts
 *   data/projects/<slug>.md     — individual Markdown file with YAML frontmatter
 *   data/projects/index.json    — fast index array of all projects
 */

const OWNER  = import.meta.env.VITE_GITHUB_OWNER  || 'rhbntm';
const REPO   = import.meta.env.VITE_GITHUB_REPO   || 'portfolio-cms';
const BRANCH = import.meta.env.VITE_GITHUB_BRANCH || 'main';
const TOKEN  = import.meta.env.VITE_GITHUB_TOKEN;

// ─── Frontmatter Serializer & Parser ──────────────────────────────────────────

/**
 * Serializes metadata object and body content into a Markdown string with YAML frontmatter.
 */
export function serializeFrontmatter(metadata, body = '') {
  const lines = ['---'];
  for (const [key, val] of Object.entries(metadata)) {
    if (val === undefined || val === null) {
      lines.push(`${key}: null`);
    } else if (Array.isArray(val)) {
      lines.push(`${key}:`);
      for (const item of val) {
        lines.push(`  - ${JSON.stringify(item)}`);
      }
    } else if (typeof val === 'boolean' || typeof val === 'number') {
      lines.push(`${key}: ${val}`);
    } else {
      lines.push(`${key}: ${JSON.stringify(String(val))}`);
    }
  }
  lines.push('---');
  lines.push('');
  if (body) {
    lines.push(body.trim());
    lines.push('');
  }
  return lines.join('\n');
}

/**
 * Parses a Markdown string with YAML frontmatter into metadata object and body content.
 */
export function parseFrontmatter(markdown) {
  if (!markdown) return { data: {}, content: '' };
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: markdown };
  }
  const [, yamlBlock, content] = match;
  const data = {};
  let currentArrayKey = null;

  for (const rawLine of yamlBlock.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (!line || line.trim().startsWith('#')) continue;

    const arrayItemMatch = line.match(/^\s*-\s*(.*)$/);
    if (arrayItemMatch && currentArrayKey) {
      let val = arrayItemMatch[1].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        try { val = JSON.parse(val); } catch { val = val.slice(1, -1); }
      }
      data[currentArrayKey].push(val);
      continue;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    const rawVal = line.slice(colonIdx + 1).trim();

    if (rawVal === '') {
      currentArrayKey = key;
      data[key] = [];
    } else {
      currentArrayKey = null;
      let val = rawVal;
      if (rawVal === 'null') val = null;
      else if (rawVal === 'true') val = true;
      else if (rawVal === 'false') val = false;
      else if (/^-?\d+(\.\d+)?$/.test(rawVal)) val = Number(rawVal);
      else if ((rawVal.startsWith('"') && rawVal.endsWith('"')) || (rawVal.startsWith("'") && rawVal.endsWith("'"))) {
        try { val = JSON.parse(rawVal); } catch { val = rawVal.slice(1, -1); }
      }
      data[key] = val;
    }
  }

  return { data, content: content.trim() };
}

// ─── Post / Project Markdown Transformers ─────────────────────────────────────

export function postToMarkdown(post) {
  const metadata = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    cover_image: post.cover_image || null,
    tags: post.tags || [],
    is_published: Boolean(post.is_published),
    created_at: post.created_at,
    updated_at: post.updated_at || post.created_at,
  };
  return serializeFrontmatter(metadata, post.content || '');
}

export function markdownToPost(markdown, slug) {
  const { data, content } = parseFrontmatter(markdown);
  return {
    ...data,
    slug: data.slug || slug,
    content: content || '',
  };
}

export function projectToMarkdown(project) {
  const metadata = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    tech_stack: project.tech_stack || [],
    image_url: project.image_url || null,
    github_url: project.github_url || null,
    live_url: project.live_url || null,
    sort_order: project.sort_order ?? 0,
    created_at: project.created_at,
    updated_at: project.updated_at || project.created_at,
  };
  return serializeFrontmatter(metadata, project.description || '');
}

export function markdownToProject(markdown, slug) {
  const { data, content } = parseFrontmatter(markdown);
  return {
    ...data,
    slug: data.slug || slug,
    description: content || data.description || '',
  };
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

/** Legacy / general json fetcher */
export async function fetchFromGitHub(path) {
  const text = await fetchFromGitHubRaw(path);
  return JSON.parse(text);
}

export async function fetchPostsFromGitHub() {
  try {
    const text = await fetchFromGitHubRaw('data/posts/index.json');
    return JSON.parse(text);
  } catch {
    const text = await fetchFromGitHubRaw('data/posts.json');
    return JSON.parse(text);
  }
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
  try {
    const text = await fetchFromGitHubRaw('data/projects/index.json');
    return JSON.parse(text);
  } catch {
    const text = await fetchFromGitHubRaw('data/projects.json');
    return JSON.parse(text);
  }
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

// ─── GitHub Contents API Writes (Requires PAT) ───────────────────────────────

export async function commitFileToGitHub(path, contentString, message) {
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

  let sha;
  try {
    const existing = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers });
    if (existing.ok) {
      const existingData = await existing.json();
      sha = existingData.sha;
    }
  } catch {
    // File does not exist yet
  }

  const encoded = btoa(unescape(encodeURIComponent(contentString)));
  const body = {
    message,
    branch: BRANCH,
    content: encoded,
    ...(sha ? { sha } : {}),
  };

  const res = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub commit failed for ${path}: ${res.status} — ${err.message || res.statusText}`);
  }

  return res.json();
}

export async function deleteFileFromGitHub(path, message) {
  if (!TOKEN) return;

  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };

  try {
    const existing = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers });
    if (!existing.ok) return;
    const data = await existing.json();
    if (!data.sha) return;

    await fetch(apiUrl, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({
        message,
        branch: BRANCH,
        sha: data.sha,
      }),
    });
  } catch (err) {
    console.warn(`[GitHub Sync] Could not delete ${path}:`, err.message);
  }
}

// ─── Sync Operations ─────────────────────────────────────────────────────────

export async function syncPostToGitHub(post) {
  if (!TOKEN || !post?.slug) return;
  try {
    const md = postToMarkdown(post);
    await commitFileToGitHub(
      `data/posts/${post.slug}.md`,
      md,
      `chore(data): sync post "${post.title}" [bot]`
    );
    await refreshPostsIndex();
    console.info(`[GitHub Sync] ✓ Post ${post.slug}.md synced`);
  } catch (err) {
    console.error(`[GitHub Sync] ✗ Failed to sync post ${post.slug}:`, err.message);
  }
}

export async function deletePostFromGitHub(slug) {
  if (!TOKEN || !slug) return;
  try {
    await deleteFileFromGitHub(
      `data/posts/${slug}.md`,
      `chore(data): remove post "${slug}" [bot]`
    );
    await refreshPostsIndex();
    console.info(`[GitHub Sync] ✓ Post ${slug}.md deleted`);
  } catch (err) {
    console.error(`[GitHub Sync] ✗ Failed to delete post ${slug}:`, err.message);
  }
}

export async function syncProjectToGitHub(project) {
  if (!TOKEN || !project?.slug) return;
  try {
    const md = projectToMarkdown(project);
    await commitFileToGitHub(
      `data/projects/${project.slug}.md`,
      md,
      `chore(data): sync project "${project.title}" [bot]`
    );
    await refreshProjectsIndex();
    console.info(`[GitHub Sync] ✓ Project ${project.slug}.md synced`);
  } catch (err) {
    console.error(`[GitHub Sync] ✗ Failed to sync project ${project.slug}:`, err.message);
  }
}

export async function deleteProjectFromGitHub(slug) {
  if (!TOKEN || !slug) return;
  try {
    await deleteFileFromGitHub(
      `data/projects/${slug}.md`,
      `chore(data): remove project "${slug}" [bot]`
    );
    await refreshProjectsIndex();
    console.info(`[GitHub Sync] ✓ Project ${slug}.md deleted`);
  } catch (err) {
    console.error(`[GitHub Sync] ✗ Failed to delete project ${slug}:`, err.message);
  }
}

async function refreshPostsIndex() {
  const { supabase } = await import('./supabase');
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (data) {
    await commitFileToGitHub(
      'data/posts/index.json',
      JSON.stringify(data, null, 2),
      'chore(data): update posts index [bot]'
    );
  }
}

async function refreshProjectsIndex() {
  const { supabase } = await import('./supabase');
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (data) {
    await commitFileToGitHub(
      'data/projects/index.json',
      JSON.stringify(data, null, 2),
      'chore(data): update projects index [bot]'
    );
  }
}

/**
 * Bulk sync: fetches everything from Supabase and creates all Markdown files + index.
 */
export async function syncAllToGitHub() {
  if (!TOKEN) {
    throw new Error('VITE_GITHUB_TOKEN is missing in your .env file.');
  }

  const { supabase } = await import('./supabase');

  const { data: posts, error: postsErr } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  if (postsErr) throw postsErr;

  const { data: projects, error: projectsErr } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (projectsErr) throw projectsErr;

  // Sync posts MDs
  for (const p of (posts || [])) {
    await commitFileToGitHub(
      `data/posts/${p.slug}.md`,
      postToMarkdown(p),
      `chore(data): sync post "${p.title}" [bot]`
    );
  }
  await commitFileToGitHub(
    'data/posts/index.json',
    JSON.stringify(posts || [], null, 2),
    'chore(data): sync posts index [bot]'
  );

  // Sync projects MDs
  for (const pr of (projects || [])) {
    await commitFileToGitHub(
      `data/projects/${pr.slug}.md`,
      projectToMarkdown(pr),
      `chore(data): sync project "${pr.title}" [bot]`
    );
  }
  await commitFileToGitHub(
    'data/projects/index.json',
    JSON.stringify(projects || [], null, 2),
    'chore(data): sync projects index [bot]'
  );

  return {
    postsCount: posts?.length || 0,
    projectsCount: projects?.length || 0,
  };
}

// Backwards compatibility aliases
export const syncProjectsToGitHub = refreshProjectsIndex;
export const syncPostsToGitHub = refreshPostsIndex;

export function isGitHubSyncConfigured() {
  return Boolean(TOKEN);
}

export function getGitHubDataUrl() {
  return `https://github.com/${OWNER}/${REPO}/tree/${BRANCH}/data`;
}
