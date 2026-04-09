import React from 'react';

export default function VideoPlayerModal({ videoId, title, onClose }) {
  if (!videoId) return null;

  return (
    <div className="hub-video-modal-backdrop" onClick={onClose}>
      <div className="hub-video-modal" onClick={(e) => e.stopPropagation()}>
        <div className="hub-video-modal-head">
          <h3 className="hub-video-modal-title">{title || 'Member Spotlight'}</h3>
          <button type="button" className="hub-video-close" onClick={onClose}>✕</button>
        </div>
        <div className="hub-video-frame-wrap">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1&autoplay=1`}
            title={title || 'Member Spotlight'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
