'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadProfile, isProfileComplete, toggleFavorite, isFavorite } from '../../lib/store';
import { useColleges } from '../../lib/useColleges';
import { categorizeAll, summarize, CATEGORY_LABELS, CATEGORY_COLORS } from '../../lib/matchEngine';

export default function ResultsPage() {
  const [profile, setProfile] = useState(null);
  const [filter, setFilter] = useState(null);
  const [, forceRerender] = useState(0);
  const { colleges, loading } = useColleges();

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const categorized = useMemo(() => {
    if (!profile || colleges.length === 0) return [];
    return categorizeAll(colleges, profile);
  }, [profile, colleges]);

  const summary = useMemo(() => summarize(categorized), [categorized]);

  if (!profile) return null;

  if (!isProfileComplete(profile)) {
    return (
      <div className="container">
        <h1>Results</h1>
        <div className="card">
          <p>Complete your profile first to see your matches.</p>
          <a href="/profile"><button className="btn btn-primary">Complete Profile</button></a>
        </div>
      </div>
    );
  }

  const displayed = filter ? categorized.filter((c) => c.category === filter) : categorized;

  return (
    <div className="container">
      <h1>Your Results</h1>
      <p className="muted">{loading ? 'Loading colleges…' : `${summary.total} colleges analyzed`}</p>

      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        {['safety', 'match', 'reach', 'highlyCompetitive'].map((cat) => (
          <div
            key={cat}
            className="card"
            style={{
              textAlign: 'center', cursor: 'pointer', padding: 12,
              border: filter === cat ? `2px solid ${CATEGORY_COLORS[cat]}` : undefined,
            }}
            onClick={() => setFilter(filter === cat ? null : cat)}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: CATEGORY_COLORS[cat] }}>
              {summary[cat].length}
            </div>
            <div style={{ fontSize: 11, color: 'var(--cm-text-secondary)' }}>{CATEGORY_LABELS[cat]}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        {displayed.slice(0, 100).map(({ college, category, matchScore }) => (
          <div className="college-row" key={college.name}>
            <div>
              <div style={{ fontWeight: 700 }}>{college.name}</div>
              <div className="muted" style={{ fontSize: 12 }}>
                {college.city}, {college.state} · {(college.acceptanceRate * 100).toFixed(1)}% acceptance
              </div>
              <span className="pill" style={{ background: `${CATEGORY_COLORS[category]}22`, color: CATEGORY_COLORS[category], marginTop: 6 }}>
                {CATEGORY_LABELS[category]} · {matchScore}% match
              </span>
            </div>
            <button
              className={`heart-btn ${isFavorite(college.name) ? 'active' : ''}`}
              onClick={() => { toggleFavorite(college.name); forceRerender((n) => n + 1); }}
              aria-label={isFavorite(college.name) ? `Remove ${college.name} from favorites` : `Add ${college.name} to favorites`}
            >
              {isFavorite(college.name) ? '♥' : '♡'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
