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
public/img/               Official logos and the container ship photo
src/
  main.jsx                Entry point: mounts <App /> and loads styles
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

`public/img/container-ship.jpg` is
[MSC Lisa in Port Phillip Bay](https://unsplash.com/photos/ZT3i-6XW8J8)
by Haydn, free to use under the [Unsplash License](https://unsplash.com/license)
(no credit required). Any stock photo with open water on one side works; keep
the ship on the left so the card has room on the right.

## License

[MIT](LICENSE)
