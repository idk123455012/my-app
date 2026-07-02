import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const tabs = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/search', label: 'Search', icon: '🔍' },
  { to: '/results', label: 'Results', icon: '📋' },
  { to: '/tracker', label: 'Tracker', icon: '✅' },
  { to: '/more', label: 'More', icon: '⋯' },
];

export default function BottomNav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* top bar: logo + theme toggle */}
      <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur border-b border-borderC">
        <div className="max-w-md mx-auto flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-cmGold text-lg">🎓</span>
            <span className="font-bold text-textPrimary">CollegePath</span>
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle light/dark mode"
            className="w-9 h-9 rounded-full bg-surfaceLight border border-borderC flex items-center justify-center text-sm"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-surfaceMid/95 backdrop-blur border-t border-borderC">
        <div className="max-w-md mx-auto flex items-center justify-around py-2">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold ${
                  isActive ? 'text-cmBlue' : 'text-textTertiary'
                }`
              }
            >
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
