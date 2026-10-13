/**
 * sync-data.mjs — mirror published Supabase content into data/ so the site can run without Supabase.
 *
 * Run by .github/workflows/sync-data.yml (daily + manual). Uses only the public
 * anon key, so it sees exactly what the public site sees (RLS applies).
 *
 *   SUPABASE_URL=... SUPABASE_ANON_KEY=... node scripts/sync-data.mjs
 *
 * Writes:
 *   data/posts/<slug>.md, data/posts/index.json
 *   data/projects/<slug>.md, data/projects/index.json
 *   data/images/<storage path>   — copies of every Supabase Storage image the content references.
 *     Image URLs in the mirrored files are rewritten to point at these copies on GitHub.
 *
 * Exits non-zero on any fetch error so a paused/unreachable Supabase never wipes data/.
 */

import { mkdir, readdir, rm, writeFile, access } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { postToMarkdown, projectToMarkdown } from '../src/lib/frontmatter.js';

const { SUPABASE_URL, SUPABASE_ANON_KEY, ALLOW_EMPTY } = process.env;
const REPOSITORY = process.env.GITHUB_REPOSITORY || 'rhbntm/portfolio-cms';
const BRANCH = process.env.GITHUB_REF_NAME || 'main';

const SLUG_RE = /^[a-z0-9-]+$/;
const IMAGES_DIR = join('data', 'images');
const MIRROR_BASE = `https://raw.githubusercontent.com/${REPOSITORY}/${BRANCH}/data`;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('SUPABASE_URL and SUPABASE_ANON_KEY must be set.');
  process.exit(1);
}

const SUPABASE_BASE = SUPABASE_URL.replace(/\/$/, '');
const STORAGE_PREFIX = `${SUPABASE_BASE}/storage/v1/object/public/`;
// Matches public Storage URLs anywhere in a string (cover fields, Markdown image links, ...)
const STORAGE_URL_RE = new RegExp(`${STORAGE_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([A-Za-z0-9._%/-]+)`, 'g');

async function fetchRows(table, query) {
  const res = await fetch(`${SUPABASE_BASE}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Supabase ${table} fetch failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// ─── Images ──────────────────────────────────────────────────────────────────

const referencedImages = new Set(); // storage paths, e.g. "images/posts/123-photo.png"

function isSafeStoragePath(path) {
  return !path.split('/').some(part => part === '' || part === '.' || part === '..');
}

/** Replaces Supabase Storage URLs in every string field with mirror URLs, recording each image. */
function rewriteImageUrls(row) {
  const out = {};
  for (const [key, val] of Object.entries(row)) {
    out[key] = typeof val === 'string'
      ? val.replace(STORAGE_URL_RE, (url, path) => {
          if (!isSafeStoragePath(path)) return url;
          referencedImages.add(path);
          return `${MIRROR_BASE}/${path}`;
        })
      : val;
  }
  return out;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function mirrorImages() {
  let downloaded = 0;
  for (const path of referencedImages) {
    const dest = join('data', ...path.split('/'));
    if (await exists(dest)) continue; // uploads are timestamped, so existing files never change

    const res = await fetch(`${STORAGE_PREFIX}${path}`);
    if (!res.ok) throw new Error(`Image download failed for ${path}: ${res.status}`);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    downloaded++;
  }

  // Prune images no longer referenced by any published content
  await mkdir(IMAGES_DIR, { recursive: true });
  for (const entry of await readdir(IMAGES_DIR, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const file = join(entry.parentPath, entry.name);
    const storagePath = relative('data', file).split(sep).join('/');
    if (!referencedImages.has(storagePath)) {
      await rm(file);
      console.log(`Removed ${file}`);
    }
  }

  console.log(`Images: ${referencedImages.size} referenced, ${downloaded} downloaded`);
}

// ─── Posts & projects ────────────────────────────────────────────────────────

async function syncCollection(dir, rows, toMarkdown) {
  await mkdir(dir, { recursive: true });

  const existing = (await readdir(dir)).filter(f => f.endsWith('.md'));
  if (rows.length === 0 && existing.length > 0 && !ALLOW_EMPTY) {
    throw new Error(`Supabase returned 0 rows for ${dir} but ${existing.length} files exist — refusing to wipe (set ALLOW_EMPTY=1 to override).`);
  }

  const mirrored = [];
  for (const row of rows) {
    if (!SLUG_RE.test(row.slug ?? '')) {
      console.warn(`Skipping row ${row.id} with invalid slug: ${JSON.stringify(row.slug)}`);
      continue;
    }
    mirrored.push(rewriteImageUrls(row));
  }

  const keep = new Set();
  for (const row of mirrored) {
    keep.add(`${row.slug}.md`);
    await writeFile(join(dir, `${row.slug}.md`), toMarkdown(row));
  }

  // Prune files for deleted, unpublished, or renamed entries
  for (const file of existing) {
    if (!keep.has(file)) {
      await rm(join(dir, file));
      console.log(`Removed ${join(dir, file)}`);
    }
  }

  await writeFile(join(dir, 'index.json'), JSON.stringify(mirrored, null, 2));
  console.log(`Synced ${keep.size} files to ${dir}`);
}

const [posts, projects] = await Promise.all([
  fetchRows('posts', 'select=*&is_published=eq.true&order=created_at.desc'),
  fetchRows('projects', 'select=*&order=sort_order.asc,created_at.desc'),
]);

await syncCollection(join('data', 'posts'), posts, postToMarkdown);
await syncCollection(join('data', 'projects'), projects, projectToMarkdown);
await mirrorImages();
