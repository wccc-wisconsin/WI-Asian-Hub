import React from 'react';

export default function UpdateBanner({
  visible,
  latestVersion,
  t,
  onDismiss,
  onRefresh,
}) {
  if (!visible) return null;

  return (
    <div className="hub-updatebar">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <strong>{t.updateAvailable}</strong>
        <span style={{ fontSize: 12, opacity: 0.9 }}>
          {t.refreshHelp}
          {latestVersion ? ` (${latestVersion})` : ''}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          className="hub-dismiss-btn"
          onClick={onDismiss}
        >
          {t.dismiss}
        </button>

        <button
          type="button"
          className="hub-update-btn"
          onClick={onRefresh}
        >
          {t.refreshCta}
        </button>
      </div>
    </div>
  );
}
