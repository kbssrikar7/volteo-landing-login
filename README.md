# volteo-landing-login
smartport login pane re-design

A redesigned, minimal login page for [Smartport](https://smartport.ap.gov.in), built with React + Vite.

**Live preview:** https://job-one-lilac.vercel.app (sign-in is disabled outside smartport.ap.gov.in)

| Before | After |
| --- | --- |
| ![Before](docs/before.png) | ![After](docs/after.png) |

## Getting started

```bash
npm install
npm run dev      # start local dev server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

During development, requests to `/api/*` are proxied to `https://smartport.ap.gov.in`
(see `vite.config.js`), so you can log in with a real account locally.

## Deployment

The site deploys on Vercel. `vercel.json` sets the build (`npm run build`,
output in `dist/`), so once the repo is connected to the Vercel project,
every push to `main` redeploys automatically.

## Project structure

```
public/img/               Official logos and the Krishnapatnam Port photo
src/
  main.jsx                Entry point: mounts <App /> and loads styles
  App.jsx                 Page layout: PhotoPanel (left), LoginForm + Footer (right)
  config.js               URLs, localStorage keys and logo paths (edit here first)
  styles.css              All styles; colors/sizes are CSS variables at the top
  components/
    PhotoPanel.jsx        Black-and-white port photo with the APMB emblem and photo credit
    LoginForm.jsx         The sign-in form: fields, validation, submit
    Footer.jsx            Copyright and browser note
  services/
    auth.js               API calls: login() and logout()
```

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

## Design notes

- Black and white on purpose: a black-and-white port photo on the left, a
  white form on the right, near-black text and button. The logos are the
  only colour. All colours are CSS variables at the top of `src/styles.css`.
- On tablets and phones the photo becomes a banner above the form.
- Font: IBM Plex Sans (loaded from Google Fonts in `index.html`).
- Always light: the page stays white even if the visitor's device is in dark mode.
- In production, React is loaded from jsDelivr via an import map (see
  `vite.config.js`), so the built bundle is only our own ~5 KB of code.
- Logo paths can be overridden at build time with `VITE_SMARTPORT_LOGO_URL`
  and `VITE_APMB_LOGO_URL`.

## What changed from the old page

- Split layout: photo of an Andhra Pradesh port beside the sign-in form
- Visible labels instead of placeholder-only fields
- Show/Hide password toggle
- "Forgot password?" next to the password field; "Create an account" below the button
- "Keep my email on this device" actually remembers the email
- Clear error messages and a "Signing in…" state while waiting
- Responsive on mobile; consistent colours defined as CSS variables

## Photo credit

`public/img/krishnapatnam-port.jpg` is a black-and-white crop of
[Krishnapatnam port cranes unloading a ship](https://commons.wikimedia.org/wiki/File:Krishnapatnam_port_cranes_unloadng_a_ship.jpg)
by Rahmanuddin, licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
This is a design mockup, so the credit is not shown on the page. Before any
production use, either show this credit on the page or replace the photo
with one APMB owns.

## License

[MIT](LICENSE)
