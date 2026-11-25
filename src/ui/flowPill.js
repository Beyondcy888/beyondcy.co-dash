/*
 * The flowing "blob" behind the active navigation item (update v6, file 04): ONE small,
 * framework-free module shared by the Beyond 360° Dashboard (src/ui/flowPill.js) and the
 * portfolio (lib/flowPill.js). The two copies must stay byte-identical.
 *
 * When the active item changes, the pill does not jump: it STRETCHES toward the new item (its
 * leading edge moves first, the trailing edge follows) and then settles into the new item's
 * size with a soft spring. About 460 ms; only `transform` and `width` (and, when a row wraps,
 * `height`) are animated. With prefers-reduced-motion it moves at once.
 *
 *   const pill = attachFlowPill(track, { pillClass: 'my-pill' });
 *   pill.update();                    // call whenever the active item may have changed
 *   pill.update({ animate: false });  // re-measure without moving (e.g. after a resize)
 *   pill.destroy();
 *
 * `track` is the element that holds the items; it must be a positioned box (position: relative)
 * and the items must be its children or descendants. The active item is the first match of
 * `activeSelector` (default: [aria-current="page"]). The module adds one <span> (the pill) as
 * the track's first child and sets data-flow="on" on the track once the pill is in place, so
 * the stylesheet can hand the active item's own background over to the pill.
 * `follow: true` keeps the active item in view when the track scrolls sideways (phone tab rows).
 */

const DEFAULTS = { pillClass: 'flow-pill', activeSelector: '[aria-current="page"]', duration: 460, follow: false };

/** A soft spring: reaches 1 with a small overshoot, then settles. */
function spring(u, bounce) {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  const v = u - 1;
  return 1 + (bounce + 1) * v * v * v + bounce * v * v;
}

function smooth(u) {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  return u * u * (3 - 2 * u);
}

const lerp = (a, b, p) => a + (b - a) * p;

export function attachFlowPill(track, options) {
  const opts = Object.assign({}, DEFAULTS, options || {});
  const doc = track.ownerDocument;
  const win = doc.defaultView;
  const pill = doc.createElement('span');
  pill.className = opts.pillClass;
  pill.setAttribute('aria-hidden', 'true');
  track.insertBefore(pill, track.firstChild);

  const reduce = win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;
  let box = null; // where the pill is drawn now: { l, r, y, h }
  let goal = null; // where it is going
  let frame = 0;
  let destroyed = false;

  function paint(b) {
    box = b;
    pill.style.transform = 'translate3d(' + b.l.toFixed(2) + 'px,' + b.y.toFixed(2) + 'px,0)';
    pill.style.width = Math.max(b.r - b.l, 0).toFixed(2) + 'px';
    pill.style.height = b.h.toFixed(2) + 'px';
  }

  function measure(el) {
    // offsets are relative to the track (a positioned box), so a sideways scroll doesn't matter
    let l = el.offsetLeft;
    let y = el.offsetTop;
    let node = el.offsetParent;
    while (node && node !== track && track.contains(node)) {
      l += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent;
    }
    return { l: l, r: l + el.offsetWidth, y: y, h: el.offsetHeight };
  }

  function stop() {
    if (frame) win.cancelAnimationFrame(frame);
    frame = 0;
  }

  function show(on) {
    pill.style.opacity = on ? '1' : '0';
    if (on) track.setAttribute('data-flow', 'on');
    else track.removeAttribute('data-flow');
  }

  function keepInView(el, instant) {
    if (!opts.follow || track.scrollWidth <= track.clientWidth + 1) return;
    const left = Math.max(0, Math.min(el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2, track.scrollWidth - track.clientWidth));
    if (Math.abs(track.scrollLeft - left) < 2) return;
    try {
      track.scrollTo({ left: left, behavior: instant ? 'auto' : 'smooth' });
    } catch (e) {
      track.scrollLeft = left;
    }
  }

  function flow(from, to) {
    const start = win.performance.now();
    const right = to.l + to.r >= from.l + from.r; // moving right: the right edge leads
    const travel = Math.abs((to.l + to.r) / 2 - (from.l + from.r) / 2);
    // a longer trip gets a little more time; a short hop stays snappy
    const total = Math.min(opts.duration + 60, Math.max(opts.duration - 80, opts.duration - 80 + travel * 0.35));
    const step = function (now) {
      const t = Math.min((now - start) / total, 1);
      const lead = spring(t / 0.72, 1.15); // leaves at once, arrives early, overshoots a touch
      const trail = spring(smooth((t - 0.1) / 0.9), 0.75); // hangs back, then catches up and settles
      const l = lerp(from.l, to.l, right ? trail : lead);
      const r = lerp(from.r, to.r, right ? lead : trail);
      const k = smooth(t);
      paint({ l: Math.min(l, r - 8), r: Math.max(r, l + 8), y: lerp(from.y, to.y, k), h: lerp(from.h, to.h, k) });
      if (t < 1) {
        frame = win.requestAnimationFrame(step);
      } else {
        frame = 0;
        paint(to);
      }
    };
    stop();
    frame = win.requestAnimationFrame(step);
  }

  /** Move to the active item. `animate: false` (or the first placement) puts it there at once. */
  function update(how) {
    if (destroyed) return;
    const animate = !(how && how.animate === false);
    const el = track.querySelector(opts.activeSelector);
    if (!el || !el.offsetWidth) {
      stop();
      goal = null;
      box = null;
      show(false);
      return;
    }
    const to = measure(el);
    const same = goal && Math.abs(goal.l - to.l) < 0.5 && Math.abs(goal.r - to.r) < 0.5 && Math.abs(goal.y - to.y) < 0.5 && Math.abs(goal.h - to.h) < 0.5;
    const first = !box;
    goal = to;
    if (first || !animate || (reduce && reduce.matches)) {
      stop();
      paint(to);
      show(true);
      keepInView(el, first || !animate);
      return;
    }
    if (same) return; // already there, or on its way there
    show(true);
    keepInView(el, false);
    flow(box, to);
  }

  // sizes change (fonts arriving, the window resizing, a tab's text changing): follow, without a flourish
  const settle = function () {
    if (!frame) update({ animate: false });
  };
  let observer = null;
  if (win.ResizeObserver) {
    observer = new win.ResizeObserver(settle);
    observer.observe(track);
  }
  win.addEventListener('resize', settle);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(settle, function () {});

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    stop();
    if (observer) observer.disconnect();
    win.removeEventListener('resize', settle);
    track.removeAttribute('data-flow');
    if (pill.parentNode) pill.parentNode.removeChild(pill);
  }

  return { update: update, destroy: destroy, element: pill };
}
