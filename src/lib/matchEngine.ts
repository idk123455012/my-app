import type { College, StudentProfile, CategorizedCollege, CollegeCategory } from '../data/types';

function actToSAT(act: number): number {
  const table: Record<number, number> = {
    36: 1580, 35: 1540, 34: 1500, 33: 1460, 32: 1420, 31: 1390, 30: 1360,
    29: 1320, 28: 1280, 27: 1240, 26: 1200, 25: 1160, 24: 1120, 23: 1080,
    22: 1040, 21: 1000, 20: 960, 19: 920, 18: 870, 17: 820,
  };
  return table[act] ?? Math.max(400, act * 20);
}

/** Returns a 0-1 admission probability estimate. */
export function calculateChance(college: College, profile: StudentProfile): number {
  const acceptRate = college.admissions.acceptanceRate;
  let prob = acceptRate;

  const gpaGap = profile.academic.unweightedGPA - college.admissions.averageGPA;
  prob += gpaGap * 0.15;

  if (profile.academic.hasSAT || profile.academic.hasACT) {
    const studentSAT = profile.academic.hasSAT ? profile.academic.satScore : actToSAT(profile.academic.actScore);
    const { low, high } = college.admissions.satRange;
    const mid = (low + high) / 2;
    const spread = high - low;
    if (spread > 0) prob += ((studentSAT - mid) / spread) * 0.12;
  }

  if (profile.personal.isFirstGeneration) prob += 0.02;
  if (profile.personal.hasLegacyStatus) prob += 0.05;
  prob += (Math.min(profile.activities.activityStrengthScore, 10) / 10) * 0.04;

  let cap: number;
  if (acceptRate < 0.08) cap = 0.30;
  else if (acceptRate < 0.15) cap = 0.45;
  else if (acceptRate < 0.25) cap = 0.60;
  else if (acceptRate < 0.40) cap = 0.78;
  else cap = 0.95;

  return Math.max(0.01, Math.min(prob, cap));
}

export function chanceLabel(p: number): string {
  if (p >= 0.70) return 'Very Likely';
  if (p >= 0.45) return 'Good Chance';
  if (p >= 0.25) return 'Possible';
  if (p >= 0.10) return 'Reach';
  return 'Long Shot';
}

/** Categorizes a college as Safety / Match / Reach / Highly Competitive for a given student. */
export function categorize(college: College, profile: StudentProfile): CategorizedCollege {
  const p = calculateChance(college, profile);
  let category: CollegeCategory;
  if (college.admissions.acceptanceRate < 0.15) category = 'Highly Competitive';
  else if (p >= 0.60) category = 'Safety';
  else if (p >= 0.30) category = 'Match';
  else category = 'Reach';

  return { college, category, matchScore: Math.round(p * 100) };
}

export function categorizeAll(colleges: College[], profile: StudentProfile): CategorizedCollege[] {
  return colleges.map((c) => categorize(c, profile));
}
