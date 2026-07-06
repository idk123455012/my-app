'use client';

import { useMemo, useState } from 'react';
import { useColleges } from '../../lib/useColleges';
import { toggleFavorite, isFavorite } from '../../lib/store';

export default function SearchPage() {
  const { colleges, loading } = useColleges();
  const [query, setQuery] = useState('');
  const [, forceRerender] = useState(0);

  const filtered = useMemo(() => {
    if (!query) return colleges.slice(0, 50);
    const q = query.toLowerCase();
    return colleges.filter((c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)).slice(0, 100);
  }, [colleges, query]);

  return (
    <div className="container">
      <h1>Search Colleges</h1>
      <div className="field">
        <input placeholder="Search by name or state…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <p className="muted">{loading ? 'Loading…' : `${filtered.length} shown`}</p>

      <div className="card" style={{ padding: 0 }}>
        {filtered.map((c) => (
          <div className="college-row" key={c.name}>
            <div>
              <div style={{ fontWeight: 700 }}>{c.name}</div>
              <div className="muted" style={{ fontSize: 12 }}>{c.city}, {c.state} · {(c.acceptanceRate * 100).toFixed(1)}% acceptance</div>
            </div>
            <button
              className={`heart-btn ${isFavorite(c.name) ? 'active' : ''}`}
              onClick={() => { toggleFavorite(c.name); forceRerender((n) => n + 1); }}
              aria-label={isFavorite(c.name) ? `Remove ${c.name} from favorites` : `Add ${c.name} to favorites`}
            >
              {isFavorite(c.name) ? '♥' : '♡'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
