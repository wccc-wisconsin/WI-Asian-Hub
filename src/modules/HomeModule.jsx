import React from 'react';
import { formatDisplayDate } from '../utils/helpers';

export default function HomeModule({
  t,
  language,
  businesses,
  events,
  news,
  opportunities,
  homeEvents,
  homeBusinesses,
  homeNews,
  homeOpportunities,
  homeSpotlights,
  openVideo,
  setActiveTab,
  DashboardSection,
  memberSpotlightsError,
  memberSpotlights,
  getCategoryLabel,
  categoryMap,
}) {
  return (
    <section className="hub-dashboard">
      <section className="hub-section">
        <div className="hub-section-head">
          <h2 className="hub-section-title">🎥 {t.memberSpotlights}</h2>
          <button type="button" className="hub-section-link" onClick={() => setActiveTab('videos')}>{t.viewAll}</button>
        </div>
        <div className="hub-video-strip">
          {homeSpotlights.map((video) => (
            <button key={video.id} type="button" className="hub-video-card" onClick={() => openVideo(video)}>
              <img src={video.thumbnail} alt={video.title} className="hub-video-thumb" />
              <div className="hub-video-body"><p className="hub-video-title">{video.title}</p></div>
            </button>
          ))}
        </div>
        {memberSpotlightsError ? <div className="hub-video-note">{memberSpotlightsError}</div> : null}
        {!memberSpotlights.length ? <div className="hub-video-note">{t.videoApiNote}</div> : null}
      </section>

      <div className="hub-highlight-grid">
        <div className="hub-stat"><div className="hub-stat-label">{language === 'zh' ? '企业' : language === 'hm' ? 'Lag luam' : 'Businesses'}</div><div className="hub-stat-value">{businesses.length}</div></div>
        <div className="hub-stat"><div className="hub-stat-label">{t.events}</div><div className="hub-stat-value">{events.length}</div></div>
        <div className="hub-stat"><div className="hub-stat-label">{t.news}</div><div className="hub-stat-value">{news.length}</div></div>
        <div className="hub-stat"><div className="hub-stat-label">{t.opportunities}</div><div className="hub-stat-value">{opportunities.length}</div></div>
      </div>

      <DashboardSection title={t.events} actionLabel={t.viewAll} onAction={() => setActiveTab('events')} emptyLabel={t.noEvents} items={homeEvents} renderMeta={(item) => [formatDisplayDate(item.date), item.location || item.city].filter(Boolean).join(' • ')} />
      <DashboardSection title={t.featuredBusinesses} actionLabel={t.viewAll} onAction={() => setActiveTab('business')} emptyLabel={t.noResults} items={homeBusinesses} renderTitle={(item) => item.business_name || item.name} renderMeta={(item) => [getCategoryLabel(item.category_key || item.category || '', categoryMap, language), item.city].filter(Boolean).join(' • ')} />
      <DashboardSection title={t.news} actionLabel={t.viewAll} onAction={() => setActiveTab('news')} emptyLabel={t.noNews} items={homeNews} renderMeta={(item) => [item.source, formatDisplayDate(item.date)].filter(Boolean).join(' • ')} />
      <DashboardSection title={t.opportunities} actionLabel={t.viewAll} onAction={() => setActiveTab('opportunities')} emptyLabel={t.noOpportunities} items={homeOpportunities} renderMeta={(item) => [item.organization || item.company, formatDisplayDate(item.deadline)].filter(Boolean).join(' • ')} />
    </section>
  );
}
