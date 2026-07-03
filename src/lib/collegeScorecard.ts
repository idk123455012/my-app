import type { College } from '../data/types';

// U.S. Department of Education College Scorecard API.
// Free, public, no billing attached — get a key at:
// https://collegescorecard.ed.gov/data/api-documentation/
//
// PUT YOUR KEY HERE:
const API_KEY = '5Dv762s4X7oIcqvAd79FWYnaq3DIGhSkH6t4wPF5';

const BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1/schools.json';

const FIELDS = [
  'id', 'school.name', 'school.city', 'school.state', 'school.school_url',
  'school.ownership',
  'latest.admissions.admission_rate.overall',
  'latest.admissions.sat_scores.25th_percentile.critical_reading',
  'latest.admissions.sat_scores.75th_percentile.critical_reading',
  'latest.admissions.sat_scores.average.overall',
  'latest.admissions.act_scores.25th_percentile.cumulative',
  'latest.admissions.act_scores.75th_percentile.cumulative',
  'latest.cost.tuition.in_state',
  'latest.cost.tuition.out_of_state',
  'latest.cost.avg_net_price.overall',
  'latest.cost.roomboard.oncampus',
  'latest.completion.rate_suppressed.overall',
  'latest.student.size',
].join(',');

interface ScorecardResult {
  id: number;
  'school.name': string;
  'school.city': string;
  'school.state': string;
  'school.school_url': string;
  'school.ownership': number; // 1=public, 2=private nonprofit, 3=private for-profit
  'latest.admissions.admission_rate.overall': number | null;
  'latest.admissions.sat_scores.25th_percentile.critical_reading': number | null;
  'latest.admissions.sat_scores.75th_percentile.critical_reading': number | null;
  'latest.admissions.sat_scores.average.overall': number | null;
  'latest.admissions.act_scores.25th_percentile.cumulative': number | null;
  'latest.admissions.act_scores.75th_percentile.cumulative': number | null;
  'latest.cost.tuition.in_state': number | null;
  'latest.cost.tuition.out_of_state': number | null;
  'latest.cost.avg_net_price.overall': number | null;
  'latest.cost.roomboard.oncampus': number | null;
  'latest.completion.rate_suppressed.overall': number | null;
  'latest.student.size': number | null;
}

function institutionType(ownership: number): College['institutionType'] {
  if (ownership === 1) return 'Public';
  if (ownership === 3) return 'For-Profit';
  return 'Private';
}

// The College Scorecard API doesn't publish an "average admitted GPA" field
// at all, so we estimate it from acceptance rate — more selective schools
// reliably admit students with higher average GPAs. This is a heuristic,
// not an exact published figure, but it's far more accurate for comparison
// purposes than treating every school as identical.
function estimateAverageGPA(acceptanceRate: number): number {
  if (acceptanceRate < 0.10) return 3.9;
  if (acceptanceRate < 0.20) return 3.8;
  if (acceptanceRate < 0.35) return 3.65;
  if (acceptanceRate < 0.50) return 3.45;
  if (acceptanceRate < 0.70) return 3.25;
  return 3.0;
}

function toCollege(r: ScorecardResult): College {
  return {
    id: String(r.id),
    name: r['school.name'],
    shortName: r['school.name'],
    websiteURL: r['school.school_url'] ? `https://${r['school.school_url'].replace(/^https?:\/\//, '')}` : '',
    description: '',
    institutionType: institutionType(r['school.ownership']),
    city: r['school.city'] ?? '',
    state: r['school.state'] ?? '',
    admissions: {
      acceptanceRate: r['latest.admissions.admission_rate.overall'] ?? 0.5,
      satRange: {
        low: r['latest.admissions.sat_scores.25th_percentile.critical_reading'] ?? 0,
        high: r['latest.admissions.sat_scores.75th_percentile.critical_reading'] ?? 0,
      },
      actRange: {
        low: r['latest.admissions.act_scores.25th_percentile.cumulative'] ?? 0,
        high: r['latest.admissions.act_scores.75th_percentile.cumulative'] ?? 0,
      },
      averageGPA: estimateAverageGPA(r['latest.admissions.admission_rate.overall'] ?? 0.5),
    },
    financials: {
      tuitionInState: r['latest.cost.tuition.in_state'] ?? 0,
      tuitionOutOfState: r['latest.cost.tuition.out_of_state'] ?? 0,
      roomAndBoard: r['latest.cost.roomboard.oncampus'] ?? 0,
      averageNetPrice: r['latest.cost.avg_net_price.overall'] ?? 0,
    },
    academics: {
      graduationRate: r['latest.completion.rate_suppressed.overall'] ?? 0,
      studentFacultyRatio: 0,
      popularMajors: [],
    },
    studentLife: {
      undergradEnrollment: r['latest.student.size'] ?? 0,
    },
    rankings: {},
  };
}

/**
 * Fetches a page of colleges from College Scorecard.
 * perPage max is 100 per API call; paginate with `page` to build a larger set.
 */
export async function fetchColleges(page = 0, perPage = 100): Promise<College[]> {
  const params = new URLSearchParams({
    api_key: API_KEY,
    fields: FIELDS,
    per_page: String(perPage),
    page: String(page),
    'school.operating': '1',
    'school.degrees_awarded.predominant': '3', // bachelor's-degree-granting institutions
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`College Scorecard API error: ${res.status}`);
  const json = await res.json();
  return (json.results as ScorecardResult[]).map(toCollege);
}

/**
 * Fetches multiple pages to build a larger local dataset.
 * Uses batched, resilient fetching: if a handful of individual page requests
 * fail (rate limits, brief network blips), we keep whatever pages succeeded
 * instead of throwing away the entire result — which is what a plain
 * Promise.all would do on a single failure.
 */
export async function fetchCollegesBulk(pages = 60, batchSize = 10): Promise<College[]> {
  const all: College[] = [];
  let consecutiveFailures = 0;

  for (let start = 0; start < pages; start += batchSize) {
    const batchPages = Array.from(
      { length: Math.min(batchSize, pages - start) },
      (_, i) => start + i
    );

    const settled = await Promise.allSettled(batchPages.map((p) => fetchColleges(p, 100)));

    let batchHadSuccess = false;
    for (const result of settled) {
      if (result.status === 'fulfilled') {
        all.push(...result.value);
        batchHadSuccess = true;
        consecutiveFailures = 0;
        // A page with fewer than 100 results means we've hit the end of the dataset.
        if (result.value.length < 100 && result.value.length > 0) {
          return all;
        }
      }
    }

    if (!batchHadSuccess) {
      consecutiveFailures++;
      // Stop only if several consecutive batches failed entirely —
      // a couple of isolated failures shouldn't abandon the whole fetch.
      if (consecutiveFailures >= 3) break;
    }
  }

  return all;
}
