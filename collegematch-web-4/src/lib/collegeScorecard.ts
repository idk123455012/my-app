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
      averageGPA: 3.5, // Scorecard doesn't report this; kept as a neutral default
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
 * Fetches multiple pages up front to build a larger local dataset
 * (e.g. 10 pages x 100 = 1,000 colleges). Increase `pages` for more —
 * be mindful this makes that many API calls on load.
 */
export async function fetchCollegesBulk(pages = 10): Promise<College[]> {
  const results = await Promise.all(
    Array.from({ length: pages }, (_, i) => fetchColleges(i, 100))
  );
  return results.flat();
}
