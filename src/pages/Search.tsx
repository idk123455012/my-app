import { useState } from 'react';
import { useCollegeDatabase } from '../lib/useCollegeDatabase';
import { asPercent } from '../lib/format';

export default function Search() {
  const { colleges, loading, error } = useCollegeDatabase();
  const [query, setQuery] = useState('');

  const filtered = query
    ? colleges.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.state.toLowerCase().includes(query.toLowerCase()) ||
          c.city.toLowerCase().includes(query.toLowerCase())
      )
    : colleges.slice(0, 50);

  return (
    <div className="pb-24 md:pb-8 px-5 pt-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-textPrimary mb-1">Search</h1>
      <p className="text-textSecondary text-sm mb-4">
        {loading ? 'Loading colleges…' : `${colleges.length.toLocaleString()} colleges available`}
      </p>
      {error && (
        <div className="bg-cmHC/10 border border-cmHC/25 rounded-xl p-3 mb-4 text-xs text-cmHC">
          Couldn't load the full college database ({error}). Showing a smaller starter list instead.
        </div>
      )}

      <input
        type="text"
        placeholder="Search by name, city, or state…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-surfaceMid border border-borderC rounded-xl px-4 py-3 text-sm text-textPrimary mb-5"
      />

      <div className="grid md:grid-cols-2 gap-2">
        {filtered.map((c) => (
          <div key={c.id} className="bg-surfaceMid border border-borderC rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cmBlue text-white font-bold flex items-center justify-center shrink-0">
              {c.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-textPrimary text-sm truncate">{c.name}</p>
              <p className="text-xs text-textTertiary">{c.city}, {c.state}</p>
            </div>
            <span className="text-xs font-bold text-cmGold shrink-0">{asPercent(c.admissions.acceptanceRate)}</span>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="text-textSecondary text-sm text-center py-8 col-span-2">No colleges found matching "{query}"</p>
        )}
      </div>
    </div>
  );
}
