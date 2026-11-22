// "Showing 1 – 31 Oct 2026 · compared with the previous period", the date-period picker and
// "Download PDF" (update v5, file 01 §4). As in the mock: the picker opens, presets and a custom
// range can be chosen, and the label follows; the numbers don't change yet (sample pages).
import { useCallback, useRef, useState } from 'react';
import { IconCalendar, IconChevronDown, IconDownload } from '../ui/icons.jsx';
import { useDismiss } from '../ui/useDismiss.js';

const PRESETS = [
  { id: 'this', label: 'This month', hint: '1 – 18 Nov', range: '1 – 18 Nov 2026' },
  { id: 'last', label: 'Last month', hint: 'Oct 2026', range: '1 – 31 Oct 2026' },
  { id: 'q', label: 'Last 3 months', hint: 'Aug – Oct', range: '1 Aug – 31 Oct 2026' },
  { id: 'ytd', label: 'Year to date', hint: 'Jan – Nov', range: '1 Jan – 18 Nov 2026' },
  { id: 'custom', label: 'Custom range', hint: 'Pick dates', range: 'Custom range' },
];
const HEADS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
// the mock's custom-range calendar: October 2026 (starts on a Thursday)
const MONTH = { name: 'October 2026', lead: 4, days: 31, short: 'Oct' };

/** Download PDF: the look from the mock (no export yet). */
export function DownloadPdf() {
  return (
    <a href="#download-pdf" className="b360-pill is-pdf" onClick={(e) => e.preventDefault()}>
      <IconDownload />
      Download PDF
    </a>
  );
}

export function PeriodBar({ note = 'compared with the previous period' }) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState('last');
  const [rs, setRs] = useState(6);
  const [re, setRe] = useState(20);
  const ref = useRef(null);
  const btnRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close, btnRef);

  const isCustom = preset === 'custom';
  const current = PRESETS.find((p) => p.id === preset) ?? PRESETS[1];
  const label = isCustom ? (re != null ? `${rs} – ${re} ${MONTH.short} 2026` : 'Custom range') : current.range;

  const pick = (d) => {
    if (re != null) {
      setRs(d);
      setRe(null);
    } else if (d < rs) {
      setRe(rs);
      setRs(d);
    } else setRe(d);
  };

  return (
    <div className="b360-period">
      <p className="b360-period-text">
        Showing <strong>{label}</strong> · {note}
      </p>
      <div className="b360-period-tools" ref={ref}>
        <button
          ref={btnRef}
          type="button"
          className="b360-pill"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <IconCalendar />
          {label}
          <IconChevronDown />
        </button>
        <DownloadPdf />
        {open && (
          <div className="b360-pop is-dates" role="dialog" aria-label="Choose date period">
            {PRESETS.map((p) => (
              <button key={p.id} type="button" className="b360-preset" aria-pressed={p.id === preset} onClick={() => setPreset(p.id)}>
                <span>{p.label}</span>
                <span className="b360-preset-hint">{p.hint}</span>
              </button>
            ))}
            {isCustom && (
              <div className="b360-range">
                <div className="b360-range-head">
                  <span>{MONTH.name}</span>
                  <span>{re != null ? `${rs} – ${re} ${MONTH.short}` : 'Pick an end date'}</span>
                </div>
                <div className="b360-range-grid">
                  {HEADS.map((h, i) => (
                    <span key={i}>{h}</span>
                  ))}
                  {Array.from({ length: MONTH.lead }, (_, i) => (
                    <span key={`b${i}`} aria-hidden="true" />
                  ))}
                  {Array.from({ length: MONTH.days }, (_, i) => {
                    const d = i + 1;
                    const edge = d === rs || d === re;
                    const inside = re != null && d > rs && d < re;
                    return (
                      <button key={d} type="button" className={edge ? 'is-edge' : inside ? 'is-in' : ''} onClick={() => pick(d)}>
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <button type="button" className="b360-apply" onClick={close}>
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
