# beyondcy.co-dash

The Beyondcy marketing dashboard. In this release it is only a "Stay tuned" page (no login form, no data). The page is `noindex, nofollow`.

- **Live:** https://beyondcy888.github.io/beyondcy.co-dash/ (later **https://dash.beyondcy.co**, see `11_CONNECT_DOMAIN.md` in the tracker repo's `docs/`)
- **Repo:** `github.com/Beyondcy888/beyondcy.co-dash`. The portfolio (`beyondcy.co`) and the tracker (`beyondcy.co-track`) have their own repos; the tracker repo's `docs/` holds the project docs.

## Files

- `index.html`: the whole page (inline CSS, no build). To change the copy, edit the block marked `<!-- COPY -->`. The `SITE LINKS` comment at the top holds the three sites' addresses (one place to change them).
- `logo-beyondcy.png` (the logo, made for dark backgrounds) and the favicons `favicon.ico`, `favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png`.
- `.nojekyll` (empty): GitHub Pages serves the files as they are, without Jekyll.
- Paths are **relative** (`favicon.ico`, not `/favicon.ico`), so the page works at its github.io sub-path now and at the domain root later.

## Deploy

Push with `deploy.ps1` from the parent `Beyondcy-Web` folder: `.\deploy.ps1 dash`. Live in about 1–2 minutes.

GitHub settings: Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`. Custom domain: **leave empty for now**.

**No `CNAME` file yet**: it would make GitHub redirect the github.io link to a domain that isn't connected. When the domain is connected (file 11): add a root `CNAME` containing exactly `dash.beyondcy.co`, update the `SITE LINKS` block, then set the custom domain in Settings → Pages and tick **Enforce HTTPS** once the certificate is issued.
