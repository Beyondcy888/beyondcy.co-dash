// The Content Calendar's controls (update v5, file 02 §2 and §4): the month picker (top right)
// and the ‹ month › control share ONE month; the filters and the legend use the tracker's
// formats and statuses, with the tracker's names, icons and colours.
import { useCallback, useId, useRef, useState } from 'react';
import { monthName, shiftMonth } from '../lib/time.js';
import { IconCalendar, IconCheck, IconChevronDown, IconChevronLeft, IconChevronRight, TypeIcon } from '../ui/icons.jsx';
import { useDismiss } from '../ui/useDismiss.js';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const STATUSES = [
  { id: 'not_started', name: 'Not started' },
  { id: 'planned', name: 'Planned' },
  { id: 'done', name: 'Done' },
  { id: 'revision', name: 'Revision' },
  { id: 'uploaded', name: 'Uploaded' },
];
export const STATUS_NAME = Object.fromEntries(STATUSES.map((s) => [s.id, s.name]));
export const TYPE_NAME = { reels: 'Reels', feed: 'Feed' };

/** "November 2026" */
export function monthTitle(month) {
  return `${monthName(month)} ${month.slice(0, 4)}`;
}

/** The pill at the top right: a month picker (one year at a time). */
export function MonthPicker({ month, onChange, thisMonth }) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(Number(month.slice(0, 4)));
  const ref = useRef(null);
  const btnRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close, btnRef);

  const toggle = () => {
    setYear(Number(month.slice(0, 4)));
    setOpen((o) => !o);
  };
  const pick = (m) => {
    onChange(m);
    close();
    btnRef.current?.focus();
  };

  return (
    <div className="cal-mpick" ref={ref}>
      <button ref={btnRef} type="button" className="b360-pill" onClick={toggle} aria-expanded={open} aria-haspopup="dialog">
        <IconCalendar />
        {monthTitle(month)}
        <IconChevronDown />
      </button>
      {open && (
        <div className="b360-pop cal-mpick-pop" role="dialog" aria-label="Choose a month">
          <div className="cal-mpick-head">
            <button type="button" className="cal-round" onClick={() => setYear((y) => y - 1)} aria-label="Previous year">
              <IconChevronLeft />
            </button>
            <strong>{year}</strong>
            <button type="button" className="cal-round" onClick={() => setYear((y) => y + 1)} aria-label="Next year">
              <IconChevronRight />
            </button>
          </div>
          <div className="cal-mpick-grid">
            {MONTHS_SHORT.map((label, i) => {
              const m = `${year}-${String(i + 1).padStart(2, '0')}`;
              return (
                <button
                  key={m}
                  type="button"
                  className={`cal-mpick-m${m === month ? ' is-on' : ''}${m === thisMonth ? ' is-now' : ''}`}
                  aria-pressed={m === month}
                  onClick={() => pick(m)}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <button type="button" className="b360-apply" onClick={() => pick(thisMonth)}>
            This month
          </button>
        </div>
      )}
    </div>
  );
}

/** ‹ November 2026 › inside the calendar panel. */
export function MonthNav({ month, onChange }) {
  return (
    <div className="cal-mnav">
      <button type="button" className="cal-round" aria-label="Previous month" onClick={() => onChange(shiftMonth(month, -1))}>
        <IconChevronLeft />
      </button>
      <strong aria-live="polite">{monthTitle(month)}</strong>
      <button type="button" className="cal-round" aria-label="Next month" onClick={() => onChange(shiftMonth(month, 1))}>
        <IconChevronRight />
      </button>
    </div>
  );
}

/** A filter pill as in the mock: "All formats ⌄" → a list. options: [{ value, label }] ('' = all) */
export function FilterSelect({ name, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close, btnRef);
  const current = options.find((o) => o.value === value) ?? options[0];
  return (
    <div className="cal-filter" ref={ref}>
      <button
        ref={btnRef}
        type="button"
        className={`cal-filter-btn${value ? ' is-set' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${name}: ${current.label}`}
      >
        {current.label}
        <IconChevronDown size={12} strokeWidth={2.4} />
      </button>
      {open && (
        <div id={id} className="b360-pop is-list cal-filter-pop" role="listbox" aria-label={name}>
          {options.map((o) => (
            <button
              key={o.value || 'all'}
              type="button"
              role="option"
              aria-selected={o.value === value}
              className="b360-option"
              onClick={() => {
                onChange(o.value);
                close();
                btnRef.current?.focus();
              }}
            >
              <span className="cal-filter-opt">
                {o.icon}
                {o.label}
              </span>
              {o.value === value && <IconCheck />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Reels / Feed with the tracker's icons, then the tracker's statuses in its colours. */
export function Legend() {
  return (
    <div className="cal-legend" aria-label="Legend">
      {['reels', 'feed'].map((t) => (
        <span key={t} className="cal-legend-item">
          <TypeIcon type={t} size={11} />
          {TYPE_NAME[t]}
        </span>
      ))}
      <span className="cal-legend-sep" aria-hidden="true" />
      {STATUSES.map((s) => (
        <span key={s.id} className="cal-legend-item">
          <span className={`cal-swatch is-${s.id}`} aria-hidden="true" />
          {s.name}
        </span>
      ))}
    </div>
  );
}
