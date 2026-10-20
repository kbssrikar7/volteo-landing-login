# volteo-landing-login
smartport login pane re-design

A redesigned, minimal login page for [Smartport](https://smartport.ap.gov.in), built with
React, Vite, [Tailwind CSS](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com).

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
  index.css               Tailwind setup and the shadcn/ui theme colours
  App.jsx                 Page layout: PhotoPanel (left), LoginForm + Footer (right)
  config.js               URLs, localStorage keys and logo paths (edit here first)
  components/
    PhotoPanel.jsx        Black-and-white port photo with the APMB emblem
    LoginForm.jsx         The sign-in form: fields, validation, submit
    Footer.jsx            Copyright and browser note
    ui/                   shadcn/ui components (button, input, label, checkbox, alert)
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

## Design notes

- Black and white on purpose: a black-and-white port photo on the left, a
  white form on the right, near-black text and button. The logos are the
  only colour. Colours are shadcn/ui's "neutral" theme, defined as CSS
  variables in `src/index.css`.
- On tablets and phones the photo becomes a banner above the form.
- Font: IBM Plex Sans (loaded from Google Fonts in `index.html`).
- Always light: the page stays white even if the visitor's device is in dark
  mode. The `dark:` styles in the shadcn components only apply inside a
  `.dark` element, which this page never uses (see `src/index.css`).
- Logo paths can be overridden at build time with `VITE_SMARTPORT_LOGO_URL`
  and `VITE_APMB_LOGO_URL`.

## What changed from the old page

- Split layout: photo of an Andhra Pradesh port beside the sign-in form
- Visible labels instead of placeholder-only fields
- Show/Hide password toggle (eye icon)
- "Forgot password?" next to the password field; "Create an account" below the button
- "Keep my email on this device" actually remembers the email
- Clear error messages and a "Signing in…" state while waiting
- Responsive on mobile; consistent shadcn/ui components and theme

## Photo credit

`public/img/krishnapatnam-port.jpg` is a black-and-white crop of
[Krishnapatnam port cranes unloading a ship](https://commons.wikimedia.org/wiki/File:Krishnapatnam_port_cranes_unloadng_a_ship.jpg)
by Rahmanuddin, licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
This is a design mockup, so the credit is not shown on the page. Before any
production use, either show this credit on the page or replace the photo
with one APMB owns.

## License

[MIT](LICENSE)
