// Post details (update v5, file 02 §6): a placeholder in the brand's colour with its logo (the
// tracker has no post images; Notes pictures are internal), the type badge, the status in the
// tracker's wording and colour, title, date only, Instagram, PIC (photo + name), the full caption,
// and "View post ↗" for Uploaded items. On a phone it opens as a bottom sheet (§7).
import { useEffect, useRef } from 'react';
import { brandStyle } from '../config/brandStyle.js';
import { CAL_WEEKDAYS, formatDate, sundayIndex } from '../lib/time.js';
import { Avatar } from '../ui/Avatar.jsx';
import { IconExternal, IconX, TypeIcon } from '../ui/icons.jsx';
import { STATUS_NAME, TYPE_NAME } from './Controls.jsx';

const BASE = import.meta.env.BASE_URL;

/** "Wed, 18 Nov 2026" */
function dayLabel(iso) {
  return `${CAL_WEEKDAYS[sundayIndex(iso)]}, ${formatDate(iso)}`;
}

function Thumb({ item }) {
  const style = brandStyle(item.brand_id);
  return (
    <div className="cal-thumb" style={{ '--brand': style.color, '--brand-glow': style.glow }} aria-hidden="true">
      {style.logo ? (
        <img className="cal-thumb-logo" src={`${BASE}${style.logo}`} alt="" decoding="async" style={{ '--ratio': style.ratio }} />
      ) : (
        <span className="cal-thumb-initial">{(item.brand_name ?? '?').charAt(0)}</span>
      )}
      <span className="cal-thumb-shade" />
      {item.type && (
        <span className="cal-badge">
          <TypeIcon type={item.type} size={10} />
          {TYPE_NAME[item.type]}
        </span>
      )}
    </div>
  );
}

export function DetailsBody({ item, people, titleId }) {
  const pic = item.pic_id ? people.byId[item.pic_id] : null;
  const picName = pic?.display_name ?? item.pic_name ?? null;
  const link = item.status === 'uploaded' ? (item.links ?? []).find(Boolean) : null;
  return (
    <>
      <Thumb item={item} />
      <div className="cal-det-head">
        <span className={`cal-det-status is-${item.status}`}>{STATUS_NAME[item.status] ?? item.status}</span>
        <h3 id={titleId}>{item.title || 'Untitled'}</h3>
        <p className="cal-det-brand">{item.brand_name}</p>
      </div>
      <dl className="cal-det-list">
        <dt>Date</dt>
        <dd>{dayLabel(item.publish_date)}</dd>
        <dt>Platform</dt>
        <dd>Instagram</dd>
        <dt>PIC</dt>
        <dd>
          {picName ? (
            <span className="cal-det-pic">
              <Avatar id={item.pic_id} name={picName} src={people.photos[item.pic_id] ?? null} size={22} />
              {picName}
            </span>
          ) : (
            <span className="cal-det-none">No PIC yet</span>
          )}
        </dd>
      </dl>
      <div className={`cal-caption${item.caption?.trim() ? '' : ' is-empty'}`} tabIndex={0} aria-label="Caption">
        {item.caption?.trim() ? item.caption : 'No caption yet.'}
      </div>
      {link && (
        <a className="cal-view" href={link} target="_blank" rel="noopener noreferrer">
          View post <IconExternal />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </>
  );
}

/** Desktop: the panel on the right. */
export function PostDetails({ item, people }) {
  return (
    <aside className="cal-side b360-desk" aria-label="Post details">
      {item ? (
        <article className="cal-det" aria-labelledby="cal-det-title">
          <DetailsBody item={item} people={people} titleId="cal-det-title" />
        </article>
      ) : (
        <div className="cal-det is-empty">
          <p>Click a post in the calendar to see its details.</p>
        </div>
      )}
    </aside>
  );
}

/** Phone: the details as a bottom sheet over the page. */
export function DetailsSheet({ item, people, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const back = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      if (back && typeof back.focus === 'function') back.focus();
    };
  }, [onClose]);
  return (
    <div className="cal-sheet-wrap">
      <div className="cal-sheet-scrim" onClick={onClose} aria-hidden="true" />
      <div ref={ref} className="cal-sheet" role="dialog" aria-modal="true" aria-labelledby="cal-sheet-title" tabIndex={-1}>
        <div className="cal-sheet-bar">
          <span className="cal-sheet-grip" aria-hidden="true" />
          <button type="button" className="cal-round cal-sheet-x" onClick={onClose} aria-label="Close details">
            <IconX />
          </button>
        </div>
        <div className="cal-det is-sheet">
          <DetailsBody item={item} people={people} titleId="cal-sheet-title" />
        </div>
      </div>
    </div>
  );
}
