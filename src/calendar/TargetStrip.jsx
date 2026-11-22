// The target strip (update v5, file 02 §3): Total target · Uploaded · Remaining · Achievement,
// for the selected month and all brands. The numbers come from the tracker's own progress
// module (lib/progress.js, copied whole: groupStats), so they always agree with the tracker's
// Admin Dashboard boxes; only the number format is Indonesian here.
// The mock's fonts and sizes are kept; the tracker's illustrations sit bottom-right in each box
// at ONE fixed size (calendar.css), behind the text, never shrinking with longer numbers.
import { daysInMonth } from '../lib/time.js';
import { fmtNum, fmtPct } from '../lib/format.js';
import { TypeIcon } from '../ui/icons.jsx';
import { Gauge, IllusCards, IllusHourglass, IllusPhone } from './illustrations.jsx';

function TypeCount({ type, children }) {
  return (
    <span className="tgt-type">
      <TypeIcon type={type} size={10} />
      {children}
    </span>
  );
}

function Box({ label, value, children, illus, className = '' }) {
  return (
    <article className={`b360-tgt cal-tgt ${className}`}>
      <span className="cal-tgt-illus" aria-hidden="true">
        {illus}
      </span>
      <p className="cal-tgt-label">{label}</p>
      <p className="b360-mid cal-tgt-num tnum">{value}</p>
      {children}
    </article>
  );
}

/** "12 days left" (this month) · "Last day" · "Month ended" · "Not started yet" */
function whenText(month, today) {
  const todayMonth = today.slice(0, 7);
  if (month === todayMonth) {
    const left = daysInMonth(month) - Number(today.slice(8));
    return left === 0 ? 'Last day' : `${left} ${left === 1 ? 'day' : 'days'} left`;
  }
  return month < todayMonth ? 'Month ended' : 'Not started yet';
}

/** The pace line: "30 posts behind pace" · "On pace" · "Target reached"; past months the final result; future months none. */
function paceLine(stats) {
  const p = stats.pace;
  if (!stats.target) return { text: 'No target yet', tone: 'muted' };
  if (p.phase === 'future') return null;
  if (p.reached) return { text: 'Target reached', tone: 'up' };
  if (p.phase === 'past') return { text: `Ended ${fmtNum(p.toGo)} short of the target`, tone: 'down' };
  if (p.onPace) return { text: 'On pace', tone: 'up' };
  return { text: `${fmtNum(p.behind)} ${p.behind === 1 ? 'post' : 'posts'} behind pace`, tone: 'down' };
}

export function TargetStrip({ stats, month, today }) {
  const t = stats.target;
  const u = stats.uploaded;
  const pct = stats.achievement == null ? null : fmtPct(stats.achievement).match(/^(\d+)(.*)$/);
  const pace = paceLine(stats);

  return (
    <div className="cal-strip" role="group" aria-label="This month in numbers">
      <Box label="Total target" value={t ? fmtNum(t.total) : '–'} illus={<IllusCards />}>
        <div className="cal-tgt-line is-row">
          {t ? (
            <>
              <TypeCount type="reels">{fmtNum(t.reels)} Reels</TypeCount>
              <TypeCount type="feed">{fmtNum(t.feed)} Feed</TypeCount>
            </>
          ) : (
            <span>No target yet</span>
          )}
        </div>
      </Box>

      <Box label="Uploaded" value={fmtNum(u.total)} illus={<IllusPhone />}>
        <div className="cal-tgt-line">
          <TypeCount type="reels">
            {fmtNum(u.reels)}/{t ? fmtNum(t.reels) : '–'} Reels
          </TypeCount>
          <TypeCount type="feed">
            {fmtNum(u.feed)}/{t ? fmtNum(t.feed) : '–'} Feed
          </TypeCount>
        </div>
      </Box>

      <Box
        label="Remaining"
        value={
          !t ? (
            '–'
          ) : stats.over > 0 ? (
            <>
              +{fmtNum(stats.over)}
              <span className="cal-tgt-unit">over</span>
            </>
          ) : (
            fmtNum(stats.remaining)
          )
        }
        illus={<IllusHourglass />}
        className={t && stats.over > 0 ? 'is-over' : ''}
      >
        <div className="cal-tgt-line">
          {t && (
            <span className="cal-tgt-togo">
              <TypeCount type="reels">{fmtNum(Math.max(t.reels - u.reels, 0))}</TypeCount>
              <TypeCount type="feed">{fmtNum(Math.max(t.feed - u.feed, 0))}</TypeCount>
              <span>to go</span>
            </span>
          )}
          <span>{whenText(month, today)}</span>
        </div>
      </Box>

      <Box
        label="Achievement"
        value={
          pct ? (
            <>
              {pct[1]}
              <span className="cal-tgt-frac">{pct[2]}</span>
            </>
          ) : (
            '–'
          )
        }
        illus={<Gauge value={stats.achievement} />}
        className="is-gauge"
      >
        {pace && <p className={`cal-tgt-pace is-${pace.tone}`}>{pace.text}</p>}
      </Box>
    </div>
  );
}
