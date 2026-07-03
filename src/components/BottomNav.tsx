import { NavLink } from 'react-router-dom';
import { Home, Search as SearchIcon, ClipboardList, Brain, CheckSquare, MoreHorizontal, Sun, Moon, GraduationCap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const tabs = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/search', label: 'Search', Icon: SearchIcon },
  { to: '/results', label: 'Results', Icon: ClipboardList },
  { to: '/advisor', label: 'Advisor', Icon: Brain },
  { to: '/tracker', label: 'Tracker', Icon: CheckSquare },
  { to: '/more', label: 'More', Icon: MoreHorizontal },
];

export default function BottomNav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* top bar: logo + theme toggle */}
      <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur border-b border-borderC">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <GraduationCap size={22} className="text-cmGold" />
            <span className="font-bold text-textPrimary">CollegePath</span>
          </div>

          {/* desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                className={({ isActive }) =>
                  `text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                    isActive ? 'bg-cmBlue text-white' : 'text-textSecondary hover:bg-surfaceLight'
                  }`
                }
              >
                <t.Icon size={15} />{t.label}
              </NavLink>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle light/dark mode"
            className="w-9 h-9 rounded-full bg-surfaceLight border border-borderC flex items-center justify-center shrink-0"
          >
            {theme === 'dark' ? <Sun size={16} className="text-cmGold" /> : <Moon size={16} className="text-cmBlue" />}
          </button>
        </div>
      </div>

      {/* mobile-only bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-surfaceMid/95 backdrop-blur border-t border-borderC">
        <div className="max-w-md mx-auto flex items-center justify-around py-2">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[9px] font-semibold ${
                  isActive ? 'text-cmBlue' : 'text-textTertiary'
                }`
              }
            >
              <t.Icon size={18} />
              {t.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
