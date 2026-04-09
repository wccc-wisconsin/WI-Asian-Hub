import React from 'react';

export default function UpdateBanner({ visible, latestVersion, t, onDismiss, onRefresh }) {
  if (!visible) return null;

  return (
    <div className="hub-updatebar">
      <div>
        <strong>{t.updateAvailable}</strong>
        <div>
          {t.refreshHelp}
          {latestVersion ? ` (${latestVersion})` : ''}
        </div>
      </div>
      <div className="hub-updatebar-actions">
        <button type="button" className="hub-dismiss-btn" onClick={onDismiss}>{t.dismiss}</button>
        <button type="button" className="hub-update-btn" onClick={onRefresh}>{t.refreshCta}</button>
      </div>
    </div>
  );
}
