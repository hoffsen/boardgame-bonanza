const KEY = 'bgb.display_name';

export function getDisplayName(): string | null {
  return localStorage.getItem(KEY);
}

export function setDisplayName(name: string): void {
  localStorage.setItem(KEY, name.trim());
}
