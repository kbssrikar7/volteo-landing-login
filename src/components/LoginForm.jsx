import { useState } from 'react';
import { ArrowRight, CircleAlert, Eye, EyeOff, Info, LoaderCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/services/auth';
import { AFTER_LOGIN_URL, IS_DESIGN_PREVIEW, LINKS, PASSWORD_RESET_URL, STORAGE_KEYS } from '@/config';

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

    // The preview note above the form already explains why nothing happens.
    if (IS_DESIGN_PREVIEW) {
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
    <section className="w-full max-w-sm" aria-labelledby="login-title">
      <h1 id="login-title" className="text-3xl font-semibold tracking-tight">
        Sign in
      </h1>
      <p className="mt-1.5 text-muted-foreground">
        Use the email address registered with Smartport.
      </p>

      <div className="mt-8 grid gap-3 empty:hidden">
        {IS_DESIGN_PREVIEW && (
          <Alert>
            <Info />
            <AlertDescription>Design preview. Sign-in only works on smartport.ap.gov.in.</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <form className="mt-6 grid gap-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="name@company.com"
            className="h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a
              href={LINKS.forgotPassword}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="h-11 pr-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <Label htmlFor="remember" className="font-normal text-muted-foreground">
            Keep my email on this device
          </Label>
        </div>

        <Button type="submit" size="lg" className="mt-1 h-11 w-full" disabled={isSubmitting}>
          {isSubmitting && <LoaderCircle className="animate-spin" />}
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        New to Smartport?{' '}
        <a href={LINKS.signUp} className="font-medium text-foreground underline underline-offset-4">
          Create an account
        </a>
      </p>

      <Button asChild variant="outline" className="mt-10 h-12 w-full justify-between px-4">
        <a href={LINKS.ivRegistration}>
          IV Upskill Program
          <span className="flex items-center gap-1.5 font-normal text-muted-foreground">
            Register <ArrowRight />
          </span>
        </a>
      </Button>
    </section>
  );
}
