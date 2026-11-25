// Local preview of the three Beyondcy sites on ONE address, as on github.io:
//   http://localhost:5173/beyondcy.co/          (the portfolio, with the one login page: /login/)
//   http://localhost:5173/beyondcy.co-track/    (the tracker)
//   http://localhost:5173/beyondcy.co-dash/     (the dashboard)
// Same address = the browser shares the sign-in between them, exactly like the live sites.
// Port 5173 is the one Supabase allows for password-reset links (http://localhost:5173/**).
//
//   npm run preview:both                build all three (with their .env.local), then serve
//   npm run preview:both -- --no-build  serve the last builds
//   npm run preview:both -- --skip=site build only the tracker and the dashboard (site | track | dash)
//
// Expects the other two repos next to this one (..\beyondcy.co-track and ..\beyondcy.co). Stop
// `npm run dev` in the tracker first (it also uses 5173).
import { spawnSync } from 'node:child_process';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DASH = resolve(fileURLToPath(new URL('..', import.meta.url)));
const TRACK = resolve(DASH, '..', 'beyondcy.co-track');
const SITE = resolve(DASH, '..', 'beyondcy.co');
const PORT = 5173;
// the longest base first: "/beyondcy.co/" must not catch "/beyondcy.co-track/…"
const SITES = [
  { key: 'track', name: 'Tracker', base: '/beyondcy.co-track/', root: TRACK, out: 'dist', kind: 'vite' },
  { key: 'dash', name: 'Dashboard', base: '/beyondcy.co-dash/', root: DASH, out: 'dist', kind: 'vite' },
  { key: 'site', name: 'Portfolio', base: '/beyondcy.co/', root: SITE, out: 'out', kind: 'next' },
];
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
};

for (const site of SITES) {
  if (!existsSync(site.root)) {
    console.error(`The ${site.name.toLowerCase()} repo was not found at ${site.root}`);
    process.exit(1);
  }
}

const skip = process.argv.filter((a) => a.startsWith('--skip=')).flatMap((a) => a.slice(7).split(','));

if (!process.argv.includes('--no-build')) {
  for (const site of SITES) {
    if (skip.includes(site.key)) continue;
    console.log(`\nBuilding ${site.root} for ${site.base} …`);
    const bin = site.kind === 'vite' ? join(site.root, 'node_modules', 'vite', 'bin', 'vite.js') : join(site.root, 'node_modules', 'next', 'dist', 'bin', 'next');
    const env =
      site.kind === 'vite'
        ? { ...process.env, VITE_BASE_PATH: site.base }
        : { ...process.env, BASE_PATH: site.base.replace(/\/$/, '') }; // Next wants "/beyondcy.co", no "/" at the end
    const r = spawnSync(process.execPath, [bin, 'build'], { cwd: site.root, stdio: 'inherit', env });
    if (r.status !== 0) process.exit(r.status ?? 1);
  }
}

function send(res, file, status = 200) {
  res.writeHead(status, { 'Content-Type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
  createReadStream(file).pipe(res);
}

const isFile = (file) => existsSync(file) && statSync(file).isFile();

createServer((req, res) => {
  const [rawPath, query = ''] = (req.url ?? '/').split('?');
  const path = decodeURIComponent(rawPath);
  const search = query ? `?${query}` : '';
  // "/" and a site's address without its last "/" → the site
  if (path === '/') {
    res.writeHead(302, { Location: '/beyondcy.co-track/' });
    return res.end();
  }
  const bare = SITES.find((s) => path === s.base.slice(0, -1));
  if (bare) {
    res.writeHead(302, { Location: bare.base + search });
    return res.end();
  }
  const site = SITES.find((s) => path.startsWith(s.base));
  if (!site) {
    res.writeHead(404);
    return res.end('Not found');
  }
  const root = join(site.root, site.out);
  const file = normalize(join(root, path.slice(site.base.length)));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    return res.end();
  }
  if (isFile(file)) return send(res, file);

  if (site.kind === 'vite') {
    // like GitHub Pages' 404.html: every app route gets the app
    return send(res, join(root, 'index.html'));
  }
  // the portfolio is a set of exported pages: /login/ → login/index.html
  if (isFile(join(file, 'index.html'))) {
    if (!path.endsWith('/')) {
      // GitHub Pages redirects /login → /login/ too (the query goes along)
      res.writeHead(301, { Location: `${path}/${search}` });
      return res.end();
    }
    return send(res, join(file, 'index.html'));
  }
  const notFound = join(root, '404.html');
  if (isFile(notFound)) return send(res, notFound, 404);
  res.writeHead(404);
  return res.end('Not found');
}).listen(PORT, () => {
  console.log(`\nPortfolio: http://localhost:${PORT}/beyondcy.co/`);
  console.log(`  Login:   http://localhost:${PORT}/beyondcy.co/login/`);
  console.log(`Tracker:   http://localhost:${PORT}/beyondcy.co-track/`);
  console.log(`Dashboard: http://localhost:${PORT}/beyondcy.co-dash/`);
  const lan = Object.values(networkInterfaces())
    .flat()
    .find((n) => n && n.family === 'IPv4' && !n.internal);
  if (lan) console.log(`On a phone (same Wi-Fi), to look only: http://${lan.address}:${PORT}/beyondcy.co-track/  (signing in works on localhost only)`);
  console.log('(Ctrl+C to stop)');
});
