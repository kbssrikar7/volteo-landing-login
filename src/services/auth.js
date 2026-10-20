// All communication with the Smartport authentication API lives here,
// so components never call fetch() directly.

import { STORAGE_KEYS } from '@/config';

/**
 * Logs the user in and returns their profile.
 * Throws an Error with a readable message if anything fails.
 */
export async function login(email, password) {
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
    logout();
    throw new Error('Could not load your account. Please try again.');
  }
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));

  return user;
}

/** Clears everything stored for the current session. */
export function logout() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
}

// Parses a JSON response body, returning {} if the body is empty or not JSON.
async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
