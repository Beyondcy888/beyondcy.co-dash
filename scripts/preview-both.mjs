// Local preview of the Tracker AND the Dashboard on ONE address, as on github.io:
//   http://localhost:5173/beyondcy.co-track/   (the tracker, with the one login page)
//   http://localhost:5173/beyondcy.co-dash/    (the dashboard)
// Same address = the browser shares the sign-in between them, exactly like the live sites.
// Port 5173 is the one Supabase allows for password-reset links (http://localhost:5173/**).
//
//   npm run preview:both              build both (with their .env.local), then serve
//   npm run preview:both -- --no-build  serve the last builds
//
// Expects the tracker repo next to this one (..\beyondcy.co-track). Stop `npm run dev` in the
// tracker first (it also uses 5173).
import { spawnSync } from 'node:child_process';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DASH = resolve(fileURLToPath(new URL('..', import.meta.url)));
const TRACK = resolve(DASH, '..', 'beyondcy.co-track');
const PORT = 5173;
const SITES = [
  { base: '/beyondcy.co-track/', root: TRACK },
  { base: '/beyondcy.co-dash/', root: DASH },
];
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

if (!existsSync(TRACK)) {
  console.error(`The tracker repo was not found at ${TRACK}`);
  process.exit(1);
}

if (!process.argv.includes('--no-build')) {
  for (const site of SITES) {
    console.log(`\nBuilding ${site.root} for ${site.base} …`);
    const vite = join(site.root, 'node_modules', 'vite', 'bin', 'vite.js');
    const r = spawnSync(process.execPath, [vite, 'build'], {
      cwd: site.root,
      stdio: 'inherit',
      env: { ...process.env, VITE_BASE_PATH: site.base },
    });
    if (r.status !== 0) process.exit(r.status ?? 1);
  }
}

function send(res, file, status = 200) {
  res.writeHead(status, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const path = decodeURIComponent((req.url ?? '/').split('?')[0]);
  if (path === '/' || path === '/beyondcy.co-track' || path === '/beyondcy.co-dash') {
    res.writeHead(302, { Location: path === '/beyondcy.co-dash' ? '/beyondcy.co-dash/' : '/beyondcy.co-track/' });
    return res.end();
  }
  const site = SITES.find((s) => path.startsWith(s.base));
  if (!site) {
    res.writeHead(404);
    return res.end('Not found');
  }
  const dist = join(site.root, 'dist');
  const file = normalize(join(dist, path.slice(site.base.length)));
  if (!file.startsWith(dist)) {
    res.writeHead(403);
    return res.end();
  }
  if (existsSync(file) && statSync(file).isFile()) return send(res, file);
  // like GitHub Pages' 404.html: every app route gets the app
  return send(res, join(dist, 'index.html'));
}).listen(PORT, () => {
  console.log(`\nTracker:   http://localhost:${PORT}/beyondcy.co-track/`);
  console.log(`Dashboard: http://localhost:${PORT}/beyondcy.co-dash/`);
  console.log('(Ctrl+C to stop)');
});
