// app/api/colleges/route.js
// College Path — Web
//
// Server-side route (not client-side) so the College Scorecard API key
// never ships in browser-visible JS. Mirrors APIManager.swift + 
// CollegeDataStore.swift's behavior: pull from the live API, merge with
// the local seed list, and fall back to local-only if no key is set —
// same graceful-degradation pattern as the iOS app, not a rewrite of it.
//
// SETUP: get a free key at https://api.data.gov/signup (instant, no cost)
// then add it as an environment variable named COLLEGE_SCORECARD_API_KEY
// in your Vercel project settings (Project → Settings → Environment
// Variables). Without it, this route just returns the local ~67 colleges,
// same as the iOS app does when APIConfig.useMockData is true.

import { NextResponse } from 'next/server';
import localColleges from '../../../data/colleges.json';

const SCORECARD_FIELDS = [
  'school.name',
  'school.city',
  'school.state',
  'school.school_url',
  'school.ownership',
  'latest.admissions.admission_rate.overall',
  'latest.admissions.sat_scores.25th_percentile.critical_reading',
  'latest.admissions.sat_scores.75th_percentile.critical_reading',
  'latest.admissions.sat_scores.25th_percentile.math',
  'latest.admissions.sat_scores.75th_percentile.math',
  'latest.admissions.act_scores.25th_percentile.cumulative',
  'latest.admissions.act_scores.75th_percentile.cumulative',
  'latest.student.size',
  'latest.cost.tuition.in_state',
  'latest.cost.tuition.out_of_state',
  'latest.cost.avg_net_price.overall',
  'latest.completion.rate_suppressed.overall',
].join(',');

function mapScorecardSchool(s) {
  const satLow = (s['latest.admissions.sat_scores.25th_percentile.critical_reading'] || 0) +
                 (s['latest.admissions.sat_scores.25th_percentile.math'] || 0);
  const satHigh = (s['latest.admissions.sat_scores.75th_percentile.critical_reading'] || 0) +
                  (s['latest.admissions.sat_scores.75th_percentile.math'] || 0);
  return {
    name: s['school.name'],
    shortName: s['school.name'],
    websiteURL: s['school.school_url'] ? `https://${s['school.school_url']}` : '',
    description: '',
    institutionType: s['school.ownership'] === 1 ? 'public' : 'private',
    state: s['school.state'] || '',
    city: s['school.city'] || '',
    setting: 'suburban',
    campusSize: 'medium',
    undergradEnrollment: s['latest.student.size'] || 0,
    gradEnrollment: 0,
    acceptanceRate: s['latest.admissions.admission_rate.overall'] || 0,
    satLow: satLow || 0,
    satHigh: satHigh || 0,
    actLow: s['latest.admissions.act_scores.25th_percentile.cumulative'] || 0,
    actHigh: s['latest.admissions.act_scores.75th_percentile.cumulative'] || 0,
    averageGPA: 3.0,
    tuitionInState: s['latest.cost.tuition.in_state'] || 0,
    tuitionOutOfState: s['latest.cost.tuition.out_of_state'] || 0,
    roomAndBoard: 12000,
    averageNetPrice: s['latest.cost.avg_net_price.overall'] || 0,
    averageAidPackage: 0,
    needBlind: false,
    meetsFullNeed: false,
    meritScholarshipsAvailable: false,
    graduationRate: s['latest.completion.rate_suppressed.overall'] || 0,
    studentFacultyRatio: 15,
    popularMajors: [],
    usNewsNational: null,
    mascot: '',
    hasGreekLife: false,
    divisionI: false,
  };
}

async function fetchScorecardPage(apiKey, page) {
  const url = `https://api.data.gov/ed/collegescorecard/v1/schools.json` +
    `?api_key=${apiKey}&fields=${SCORECARD_FIELDS}&per_page=100&page=${page}` +
    `&latest.student.size__range=500..`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Scorecard API error: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

export async function GET() {
  const apiKey = process.env.COLLEGE_SCORECARD_API_KEY;

  if (!apiKey) {
    // Same fallback the iOS app uses when no key is configured.
    return NextResponse.json({ colleges: localColleges, source: 'local', count: localColleges.length });
  }

  try {
    const pages = await Promise.all([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => fetchScorecardPage(apiKey, p)));
    const apiSchools = pages.flat().map(mapScorecardSchool).filter((c) => c.name);

    // Merge: local seed data (which has richer hand-curated fields like
    // majors, mascots, need-blind status) takes priority; API fills in
    // everything else so the total count reflects the full dataset.
    const localNames = new Set(localColleges.map((c) => c.name.toLowerCase()));
    const merged = [...localColleges, ...apiSchools.filter((c) => !localNames.has(c.name.toLowerCase()))];
    merged.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ colleges: merged, source: 'api', count: merged.length });
  } catch (err) {
    // If the live API call fails for any reason, don't break the page —
    // fall back to local data, same principle as CollegeDataStore.swift's
    // .failure case.
    return NextResponse.json({ colleges: localColleges, source: 'local-fallback', count: localColleges.length, error: String(err) });
  }
}
