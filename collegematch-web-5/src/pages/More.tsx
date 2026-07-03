import { Link } from 'react-router-dom';
import { UserRound, Brain, FileEdit, Star, Heart, ArrowLeftRight, DollarSign, BadgeCheck } from 'lucide-react';
import { loadLocal } from '../lib/storage';

const items = [
  { to: '/profile', Icon: UserRound, title: 'My Profile', subtitle: 'Complete your info', color: 'bg-cmBlue/15 text-cmBlue' },
  { to: '/advisor', Icon: Brain, title: 'AI Advisor', subtitle: 'Ask Alex anything', color: 'bg-purple-500/15 text-purple-400' },
  { to: '/essay-review', Icon: FileEdit, title: 'Essay Review', subtitle: 'Get instant feedback', color: 'bg-indigo-500/15 text-indigo-400' },
  { to: '/scholarships', Icon: Star, title: 'Scholarships', subtitle: 'Find funding', color: 'bg-cmGold/15 text-cmGold' },
  { to: '/favorites', Icon: Heart, title: 'Favorites', subtitle: '0 saved', color: 'bg-cmHC/15 text-cmHC' },
  { to: '/compare', Icon: ArrowLeftRight, title: 'Compare Schools', subtitle: 'Side-by-side analysis', color: 'bg-cmGold/15 text-cmGold' },
  { to: '/net-price', Icon: DollarSign, title: 'Net Price Calculator', subtitle: 'Estimate real costs', color: 'bg-cmSafety/15 text-cmSafety' },
  { to: '/outcomes', Icon: BadgeCheck, title: 'My Outcomes', subtitle: 'Log your results', color: 'bg-cmSafety/15 text-cmSafety' },
];

export default function More() {
  const favCount = (loadLocal<string[]>('favoriteIds') ?? []).length;

  return (
    <div className="pb-24 md:pb-8 px-5 pt-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-textPrimary mb-5">More</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="bg-surfaceMid border border-borderC rounded-xl p-4 flex flex-col gap-3 hover:border-cmBlue/40 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
              <item.Icon size={20} />
            </div>
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
