import React from 'react';

export default function BusinessModule({ businesses, t, categoryMap, language, getCategoryLabel, normalizeWebsite }) {
  if (!businesses.length) return <div className="hub-message">{t.noResults}</div>;

  return (
    <section className="hub-list hub-list-business">
      {businesses.map((b, index) => {
        const businessName = b.business_name || b.name || '';
        const categoryKey = b.category_key || b.category || '';
        const city = b.city || '';
        const state = b.state || '';
        const website = normalizeWebsite(b.website || '');
        const email = b.email || '';
        const phone = b.phone || '';
        const description = b.description || b.about || '';

        return (
          <article key={b.id || `${businessName}-${index}`} className="hub-card hub-business-card">
            <div className="hub-card-body">
              <div className="hub-business-head">
                <div>
                  <h3 className="hub-card-title">{businessName}</h3>
                  <div className="hub-badges">
                    <span className="hub-badge-category">{getCategoryLabel(categoryKey, categoryMap, language)}</span>
                    <span className="hub-badge-location">{[city, state].filter(Boolean).join(', ') || t.allLocations}</span>
                  </div>
                </div>
              </div>

              {description ? <div className="hub-meta hub-business-description">{description}</div> : null}

              <div className="hub-business-actions">
                {phone ? <a href={`tel:${phone}`} className="hub-action-pill">{t.phone}</a> : null}
                {email ? <a href={`mailto:${email}`} className="hub-action-pill">{t.email}</a> : null}
                {website ? <a href={website} target="_blank" rel="noreferrer" className="hub-action-pill">{t.website}</a> : null}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
