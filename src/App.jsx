import React, { useEffect, useMemo, useRef, useState } from 'react';
import BottomNav from './components/BottomNav';
import UpdateBanner from './components/UpdateBanner';
import BusinessModule from './modules/BusinessModule';
import { fetchLatestBuildVersion, fetchSheet } from './utils/api';
import {
  dedupeBy,
  filterSimple,
  getCategoryLabel,
  normalizeWebsite,
} from './utils/helpers';
import { BUILD_VERSION } from './buildVersion';

const BUSINESSES_RANGE = 'Businesses!A:Z';
const CATEGORIES_RANGE = 'Categories!A:Z';
const VERSION_CHECK_INTERVAL = 30000;
const AUTO_REFRESH_AFTER_UPDATE_MS = 15000;

const UI_TEXT = {
  en: {
    search: 'Search businesses',
    allCategories: 'All Categories',
    allLocations: 'All Locations',
    business: 'Business',
    events: 'Events',
    news: 'News',
    more: 'About',
    website: 'Website',
    email: 'Email',
    phone: 'Phone',
    noResults: 'No businesses found.',
    loading: 'Loading...',
    loadError: 'Unable to load data',
    updateAvailable: 'Update available',
    refreshCta: 'Refresh',
    refreshHelp: 'Tap Refresh to load the latest version.',
    dismiss: 'Dismiss',
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('business');
  const [language] = useState('en');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');

  const currentVersionRef = useRef(String(BUILD_VERSION || '').trim());
  const versionCheckInFlightRef = useRef(false);
  const lastSeenRemoteBuildRef = useRef('');

  const t = UI_TEXT[language];

  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((item, i) => {
      const key = item.category_key || item.category || `cat-${i}`;
      map[key] = {
        en: item.en || item.english || item.name || key,
        zh: item.zh || item.chinese || item.name || key,
        hm: item.hm || item.hmong || item.name || key,
      };
    });
    return map;
  }, [categories]);

  const locationOptions = useMemo(() => {
    return dedupeBy(
      businesses
        .map((b) => [b.city, b.state].filter(Boolean).join(', '))
        .filter(Boolean),
      (x) => x
    );
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    let items = filterSimple(businesses, search, [
      'business_name',
      'name',
      'description',
      'category',
      'category_key',
      'city',
      'state',
      'email',
      'website',
    ]);

    if (selectedCategory) {
      items = items.filter(
        (b) => (b.category_key || b.category) === selectedCategory
      );
    }

    if (selectedLocation) {
      items = items.filter(
        (b) =>
          [b.city, b.state].filter(Boolean).join(', ') === selectedLocation
      );
    }

    return items;
  }, [businesses, search, selectedCategory, selectedLocation]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError('');

        const [b, c] = await Promise.all([
          fetchSheet(BUSINESSES_RANGE),
          fetchSheet(CATEGORIES_RANGE),
        ]);

        if (cancelled) return;

        setBusinesses(b);
        setCategories(c);
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    let autoRefreshTimeoutId = null;

    async function reloadAppNow() {
      try {
        window.location.reload();
      } catch {
        window.location.reload();
      }
    }

    async function checkForUpdates() {
      if (versionCheckInFlightRef.current) return;
      versionCheckInFlightRef.current = true;

      try {
        const remoteVersion = await fetchLatestBuildVersion();
        if (disposed || !remoteVersion) return;

        const remoteBuild = String(remoteVersion).trim();
        setLatestVersion(remoteBuild);

        if (remoteBuild === currentVersionRef.current) {
          lastSeenRemoteBuildRef.current = '';
          return;
        }

        if (lastSeenRemoteBuildRef.current != remoteBuild) {
          lastSeenRemoteBuildRef.current = remoteBuild;
          setShowUpdateBanner(true);
          return;
        }

        setShowUpdateBanner(true);

        if (autoRefreshTimeoutId) {
          window.clearTimeout(autoRefreshTimeoutId);
        }

        autoRefreshTimeoutId = window.setTimeout(() => {
          if (!disposed) reloadAppNow();
        }, AUTO_REFRESH_AFTER_UPDATE_MS);
      } catch {
        // ignore transient fetch/cache issues
      } finally {
        versionCheckInFlightRef.current = false;
      }
    }

    checkForUpdates();

    const intervalId = window.setInterval(
      checkForUpdates,
      VERSION_CHECK_INTERVAL
    );

    const onVisible = async () => {
      if (document.visibilityState === 'visible') {
        await checkForUpdates();
      }
    };

    const onFocus = async () => {
      await checkForUpdates();
    };

    window.addEventListener('focus', onFocus);
    window.addEventListener('pageshow', onFocus);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      disposed = true;
      window.clearInterval(intervalId);
      if (autoRefreshTimeoutId) {
        window.clearTimeout(autoRefreshTimeoutId);
      }
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('pageshow', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return (
    <div className="hub-shell">
      <UpdateBanner
        visible={showUpdateBanner}
        latestVersion={latestVersion}
        t={t}
        onDismiss={() => setShowUpdateBanner(false)}
        onRefresh={() => {
          window.location.reload();
        }}
      />

      <div className="hub-inner">
        <div className="hub-controls" style={{ marginBottom: 12 }}>
          <input
            className="hub-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
          />

          {activeTab === 'business' && (
            <>
              <select
                className="hub-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">{t.allCategories}</option>
                {Object.keys(categoryMap).map((key) => (
                  <option key={key} value={key}>
                    {categoryMap[key].en}
                  </option>
                ))}
              </select>

              <select
                className="hub-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">{t.allLocations}</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        {loading && <div className="hub-loading">{t.loading}</div>}
        {error && <div className="hub-error">{error || t.loadError}</div>}

        {!loading && !error && activeTab === 'business' && (
          <BusinessModule
            businesses={filteredBusinesses}
            t={t}
            categoryMap={categoryMap}
            language={language}
            getCategoryLabel={getCategoryLabel}
            normalizeWebsite={normalizeWebsite}
          />
        )}

        {!loading && !error && activeTab === 'events' && (
          <div>Events (Phase 2)</div>
        )}
        {!loading && !error && activeTab === 'news' && (
          <div>News (Phase 2)</div>
        )}
        {!loading && !error && activeTab === 'more' && (
          <div>About (Phase 2)</div>
        )}
      </div>

      <div className="hub-mobile-spacer" />
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        t={t}
      />
    </div>
  );
}
