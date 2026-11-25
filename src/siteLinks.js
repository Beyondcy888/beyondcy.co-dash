// SITE LINKS: the three Beyondcy sites, kept in ONE place.
// When the domain is connected (11_CONNECT_DOMAIN.md), only these three lines change, to
// https://beyondcy.co/, https://dash.beyondcy.co/ and https://track.beyondcy.co/.
// (The dashboard's own links never use these: they come from the router and BASE_URL.)
// The tracker repo (beyondcy.co-track, src/siteLinks.js) has this same file, and the portfolio
// (beyondcy.co, lib/siteLinks.js) the same list: keep all three in step.
export const SITE_LINKS = {
  site: 'https://beyondcy888.github.io/beyondcy.co/',
  dash: 'https://beyondcy888.github.io/beyondcy.co-dash/',
  track: 'https://beyondcy888.github.io/beyondcy.co-track/',
};

// On this computer the three sites are served from ONE address (localhost:5173, the dash repo's
// `npm run preview:both`), at the same paths as on github.io, so the sign-in is shared the same way.
const LOCAL_PATHS = {
  site: '/beyondcy.co/',
  dash: '/beyondcy.co-dash/',
  track: '/beyondcy.co-track/',
};

const IS_LOCAL = typeof window !== 'undefined' && ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);

/** The address of one of the sites (+ an optional path inside it, e.g. 'admin/maintenance'). */
export function siteLink(key, path = '') {
  const base = IS_LOCAL ? `${window.location.origin}${LOCAL_PATHS[key]}` : SITE_LINKS[key];
  return base + path;
}

// The ONE login page lives in the portfolio (update v6, file 05). Its pages end with "/" because
// the portfolio is exported that way (login/index.html): linking to the exact address avoids a
// redirect on the way.
/** The login page; `next` (a full address of this site) is where to come back to after signing in. */
export function loginLink(next = '') {
  return siteLink('site', 'login/') + (next ? `?next=${encodeURIComponent(next)}` : '');
}

/** The login page for an old link: the same query and hash go along (emailed reset links keep working). */
export function authPageLink(page, search = '', hash = '') {
  return siteLink('site', `${page}/`) + search + hash;
}
