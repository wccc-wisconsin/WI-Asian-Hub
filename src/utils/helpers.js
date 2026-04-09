export function filterSimple(items, search, fields) {
  const term = String(search || '').trim().toLowerCase();
  return items.filter((item) => {
    const haystack = fields.map((field) => item[field] || '').join(' ').toLowerCase();
    return !term || haystack.includes(term);
  });
}

export function getCategoryLabel(key, map, language) {
  return (map[key] && map[key][language]) || (map[key] && map[key].en) || key || '';
}

export function normalizeWebsite(value) {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function formatDisplayDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export function sortByDateDesc(items, fieldNames = ['date', 'publishedat', 'published_at']) {
  return [...items].sort((a, b) => {
    const aVal = fieldNames.map((f) => a[f]).find(Boolean);
    const bVal = fieldNames.map((f) => b[f]).find(Boolean);
    return new Date(bVal || 0).getTime() - new Date(aVal || 0).getTime();
  });
}

export function dedupeBy(items, getKey) {
  const seen = new Set();
  return items.filter((item, index) => {
    const key = getKey(item, index);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function isStandaloneMode() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
