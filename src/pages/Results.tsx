import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { emptyProfile } from '../data/types';
import type { StudentProfile, CollegeCategory } from '../data/types';
import { categorizeAll } from '../lib/matchEngine';
import { loadLocal, saveLocal } from '../lib/storage';
import { useCollegeDatabase } from '../lib/useCollegeDatabase';
import CollegeCard from '../components/CollegeCard';

const CATEGORIES: CollegeCategory[] = ['Safety', 'Match', 'Reach', 'Highly Competitive'];

export default function Results() {
  const profile = loadLocal<StudentProfile>('studentProfile') ?? emptyProfile();
  const favorites = loadLocal<string[]>('favoriteIds') ?? [];
  const { colleges, loading } = useCollegeDatabase();

  const categorized = useMemo(() => categorizeAll(colleges, profile), [colleges, profile]);

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    saveLocal('favoriteIds', next);
    // simple re-render trigger since we're not using state management here
    window.location.reload();
  }

  if (profile.academic.unweightedGPA <= 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-textSecondary mb-4">You haven't built your profile yet.</p>
        <Link to="/profile" className="inline-flex items-center gap-2 bg-cmBlue text-white font-bold px-6 py-3 rounded-md">
          Build My Profile <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-textPrimary mb-1">Your College List</h1>
      <p className="text-textSecondary text-sm mb-6">
        {loading ? 'Loading full college database…' : `${categorized.length.toLocaleString()} colleges analyzed for your profile.`}
      </p>

      {CATEGORIES.map((cat) => {
        const items = categorized.filter((c) => c.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-textPrimary">{cat}</h2>
              <span className="text-xs font-semibold text-textSecondary bg-white/5 px-2.5 py-1 rounded-full">
                {items.length} school{items.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item) => (
                <CollegeCard
                  key={item.college.id}
                  item={item}
                  isFavorite={favorites.includes(item.college.id)}
                  onToggleFavorite={() => toggleFavorite(item.college.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
