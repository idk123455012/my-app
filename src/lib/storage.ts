// Browser storage helper. On the web there's no Keychain — localStorage is
// the standard equivalent. It isn't hardware-encrypted the way iOS Keychain
// is, but it's private to your domain and never sent to a server unless you
// explicitly build a backend later.

const PREFIX = 'collegematch.';

export function saveLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — fail silently, same spirit as the Swift version
  }
}

export function loadLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function deleteLocal(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

export function clearAllAppData(): void {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}
