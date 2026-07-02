import { Link } from 'react-router-dom';
import { loadLocal } from '../lib/storage';

const items = [
  { to: '/profile', icon: '👤', title: 'My Profile', subtitle: 'Complete your info', color: 'bg-cmBlue/15' },
  { to: '/favorites', icon: '❤️', title: 'Favorites', subtitle: '0 saved', color: 'bg-cmHC/15' },
  { to: '/compare', icon: '🔀', title: 'Compare Schools', subtitle: 'Side-by-side analysis', color: 'bg-cmGold/15' },
  { to: '/scholarships', icon: '⭐', title: 'Scholarships', subtitle: 'Find funding', color: 'bg-cmGold/15' },
  { to: '/net-price', icon: '💲', title: 'Net Price Calculator', subtitle: 'Estimate real costs', color: 'bg-cmSafety/15' },
  { to: '/outcomes', icon: '✅', title: 'My Outcomes', subtitle: 'Log your results', color: 'bg-cmSafety/15' },
];

export default function More() {
  const favCount = (loadLocal<string[]>('favoriteIds') ?? []).length;

  return (
    <div className="pb-24 px-5 pt-6">
      <h1 className="text-2xl font-bold text-textPrimary mb-5">More</h1>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`${item.color} border border-borderC rounded-xl p-4 flex flex-col gap-2`}
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-bold text-textPrimary text-sm">{item.title}</p>
              <p className="text-xs text-textTertiary">
                {item.title === 'Favorites' ? `${favCount} saved` : item.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
