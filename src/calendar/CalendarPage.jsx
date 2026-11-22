// 2 · Content Calendar (update v5, file 02): the one page with REAL data, straight from the team
// tracker (all brands, read-only). The mock's layout, fonts and sizes (design-reference/
// Calendar.dc.html) with the tracker's statuses, names, icons and colours.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { brandList } from '../config/brands.js';
import { BRAND_ORDER } from '../config/brandStyle.js';
import { Footer } from '../layout/Shell.jsx';
import { DownloadPdf } from '../layout/PeriodBar.jsx';
import { groupStats } from '../lib/progress.js';
import { currentMonthWIB, isValidMonth, todayWIB } from '../lib/time.js';
import { TypeIcon } from '../ui/icons.jsx';
import { FilterSelect, Legend, MonthNav, MonthPicker, monthTitle, STATUSES } from './Controls.jsx';
import { Agenda, byDay, MonthGrid } from './MonthGrid.jsx';
import { DetailsSheet, PostDetails } from './PostDetails.jsx';
import { TargetStrip } from './TargetStrip.jsx';
import { useCalendarData } from './useCalendarData.js';

const PHONE = '(max-width: 640px)';
const NO_FILTERS = { platform: '', format: '', status: '', brand: '' };

/** Today in WIB ('YYYY-MM-DD'), updated each minute (a page left open past midnight). */
function useToday() {
  const [today, setToday] = useState(todayWIB);
  useEffect(() => {
    const timer = setInterval(() => setToday(todayWIB()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);
  return today;
}

function usePhone() {
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia(PHONE).matches);
  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const on = () => setPhone(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return phone;
}

/** "22 Nov 2026, 23:41 WIB" */
function syncLabel(ms) {
  if (!ms) return '–';
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(ms);
    const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
    return `${p.day} ${p.month} ${p.year}, ${p.hour}:${p.minute} WIB`;
  } catch {
    return new Date(ms).toISOString();
  }
}

const BRAND_RANK = Object.fromEntries(BRAND_ORDER.map((id, i) => [id, i]));

/** The order inside a day: by brand (the owner's order), then title. */
function sortItems(items) {
  return [...items].sort(
    (a, b) =>
      a.publish_date.localeCompare(b.publish_date) ||
      (BRAND_RANK[a.brand_id] ?? 99) - (BRAND_RANK[b.brand_id] ?? 99) ||
      (a.title ?? '').localeCompare(b.title ?? ''),
  );
}

/** Today's first item, else the next upcoming one in the month, else the month's first. */
function defaultItem(items, today) {
  return items.find((i) => i.publish_date === today) ?? items.find((i) => i.publish_date > today) ?? items[0] ?? null;
}

export function CalendarPage() {
  const [params, setParams] = useSearchParams();
  const thisMonth = currentMonthWIB();
  const asked = params.get('month');
  const month = asked && isValidMonth(asked) ? asked : thisMonth;
  const today = useToday();
  const phone = usePhone();
  const data = useCalendarData(month);
  const [filters, setFilters] = useState(NO_FILTERS);
  const [selectedId, setSelectedId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const setMonth = useCallback(
    (m) => {
      setSelectedId(null);
      setSheetOpen(false);
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (m === thisMonth) next.delete('month');
          else next.set('month', m);
          return next;
        },
        { replace: true },
      );
    },
    [setParams, thisMonth],
  );

  const items = useMemo(() => sortItems(data.items), [data.items]);
  const shownMonth = data.month ?? month;

  // the strip counts everything in the month (the same as the tracker's Admin Dashboard);
  // the filters only narrow the calendar
  const stats = useMemo(
    () => groupStats({ items, targetRows: data.targets, month: shownMonth, today }),
    [items, data.targets, shownMonth, today],
  );

  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          (!filters.platform || filters.platform === 'instagram') &&
          (!filters.format || i.type === filters.format) &&
          (!filters.status || i.status === filters.status) &&
          (!filters.brand || i.brand_id === filters.brand),
      ),
    [items, filters],
  );
  const days = useMemo(() => byDay(filtered), [filtered]);
  const selected = filtered.find((i) => i.id === selectedId) ?? (phone ? null : defaultItem(filtered, today));

  const pick = useCallback(
    (item) => {
      setSelectedId(item.id);
      if (phone) setSheetOpen(true);
    },
    [phone],
  );
  const set = (key) => (value) => setFilters((f) => ({ ...f, [key]: value }));

  const brands = brandList(items);
  const emptyText = filtered.length ? null : items.length ? 'Nothing matches these filters.' : 'No content planned for this month yet.';
  const sheetItem = phone && sheetOpen ? filtered.find((i) => i.id === selectedId) : null;

  return (
    <>
      <div className="b360-period">
        <p className="b360-period-text">
          Showing <strong>{monthTitle(month)}</strong> · synced live from the Beyondcy team tracker
        </p>
        <div className="b360-period-tools">
          <MonthPicker month={month} onChange={setMonth} thisMonth={thisMonth} />
          <DownloadPdf />
        </div>
      </div>

      <section className="b360-panel cal-panel" aria-labelledby="cal">
        <div className="b360-panel-head">
          <div>
            <h2 id="cal">Content Calendar</h2>
            <p>Everything planned and posted this month. Click a post to see its details.</p>
          </div>
          <MonthNav month={month} onChange={setMonth} />
        </div>

        {data.status === 'error' && (
          <div className="cal-error" role="alert">
            <p>{data.error}</p>
            <button type="button" className="btn btn-primary" onClick={data.reload}>
              Try again
            </button>
          </div>
        )}

        {data.status === 'loading' && <CalendarSkeleton />}

        {data.status === 'ready' && (
          <div className={`cal-body${data.stale ? ' is-stale' : ''}`} aria-busy={data.stale}>
            <TargetStrip stats={stats} month={shownMonth} today={today} />

            <div className="cal-tools">
              <div className="cal-filters">
                <FilterSelect
                  name="Platform"
                  value={filters.platform}
                  onChange={set('platform')}
                  options={[
                    { value: '', label: 'All platforms' },
                    { value: 'instagram', label: 'Instagram' },
                  ]}
                />
                <FilterSelect
                  name="Format"
                  value={filters.format}
                  onChange={set('format')}
                  options={[
                    { value: '', label: 'All formats' },
                    { value: 'reels', label: 'Reels', icon: <TypeIcon type="reels" size={10} /> },
                    { value: 'feed', label: 'Feed', icon: <TypeIcon type="feed" size={10} /> },
                  ]}
                />
                <FilterSelect
                  name="Status"
                  value={filters.status}
                  onChange={set('status')}
                  options={[
                    { value: '', label: 'All statuses' },
                    ...STATUSES.map((s) => ({ value: s.id, label: s.name, icon: <span className={`cal-swatch is-${s.id}`} aria-hidden="true" /> })),
                  ]}
                />
                <FilterSelect
                  name="Brand"
                  value={filters.brand}
                  onChange={set('brand')}
                  options={[{ value: '', label: 'All brands' }, ...brands.map((b) => ({ value: b.id, label: b.name }))]}
                />
              </div>
              <Legend />
            </div>

            <div className="cal-main">
              <Agenda today={today} days={days} selectedId={selected?.id} onPick={pick} empty={emptyText} />
              <MonthGrid month={shownMonth} today={today} days={days} selectedId={selected?.id} onPick={pick} empty={emptyText} />
              <PostDetails item={selected} people={data.people} />
            </div>
          </div>
        )}
      </section>

      <Footer>Beyond 360° Dashboard by Beyondcy · Calendar data from the Beyondcy team tracker · Last sync {syncLabel(data.syncedAt)}</Footer>

      {sheetItem && <DetailsSheet item={sheetItem} people={data.people} onClose={() => setSheetOpen(false)} />}
    </>
  );
}

function CalendarSkeleton() {
  return (
    <div className="cal-sk" role="status" aria-label="Loading the calendar">
      <span className="sk cal-sk-strip" />
      <span className="sk cal-sk-tools" />
      <div className="cal-sk-main">
        <span className="sk cal-sk-grid" />
        <span className="sk cal-sk-side" />
      </div>
    </div>
  );
}
