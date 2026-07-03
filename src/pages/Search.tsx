import { useState } from 'react';
import { SearchIcon, MapPin, AlertTriangle } from 'lucide-react';
import { useCollegeDatabase } from '../lib/useCollegeDatabase';
import { matchesCollegeQuery } from '../lib/collegeAliases';
import { asPercent } from '../lib/format';

export default function Search() {
  const { colleges, loading, error } = useCollegeDatabase();
  const [query, setQuery] = useState('');

  const filtered = query
    ? colleges.filter(
        (c) =>
          matchesCollegeQuery(c.name, query) ||
          c.state.toLowerCase().includes(query.toLowerCase()) ||
          c.city.toLowerCase().includes(query.toLowerCase())
      )
    : colleges.slice(0, 60);

  return (
    <div className="pb-8 px-6 md:px-10 pt-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-textPrimary mb-1">Search Colleges</h1>
      <p className="text-textSecondary text-sm mb-5">
        {loading ? 'Loading colleges…' : `${colleges.length.toLocaleString()} colleges available`}
      </p>
      {error && (
        <div className="flex items-start gap-2 bg-cmHC/10 border border-cmHC/25 rounded-xl p-3 mb-5 text-xs text-cmHC">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          Couldn't load the full college database ({error}). Showing a smaller starter list instead.
        </div>
      )}

      <div className="relative mb-6">
        <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-textTertiary" />
        <input
          type="text"
          placeholder="Search by name, abbreviation (GMU, UVA, MIT…), city, or state…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-surfaceMid border border-borderC rounded-xl pl-11 pr-4 py-3.5 text-sm text-textPrimary"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((c) => (
          <div key={c.id} className="bg-surfaceMid border border-borderC rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cmBlue text-white font-bold flex items-center justify-center shrink-0">
              {c.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-textPrimary text-sm truncate">{c.name}</p>
              <p className="text-xs text-textTertiary flex items-center gap-1"><MapPin size={10} /> {c.city}, {c.state}</p>
            </div>
            <span className="text-xs font-bold text-cmGold shrink-0">{asPercent(c.admissions.acceptanceRate)}</span>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="text-textSecondary text-sm text-center py-8 col-span-full">No colleges found matching "{query}"</p>
        )}
      </div>
    </div>
  );
}
