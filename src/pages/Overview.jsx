// 1 · Overview (update v5, file 01 §4): exactly as the mock (design-reference/Overview.dc.html),
// with its numbers and text. No real data yet; nothing on the page says so (owner's decision).
import { Footer } from '../layout/Shell.jsx';
import { PeriodBar } from '../layout/PeriodBar.jsx';
import { AdsResultDropdown } from '../ui/Dropdown.jsx';

const KPIS = [
  { label: 'Content published', value: '44', unit: 'posts', pct: '100%', target: 'Target 40', pctText: '110%', delta: '↑ 26,7%', kind: 'good' },
  { label: 'Views / impressions', value: '89.200', unit: '', pct: '59%', target: 'Target 150.000', pctText: '59%', delta: '↓ 87,1%', kind: 'bad' },
  { label: 'New followers', value: '274', unit: '', pct: '55%', target: 'Target 500', pctText: '55%', delta: '↓ 70,0%', kind: 'bad' },
  { label: 'Media spend', value: 'Rp30,2', unit: 'Mio', pct: '86%', target: 'Budget Rp35 Mio', pctText: '86% used', delta: '↑ 12,4%', kind: 'neutral' },
  { label: 'Results: leads', value: '13.420', unit: '', pct: '100%', target: 'Target 12.000', pctText: '112%', delta: '↑ 18,2%', kind: 'good' },
  { label: 'Cost per lead', value: 'Rp2.250', unit: '', pct: '90%', target: 'Benchmark Rp2.500', pctText: '10% under', delta: '↓ 6,3%', kind: 'good' },
];

const SUMMARY = [
  {
    title: 'Key highlights',
    kind: 'good',
    items: [
      ['Followers keep growing.', '3.232 in total, +274 net this month.'],
      ['Short videos win on reach.', 'Avg 935 reach and 1.092 views, 2,5× wider than carousels.'],
      ['Carousels win on engagement.', '7,14% avg ER vs 3,47% for video.'],
      ['Top post: “News: Rumah Singgah”.', '6.200 views, 4.900 reach, 110 engagements.'],
    ],
  },
  {
    title: 'Key challenges',
    kind: 'bad',
    items: [
      ['Sharp drop vs last month.', 'Views −87,3%, reach −85,0%, interactions −88,7%.'],
      ['TikTok is still slow.', '6 posts reached only 1.300 views and 62 engagements.'],
      ['Profile visits fell 79,8%.', '363 visits vs 1.800 last month.'],
    ],
  },
  {
    title: 'Next month focus',
    kind: 'brand',
    items: [
      ['Fix the hook.', 'Sharpen the first 3 seconds of short videos to win back reach.'],
      ['TikTok-native video.', 'Vertical, trending audio, no reposted statics.'],
      ['Prime time.', 'Key posts Thursday to Sunday, fewer on Monday.'],
      ['Stronger CTAs.', 'Ask people to visit the bio and save posts.'],
    ],
  },
  {
    title: 'What worked',
    kind: 'good',
    items: [
      ['Pop culture and public figures.', 'Rumah Singgah, Operasi Pesta Copet, Coki, Iqbaal.'],
      ['Thursday and weekends.', 'Thursday best for reach (avg 1.017), Saturday for interactions (avg 39).'],
      ['Interactive carousels.', 'Drove saves, comments and a high ER.'],
    ],
  },
  {
    title: 'What didn’t work',
    kind: 'bad',
    items: [
      ['Niche education pillar.', 'Film School 101 stayed under 100 views.'],
      ['Carousels reposted to TikTok.', 'Only dozens of views each.'],
      ['Monday posts.', 'Lowest results: avg 131 reach, 4 engagements.'],
    ],
  },
];

function Kpi({ k }) {
  return (
    <article className={`b360-card ov-kpi is-${k.kind}`}>
      <div className="b360-card-glow ov-kpi-glow" aria-hidden="true" />
      <div className="ov-kpi-top">
        <p className="ov-kpi-label">{k.label}</p>
        <span className="ov-kpi-delta">{k.delta}</span>
      </div>
      <div className="ov-kpi-mid">
        <p className="b360-big ov-kpi-value tnum">{k.value}</p>
        <span className="ov-kpi-unit">{k.unit}</span>
      </div>
      <div className="ov-kpi-foot">
        <div className="ov-bar" aria-hidden="true">
          <div style={{ width: k.pct }} />
        </div>
        <div className="ov-kpi-target">
          <span>{k.target}</span>
          <span>{k.pctText}</span>
        </div>
      </div>
    </article>
  );
}

export function Overview() {
  return (
    <>
      <PeriodBar />

      <section className="b360-panel" aria-labelledby="snap">
        <div className="b360-panel-head">
          <div>
            <h2 id="snap">Platform &amp; Account Overview</h2>
            <p>Headline numbers for the period across every platform.</p>
          </div>
          <AdsResultDropdown />
        </div>
        <div className="ov-grid">
          {KPIS.map((k) => (
            <Kpi key={k.label} k={k} />
          ))}
        </div>
      </section>

      <section className="b360-panel" aria-labelledby="exec">
        <div className="b360-panel-head">
          <div>
            <h2 id="exec">Executive Summary</h2>
            <p>Key takeaways for the month, written by your Beyondcy account team.</p>
          </div>
          <span className="ov-updated">
            <span className="ov-at" aria-hidden="true">
              AT
            </span>
            Updated 3 Nov 2026
          </span>
        </div>
        <div className="ov-grid">
          {SUMMARY.map((s) => (
            <article key={s.title} className={`b360-card ov-sum is-${s.kind}`}>
              <div className="b360-card-glow ov-sum-glow" aria-hidden="true" />
              <h3>
                <span className="ov-sum-dot" aria-hidden="true" />
                {s.title}
              </h3>
              <ol>
                {s.items.map(([head, body], i) => (
                  <li key={head}>
                    <span className="ov-sum-n">{String(i + 1).padStart(2, '0')}</span>
                    <p>
                      <strong>{head}</strong> {body}
                    </p>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <Footer>Beyond 360° Dashboard by Beyondcy · Synced from Meta and TikTok · Last sync 18 Nov 2026, 09:30 WIB</Footer>
    </>
  );
}
