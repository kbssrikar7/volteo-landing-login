import { useState } from 'react';
import { login } from '../services/auth';
import { AFTER_LOGIN_URL, IS_DESIGN_PREVIEW, LINKS, PASSWORD_RESET_URL, STORAGE_KEYS } from '../config';

// Reads the email saved by "Remember me" (empty string if none).
function getRememberedEmail() {
  try {
    return localStorage.getItem(STORAGE_KEYS.rememberedEmail) || '';
  } catch {
    return '';
  }
}

export default function LoginForm() {
  // Form fields
  const [email, setEmail] = useState(getRememberedEmail);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => getRememberedEmail() !== '');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (email.trim() === '' || password === '') {
      setError('Enter your email address and password.');
      return;
    }

    if (IS_DESIGN_PREVIEW) {
      setError('This is a design preview. Sign-in is disabled here.');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await login(email.trim(), password);

      // Save or forget the email based on the "Remember me" checkbox.
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.rememberedEmail, email.trim());
      } else {
        localStorage.removeItem(STORAGE_KEYS.rememberedEmail);
      }

      // Users with a temporary password must set a new one first.
      window.location.href = user.password_reset_flag ? PASSWORD_RESET_URL : AFTER_LOGIN_URL;
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  }

  return (
    <section className="login" aria-labelledby="login-title">
      <h1 id="login-title" className="login-title">Sign in</h1>
      <p className="login-subtitle">Use the email address registered with Smartport.</p>

      {IS_DESIGN_PREVIEW && (
        <p className="preview-banner">
          Design preview. Sign-in only works on smartport.ap.gov.in.
        </p>
      )}

      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
          />
        </div>

        <div className="field">
          <div className="field-label-row">
            <label htmlFor="password">Password</label>
            <a href={LINKS.forgotPassword} className="link">Forgot password?</a>
          </div>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Keep my email on this device
        </label>

        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="login-signup">
        New to Smartport? <a href={LINKS.signUp} className="link">Create an account</a>
      </p>

      <a href={LINKS.ivRegistration} className="upskill">
        <span className="upskill-label">IV Upskill Program</span>
        <span className="upskill-action">Register →</span>
      </a>
    </section>
  );
}
