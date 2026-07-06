// store.js
// College Path — Web
//
// Web equivalent of StudentProfile.swift + FavoritesManager.swift.
// Uses localStorage instead of Keychain — this is NOT encrypted at rest,
// unlike the iOS app's SecureStorage. That's an intentional, honest
// tradeoff of a browser-based version: there is no Keychain equivalent on
// the web. If this web version ever collects real student data beyond a
// single local session, it needs a real backend + auth + encryption at
// rest — don't treat localStorage as FERPA-equivalent to the iOS app.

const PROFILE_KEY = 'collegepath.profile';
const FAVORITES_KEY = 'collegepath.favorites';

const DEFAULT_PROFILE = {
  firstName: '',
  unweightedGPA: 0,
  weightedGPA: 0,
  satScore: 0,
  actScore: 0,
  apCourses: 0,
  honorsCourses: 0,
  dualEnrollment: 0,
  intendedMajor: '',
  homeState: '',
  isFirstGeneration: false,
  hasLegacyStatus: false,
};

export function loadProfile() {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function isProfileComplete(profile) {
  return profile.unweightedGPA > 0;
}

export function completionPercentage(profile) {
  let filled = 0;
  if (profile.unweightedGPA > 0) filled++;
  if (profile.satScore > 0 || profile.actScore > 0) filled++;
  if (profile.firstName) filled++;
  if (profile.intendedMajor) filled++;
  return filled / 4;
}

export function loadFavorites() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(collegeName) {
  const favs = loadFavorites();
  const idx = favs.indexOf(collegeName);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(collegeName);
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  return favs;
}

export function isFavorite(collegeName) {
  return loadFavorites().includes(collegeName);
}
