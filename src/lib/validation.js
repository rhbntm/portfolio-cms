export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed.');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 5MB.');
  }
  return true;
}

export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  // Strip ALL HTML/XML tags — safer than trying to enumerate dangerous patterns.
  // Plain text fields (title, slug, excerpt, etc.) should never contain markup.
  return str.trim().replace(/<[^>]*>/g, '');
}

export function sanitizeStringArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(item => sanitizeString(item)).filter(Boolean);
}

export function isValidHttpsUrl(url, allowedDomains = null) {
  if (typeof url !== 'string' || !url.trim()) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    if (allowedDomains) {
      const hostname = parsed.hostname.toLowerCase();
      const isAllowed = allowedDomains.some(domain =>
        hostname === domain || hostname.endsWith(`.${domain}`)
      );
      if (!isAllowed) return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function isValidUrl(url, allowedDomains = null) {
  if (typeof url !== 'string' || !url.trim()) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    if (allowedDomains) {
      const hostname = parsed.hostname.toLowerCase();
      const isAllowed = allowedDomains.some(domain =>
        hostname === domain || hostname.endsWith(`.${domain}`)
      );
      if (!isAllowed) return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Enforces that a slug is URL-safe: lowercase letters, numbers, hyphens only.
 * Throws if invalid so callers get a clear error before any DB write.
 */
export function validateSlug(slug) {
  if (typeof slug !== 'string' || !slug.trim()) {
    throw new Error('Slug is required.');
  }
  if (!/^[a-z0-9-]+$/.test(slug.trim())) {
    throw new Error('Slug may only contain lowercase letters, numbers, and hyphens (e.g. "my-post-title").');
  }
  return true;
}

/**
 * Validates an optional URL field (github_url, live_url).
 * Throws if the value is present but not a valid http(s) URL.
 */
export function validateUrl(url, fieldName = 'URL') {
  if (!url) return; // optional — empty/null is fine
  if (!isValidUrl(url)) {
    throw new Error(`${fieldName} must be a valid http or https URL.`);
  }
}

/**
 * Validates an optional image URL field.
 * Throws if the value is present but not a valid https URL.
 */
export function validateImageUrl(url, fieldName = 'Image URL') {
  if (!url) return; // optional — empty/null is fine
  if (!isValidHttpsUrl(url)) {
    throw new Error(`${fieldName} must be a valid https URL.`);
  }
}
