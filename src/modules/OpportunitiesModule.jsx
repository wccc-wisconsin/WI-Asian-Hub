import React from 'react';
import { formatDisplayDate, normalizeWebsite } from '../utils/helpers';

export default function OpportunitiesModule({ opportunities, t }) {
  if (!opportunities.length) return <div className="hub-message">{t.noOpportunities}</div>;

  return (
    <section className="hub-list">
      {opportunities.map((item, index) => (
        <article key={item.id || `${item.title || item.name || 'opportunity'}-${index}`} className="hub-card">
          <div className="hub-card-body">
            <h3 className="hub-card-title">{item.title || item.name}</h3>
            <div className="hub-badges">
              {item.organization || item.company ? <span className="hub-badge-location">{item.organization || item.company}</span> : null}
              {item.deadline ? <span className="hub-badge-category">{formatDisplayDate(item.deadline)}</span> : null}
            </div>
            {item.description ? <div className="hub-meta">{item.description}</div> : null}
            {item.link ? (
              <div className="hub-meta">
                <a href={normalizeWebsite(item.link)} target="_blank" rel="noreferrer" className="hub-link">{t.open}</a>
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </section>
  );
}
