import { readCookie, writeCookie } from './cookies';

const KEY = 'bgb.display_name';
const COOKIE = 'bgb_display_name';

function safeLocalGet(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function safeLocalSet(value: string): void {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* swallow */
  }
}

export function getDisplayName(): string | null {
  const name = safeLocalGet() ?? readCookie(COOKIE);
  if (name && !safeLocalGet()) safeLocalSet(name);
  return name && name.length > 0 ? name : null;
}

export function setDisplayName(name: string): void {
  const trimmed = name.trim();
  safeLocalSet(trimmed);
  writeCookie(COOKIE, trimmed);
}
