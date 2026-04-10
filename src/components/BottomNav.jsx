import React from 'react';

export default function BottomNav({ activeTab, setActiveTab, t }) {
  const items = [
    { key: 'business', label: t.business, icon: '🏢' },
    { key: 'events', label: t.events, icon: '📅' },
    { key: 'news', label: t.news, icon: '📰' },
    { key: 'more', label: t.more, icon: '⋯' },
  ];

  return (
    <nav className="hub-bottom-nav" aria-label="Mobile navigation">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`hub-bottom-nav-btn ${
            activeTab === item.key ? 'active' : ''
          }`}
          onClick={() => setActiveTab(item.key)}
          aria-current={activeTab === item.key ? 'page' : undefined}
        >
          <span className="hub-bottom-nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
