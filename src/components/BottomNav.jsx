import React from 'react';

export default function BottomNav({ activeTab, setActiveTab, t }) {
  const items = [
    ['home', t.home, '⌂'],
    ['business', t.business, '◫'],
    ['events', t.events, '◷'],
    ['news', t.news, '☰'],
    ['videos', t.videos, '▶'],
    ['more', t.more, '⋯'],
  ];

  return (
    <nav className="hub-bottom-nav" aria-label="Mobile navigation">
      {items.map(([key, label, icon]) => (
        <button
          key={key}
          type="button"
          className={`hub-bottom-nav-btn ${activeTab === key ? 'active' : ''}`}
          onClick={() => setActiveTab(key)}
          aria-current={activeTab === key ? 'page' : undefined}
        >
          <span className="hub-bottom-nav-icon" aria-hidden="true">{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
