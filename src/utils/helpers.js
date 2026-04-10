// =============================
// Filtering
// =============================
export function filterSimple(items, search, fields) {
  const term = String(search || '').trim().toLowerCase();

  if (!term) return items;

  return items.filter((item) => {
    const haystack = fields
      .map((field) => item[field] || '')
      .join(' ')
      .toLowerCase();

    return haystack.includes(term);
  });
}

// =============================
// Category Label Mapping
// =============================
export function getCategoryLabel(key, map, language) {
  if (!key) return '';

  const entry = map[key];
  if (!entry) return key;

  return entry[language] || entry.en || key;
}

// =============================
// Normalize Website URL (FIXED)
// =============================
export function normalizeWebsite(value) {
  if (!value) return '';

  const trimmed = value.trim();

  // already has protocol
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

// =============================
// Format Date
// =============================
export function formatDisplayDate(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
}

// =============================
// Sort by Date Desc
// =============================
export function sortByDateDesc(
  items,
  fieldNames = ['date', 'publishedat', 'published_at']
) {
  return [...items].sort((a, b) => {
    const aVal = fieldNames.map((f) => a[f]).find(Boolean);
    const bVal = fieldNames.map((f) => b[f]).find(Boolean);

    return new Date(bVal || 0).getTime() - new Date(aVal || 0).getTime();
  });
}

// =============================
// Deduplicate
// =============================
export function dedupeBy(items, getKey) {
  const seen = new Set();

  return items.filter((item, index) => {
    const key = getKey(item, index);

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

// =============================
// Detect PWA Standalone Mode
// =============================
export function isStandaloneMode() {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}
