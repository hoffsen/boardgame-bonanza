const COOKIE_DAYS = 365;

export function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${name}=`;
  for (const raw of document.cookie.split(';')) {
    const c = raw.trim();
    if (c.startsWith(prefix)) {
      try {
        return decodeURIComponent(c.substring(prefix.length));
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function writeCookie(name: string, value: string, days = COOKIE_DAYS): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  // SameSite=Lax keeps the cookie on top-level navigations (works through
  // QR scan / share-link flows). No Secure flag check needed — Pages is HTTPS.
  document.cookie =
    `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}
