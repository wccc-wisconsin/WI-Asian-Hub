import React from 'react';

export default function DashboardSection({ title, actionLabel, onAction, emptyLabel, items, renderTitle, renderMeta }) {
  const getTitle = renderTitle || ((item) => item.title || item.event_name || item.business_name || item.name || '');

  if (!items.length) {
    return (
      <section className="hub-section">
        <div className="hub-section-head">
          <h2 className="hub-section-title">{title}</h2>
          {actionLabel ? <button type="button" className="hub-section-link" onClick={onAction}>{actionLabel}</button> : null}
        </div>
        <div className="hub-message">{emptyLabel}</div>
      </section>
    );
  }

  return (
    <section className="hub-section">
      <div className="hub-section-head">
        <h2 className="hub-section-title">{title}</h2>
        {actionLabel ? <button type="button" className="hub-section-link" onClick={onAction}>{actionLabel}</button> : null}
      </div>
      <div className="hub-mini-list">
        {items.map((item, index) => (
          <div key={item.id || `${getTitle(item)}-${index}`} className="hub-mini-card">
            <div className="hub-mini-title">{getTitle(item)}</div>
            <div className="hub-mini-meta">{renderMeta ? renderMeta(item) : ''}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
