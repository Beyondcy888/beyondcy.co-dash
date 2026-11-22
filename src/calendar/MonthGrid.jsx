// The month grid (desktop) and the day-by-day list (phone), update v5 file 02 §5 and §7.
// Sunday first. Chips: the type icon, then "Brand · Title" (full text in the tooltip); the chip's
// border and tint follow the tracker's status colour (Revision: the tracker's dark-blue outline).
// Read-only: clicking a chip only selects it.
import { useCallback, useRef, useState } from 'react';
import { brandShortName } from '../config/brands.js';
import { calendarWeeks, CAL_WEEKDAYS, formatLongDate, sundayIndex } from '../lib/time.js';
import { TypeIcon } from '../ui/icons.jsx';
import { useDismiss } from '../ui/useDismiss.js';
import { STATUS_NAME, TYPE_NAME } from './Controls.jsx';

const MAX_CHIPS = 3;

function chipText(item) {
  return `${brandShortName(item.brand_id, item.brand_name)} · ${item.title || 'Untitled'}`;
}

export function Chip({ item, selected, onPick, wide = false }) {
  const tip = `${TYPE_NAME[item.type] ?? 'No type'} · ${item.brand_name ?? ''} · ${item.title || 'Untitled'} · ${STATUS_NAME[item.status] ?? ''}`;
  return (
    <button
      type="button"
      className={`cal-chip is-${item.status}${wide ? ' is-wide' : ''}`}
      aria-pressed={selected}
      title={tip}
      aria-label={tip}
      onClick={() => onPick(item)}
    >
      {item.type ? <TypeIcon type={item.type} size={10} /> : <span className="cal-chip-none" aria-hidden="true" />}
      <span className="cal-chip-text">{chipText(item)}</span>
    </button>
  );
}

function MoreButton({ date, items, selectedId, onPick }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close, btnRef);
  return (
    <div className="cal-more" ref={ref}>
      <button ref={btnRef} type="button" className="cal-more-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="dialog">
        +{items.length - MAX_CHIPS} more
      </button>
      {open && (
        <div className="b360-pop cal-more-pop" role="dialog" aria-label={`Everything on ${date}`}>
          <p className="cal-more-title">{Number(date.slice(8))}</p>
          {items.map((it) => (
            <Chip
              key={it.id}
              item={it}
              wide
              selected={it.id === selectedId}
              onPick={(x) => {
                onPick(x);
                close();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Items grouped by publish date: { 'YYYY-MM-DD': [item…] } (already sorted). */
export function byDay(items) {
  const map = {};
  for (const it of items) (map[it.publish_date] ??= []).push(it);
  return map;
}

export function MonthGrid({ month, today, days, selectedId, onPick, empty }) {
  const weeks = calendarWeeks(month);
  return (
    <div className="cal-grid-wrap b360-desk">
      <div className="cal-grid">
        <div className="cal-row cal-head" aria-hidden="true">
          {CAL_WEEKDAYS.map((d, i) => (
            <div key={d} className={`cal-wd${i === 0 ? ' is-sun' : ''}`}>
              {d}
            </div>
          ))}
        </div>
        {weeks.map((week, w) => (
          <div key={week[0].date} className="cal-row">
            {week.map((cell, i) => {
              const items = cell.inMonth ? days[cell.date] ?? [] : [];
              const isToday = cell.date === today;
              return (
                <div
                  key={cell.date}
                  className={`cal-cell${cell.inMonth ? '' : ' is-out'}${i === 6 ? ' is-last-col' : ''}${w === weeks.length - 1 ? ' is-last-row' : ''}`}
                >
                  <span className={`cal-num${isToday ? ' is-today' : ''}`} aria-label={`${formatLongDate(cell.date)}${isToday ? ', today' : ''}`}>
                    {Number(cell.date.slice(8))}
                  </span>
                  {items.slice(0, MAX_CHIPS).map((it) => (
                    <Chip key={it.id} item={it} selected={it.id === selectedId} onPick={onPick} />
                  ))}
                  {items.length > MAX_CHIPS && <MoreButton date={cell.date} items={items} selectedId={selectedId} onPick={onPick} />}
                </div>
              );
            })}
          </div>
        ))}
        {empty && (
          <div className="cal-empty" role="status">
            <p>{empty}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Phone: only the days that have posts, one card per day. */
export function Agenda({ today, days, selectedId, onPick, empty }) {
  const dates = Object.keys(days).sort();
  if (empty || !dates.length) {
    return (
      <div className="cal-agenda b360-mob">
        <p className="cal-agenda-empty" role="status">
          {empty || 'No content planned for this month yet.'}
        </p>
      </div>
    );
  }
  return (
    <div className="cal-agenda b360-mob">
      {dates.map((date) => {
        const dow = CAL_WEEKDAYS[sundayIndex(date)];
        return (
          <div key={date} className="cal-day">
            <div className="cal-day-date">
              <div className={`cal-day-dow${sundayIndex(date) === 0 ? ' is-sun' : ''}`}>{dow}</div>
              <div className={`cal-num is-lg${date === today ? ' is-today' : ''}`}>{Number(date.slice(8))}</div>
            </div>
            <div className="cal-day-items">
              {days[date].map((it) => (
                <Chip key={it.id} item={it} wide selected={it.id === selectedId} onPick={onPick} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
