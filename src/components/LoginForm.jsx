import { useEffect, useState } from 'react';
import { CircleAlert, Eye, EyeOff, GraduationCap, LoaderCircle, UserPlus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/services/auth';
import { AFTER_LOGIN_URL, LINKS, PASSWORD_RESET_URL, STORAGE_KEYS, isDesignPreview } from '@/config';

// Reads the email saved by "Remember me" (empty string if none).
function getRememberedEmail() {
  try {
    return localStorage.getItem(STORAGE_KEYS.rememberedEmail) || '';
  } catch {
    return '';
  }
}

// The sign-in form: fields, validation and submit.
export default function LoginForm() {
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Fill in the remembered email once the page is running in the browser.
  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

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

    // The "Design preview" note in the page header explains why nothing happens.
    if (isDesignPreview()) {
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
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <div>
          <h1 className="text-[1.75rem] leading-tight font-semibold tracking-tight">Sign in to Smartport</h1>
          <p className="mt-2 text-muted-foreground">
            Gate passes, port dues and vessel registration for the ports of Andhra Pradesh.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
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
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a href={LINKS.forgotPassword} className="ml-auto text-sm font-medium text-primary underline-offset-4 hover:underline">
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
        </Field>

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

        <Field>
          <Button type="submit" size="lg" className="h-11 text-[15px]" disabled={isSubmitting}>
            {isSubmitting && <LoaderCircle className="animate-spin" />}
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </Field>

        <FieldSeparator>New to Smartport?</FieldSeparator>

        <Field className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-10" asChild>
            <a href={LINKS.signUp}>
              <UserPlus />
              Create account
            </a>
          </Button>
          <Button variant="outline" className="h-10" asChild>
            <a href={LINKS.ivRegistration}>
              <GraduationCap />
              IV Upskill
            </a>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
