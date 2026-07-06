'use client';

import { useEffect, useMemo, useState } from 'react';
import { useColleges } from '../../lib/useColleges';
import { loadFavorites, toggleFavorite } from '../../lib/store';

export default function FavoritesPage() {
  const { colleges, loading } = useColleges();
  const [favNames, setFavNames] = useState([]);

  useEffect(() => {
    setFavNames(loadFavorites());
  }, []);

  const favoritedColleges = useMemo(
    () => colleges.filter((c) => favNames.includes(c.name)),
    [colleges, favNames]
  );

  function remove(name) {
    toggleFavorite(name);
    setFavNames(loadFavorites());
  }

  return (
    <div className="container">
      <h1>My Favorites</h1>
      <p className="muted">{loading ? 'Loading…' : `${favoritedColleges.length} saved`}</p>

      {favoritedColleges.length === 0 && !loading && (
        <div className="card">
          <p className="muted">No favorites yet. Save colleges from Search or Results.</p>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        {favoritedColleges.map((c) => (
          <div className="college-row" key={c.name}>
            <div>
              <div style={{ fontWeight: 700 }}>{c.name}</div>
              <div className="muted" style={{ fontSize: 12 }}>{c.city}, {c.state}</div>
            </div>
            <button className="heart-btn active" onClick={() => remove(c.name)} aria-label={`Remove ${c.name} from favorites`}>♥</button>
          </div>
        ))}
      </div>
    </div>
  );
}
