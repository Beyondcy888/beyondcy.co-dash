// 3 · Content Performance: exactly as the mock (design/Content.dc.html), with its numbers and
// text. No real data yet; nothing on the page says so (owner's decision). The "Rank by" tabs
// re-sort the Top 5 as the mock does; search and "Load more" are look only, as in the mock.
import { useState } from 'react';
import { Footer } from '../layout/Shell.jsx';
import { PeriodBar } from '../layout/PeriodBar.jsx';

const fmt = (n) => n.toLocaleString('id-ID');
const pct = (n) => n.toFixed(2).replace('.', ',') + '%';

// [metric, Instagram, TikTok, Total, bold]
const PLATFORM_ROWS = [
  ['Followers', '3.226', '6', '3.232'],
  ['Follower growth', '+269', '+5', '+274'],
  ['Reach', '62.000', '–', '62.000'],
  ['Content interactions', '3.900', '–', '3.900'],
  ['Views', '87.900', '1.300', '89.200'],
  ['Likes', '2.510', '57', '2.567'],
  ['Comments', '30', '–', '30'],
  ['Shares', '77', '5', '82'],
  ['Saves', '114', '–', '114'],
  ['Engagement', '2.731', '62', '2.793', true],
  ['Engagement rate', '4,40%', '4,77%', '4,50%', true],
  ['Profile visits', '363', '22', '385'],
  ['Content published', '38', '6', '44'],
];

const DONUTS = [
  {
    title: 'Views share by platform',
    aria: 'Views share: Instagram 98,5%, TikTok 1,5%',
    center: '89.200',
    centerLabel: 'total views',
    glow: 'rgba(158, 205, 90, 0.45)',
    gradient: 'conic-gradient(var(--good) 0 98.5%, var(--brand) 98.5% 100%)',
    legend: [
      { label: 'Instagram', value: '98,5%', color: 'var(--good)' },
      { label: 'TikTok', value: '1,5%', color: 'var(--brand)' },
    ],
  },
  {
    title: 'Engagement mix',
    aria: 'Engagement mix: likes 2.567, comments 30, shares 82, saves 114',
    center: '2.793',
    centerLabel: 'engagements',
    glow: 'rgba(132, 114, 182, 0.45)',
    gradient: 'conic-gradient(var(--good) 0 91.9%, #f0a24a 91.9% 93%, #7fb2e5 93% 95.9%, var(--brand) 95.9% 100%)',
    legend: [
      { label: 'Likes', value: '2.567', color: 'var(--good)' },
      { label: 'Comments', value: '30', color: '#f0a24a' },
      { label: 'Shares', value: '82', color: '#7fb2e5' },
      { label: 'Saves', value: '114', color: 'var(--brand)' },
    ],
  },
];

const POSTS = [
  { date: '03 Oct 2026', platform: 'Instagram', title: '5 Indonesian films to watch', format: 'Carousel', views: 2050, reach: 1650, likes: 101, comments: 3, shares: 12, saves: 35, watch: '–' },
  { date: '08 Oct 2026', platform: 'Instagram', title: 'Quiz: guess the scene', format: 'Carousel', views: 2900, reach: 2100, likes: 120, comments: 9, shares: 8, saves: 20, watch: '–' },
  { date: '12 Oct 2026', platform: 'Instagram', title: 'News: Rumah Singgah', format: 'Reels', views: 6200, reach: 4900, likes: 96, comments: 4, shares: 6, saves: 4, watch: '14s' },
  { date: '14 Oct 2026', platform: 'Instagram', title: 'Film School 101: lighting', format: 'Carousel', views: 92, reach: 85, likes: 5, comments: 0, shares: 0, saves: 1, watch: '–' },
  { date: '16 Oct 2026', platform: 'Instagram', title: 'Operasi Pesta Copet: cast reacts', format: 'Reels', views: 3800, reach: 2465, likes: 85, comments: 3, shares: 6, saves: 7, watch: '12s' },
  { date: '18 Oct 2026', platform: 'Instagram', title: 'Iqbaal interview teaser', format: 'Reels', views: 1960, reach: 1600, likes: 36, comments: 1, shares: 2, saves: 2, watch: '8s' },
  { date: '20 Oct 2026', platform: 'TikTok', title: 'POV: first day on set', format: 'TikTok video', views: 420, reach: 0, likes: 15, comments: 1, shares: 2, saves: 0, watch: '6s' },
  { date: '22 Oct 2026', platform: 'Instagram', title: 'Coki’s favourite films', format: 'Reels', views: 2780, reach: 2400, likes: 58, comments: 2, shares: 3, saves: 3, watch: '9s' },
  { date: '24 Oct 2026', platform: 'Instagram', title: 'Poll: best villain', format: 'Carousel', views: 1500, reach: 1180, likes: 98, comments: 6, shares: 4, saves: 12, watch: '–' },
  { date: '29 Oct 2026', platform: 'Instagram', title: 'Behind the poster', format: 'Carousel', views: 980, reach: 720, likes: 64, comments: 2, shares: 5, saves: 17, watch: '–' },
].map((p) => {
  const eng = p.likes + p.comments + p.shares + p.saves;
  return { ...p, eng, erNum: (eng / (p.reach || p.views)) * 100 };
});

const DB_COLS = [
  ['Date', 'left'],
  ['Platform', 'left'],
  ['Content', 'left'],
  ['Format', 'left'],
  ['Views', 'right'],
  ['Reach', 'right'],
  ['Likes', 'right'],
  ['Comments', 'right'],
  ['Shares', 'right'],
  ['Saves', 'right'],
  ['Engagement', 'right'],
  ['ER', 'right'],
  ['Avg watch', 'right'],
];

const RANK_BY = [
  ['reach', 'Reach'],
  ['eng', 'Engagement'],
  ['er', 'Engagement rate'],
  ['views', 'Views'],
];

const FORMATS = [
  { name: 'Short video (Reels)', posts: 22, reach: '935', views: '1.092', reachN: 935, viewsN: 1092, er: '3,47%', best: false },
  { name: 'Carousel', posts: 16, reach: '640', views: '720', reachN: 640, viewsN: 720, er: '7,14%', best: true },
  { name: 'TikTok video', posts: 6, reach: '–', views: '217', reachN: 0, viewsN: 217, er: '4,77%', best: false },
].map((f) => ({ ...f, reachPct: Math.round((f.reachN / 1092) * 100) + '%', viewsPct: Math.round((f.viewsN / 1092) * 100) + '%' }));

// [day, avg reach, avg engagements]: Thursday best for reach, Saturday for engagement, Monday worst
const DAYS = [
  ['Sun', 488, 17],
  ['Mon', 131, 4],
  ['Tue', 411, 18],
  ['Wed', 188, 12],
  ['Thu', 1017, 24],
  ['Fri', 486, 34],
  ['Sat', 744, 39],
].map(([day, reach, eng]) => ({
  day,
  reach: fmt(reach),
  eng,
  h: Math.max(10, Math.round((reach / 1017) * 170)) + 'px',
  kind: reach === 1017 ? 'best' : day === 'Sat' ? 'sat' : reach === 131 ? 'worst' : 'dim',
}));

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function Donut({ d }) {
  return (
    <article className="b360-card cp-donut">
      <h3>{d.title}</h3>
      <div className="cp-donut-body">
        <div className="cp-ring">
          <div className="cp-ring-arc" role="img" aria-label={d.aria} style={{ background: d.gradient, filter: `drop-shadow(0 0 14px ${d.glow})` }} />
          <div className="cp-ring-center">
            <strong>{d.center}</strong>
            <span>{d.centerLabel}</span>
          </div>
        </div>
        <ul className="cp-legend">
          {d.legend.map((l) => (
            <li key={l.label}>
              <span className="cp-legend-dot" aria-hidden="true" style={{ '--dot': l.color }} />
              <span className="cp-legend-label">{l.label}</span>
              <strong className="tnum">{l.value}</strong>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function TopContent() {
  const [by, setBy] = useState('reach');
  const keyOf = (p) => (by === 'er' ? p.erNum : p[by]);
  const top = POSTS.slice()
    .sort((a, b) => keyOf(b) - keyOf(a))
    .slice(0, 5);
  const rankLabel = (RANK_BY.find((r) => r[0] === by) ?? RANK_BY[0])[1];

  return (
    <section className="b360-panel cp-panel" aria-labelledby="top">
      <div className="b360-panel-head">
        <div>
          <h2 id="top">Top Performing Content</h2>
          <p>The 5 best posts of the period, ranked by the metric you choose.</p>
        </div>
        <div className="cp-seg" role="group" aria-label="Rank by">
          {RANK_BY.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={id === by} onClick={() => setBy(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="cp-top">
        {top.map((p, i) => (
          <article key={p.title} className="b360-card cp-post">
            <div className="cp-thumb" aria-hidden="true">
              <span className="cp-thumb-rank">{String(i + 1).padStart(2, '0')}</span>
              <span className="cp-thumb-format">{p.format}</span>
            </div>
            <div className="cp-post-text">
              <h3>{p.title}</h3>
              <p>
                {p.platform} · {p.date}
              </p>
            </div>
            <div className="cp-post-metric">
              <span>{rankLabel}</span>
              <strong>{by === 'er' ? pct(p.erNum) : fmt(p[by])}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ContentPerformance() {
  return (
    <div className="cp-page">
      <PeriodBar />

      <section className="b360-panel cp-panel" aria-labelledby="plat">
        <div className="b360-panel-head">
          <div>
            <h2 id="plat">Platform Performance</h2>
            <p>All organic results for the period, split by platform.</p>
          </div>
        </div>
        <div className="cp-row">
          <div className="b360-card cp-table-card cp-plat-card">
            <table className="cp-plat">
              <thead>
                <tr>
                  <th scope="col">Metric</th>
                  <th scope="col">Instagram</th>
                  <th scope="col">TikTok</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {PLATFORM_ROWS.map(([m, ig, tt, total, bold]) => (
                  <tr key={m} className={bold ? 'cp-is-bold' : undefined}>
                    <th scope="row">{m}</th>
                    <td>{ig}</td>
                    <td>{tt}</td>
                    <td>{total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cp-donuts">
            {DONUTS.map((d) => (
              <Donut key={d.title} d={d} />
            ))}
          </div>
        </div>
      </section>

      <TopContent />

      <section className="b360-panel cp-panel" aria-labelledby="ana">
        <div className="b360-panel-head">
          <div>
            <h2 id="ana">Content Analysis</h2>
            <p>Which formats and posting days work best. Averages per post.</p>
          </div>
        </div>
        <div className="cp-row">
          <article className="b360-card cp-formats">
            <h3>Performance by format</h3>
            {FORMATS.map((f) => (
              <div key={f.name} className="cp-format">
                <div className="cp-format-head">
                  <strong>
                    {f.name} <span>· {f.posts} posts</span>
                  </strong>
                  <span className={f.best ? 'cp-er cp-is-best' : 'cp-er'}>ER {f.er}</span>
                </div>
                <div className="cp-meter">
                  <span>Avg reach</span>
                  <div className="cp-meter-track" aria-hidden="true">
                    <div className="cp-is-reach" style={{ width: f.reachPct }} />
                  </div>
                  <strong>{f.reach}</strong>
                </div>
                <div className="cp-meter">
                  <span>Avg views</span>
                  <div className="cp-meter-track" aria-hidden="true">
                    <div className="cp-is-views" style={{ width: f.viewsPct }} />
                  </div>
                  <strong>{f.views}</strong>
                </div>
              </div>
            ))}
          </article>
          <article className="b360-card cp-days">
            <div className="cp-days-head">
              <h3>Avg reach by posting day</h3>
              <span>Best: Thursday for reach · Saturday for engagement</span>
            </div>
            <div
              className="cp-days-chart"
              role="img"
              aria-label="Average reach per post by day: Sunday 488, Monday 131, Tuesday 411, Wednesday 188, Thursday 1.017, Friday 486, Saturday 744"
            >
              {DAYS.map((d) => (
                <div key={d.day} className={`cp-day cp-is-${d.kind}`}>
                  <span className="cp-day-reach">{d.reach}</span>
                  <div className="cp-day-bar" style={{ height: d.h }} />
                  <span className="cp-day-name">{d.day}</span>
                  <span className="cp-day-eng">{d.eng} eng</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="b360-panel cp-panel" aria-labelledby="db">
        <div className="b360-panel-head">
          <div>
            <h2 id="db">Content Database</h2>
            <p>Every post of the period with its full results.</p>
          </div>
          <label className="cp-search">
            <SearchIcon />
            <span className="sr-only">Search content</span>
            <input type="search" placeholder="Search content" />
          </label>
        </div>
        <div className="b360-card cp-table-card cp-db-card">
          <table className="cp-db">
            <thead>
              <tr>
                {DB_COLS.map(([label, align]) => (
                  <th key={label} scope="col" className={align === 'right' ? 'cp-is-num' : undefined}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {POSTS.map((p) => (
                <tr key={p.title}>
                  <td className="cp-is-muted">{p.date}</td>
                  <td className="cp-db-platform">
                    <span>
                      <span className={p.platform === 'TikTok' ? 'cp-pdot cp-is-tiktok' : 'cp-pdot'} aria-hidden="true" />
                      {p.platform}
                    </span>
                  </td>
                  <td className="cp-db-title">{p.title}</td>
                  <td className="cp-is-muted">{p.format}</td>
                  <td className="cp-is-num">{fmt(p.views)}</td>
                  <td className="cp-is-num">{p.reach ? fmt(p.reach) : '–'}</td>
                  <td className="cp-is-num cp-is-soft">{fmt(p.likes)}</td>
                  <td className="cp-is-num cp-is-soft">{fmt(p.comments)}</td>
                  <td className="cp-is-num cp-is-soft">{fmt(p.shares)}</td>
                  <td className="cp-is-num cp-is-soft">{fmt(p.saves)}</td>
                  <td className="cp-is-num cp-is-strong">{fmt(p.eng)}</td>
                  <td className="cp-is-num cp-is-strong cp-is-up">{pct(p.erNum)}</td>
                  <td className="cp-is-num cp-is-muted">{p.watch}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cp-db-foot">
            <span>Showing 10 of 44 posts</span>
            <button type="button">Load more</button>
          </div>
        </div>
      </section>

      <Footer>Beyond 360° Dashboard by Beyondcy · Synced from Meta and TikTok · Last sync 18 Nov 2026, 09:30 WIB</Footer>
    </div>
  );
}
