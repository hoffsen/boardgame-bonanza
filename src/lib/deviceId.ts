import { readCookie, writeCookie } from './cookies';

const KEY = 'bgb.device_id';
const COOKIE = 'bgb_device_id';

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
    /* private mode / quota — cookie still has it */
  }
}

export function getDeviceId(): string {
  // Either storage is enough. Mirror both on every read so the surviving
  // value repopulates whichever one got purged.
  let id = safeLocalGet() ?? readCookie(COOKIE);
  if (!id) {
    id = crypto.randomUUID();
  }
  safeLocalSet(id);
  writeCookie(COOKIE, id);
  return id;
}
