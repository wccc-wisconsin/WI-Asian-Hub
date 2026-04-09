import React from 'react';
import { formatDisplayDate } from '../utils/helpers';

export default function EventsModule({ events, t }) {
  if (!events.length) return <div className="hub-message">{t.noEvents}</div>;

  return (
    <section className="hub-list">
      {events.map((item, index) => (
        <article key={item.id || `${item.title || item.event_name || 'event'}-${index}`} className="hub-card">
          <div className="hub-card-body">
            <h3 className="hub-card-title">{item.title || item.event_name || item.name}</h3>
            <div className="hub-badges">
              {item.date ? <span className="hub-badge-category">{formatDisplayDate(item.date)}</span> : null}
              {item.location || item.city ? <span className="hub-badge-location">{item.location || item.city}</span> : null}
            </div>
            {item.description ? <div className="hub-meta">{item.description}</div> : null}
          </div>
        </article>
      ))}
    </section>
  );
}
