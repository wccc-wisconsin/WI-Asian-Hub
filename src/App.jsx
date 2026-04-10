import React, { useEffect, useMemo, useState } from 'react';
import BottomNav from './components/BottomNav';
import UpdateBanner from './components/UpdateBanner';
import BusinessModule from './modules/BusinessModule';
import { fetchSheet } from './utils/api';
import {
  dedupeBy,
  filterSimple,
  getCategoryLabel,
  normalizeWebsite,
} from './utils/helpers';

const BUSINESSES_RANGE = 'Businesses!A:Z';
const CATEGORIES_RANGE = 'Categories!A:Z';

const UI_TEXT = {
  en: {
    title: 'WCCC Business Directory',
    subtitle: 'Discover member businesses across Wisconsin',
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
    refreshHelp: 'Tap Refresh to update',
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

  const t = UI_TEXT[language];

  // category map
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((item, i) => {
      const key = item.category_key || item.category || `cat-${i}`;
      map[key] = { en: item.name || key };
    });
    return map;
  }, [categories]);

  // locations
  const locationOptions = useMemo(() => {
    return dedupeBy(
      businesses
        .map((b) => [b.city, b.state].filter(Boolean).join(', '))
        .filter(Boolean),
      (x) => x
    );
  }, [businesses]);

  // filtering
  const filteredBusinesses = useMemo(() => {
    let items = filterSimple(businesses, search, [
      'business_name',
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

  // load data
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

  return (
    <div className="hub-shell">
      {/* Header */}
      <div className="hub-topbar">
        <div className="hub-inner">
          <h1 className="hub-title">{t.title}</h1>
          <p className="hub-subtitle">{t.subtitle}</p>

          {/* Search */}
          <div className="hub-controls">
            <input
              className="hub-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search}
            />

            {/* Only show filters on business tab */}
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
                    <option key={loc}>{loc}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="hub-inner">
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

        {/* Placeholder tabs */}
        {activeTab === 'events' && <div>Events (Phase 2)</div>}
        {activeTab === 'news' && <div>News (Phase 2)</div>}
        {activeTab === 'more' && <div>About (Phase 2)</div>}
      </div>

      {/* Bottom Nav */}
      <div className="hub-mobile-spacer" />
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        t={t}
      />
    </div>
  );
}
