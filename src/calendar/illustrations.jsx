// The tracker's four summary-box illustrations (beyondcy.co-track src/track/illustrations.jsx),
// copied here for the Content Calendar's target strip (update v5, file 02 §3). Same artwork;
// the colours go through CSS variables (--il-*, calendar.css) so they sit naturally on the
// dashboard's dark and light themes. Decorative (aria-hidden); the text carries the meaning.
import { useId } from 'react';

const v = (name) => `var(--il-${name})`;
const paint = (fill, stroke) => ({ style: { fill: fill ?? 'none', ...(stroke ? { stroke } : {}) } });
const svgProps = { viewBox: '0 0 128 128', fill: 'none', 'aria-hidden': true, focusable: 'false' };

/** Total target: a stack of content cards (a Reel in front, a Feed post behind). */
export function IllusCards() {
  const g = useId().replace(/:/g, '');
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id={`${g}f`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: v('card-a') }} />
          <stop offset="1" style={{ stopColor: v('card-b') }} />
        </linearGradient>
      </defs>
      <rect x="46" y="10" width="62" height="84" rx="10" {...paint(v('raised'), v('line'))} />
      <rect x="32" y="20" width="62" height="84" rx="10" {...paint(v('hi'), v('line-hi'))} />
      <g transform="translate(42 28)" style={{ fill: v('feed') }}>
        <rect width="9" height="9" rx="2" opacity="0.7" />
        <rect x="11" width="9" height="9" rx="2" opacity="0.45" />
        <rect y="11" width="9" height="9" rx="2" opacity="0.45" />
        <rect x="11" y="11" width="9" height="9" rx="2" opacity="0.7" />
      </g>
      <rect x="16" y="32" width="62" height="86" rx="10" style={{ fill: `url(#${g}f)`, stroke: v('edge') }} />
      <rect x="24" y="40" width="46" height="34" rx="6" {...paint(v('panel'))} />
      <path d="M43 50v14l12-7z" strokeWidth="2" strokeLinejoin="round" {...paint(v('reels'), v('reels'))} />
      <rect x="24" y="82" width="38" height="4" rx="2" {...paint(v('text-line'))} />
      <rect x="24" y="91" width="28" height="4" rx="2" {...paint(v('dim'))} />
      <rect x="24" y="100" width="34" height="4" rx="2" {...paint(v('dim'))} />
    </svg>
  );
}

/** Uploaded: a phone with a play button and a feed grid. */
export function IllusPhone() {
  const g = useId().replace(/:/g, '');
  const grid = [0.65, 0.22, 0.45, 0.22, 0.55, 0.3];
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id={`${g}p`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: v('phone-a') }} />
          <stop offset="1" style={{ stopColor: v('phone-b') }} />
        </linearGradient>
      </defs>
      <rect x="32" y="6" width="64" height="118" rx="15" style={{ fill: `url(#${g}p)`, stroke: v('edge') }} />
      <rect x="38" y="16" width="52" height="100" rx="9" {...paint(v('screen'))} />
      <rect x="57" y="10" width="14" height="3" rx="1.5" {...paint(v('line'))} />
      <rect x="42" y="21" width="44" height="34" rx="6" {...paint(v('raised'))} />
      <circle cx="64" cy="38" r="10" {...paint(v('reels'))} />
      <path d="M61 33.5v9l7.5-4.5z" {...paint(v('on-accent'))} />
      {grid.map((o, i) => (
        <rect
          key={i}
          x={42 + (i % 3) * 15}
          y={61 + Math.floor(i / 3) * 15}
          width="13"
          height="13"
          rx="3"
          opacity={o > 0.25 ? o : 1}
          {...paint(o > 0.25 ? v('feed') : v('hi'))}
        />
      ))}
      <rect x="42" y="95" width="30" height="4" rx="2" {...paint(v('dim'))} />
      <rect x="42" y="104" width="20" height="4" rx="2" {...paint(v('hi'))} />
    </svg>
  );
}

/** Remaining: an hourglass running in the brand green. */
export function IllusHourglass() {
  const g = useId().replace(/:/g, '');
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id={`${g}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: v('cap-a') }} />
          <stop offset="1" style={{ stopColor: v('cap-b') }} />
        </linearGradient>
      </defs>
      <rect x="35" y="20" width="4" height="90" rx="2" {...paint(v('hi'))} />
      <rect x="89" y="20" width="4" height="90" rx="2" {...paint(v('hi'))} />
      <path
        d="M42 20h44c0 21-15 30-19 44 4 14 19 23 19 44H42c0-21 15-30 19-44-4-14-19-23-19-44z"
        strokeWidth="1.5"
        {...paint(v('glass'), v('dim'))}
      />
      <path d="M49 36h30c-3 8-10 13-15 19-5-6-12-11-15-19z" opacity="0.9" {...paint(v('green'))} />
      <path d="M64 62v30" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 4" {...paint(null, v('green'))} />
      <path d="M46 108c4-9 10-14 18-15 8 1 14 6 18 15z" {...paint(v('green'))} />
      <rect x="28" y="10" width="72" height="11" rx="5.5" style={{ fill: `url(#${g}c)`, stroke: v('edge') }} />
      <rect x="28" y="107" width="72" height="11" rx="5.5" style={{ fill: `url(#${g}c)`, stroke: v('edge') }} />
    </svg>
  );
}

/**
 * Achievement: a real half-gauge drawn from the actual percentage (0–100% across the arc;
 * above 100% the arc is full and a small notch marks the overshoot).
 */
export function Gauge({ value }) {
  const cx = 64;
  const cy = 84;
  const r = 46;
  const pct = value == null ? 0 : Math.min(Math.max(value, 0), 100) / 100;
  const angle = Math.PI * (1 - pct);
  const end = [cx + r * Math.cos(angle), cy - r * Math.sin(angle)];
  const needle = [cx + (r - 15) * Math.cos(angle), cy - (r - 15) * Math.sin(angle)];
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((p) => {
    const a = Math.PI * (1 - p);
    return [cx + (r + 9) * Math.cos(a), cy - (r + 9) * Math.sin(a), cx + (r + 4) * Math.cos(a), cy - (r + 4) * Math.sin(a)];
  });
  return (
    <svg {...svgProps}>
      <path d={`M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}`} strokeWidth="13" strokeLinecap="round" {...paint(null, v('hi'))} />
      {pct > 0 && (
        <path
          d={`M${cx - r} ${cy}A${r} ${r} 0 0 1 ${end[0].toFixed(2)} ${end[1].toFixed(2)}`}
          strokeWidth="13"
          strokeLinecap="round"
          {...paint(null, v('green'))}
        />
      )}
      {ticks.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2" strokeLinecap="round" {...paint(null, v('dim'))} />
      ))}
      {value != null && value > 100 && <circle cx={cx + r} cy={cy - 13} r="3.5" {...paint(v('green'))} />}
      <line x1={cx} y1={cy} x2={needle[0]} y2={needle[1]} strokeWidth="3" strokeLinecap="round" {...paint(null, v('needle'))} />
      <circle cx={cx} cy={cy} r="7" strokeWidth="2" {...paint(v('raised'), v('needle'))} />
    </svg>
  );
}
