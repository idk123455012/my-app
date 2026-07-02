import { useEffect, useState } from 'react';
import type { College } from '../data/types';
import { colleges as fallbackColleges } from '../data/colleges';
import { fetchCollegesBulk } from './collegeScorecard';
import { loadLocal, saveLocal } from './storage';

const CACHE_KEY = 'collegeDatabase';
const CACHE_TIME_KEY = 'collegeDatabaseFetchedAt';
const CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 1 week

export function useCollegeDatabase() {
  const [colleges, setColleges] = useState<College[]>(() => loadLocal<College[]>(CACHE_KEY) ?? fallbackColleges);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchedAt = loadLocal<number>(CACHE_TIME_KEY) ?? 0;
    const isStale = Date.now() - fetchedAt > CACHE_MAX_AGE_MS;
    const cached = loadLocal<College[]>(CACHE_KEY);

    if (cached && cached.length > 0 && !isStale) return; // fresh cache, nothing to do

    setLoading(true);
    fetchCollegesBulk(60) // 60 pages x 100 = up to 6,000 colleges
      .then((data) => {
        if (data.length > 0) {
          setColleges(data);
          saveLocal(CACHE_KEY, data);
          saveLocal(CACHE_TIME_KEY, Date.now());
        }
      })
      .catch((err) => {
        setError(err.message ?? 'Failed to load college database');
        // keep whatever we already have (cache or fallback) — don't blank the UI
      })
      .finally(() => setLoading(false));
  }, []);

  return { colleges, loading, error };
}
