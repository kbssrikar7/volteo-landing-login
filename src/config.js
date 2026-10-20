// Central place for URLs and storage keys used by the login page.
// Change APP_URL if the main Smartport app is hosted somewhere else.

export const APP_URL = 'https://smartport.ap.gov.in';

// Links shown on the login page (they open screens in the main app).
export const LINKS = {
  signUp: `${APP_URL}/#/sign-up`,
  forgotPassword: `${APP_URL}/#/forgot-password`,
  ivRegistration: `${APP_URL}/#/iv-reg`,
};

// Where to send the user after a successful login.
export const AFTER_LOGIN_URL = `${APP_URL}/#/`;
export const PASSWORD_RESET_URL = `${APP_URL}/#/password-reset`;

// localStorage keys. These must match the keys the main app reads,
// otherwise the user will not appear logged in after the redirect.
export const STORAGE_KEYS = {
  token: 'token',
  user: 'splogu',
  rememberedEmail: 'sp_remembered_email',
};

// The real login only runs on the Smartport domain (or localhost while developing).
// Anywhere else, e.g. a Vercel preview, the page is a design preview and
// never sends credentials.
// It is a function (not a constant) because the page is also rendered at
// build time, where there is no browser window.
const ALLOWED_HOSTS = ['smartport.ap.gov.in', 'localhost', '127.0.0.1'];
export function isDesignPreview() {
  return typeof window !== 'undefined' && !ALLOWED_HOSTS.includes(window.location.hostname);
}

// Logo images. By default they come from this app's own public/img folder.
// A build can load them from elsewhere by setting these environment variables,
// e.g. VITE_SMARTPORT_LOGO_URL=https://smartport.ap.gov.in/img/logo.png
export const LOGOS = {
  smartport: import.meta.env.VITE_SMARTPORT_LOGO_URL || '/img/smartport-logo.png',
  apmb: import.meta.env.VITE_APMB_LOGO_URL || '/img/apmb-emblem.webp',
};
