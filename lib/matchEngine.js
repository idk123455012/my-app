// matchEngine.js
// College Path — Web
//
// Direct port of CollegeMatchEngine.swift's determineCategory logic.
// Kept structurally identical (same bands, same thresholds, same acceptance
// rate tiers) on purpose — this is the same categorization behavior as the
// iOS app, not a reimplementation from scratch, so results should match.

const ACT_TO_SAT = {
  36: 1580, 35: 1540, 34: 1500, 33: 1460, 32: 1420,
  31: 1390, 30: 1360, 29: 1320, 28: 1280, 27: 1240,
  26: 1200, 25: 1160, 24: 1120, 23: 1080, 22: 1040,
  21: 1000, 20: 960, 19: 920, 18: 870, 17: 820,
};

function actToSat(act) {
  return ACT_TO_SAT[act] || Math.max(400, act * 20);
}

// Percentile band values, matching the Swift enum's rawValue ordering:
// belowTwentyFifth=0, aboveTwentyFifth=1, middle=2, above75th=3, wellAbove75th=4
const BAND = {
  below25th: 0,
  above25th: 1,
  middle: 2,
  above75th: 3,
  wellAbove75th: 4,
};

function collegeGPARange(college) {
  const rate = college.acceptanceRate;
  let lo, hi;
  if (rate < 0.05) { lo = 3.90; hi = 4.00; }
  else if (rate < 0.10) { lo = 3.82; hi = 3.98; }
  else if (rate < 0.15) { lo = 3.75; hi = 3.95; }
  else if (rate < 0.20) { lo = 3.68; hi = 3.90; }
  else if (rate < 0.28) { lo = 3.58; hi = 3.85; }
  else if (rate < 0.36) { lo = 3.48; hi = 3.78; }
  else if (rate < 0.45) { lo = 3.35; hi = 3.70; }
  else if (rate < 0.55) { lo = 3.20; hi = 3.60; }
  else if (rate < 0.65) { lo = 3.05; hi = 3.50; }
  else if (rate < 0.75) { lo = 2.90; hi = 3.35; }
  else if (rate < 0.85) { lo = 2.70; hi = 3.15; }
  else { lo = 2.40; hi = 2.95; }

  const stored = college.averageGPA;
  if (stored > 0 && stored !== 3.0) {
    const spread = (hi - lo) / 2.0;
    return [Math.max(stored - spread, 2.0), Math.min(stored + spread * 0.5, 4.0)];
  }
  return [lo, hi];
}

function gpaPercentileBand(college, profile) {
  const studentGPA = profile.unweightedGPA || 0;
  if (studentGPA <= 0) return BAND.below25th;
  const [lo, hi] = collegeGPARange(college);
  const mid = (lo + hi) / 2.0;
  const wellAbove = hi + (hi - mid) * 0.25;
  if (studentGPA >= wellAbove) return BAND.wellAbove75th;
  if (studentGPA >= hi) return BAND.above75th;
  if (studentGPA >= mid) return BAND.middle;
  if (studentGPA >= lo) return BAND.above25th;
  return BAND.below25th;
}

function testPercentileBand(college, profile) {
  let studentSAT;
  if (profile.satScore > 0) studentSAT = profile.satScore;
  else if (profile.actScore > 0) studentSAT = actToSat(profile.actScore);
  else return BAND.middle;

  const lo = college.satLow, hi = college.satHigh;
  if (!(lo > 600 && hi > 700)) return BAND.middle;

  const mid = (lo + hi) / 2;
  const spread = hi - lo;
  const wellAbove = hi + spread / 4;

  if (studentSAT >= wellAbove) return BAND.wellAbove75th;
  if (studentSAT >= hi) return BAND.above75th;
  if (studentSAT >= mid) return BAND.middle;
  if (studentSAT >= lo) return BAND.above25th;
  return BAND.below25th;
}

function rigorBand(profile) {
  const total = (profile.apCourses || 0) + (profile.honorsCourses || 0) / 2 + (profile.dualEnrollment || 0);
  if (total === 0) return 0.5;
  if (total <= 2) return 1.0;
  if (total <= 5) return 1.8;
  if (total <= 9) return 2.5;
  return 3.2;
}

function determineCategory(college, academicScore, profile) {
  const rate = college.acceptanceRate;
  let effectiveScore = academicScore;

  if (college.institutionType === 'public' && profile.homeState && college.state === profile.homeState) {
    effectiveScore = Math.min(effectiveScore + 0.5, 4.0);
  }
  if (profile.hasLegacyStatus && college.institutionType !== 'public') {
    effectiveScore = Math.min(effectiveScore + 0.3, 4.0);
  }

  // Same tier ladder as the Swift engine — including the important rule
  // that sub-12%-acceptance schools can NEVER be Match/Safety, only
  // Reach or Highly Competitive, regardless of how strong the profile is.
  if (rate < 0.12) {
    return effectiveScore >= 3.5 ? 'reach' : 'highlyCompetitive';
  }
  if (rate < 0.25) {
    if (effectiveScore >= 3.8) return 'match';
    if (effectiveScore >= 2.8) return 'reach';
    return 'highlyCompetitive';
  }
  if (rate < 0.42) {
    if (effectiveScore >= 3.5) return 'match';
    if (effectiveScore >= 2.0) return 'reach';
    return 'highlyCompetitive';
  }
  if (rate < 0.65) {
    if (effectiveScore >= 3.2) return 'safety';
    if (effectiveScore >= 1.8) return 'match';
    if (effectiveScore >= 0.8) return 'reach';
    return 'highlyCompetitive';
  }
  if (rate < 0.82) {
    if (effectiveScore >= 2.0) return 'safety';
    if (effectiveScore >= 0.5) return 'match';
    return 'reach';
  }
  return effectiveScore >= 0.5 ? 'safety' : 'match';
}

export function categorizeCollege(college, profile) {
  const gpaBand = gpaPercentileBand(college, profile);
  const testBand = testPercentileBand(college, profile);
  const hasTest = profile.satScore > 0 || profile.actScore > 0;

  let academicScore;
  if (hasTest) {
    academicScore = gpaBand * 0.55 + testBand * 0.45;
  } else {
    academicScore = gpaBand * 0.70 + rigorBand(profile) * 0.30;
  }

  const category = determineCategory(college, academicScore, profile);
  const matchScore = Math.round(Math.min(Math.max((academicScore / 4.0) * 100, 0), 100));

  return { college, category, matchScore };
}

export function categorizeAll(colleges, profile) {
  return colleges.map((c) => categorizeCollege(c, profile));
}

export function summarize(categorized) {
  return {
    safety: categorized.filter((c) => c.category === 'safety'),
    match: categorized.filter((c) => c.category === 'match'),
    reach: categorized.filter((c) => c.category === 'reach'),
    highlyCompetitive: categorized.filter((c) => c.category === 'highlyCompetitive'),
    total: categorized.length,
  };
}

// Chance Me — same acceptance-rate-tiered cap logic as ChanceCalculator.swift
export function calculateChance(college, profile) {
  const acceptRate = college.acceptanceRate;
  let prob = acceptRate;

  const gpaGap = (profile.unweightedGPA || 0) - college.averageGPA;
  prob += gpaGap * 0.15;

  if (profile.satScore > 0 || profile.actScore > 0) {
    const studentSAT = profile.satScore > 0 ? profile.satScore : actToSat(profile.actScore);
    const midSAT = (college.satLow + college.satHigh) / 2;
    const spread = college.satHigh - college.satLow;
    if (spread > 0) {
      prob += ((studentSAT - midSAT) / spread) * 0.12;
    }
  }

  if (profile.isFirstGeneration) prob += 0.02;
  if (profile.hasLegacyStatus) prob += 0.05;

  let cap;
  if (acceptRate < 0.08) cap = 0.30;
  else if (acceptRate < 0.15) cap = 0.45;
  else if (acceptRate < 0.25) cap = 0.60;
  else if (acceptRate < 0.40) cap = 0.78;
  else cap = 0.95;

  return Math.max(0.01, Math.min(prob, cap));
}

export function chanceLabel(probability) {
  if (probability >= 0.70) return 'Very Likely';
  if (probability >= 0.45) return 'Good Chance';
  if (probability >= 0.25) return 'Possible';
  if (probability >= 0.10) return 'Reach';
  return 'Long Shot';
}

export const CATEGORY_LABELS = {
  safety: 'Safety',
  match: 'Match',
  reach: 'Reach',
  highlyCompetitive: 'Highly Competitive',
};

export const CATEGORY_COLORS = {
  safety: '#0ea86f',
  match: '#3388ff',
  reach: '#ff9900',
  highlyCompetitive: '#e8384f',
};
