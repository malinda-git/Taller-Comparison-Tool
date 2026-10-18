# HeightLine (static site)

Plain HTML, CSS and JavaScript. No build step.

## Deploy on Cloudflare Pages
1. Put this folder's contents in a GitHub repository (index.html at the top level).
2. Cloudflare dashboard > Workers & Pages > Create > Pages > Connect to Git, pick the repo.
3. Framework preset: None. Build command: leave empty. Build output directory: `/` (or leave blank).
4. After the first deploy, open the project > Custom domains and add your domain.

You can also use "Upload assets" in Cloudflare Pages and drag this folder in, without GitHub.

## Before you go live (TODO)
- contact.html: replace `contact@example.com` with your real email.
- privacy.html: set the date and edit the advertising/analytics section to match what you use.
- Add a `<link rel="canonical">` and a sitemap.xml once you have your domain.
- AdSense: paste your ad unit into `#ad-slot` in index.html and remove its `hidden` attribute.
- Building details marked "Basic details only" in assets/app.js (BUILD list, `v:0`) need checking.
- Custom items are saved in each visitor's browser only. A shared database needs a backend (for example Supabase or Cloudflare D1).
