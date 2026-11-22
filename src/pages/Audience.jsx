// 4 · Audience: exactly as the mock (design-reference/Audience.dc.html), with its numbers and
// text. No real data yet; nothing on the page says so (owner's decision).
import { useState } from 'react';
import { Footer } from '../layout/Shell.jsx';
import { PeriodBar } from '../layout/PeriodBar.jsx';

const PLATFORMS = [
  ['all', 'All platforms'],
  ['ig', 'Instagram'],
  ['tt', 'TikTok'],
];

const STATS = [
  { label: 'Total followers', value: '3.232', sub: 'Instagram 3.226 · TikTok 6', glow: 'brand' },
  { label: 'Follower growth', value: '+274', sub: '70% lower than last month', glow: 'good' },
  { label: 'Top country', value: 'Indonesia', sub: '94,8% of followers', glow: 'brand' },
  { label: 'Main age group', value: '25–34', sub: '37,1% of followers', glow: 'good' },
];

// [label, % of followers]: bars are scaled to the largest group, as in the mock
const AGES = [
  ['13–17', 2.1],
  ['18–24', 28.6],
  ['25–34', 37.1],
  ['35–44', 19.4],
  ['45–54', 8.3],
  ['55+', 4.5],
];

const CITIES = [
  ['Jakarta', 31.2],
  ['Depok', 9.8],
  ['Bandung', 8.6],
  ['Bekasi', 7.9],
  ['Tangerang', 7.1],
];

const WEEKS = [
  ['W1', 52],
  ['W2', 88],
  ['W3', 71],
  ['W4', 63],
];

const pct = (v) => `${String(v).replace('.', ',')}%`;
const share = (v, max) => `${((v / max) * 100).toFixed(1)}%`;
const AGE_MAX = Math.max(...AGES.map(([, v]) => v));
const CITY_MAX = Math.max(...CITIES.map(([, v]) => v));
const WEEK_MAX = Math.max(...WEEKS.map(([, v]) => v));

function PlatformTabs() {
  const [platform, setPlatform] = useState('all');
  return (
    <div className="au-plat" role="group" aria-label="Platform">
      {PLATFORMS.map(([id, label]) => (
        <button key={id} type="button" aria-pressed={id === platform} onClick={() => setPlatform(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}

export function Audience() {
  return (
    <div className="au-page">
      <PeriodBar />

      <section className="b360-panel au-panel" aria-labelledby="aud">
        <div className="b360-panel-head">
          <div>
            <h2 id="aud">Audience Insights</h2>
            <p>Who follows you: growth, location, age and gender.</p>
          </div>
          <PlatformTabs />
        </div>

        <div className="au-row">
          {STATS.map((s) => (
            <article key={s.label} className={`b360-card au-stat is-${s.glow}`}>
              <div className="b360-card-glow au-stat-glow" aria-hidden="true" />
              <p className="au-stat-label">{s.label}</p>
              <div className="au-stat-body">
                <p className="au-stat-value">{s.value}</p>
                <p className="au-stat-sub">{s.sub}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="au-row au-charts">
          <article className="b360-card au-chart au-bars">
            <h3>Age groups</h3>
            {AGES.map(([label, v]) => (
              <div key={label} className={`au-bar-row${v === AGE_MAX ? ' is-top' : ''}`}>
                <span className="au-age">{label}</span>
                <div className="au-track" aria-hidden="true">
                  <div style={{ width: share(v, AGE_MAX) }} />
                </div>
                <strong>{pct(v)}</strong>
              </div>
            ))}
          </article>

          <article className="b360-card au-chart au-bars au-cities">
            <h3>Top cities</h3>
            {CITIES.map(([name, v], i) => (
              <div key={name} className={`au-bar-row${i === 0 ? ' is-top' : ''}`}>
                <span className="au-rank">{i + 1}</span>
                <span className="au-city">{name}</span>
                <div className="au-track" aria-hidden="true">
                  <div style={{ width: share(v, CITY_MAX) }} />
                </div>
                <strong>{pct(v)}</strong>
              </div>
            ))}
          </article>

          <article className="b360-card au-chart au-gender">
            <h3>Gender</h3>
            <div className="au-split" role="img" aria-label="Female 58,4%, male 41,6%">
              <div className="is-female" style={{ width: '58.4%' }} />
              <div className="is-male" />
            </div>
            <div className="au-split-legend">
              <div>
                <span className="au-key">
                  <span className="au-dot is-female" aria-hidden="true" />
                  Female
                </span>
                <p className="au-share">58,4%</p>
              </div>
              <div className="is-end">
                <span className="au-key">
                  <span className="au-dot is-male" aria-hidden="true" />
                  Male
                </span>
                <p className="au-share">41,6%</p>
              </div>
            </div>

            <div className="au-weekly">
              <h3>New followers per week</h3>
              <div
                className="au-weeks"
                role="img"
                aria-label="New followers per week: week 1 +52, week 2 +88, week 3 +71, week 4 +63"
              >
                {WEEKS.map(([label, v]) => (
                  <div key={label} className={`au-week${v === WEEK_MAX ? ' is-top' : ''}`}>
                    <strong>+{v}</strong>
                    <div className="au-week-bar" style={{ height: `${Math.round((v / WEEK_MAX) * 72)}px` }} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>

        <article className="b360-card au-note">
          <div className="b360-card-glow au-note-glow" aria-hidden="true" />
          <div className="au-note-head">
            <h3>Audience observation</h3>
            <span>From your account team</span>
          </div>
          <p>
            Your audience is almost entirely Indonesian (94,8%), mostly aged 25–34 (37,1%) and concentrated in Greater Jakarta
            (Jakarta, Depok, Bekasi, Tangerang) and Bandung. Women make up 58,4% of followers. With 3.232 followers after +274
            this month, content for urban young professionals, such as pop-culture news and weekend plans, fits this audience
            best.
          </p>
        </article>
      </section>

      <Footer>Beyond 360° Dashboard by Beyondcy · Synced from Meta and TikTok · Last sync 18 Nov 2026, 09:30 WIB</Footer>
    </div>
  );
}
