import { colleges } from '../data/colleges';
import { emptyProfile } from '../data/types';
import type { StudentProfile } from '../data/types';
import { categorize } from '../lib/matchEngine';
import { loadLocal, saveLocal } from '../lib/storage';
import CollegeCard from '../components/CollegeCard';

export default function Favorites() {
  const favorites = loadLocal<string[]>('favoriteIds') ?? [];
  const profile = loadLocal<StudentProfile>('studentProfile') ?? emptyProfile();
  const favColleges = colleges.filter((c) => favorites.includes(c.id));

  function toggleFavorite(id: string) {
    const next = favorites.filter((f) => f !== id);
    saveLocal('favoriteIds', next);
    window.location.reload();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-cmTextPrimary mb-6">Favorites</h1>
      {favColleges.length === 0 ? (
        <p className="text-cmTextSecondary">No favorites yet. Heart a college from your results to save it here.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {favColleges.map((college) => (
            <CollegeCard
              key={college.id}
              item={categorize(college, profile)}
              isFavorite
              onToggleFavorite={() => toggleFavorite(college.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
