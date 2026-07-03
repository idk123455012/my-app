import { useCallback, useEffect, useState } from 'react';
import type { College } from '../data/types';
import { colleges as fallbackColleges } from '../data/colleges';
import { fetchCollegesBulk } from './collegeScorecard';
import { loadLocal, saveLocal, deleteLocal } from './storage';

// Bumping this version string invalidates any cache saved by a previous
// (possibly broken) build — without this, a bad result cached in someone's
// browser early on could get reused for up to a week regardless of how many
// times the site gets redeployed, since localStorage lives in the browser,
// not on the server.
const CACHE_KEY = 'collegeDatabase_v2';
const CACHE_TIME_KEY = 'collegeDatabaseFetchedAt_v2';
const CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 1 week

export function useCollegeDatabase() {
  const [colleges, setColleges] = useState<College[]>(() => loadLocal<College[]>(CACHE_KEY) ?? fallbackColleges);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(() => !loadLocal<College[]>(CACHE_KEY));

  const runFetch = useCallback((forceRefresh = false) => {
    if (!forceRefresh) {
      const fetchedAt = loadLocal<number>(CACHE_TIME_KEY) ?? 0;
      const isStale = Date.now() - fetchedAt > CACHE_MAX_AGE_MS;
      const cached = loadLocal<College[]>(CACHE_KEY);
      if (cached && cached.length > 50 && !isStale) return; // solid fresh cache, nothing to do
    }

    setLoading(true);
    setError(null);
    fetchCollegesBulk(60) // 60 pages x 100 = up to 6,000 colleges
      .then((data) => {
        if (data.length > 50) {
          setColleges(data);
          setUsingFallback(false);
          saveLocal(CACHE_KEY, data);
          saveLocal(CACHE_TIME_KEY, Date.now());
        } else if (data.length > 0) {
          // Got a partial result, better than nothing but worth flagging
          setColleges(data);
          setUsingFallback(false);
          setError(`Only loaded ${data.length} colleges instead of thousands — the API may be rate-limiting or partially unreachable.`);
        } else {
          setError('Received zero results from the College Scorecard API. Check that the API key is valid and not rate-limited.');
        }
      })
      .catch((err) => {
        setError(err?.message ?? 'Failed to reach the College Scorecard API.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    runFetch(false);
  }, [runFetch]);

  const refresh = useCallback(() => {
    deleteLocal(CACHE_KEY);
    deleteLocal(CACHE_TIME_KEY);
    runFetch(true);
  }, [runFetch]);

  return { colleges, loading, error, usingFallback, refresh };
}
