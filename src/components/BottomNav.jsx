import React from 'react';

export default function BottomNav({ activeTab, setActiveTab, t }) {
  const items = [
    ['business', t.business, '◫'],
    ['events', t.events, '◷'],
    ['news', t.news, '☰'],
    ['more', t.more, '⋯'],
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      style={{
        position: 'fixed',
        left: '0',
        right: '0',
        bottom: '0',
        top: 'auto',
        zIndex: 99999,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        background: '#ffffff',
        borderTop: '1px solid #ddd',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
      }}
    >
      {items.map(([key, label, icon]) => (
        <button
          key={key}
          type="button"
          onClick={() => setActiveTab(key)}
          aria-current={activeTab === key ? 'page' : undefined}
          style={{
            border: 'none',
            background: 'transparent',
            padding: '10px 4px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            fontSize: '11px',
            color: activeTab === key ? '#1f3c88' : '#6b7280',
            fontWeight: activeTab === key ? 700 : 500,
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
