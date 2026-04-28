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
  return str
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
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
