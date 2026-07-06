'use client';
// useColleges.js
// College Path — Web
//
// Fetches from /api/colleges once, caches in sessionStorage so navigating
// between pages doesn't refetch, mirrors CollegeDataStore.swift's
// in-memory cache behavior.

import { useEffect, useState } from 'react';

const CACHE_KEY = 'collegepath.collegesCache';

export function useColleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('local');

  useEffect(() => {
    const cached = typeof window !== 'undefined' ? window.sessionStorage.getItem(CACHE_KEY) : null;
    if (cached) {
      const parsed = JSON.parse(cached);
      setColleges(parsed.colleges);
      setSource(parsed.source);
      setLoading(false);
      return;
    }
    fetch('/api/colleges')
      .then((r) => r.json())
      .then((data) => {
        setColleges(data.colleges);
        setSource(data.source);
        setLoading(false);
        window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
      })
      .catch(() => setLoading(false));
  }, []);

  return { colleges, loading, source };
}
