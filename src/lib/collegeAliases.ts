// Common abbreviations and nicknames students actually search for.
// Maps abbreviation -> substring(s) that should appear in the college's
// official name for a match. Search checks both directions: typing "GMU"
// matches "George Mason University", and typing "George Mason" still works
// normally via the plain name search.
export const COLLEGE_ALIASES: Record<string, string> = {
  gmu: 'george mason',
  uva: 'university of virginia',
  vt: 'virginia tech',
  vtech: 'virginia tech',
  jmu: 'james madison',
  nova: 'northern virginia community',
  wm: 'william & mary',
  'w&m': 'william & mary',
  vcu: 'virginia commonwealth',
  odu: 'old dominion',
  radford: 'radford university',
  ut: 'university of texas',
  usc: 'university of southern california',
  ucla: 'university of california, los angeles',
  berkeley: 'university of california, berkeley',
  mit: 'massachusetts institute of technology',
  gt: 'georgia institute of technology',
  gatech: 'georgia institute of technology',
  unc: 'university of north carolina',
  nyu: 'new york university',
  bu: 'boston university',
  bc: 'boston college',
  umd: 'university of maryland',
  psu: 'pennsylvania state',
  osu: 'ohio state',
  asu: 'arizona state',
  fsu: 'florida state',
  uf: 'university of florida',
};

/**
 * Returns true if the search query matches the college name, either
 * directly or through a known abbreviation.
 */
export function matchesCollegeQuery(collegeName: string, query: string): boolean {
  const name = collegeName.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return true;
  if (name.includes(q)) return true;

  const alias = COLLEGE_ALIASES[q];
  if (alias && name.includes(alias)) return true;

  return false;
}
