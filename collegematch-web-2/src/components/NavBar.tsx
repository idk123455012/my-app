import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'Home', icon: '🎓' },
  { to: '/profile', label: 'Profile', icon: '📝' },
  { to: '/results', label: 'Results', icon: '📊' },
  { to: '/favorites', label: 'Favorites', icon: '❤️' },
];

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-10 bg-cmNavy/95 backdrop-blur border-b border-cmBorder">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-cmGold text-lg">🎓</span>
          <span className="font-bold text-cmTextPrimary">College Match</span>
        </div>
        <div className="flex gap-1">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                  isActive ? 'bg-cmBlue text-white' : 'text-cmTextSecondary hover:bg-white/5'
                }`
              }
            >
              {t.icon} {t.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
