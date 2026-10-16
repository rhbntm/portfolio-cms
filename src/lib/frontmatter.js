/**
 * frontmatter.js — Markdown + YAML frontmatter (de)serializers for posts & projects.
 *
 * Pure functions with no environment access, so they can be shared between the
 * browser (GitHub fallback reads) and Node (scripts/sync-data.mjs).
 */

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
    summary: project.summary || '',
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
