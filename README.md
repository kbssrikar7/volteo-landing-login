# volteo-landing-login
smartport login pane re-design

A redesigned, minimal login page for [Smartport](https://smartport.ap.gov.in), built with
React, Vite, [Tailwind CSS](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com).

**Live preview:** https://job-one-lilac.vercel.app (sign-in is disabled outside smartport.ap.gov.in)

| Before | After |
| --- | --- |
| ![Before](docs/before.png) | ![After](docs/after.jpg) |

## Getting started

```bash
npm install
npm run dev      # start local dev server at http://localhost:5173
npm run build    # production build into dist/ (pre-rendered, see Performance)
npm run preview  # serve the production build locally
npm run images   # regenerate optimised images after changing one in images-src/
```

During development, requests to `/api/*` are proxied to `https://smartport.ap.gov.in`
(see `vite.config.js`), so you can log in with a real account locally.

## Deployment

The site deploys on Vercel. `vercel.json` sets the build (`npm run build`,
output in `dist/`), so once the repo is connected to the Vercel project,
every push to `main` redeploys automatically.

## Project structure

```
images-src/               Original images (edit these, then run `npm run images`)
public/img/               Optimised images generated from images-src/ (do not edit by hand)
scripts/
  optimize-images.mjs     Makes the AVIF/WebP sizes of the photo, the emblem and favicon
  prerender.mjs           Renders the page to HTML at build time
src/
  main.jsx                Entry point: loads font and styles, starts React
  entry-server.jsx        Used by prerender.mjs to render the page at build time
  index.css               Tailwind setup and the shadcn/ui theme colours
  App.jsx                 Page layout: logos, sign-in card floating on the photo, footer
  config.js               URLs, localStorage keys and logo paths (edit here first)
  components/
    LoginForm.jsx         The sign-in form: fields, validation, submit
    OceanBackground.jsx   Full-page photo of a container ship at sea (slow drift)
    ui/                   shadcn/ui components (button, field, input, label, checkbox, alert, separator)
  lib/
    utils.js              cn() helper used by the shadcn/ui components
  services/
    auth.js               API calls: login() and logout()
components.json           shadcn/ui settings (JavaScript, neutral theme)
```

## UI components (shadcn/ui)

The form is built from [shadcn/ui](https://ui.shadcn.com) components. They are
copied into `src/components/ui/` (not installed as a package), so you can edit
them directly. To add another one, for example a dialog:

```bash
npx shadcn@latest add dialog
```

Styling uses Tailwind CSS classes. Icons come from
[lucide-react](https://lucide.dev).

## How login works

1. `LoginForm` calls `login(email, password)` from `services/auth.js`.
2. `login` POSTs to `/api/authenticate` and stores the returned token in
   `localStorage["token"]`.
3. It then loads the profile from `/api/user/me` (sending the token in the
   `x-access-token` header) and stores it in `localStorage["splogu"]`.
4. The user is redirected to the main app, or to the password reset page if
   `password_reset_flag` is set.

The storage keys match what the existing Smartport app reads, so the user stays
logged in after the redirect. If you change them, update `STORAGE_KEYS` in
`src/config.js`.

Sign-in only runs on `smartport.ap.gov.in` (and `localhost` for development).
On any other address, such as the Vercel preview, the page shows a
"Design preview" note and never sends credentials. See `IS_DESIGN_PREVIEW`
in `src/config.js`.

## Performance

Measured with Lighthouse (the engine behind PageSpeed Insights), mobile
settings, median of 3 runs, before and after the optimisation work:

| | Score | First paint | Main content (LCP) | Speed Index | Page weight |
| --- | --- | --- | --- | --- | --- |
| Before | 92 | 2.39 s | 2.47 s | 4.28 s | 712 KB |
| After | 99 | 1.42 s | 2.02 s | 1.42 s | 207 KB |

What makes it fast:

- **Pre-rendered HTML.** `npm run build` renders the page to HTML at build time
  (`scripts/prerender.mjs`), so visitors see the full page before the
  JavaScript loads. React then attaches to that HTML ("hydration"). Anything
  that depends on the browser (the remembered email, the "Design preview"
  note) is read after the page loads, in a `useEffect`, so the pre-rendered
  HTML and the browser always match.
- **Right-sized photo.** The background photo is served as AVIF (or WebP) at
  five widths, and the browser downloads only the size it needs: about 20 to
  90 KB instead of 515 KB. It is preloaded in `index.html` with high priority.
- **Self-hosted font.** Geist comes from `@fontsource-variable/geist` and is
  served from this site (no Google Fonts request). The main font file is
  preloaded.
- **Caching.** Hashed files in `/assets` are cached for a year; images for a
  week (`vercel.json`).
- **Smooth animation.** The background drift only moves the image (a GPU
  transform). A Chrome DevTools trace with a 4x slower CPU showed a steady
  60 fps with no repaints or layout work.

If you change the photo: put the original in `images-src/`, run
`npm run images`, and keep the widths and `sizes` in
`src/components/OceanBackground.jsx` and the preload in `index.html` in sync.

## Design notes

- The whole page is a photo of a container ship at sea, seen from above.
  The white sign-in card floats on the open water: to the right of the ship
  on large screens, below it on phones and tablets. On phones and tablets the
  photo is shown at full width so the whole ship stays visible, then fades
  into the same deep-sea blue as the page.
- The photo drifts very slowly toward the ship's heading (40 seconds each
  way). It stays still for visitors who have "reduce motion" turned on.
  The animation is `drift` in `src/index.css`.
- Colours come from the photo: **deep-sea blue** (`#0e4266`) for buttons and
  links, the **open water** (`#0b3a54`) behind the photo, and a dark ink
  (`#0c1f2e`) for text. They are CSS variables in `src/index.css`.
- Font: Geist (loaded from Google Fonts in `index.html`, set as `--font-sans`
  in `src/index.css`).
- Always light: the card stays white even if the visitor's device is in dark
  mode. The `dark:` styles in the shadcn components only apply inside a
  `.dark` element, which this page never uses (see `src/index.css`).
- Logo paths can be overridden at build time with `VITE_SMARTPORT_LOGO_URL`
  and `VITE_APMB_LOGO_URL`.

## What changed from the old page

- Sign-in card floating on a full-page photo of a container ship at sea
- Visible labels instead of placeholder-only fields
- Show/Hide password toggle (eye icon)
- "Forgot password?" next to the password field; "Create an account" below the button
- "Keep my email on this device" actually remembers the email
- Clear error messages and a "Signing in…" state while waiting
- Responsive on mobile; consistent shadcn/ui components and theme

## Photo credit

`images-src/container-ship.jpg` (and the sizes generated from it in `public/img/`) is
[MSC Lisa in Port Phillip Bay](https://unsplash.com/photos/ZT3i-6XW8J8)
by Haydn, free to use under the [Unsplash License](https://unsplash.com/license)
(no credit required). Any stock photo with open water on one side works; keep
the ship on the left so the card has room on the right.

## License

[MIT](LICENSE)
