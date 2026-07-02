import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { colleges } from '../data/colleges';
import { emptyProfile } from '../data/types';
import type { StudentProfile, CollegeCategory } from '../data/types';
import { categorizeAll } from '../lib/matchEngine';
import { loadLocal, saveLocal } from '../lib/storage';
import CollegeCard from '../components/CollegeCard';

const CATEGORIES: CollegeCategory[] = ['Safety', 'Match', 'Reach', 'Highly Competitive'];

export default function Results() {
  const profile = loadLocal<StudentProfile>('studentProfile') ?? emptyProfile();
  const favorites = loadLocal<string[]>('favoriteIds') ?? [];

  const categorized = useMemo(() => categorizeAll(colleges, profile), [profile]);

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    saveLocal('favoriteIds', next);
    // simple re-render trigger since we're not using state management here
    window.location.reload();
  }

  if (profile.academic.unweightedGPA <= 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-cmTextSecondary mb-4">You haven't built your profile yet.</p>
        <Link to="/profile" className="inline-block bg-cmBlue text-white font-bold px-6 py-3 rounded-md">
          Build My Profile →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-cmTextPrimary mb-1">Your College List</h1>
      <p className="text-cmTextSecondary text-sm mb-6">{categorized.length} colleges analyzed for your profile.</p>

      {CATEGORIES.map((cat) => {
        const items = categorized.filter((c) => c.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-cmTextPrimary">{cat}</h2>
              <span className="text-xs font-semibold text-cmTextSecondary bg-white/5 px-2.5 py-1 rounded-full">
                {items.length} school{items.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
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
