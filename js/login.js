// Smartport sign-in page behaviour: show/hide password, remember email,
// validation, and signing in through the Smartport API.

// ---------- Settings ----------

// Change APP_URL if the main Smartport app is hosted somewhere else.
const APP_URL = 'https://smartport.ap.gov.in';

// Links shown on the page (they open screens in the main app).
const LINKS = {
  signUp: `${APP_URL}/#/sign-up`,
  forgotPassword: `${APP_URL}/#/forgot-password`,
  ivRegistration: `${APP_URL}/#/iv-reg`,
};

// Where to send the user after a successful login.
const AFTER_LOGIN_URL = `${APP_URL}/#/`;
const PASSWORD_RESET_URL = `${APP_URL}/#/password-reset`;

// localStorage keys. These must match the keys the main app reads,
// otherwise the user will not appear logged in after the redirect.
const STORAGE_KEYS = {
  token: 'token',
  user: 'splogu',
  rememberedEmail: 'sp_remembered_email',
};

// The real login only runs on the Smartport domain (or localhost while
// developing). Anywhere else, e.g. a Vercel preview, the page is a design
// preview and never sends credentials.
const ALLOWED_HOSTS = ['smartport.ap.gov.in', 'localhost', '127.0.0.1'];
const IS_DESIGN_PREVIEW = !ALLOWED_HOSTS.includes(window.location.hostname);

// ---------- Smartport API ----------

// Logs the user in and returns their profile.
// Throws an Error with a readable message if anything fails.
async function login(email, password) {
  // Step 1: exchange email + password for a token.
  const authResponse = await fetch('/api/authenticate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  });
  const authData = await readJson(authResponse);

  if (!authResponse.ok || !authData.token) {
    throw new Error(authData.message || 'Invalid email or password.');
  }
  localStorage.setItem(STORAGE_KEYS.token, authData.token);

  // Step 2: load the logged-in user's profile with that token.
  const userResponse = await fetch('/api/user/me', {
    headers: { 'x-access-token': authData.token },
  });
  const user = await readJson(userResponse);

  if (!userResponse.ok) {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    throw new Error('Could not load your account. Please try again.');
  }
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));

  return user;
}

// Parses a JSON response body, returning {} if the body is empty or not JSON.
async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

// localStorage can be blocked (e.g. private browsing), so never let it break the page.
function readStorage(key) {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function writeStorage(key, value) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // Ignore: remembering the email is only a convenience.
  }
}

// ---------- Page ----------

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const remember = document.getElementById('remember');
  const toggle = document.getElementById('password-toggle');
  const submit = document.getElementById('submit');
  const submitLabel = document.getElementById('submit-label');
  const errorBox = document.getElementById('form-error');
  const errorText = document.getElementById('form-error-text');

  // Point the links at the main app (kept in one place, above).
  for (const link of document.querySelectorAll('[data-link]')) {
    link.href = LINKS[link.dataset.link];
  }

  // "Design preview" note, everywhere except the real Smartport domain.
  document.getElementById('preview-note').hidden = !IS_DESIGN_PREVIEW;

  // Fill in the remembered email.
  const rememberedEmail = readStorage(STORAGE_KEYS.rememberedEmail);
  if (rememberedEmail) {
    email.value = rememberedEmail;
    remember.checked = true;
  }

  // Show / hide the password.
  toggle.addEventListener('click', () => {
    const show = password.type === 'password';
    password.type = show ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(show));
    toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });

  function showError(message) {
    errorText.textContent = message;
    errorBox.hidden = !message;
  }

  function setSubmitting(isSubmitting) {
    submit.disabled = isSubmitting;
    submit.setAttribute('aria-busy', String(isSubmitting));
    submitLabel.textContent = isSubmitting ? 'Signing in…' : 'Sign in';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showError('');

    const emailValue = email.value.trim();
    if (emailValue === '' || password.value === '') {
      showError('Enter your email address and password.');
      return;
    }

    // The "Design preview" note in the header explains why nothing happens.
    if (IS_DESIGN_PREVIEW) {
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(emailValue, password.value);

      // Save or forget the email based on the checkbox.
      writeStorage(STORAGE_KEYS.rememberedEmail, remember.checked ? emailValue : '');

      // Users with a temporary password must set a new one first.
      window.location.href = user.password_reset_flag ? PASSWORD_RESET_URL : AFTER_LOGIN_URL;
    } catch (error) {
      showError(error.message);
      setSubmitting(false);
    }
  });
});
