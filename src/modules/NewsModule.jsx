import React from 'react';
import { formatDisplayDate } from '../utils/helpers';

export default function NewsModule({ news, t }) {
  if (!news.length) return <div className="hub-message">{t.noNews}</div>;

  return (
    <section className="hub-list">
      {news.map((item, index) => (
        <article key={item.id || `${item.title || item.name || 'news'}-${index}`} className="hub-card">
          <div className="hub-card-body">
            <h3 className="hub-card-title">{item.title || item.name}</h3>
            <div className="hub-badges">
              {item.source ? <span className="hub-badge-location">{item.source}</span> : null}
              {item.date ? <span className="hub-badge-category">{formatDisplayDate(item.date)}</span> : null}
            </div>
            <div className="hub-meta">{item.summary || item.description || ''}</div>
          </div>
        </article>
      ))}
    </section>
  );
}
