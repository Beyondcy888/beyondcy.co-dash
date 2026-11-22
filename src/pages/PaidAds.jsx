// 5 · Paid Ads: exactly as the mock (design-reference/PaidAds.dc.html), with its numbers and text.
// No real data yet; nothing on the page says so (owner's decision).
import { Footer } from '../layout/Shell.jsx';
import { PeriodBar } from '../layout/PeriodBar.jsx';
import { AdsResultDropdown } from '../ui/Dropdown.jsx';

const KPIS = [
  { label: 'Media spend', value: 'Rp30,2', unit: 'Mio', delta: '↑ 12,4%', kind: 'neutral' },
  { label: 'Impressions', value: '1,84', unit: 'Mio', delta: '↑ 9,8%', kind: 'good' },
  { label: 'Clicks', value: '21.350', unit: '', delta: '↑ 15,1%', kind: 'good' },
  { label: 'CTR', value: '1,16%', unit: '', delta: '↑ 0,05 pt', kind: 'good' },
  { label: 'Results: leads', value: '13.420', unit: '', delta: '↑ 18,2%', kind: 'good' },
  { label: 'Cost per lead', value: 'Rp2.250', unit: '', delta: '↓ 6,3%', kind: 'good' },
];

const PLAT_COLS = [
  ['Platform', 'left'],
  ['Spend', 'right'],
  ['Impressions', 'right'],
  ['Clicks', 'right'],
  ['CTR', 'right'],
  ['Leads', 'right'],
  ['Cost / lead', 'right'],
];

const PLAT_ROWS = [
  { name: 'Meta (FB + IG)', dot: 'meta', spend: 'Rp24,6 Mio', impr: '1.420.000', clicks: '17.040', ctr: '1,20%', results: '11.180', cpr: 'Rp2.200' },
  { name: 'TikTok', dot: 'tiktok', spend: 'Rp5,6 Mio', impr: '420.000', clicks: '4.310', ctr: '1,03%', results: '2.240', cpr: 'Rp2.500' },
  { name: 'Total', dot: 'none', spend: 'Rp30,2 Mio', impr: '1.840.000', clicks: '21.350', ctr: '1,16%', results: '13.420', cpr: 'Rp2.250', total: true },
];

const EFF = [
  { label: 'Spend vs budget', verdict: 'On track', w: '86%', detail: 'Rp30,2 Mio of Rp35 Mio budget · 86% used' },
  { label: 'Leads vs target', verdict: '112%', w: '100%', detail: '13.420 leads vs 12.000 target' },
  { label: 'Cost per lead vs benchmark', verdict: '10% better', w: '90%', detail: 'Rp2.250 vs Rp2.500 benchmark' },
];

// weekly spend (Rp Mio) and leads; the bar height is spend / peak × 76px, the peak week glows
const PEAK = 8.1;
const WEEKS = [
  ['W1', 6.8, '2.950'],
  ['W2', 7.4, '3.280'],
  ['W3', 8.1, '3.720'],
  ['W4', 7.9, '3.470'],
].map(([label, v, results]) => ({
  label,
  results,
  spend: 'Rp' + String(v).replace('.', ','),
  h: Math.round((v / PEAK) * 76) + 'px',
  peak: v === PEAK,
}));

const CAMPAIGNS = [
  { name: 'Screening registration · Leads', platform: 'Meta Ads', budget: 'Rp400rb / day', status: 'Active', spend: 'Rp11,2 Mio', results: '5.360', cpr: 'Rp2.090', ends: 'ends 30 Nov' },
  { name: 'Film lovers lookalike · Leads', platform: 'Meta Ads', budget: 'Rp300rb / day', status: 'Active', spend: 'Rp8,4 Mio', results: '3.650', cpr: 'Rp2.301', ends: 'ends 30 Nov' },
  { name: 'Retargeting website visitors', platform: 'Meta Ads', budget: 'Rp250rb / day', status: 'Paused', spend: 'Rp5,0 Mio', results: '2.170', cpr: 'Rp2.304', ends: 'paused 25 Oct' },
  { name: 'Spark Ads · screening teaser', platform: 'TikTok Ads', budget: 'Rp200rb / day', status: 'Active', spend: 'Rp5,6 Mio', results: '2.240', cpr: 'Rp2.500', ends: 'ends 30 Nov' },
];

const DB_COLS = [
  ['Dates', 'left'],
  ['Platform', 'left'],
  ['Campaign', 'left'],
  ['Objective', 'left'],
  ['Spend', 'right'],
  ['Impressions', 'right'],
  ['Reach', 'right'],
  ['Clicks', 'right'],
  ['Leads', 'right'],
  ['CPM', 'right'],
  ['CPC', 'right'],
  ['CTR', 'right'],
  ['Cost / lead', 'right'],
];

const DB_ROWS = [
  { dates: '1 – 31 Oct', platform: 'Meta Ads', name: 'Screening registration · Leads', objective: 'Leads', spend: 'Rp11,2 Mio', impr: '620.000', reach: '248.000', clicks: '7.700', results: '5.360', cpm: 'Rp18.065', cpc: 'Rp1.455', ctr: '1,24%', cpr: 'Rp2.090' },
  { dates: '5 – 31 Oct', platform: 'Meta Ads', name: 'Film lovers lookalike · Leads', objective: 'Leads', spend: 'Rp8,4 Mio', impr: '480.000', reach: '176.000', clicks: '5.540', results: '3.650', cpm: 'Rp17.500', cpc: 'Rp1.516', ctr: '1,15%', cpr: 'Rp2.301' },
  { dates: '1 – 25 Oct', platform: 'Meta Ads', name: 'Retargeting website visitors', objective: 'Leads', spend: 'Rp5,0 Mio', impr: '320.000', reach: '92.000', clicks: '3.800', results: '2.170', cpm: 'Rp15.625', cpc: 'Rp1.316', ctr: '1,19%', cpr: 'Rp2.304' },
  { dates: '3 – 31 Oct', platform: 'TikTok Ads', name: 'Spark Ads · screening teaser', objective: 'Leads', spend: 'Rp5,6 Mio', impr: '420.000', reach: '96.400', clicks: '4.310', results: '2.240', cpm: 'Rp13.333', cpc: 'Rp1.299', ctr: '1,03%', cpr: 'Rp2.500' },
  { dates: 'Oct 2026', platform: 'Total', name: '4 campaigns', objective: '–', spend: 'Rp30,2 Mio', impr: '1.840.000', reach: '612.400', clicks: '21.350', results: '13.420', cpm: 'Rp16.413', cpc: 'Rp1.415', ctr: '1,16%', cpr: 'Rp2.250', total: true },
];

function Kpi({ k }) {
  return (
    <article className={`b360-card pa-kpi pa-${k.kind}`}>
      <div className="b360-card-glow pa-kpi-glow" aria-hidden="true" />
      <div className="pa-kpi-top">
        <p className="pa-kpi-label">{k.label}</p>
        <span className="pa-kpi-delta">{k.delta}</span>
      </div>
      <div className="pa-kpi-mid">
        <p className="b360-big pa-kpi-value tnum">{k.value}</p>
        <span className="pa-kpi-unit">{k.unit}</span>
      </div>
    </article>
  );
}

function PlatformCard() {
  return (
    <article className="pa-card pa-plat">
      <h3>Spend and results by platform</h3>
      <div className="pa-scroll">
        <table className="pa-table pa-plat-table">
          <thead>
            <tr>
              {PLAT_COLS.map(([label, align]) => (
                <th key={label} scope="col" className={`pa-is-${align}`}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PLAT_ROWS.map((r) => (
              <tr key={r.name} className={r.total ? 'pa-is-total' : undefined}>
                <th scope="row">
                  <span className="pa-plat-name">
                    <span className={`pa-dot pa-is-${r.dot}`} aria-hidden="true" />
                    {r.name}
                  </span>
                </th>
                <td>{r.spend}</td>
                <td>{r.impr}</td>
                <td>{r.clicks}</td>
                <td>{r.ctr}</td>
                <td>{r.results}</td>
                <td className="pa-is-cpr">{r.cpr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pa-share">
        <p className="pa-mini-head">Spend share</p>
        <div className="pa-share-bar" role="img" aria-label="Spend share: Meta 81,5%, TikTok 18,5%">
          <div className="pa-is-meta" style={{ width: '81.5%' }} />
          <div className="pa-is-tiktok" />
        </div>
        <div className="pa-share-legend">
          <span>Meta · 81,5%</span>
          <span>TikTok · 18,5%</span>
        </div>
      </div>
    </article>
  );
}

function EfficiencyCard() {
  return (
    <article className="pa-card pa-eff">
      <h3>Efficiency vs target</h3>
      {EFF.map((e) => (
        <div key={e.label} className="pa-eff-item">
          <div className="pa-eff-top">
            <span>{e.label}</span>
            <span className="pa-eff-verdict">{e.verdict}</span>
          </div>
          <div className="pa-track" aria-hidden="true">
            <div style={{ width: e.w }} />
          </div>
          <span className="pa-eff-detail">{e.detail}</span>
        </div>
      ))}
      <div className="pa-weekly">
        <p className="pa-mini-head">Weekly spend · leads</p>
        <div
          className="pa-weeks"
          role="img"
          aria-label="Weekly spend: week 1 Rp6,8 Mio, week 2 Rp7,4 Mio, week 3 Rp8,1 Mio, week 4 Rp7,9 Mio"
        >
          {WEEKS.map((wk) => (
            <div key={wk.label} className="pa-week">
              <strong>{wk.spend}</strong>
              <div className={`pa-week-bar${wk.peak ? ' pa-is-peak' : ''}`} style={{ height: wk.h }} />
              <span>
                {wk.label} · {wk.results}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function Campaign({ cp, i }) {
  return (
    <article className="pa-card pa-camp">
      <div className={`pa-thumb pa-is-${i + 1}`} aria-hidden="true">
        <div className="pa-thumb-shade" />
        <span className={`pa-chip pa-is-status pa-is-${cp.status.toLowerCase()}`}>
          <span className="pa-chip-dot" />
          {cp.status}
        </span>
        <span className="pa-chip pa-is-platform">{cp.platform}</span>
      </div>
      <div className="pa-camp-text">
        <h3>{cp.name}</h3>
        <p>
          {cp.budget} · {cp.ends}
        </p>
      </div>
      <dl className="pa-camp-stats">
        <div>
          <dt>Spend</dt>
          <dd>{cp.spend}</dd>
        </div>
        <div>
          <dt>Leads</dt>
          <dd>{cp.results}</dd>
        </div>
        <div>
          <dt>Cost / lead</dt>
          <dd className="pa-is-cpr">{cp.cpr}</dd>
        </div>
      </dl>
    </article>
  );
}

export function PaidAds() {
  return (
    <div className="pa-page">
      <PeriodBar />

      <section className="b360-panel pa-panel" aria-labelledby="ads">
        <div className="b360-panel-head">
          <div>
            <h2 id="ads">Paid Ads Performance</h2>
            <p>Spend, results and efficiency across Meta (Facebook and Instagram) and TikTok Ads.</p>
          </div>
          <AdsResultDropdown />
        </div>
        <div className="pa-kpis">
          {KPIS.map((k) => (
            <Kpi key={k.label} k={k} />
          ))}
        </div>
        <div className="pa-row">
          <PlatformCard />
          <EfficiencyCard />
        </div>
      </section>

      <section className="b360-panel pa-panel" aria-labelledby="run">
        <div className="b360-panel-head">
          <div>
            <h2 id="run">Campaigns Running Now</h2>
            <p>Live status from Ads Manager, updated every hour.</p>
          </div>
        </div>
        <div className="pa-camps">
          {CAMPAIGNS.map((cp, i) => (
            <Campaign key={cp.name} cp={cp} i={i} />
          ))}
        </div>
      </section>

      <section className="b360-panel pa-panel" aria-labelledby="adb">
        <div className="b360-panel-head">
          <div>
            <h2 id="adb">Paid Ads Database</h2>
            <p>One row per campaign, with every metric from Meta and TikTok Ads Manager.</p>
          </div>
        </div>
        <div className="pa-card pa-db">
          <table className="pa-table pa-db-table">
            <thead>
              <tr>
                {DB_COLS.map(([label, align]) => (
                  <th key={label} scope="col" className={`pa-is-${align}`}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DB_ROWS.map((r) => (
                <tr key={r.name} className={r.total ? 'pa-is-total' : undefined}>
                  <td className="pa-is-muted">{r.dates}</td>
                  <td className="pa-is-nowrap">{r.platform}</td>
                  <td className="pa-is-name">{r.name}</td>
                  <td className="pa-is-muted">{r.objective}</td>
                  <td className="pa-is-num">{r.spend}</td>
                  <td className="pa-is-num">{r.impr}</td>
                  <td className="pa-is-num">{r.reach}</td>
                  <td className="pa-is-num">{r.clicks}</td>
                  <td className="pa-is-num">{r.results}</td>
                  <td className="pa-is-num pa-is-soft">{r.cpm}</td>
                  <td className="pa-is-num pa-is-soft">{r.cpc}</td>
                  <td className="pa-is-num pa-is-soft">{r.ctr}</td>
                  <td className="pa-is-num pa-is-cpr">{r.cpr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Footer>
        Beyond 360° Dashboard by Beyondcy · Synced from Meta Ads Manager and TikTok Ads Manager · Last sync 18 Nov 2026, 09:30 WIB
      </Footer>
    </div>
  );
}
