import React from 'react';

export default function AboutModule({ t }) {
  return (
    <section className="hub-dashboard">
      <section className="hub-section">
        <div className="hub-section-head"><h2 className="hub-section-title">{t.aboutTitle}</h2></div>
        <div className="hub-about-content">
          <h3>{t.aboutOrgName}</h3>
          <p>{t.aboutTagline}</p>
          <h3>{t.whoWeAre}</h3>
          <p>{t.whoWeAreP1}</p>
          <p>{t.whoWeAreP2}</p>
          <h3>{t.mission}</h3>
          <p>{t.missionP}</p>
          <h3>{t.whatWeDo}</h3>
          <ul>{t.aboutBullets1.map((item) => <li key={item}>{item}</li>)}</ul>
          <h3>{t.programs}</h3>
          <ul>{t.aboutProgramsList.map((item) => <li key={item}>{item}</li>)}</ul>
          <h3>{t.aboutEvents}</h3>
          <ul>{t.aboutEventsList.map((item) => <li key={item}>{item}</li>)}</ul>
          <h3>{t.whoWeServe}</h3>
          <p>{t.whoWeServeP}</p>
          <h3>{t.partnerships}</h3>
          <ul>{t.aboutPartnersList.map((item) => <li key={item}>{item}</li>)}</ul>
          <h3>{t.contact}</h3>
          <p>{t.contactEmailLabel}: info@wisccc.org</p>
          <p>{t.contactLocationLabel}: {t.contactLocationValue}</p>
          <h3>{t.getInvolved}</h3>
          <p>{t.getInvolvedP}</p>
        </div>
      </section>
    </section>
  );
}
