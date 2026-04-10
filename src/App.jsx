import React, { useEffect, useMemo, useRef, useState } from 'react';
import BottomNav from './components/BottomNav';
import UpdateBanner from './components/UpdateBanner';
import BusinessModule from './modules/BusinessModule';
import { fetchLatestBuildVersion, fetchSheet } from './utils/api';
import {
  dedupeBy,
  filterSimple,
  getCategoryLabel,
  isStandaloneMode,
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
    refreshHelp: 'Tap Refresh to load latest version',
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
  const [isStandalone, setIsStandalone] = useState(false);

  const currentVersionRef = useRef(String(BUILD_VERSION || '').trim());
  const versionCheckInFlightRef = useRef(false);

  const t = UI_TEXT[language];

  // =============================
  // Category Map
  // =============================
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((item, i) => {
      const key = item.category_key || item.category || `cat-${i}`;
      map[key] = {
        en: item.en || item.english || item.name || key,
      };
    });
    return map;
  }, [categories]);

  // =============================
  // Locations
  // =============================
  const locationOptions = useMemo(() => {
    return dedupeBy(
      businesses
        .map((b) => [b.city, b.state].filter(Boolean).join(', '))
        .filter(Boolean),
      (x) => x
    );
  }, [businesses]);

  // =============================
  // Filtering
  // =============================
  const filteredBusinesses = useMemo(() => {
    let items = filterSimple(businesses, search, [
      'business_name',
      'name',
      'description',
      'city',
      'state',
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

  // =============================
  // Load Data
  // =============================
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [b, c] = await Promise.all([
          fetchSheet(BUSINESSES_RANGE),
          fetchSheet(CATEGORIES_RANGE),
        ]);
        setBusinesses(b);
        setCategories(c);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // =============================
  // Standalone Detection
  // =============================
  useEffect(() => {
    setIsStandalone(isStandaloneMode());
  }, []);

  // =============================
  // Version Check
  // =============================
  useEffect(() => {
    let disposed = false;
    let timer;

    async function check() {
      if (versionCheckInFlightRef.current) return;
      versionCheckInFlightRef.current = true;

      try {
        const remoteVersion = await fetchLatestBuildVersion();
        if (!remoteVersion || disposed) return;

        setLatestVersion(remoteVersion);

        if (remoteVersion !== currentVersionRef.current) {
          setShowUpdateBanner(true);

          timer = setTimeout(() => {
            window.location.reload(true);
          }, AUTO_REFRESH_AFTER_UPDATE_MS);
        }
      } catch {}

      versionCheckInFlightRef.current = false;
    }

    check();

    const interval = setInterval(check, VERSION_CHECK_INTERVAL);

    return () => {
      disposed = true;
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  // =============================
  // UI
  // =============================
  return (
    <div className="hub-shell">

      <UpdateBanner
        visible={showUpdateBanner}
        latestVersion={latestVersion}
        t={t}
        onDismiss={() => setShowUpdateBanner(false)}
        onRefresh={() => window.location.reload()}
      />

      {/* Controls (no top bar anymore) */}
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

        {loading && <div>{t.loading}</div>}
        {error && <div className="hub-error">{error}</div>}

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

        {activeTab === 'events' && <div>Events (Phase 2)</div>}
        {activeTab === 'news' && <div>News (Phase 2)</div>}
        {activeTab === 'more' && <div>About (Phase 2)</div>}

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
