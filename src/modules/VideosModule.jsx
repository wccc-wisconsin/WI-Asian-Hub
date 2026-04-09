import React from 'react';

const YOUTUBE_PLAYLIST_ID = 'PL_JH4KAFh0GTiKw7con0FRewbAn2D3JmZ';
const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`;

export default function VideosModule({ filteredSpotlights, openVideo, t, memberSpotlightsError }) {
  if (!filteredSpotlights.length) return <div className="hub-message">{t.videoErrorFallback}</div>;

  return (
    <section className="hub-dashboard">
      <section className="hub-section">
        <div className="hub-section-head"><h2 className="hub-section-title">🎥 {t.memberSpotlights}</h2></div>
        <div className="hub-video-grid">
          {filteredSpotlights.map((video) => (
            <button key={video.id} type="button" className="hub-video-card" onClick={() => openVideo(video)}>
              <img src={video.thumbnail} alt={video.title} className="hub-video-thumb" />
              <div className="hub-video-body"><p className="hub-video-title">{video.title}</p></div>
            </button>
          ))}
        </div>
        {memberSpotlightsError ? <div className="hub-video-note">{memberSpotlightsError}</div> : null}
        <div className="hub-video-note"><a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer" className="hub-link">{t.youtubeExternal}</a></div>
      </section>
    </section>
  );
}
