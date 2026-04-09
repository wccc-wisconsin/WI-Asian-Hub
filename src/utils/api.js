const SHEET_ID = '1tJJmD8qyOEdCrVxN4T4uzbrZBUy621K5ZhD00NR30Mk';
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_PLAYLIST_ID = 'PL_JH4KAFh0GTiKw7con0FRewbAn2D3JmZ';
const VERSION_URL = '/build-version.json';

export async function fetchSheet(range) {
  if (!API_KEY) throw new Error('Missing VITE_GOOGLE_SHEETS_API_KEY');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`;
  const res = await fetch(url, { cache: 'no-store' });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error?.message || 'Google Sheets fetch failed');
  }

  if (!json.values?.length) return [];

  const headers = json.values[0];
  const rows = json.values.slice(1);

  return rows.map((row) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[String(h).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')] = row[i] || '';
    });
    return obj;
  });
}

export async function fetchYouTubePlaylistItems() {
  if (!YOUTUBE_API_KEY) return [];

  const items = [];
  let nextPageToken = '';

  for (let i = 0; i < 3; i += 1) {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('playlistId', YOUTUBE_PLAYLIST_ID);
    url.searchParams.set('key', YOUTUBE_API_KEY);
    if (nextPageToken) url.searchParams.set('pageToken', nextPageToken);

    const res = await fetch(url.toString(), { cache: 'no-store' });
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.error?.message || 'Failed to load YouTube playlist');
    }

    const pageItems = (json.items || [])
      .map((item) => {
        const snippet = item.snippet || {};
        const videoId = snippet.resourceId?.videoId || '';
        if (!videoId) return null;

        return {
          id: videoId,
          title: snippet.title || 'Member Spotlight',
          thumbnail:
            snippet.thumbnails?.medium?.url ||
            snippet.thumbnails?.high?.url ||
            snippet.thumbnails?.default?.url ||
            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          publishedAt: snippet.publishedAt || '',
        };
      })
      .filter(Boolean);

    items.push(...pageItems);
    nextPageToken = json.nextPageToken || '';
    if (!nextPageToken) break;
  }

  return items;
}

export async function fetchLatestBuildVersion() {
  const response = await fetch(`${VERSION_URL}?t=${Date.now()}`, {
    cache: 'no-store',
    headers: {
      pragma: 'no-cache',
      'cache-control': 'no-cache, no-store, must-revalidate',
    },
  });

  if (!response.ok) {
    throw new Error('Unable to check latest version');
  }

  const data = await response.json();
  return String(data?.version || '').trim();
}
