// SITE LINKS: the three Beyondcy sites, kept in ONE place.
// When the domain is connected (11_CONNECT_DOMAIN.md), only these three lines change, to
// https://beyondcy.co/, https://dash.beyondcy.co/ and https://track.beyondcy.co/.
// (The tracker's own links never use these: they come from the router and BASE_URL.)
// The dashboard repo (beyondcy.co-dash, src/siteLinks.js) has the same list: keep both in step.
export const SITE_LINKS = {
  site: 'https://beyondcy888.github.io/beyondcy.co/',
  dash: 'https://beyondcy888.github.io/beyondcy.co-dash/',
  track: 'https://beyondcy888.github.io/beyondcy.co-track/',
};

// On this computer both apps are served from ONE address (localhost:5173, the dash repo's
// `npm run preview:both`), at the same paths as on github.io, so the sign-in is shared the same way.
const LOCAL_PATHS = {
  site: '/beyondcy.co/',
  dash: '/beyondcy.co-dash/',
  track: '/beyondcy.co-track/',
};

const IS_LOCAL = typeof window !== 'undefined' && ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);

/** The address of one of the sites (+ an optional path inside it, e.g. 'login?next=dashboard'). */
export function siteLink(key, path = '') {
  const base = IS_LOCAL ? `${window.location.origin}${LOCAL_PATHS[key]}` : SITE_LINKS[key];
  return base + path;
}
