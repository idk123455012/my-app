import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  GraduationCap, Sun, Moon, Menu, X, ChevronDown,
  Search, ClipboardList, Heart, Brain, FileEdit, Star,
  ArrowLeftRight, DollarSign, BadgeCheck, UserRound, CheckSquare,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const explore = [
  { to: '/search', label: 'Search Colleges', Icon: Search, desc: 'Browse 6,000+ schools' },
  { to: '/results', label: 'My Matches', Icon: ClipboardList, desc: 'Your personalized list' },
  { to: '/favorites', label: 'Favorites', Icon: Heart, desc: 'Schools you\'ve saved' },
  { to: '/compare', label: 'Compare Schools', Icon: ArrowLeftRight, desc: 'Side-by-side analysis' },
];

const tools = [
  { to: '/advisor', label: 'AI Advisor', Icon: Brain, desc: 'Ask Alex your questions' },
  { to: '/essay-review', label: 'Essay Review', Icon: FileEdit, desc: 'Instant feedback' },
  { to: '/scholarships', label: 'Scholarships', Icon: Star, desc: 'Find funding' },
  { to: '/net-price', label: 'Net Price Calculator', Icon: DollarSign, desc: 'Estimate real cost' },
  { to: '/outcomes', label: 'My Outcomes', Icon: BadgeCheck, desc: 'Log your results' },
  { to: '/tracker', label: 'Application Tracker', Icon: CheckSquare, desc: 'Deadlines & essays' },
];

export default function SiteNav() {
  const { theme, toggleTheme } = useTheme();
  const [openMenu, setOpenMenu] = useState<'explore' | 'tools' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-surfaceMid border-b border-borderC">
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <GraduationCap size={26} className="text-cmGold" />
          <span className="font-bold text-lg text-textPrimary">CollegePath</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 relative">
          <NavItem to="/" label="Home" />

          <DropdownNav
            label="Explore"
            items={explore}
            isOpen={openMenu === 'explore'}
            onToggle={() => setOpenMenu(openMenu === 'explore' ? null : 'explore')}
            onClose={() => setOpenMenu(null)}
          />
          <DropdownNav
            label="Tools"
            items={tools}
            isOpen={openMenu === 'tools'}
            onToggle={() => setOpenMenu(openMenu === 'tools' ? null : 'tools')}
            onClose={() => setOpenMenu(null)}
          />

          <NavItem to="/profile" label="My Profile" />
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle light/dark mode"
            className="w-9 h-9 rounded-full bg-surfaceLight border border-borderC flex items-center justify-center"
          >
            {theme === 'dark' ? <Sun size={16} className="text-cmGold" /> : <Moon size={16} className="text-cmBlue" />}
          </button>
          <Link to="/profile" className="hidden sm:flex items-center gap-1.5 bg-cmBlue text-white text-sm font-semibold px-4 py-2 rounded-full">
            <UserRound size={14} /> Account
          </Link>
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center text-textPrimary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-borderC bg-surfaceMid px-5 py-4 flex flex-col gap-1">
          <MobileLink to="/" label="Home" onClick={() => setMobileOpen(false)} />
          <p className="text-[10px] uppercase font-bold text-textTertiary mt-3 mb-1 px-2">Explore</p>
          {explore.map((item) => <MobileLink key={item.to} to={item.to} label={item.label} onClick={() => setMobileOpen(false)} />)}
          <p className="text-[10px] uppercase font-bold text-textTertiary mt-3 mb-1 px-2">Tools</p>
          {tools.map((item) => <MobileLink key={item.to} to={item.to} label={item.label} onClick={() => setMobileOpen(false)} />)}
          <p className="text-[10px] uppercase font-bold text-textTertiary mt-3 mb-1 px-2">Account</p>
          <MobileLink to="/profile" label="My Profile" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </header>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm font-semibold px-4 py-2 rounded-full ${isActive ? 'bg-cmBlue text-white' : 'text-textSecondary hover:bg-surfaceLight'}`
      }
    >
      {label}
    </NavLink>
  );
}

interface DropdownItem { to: string; label: string; Icon: typeof Search; desc: string }

function DropdownNav({ label, items, isOpen, onToggle, onClose }: {
  label: string; items: DropdownItem[]; isOpen: boolean; onToggle: () => void; onClose: () => void;
}) {
  return (
    <div className="relative" onMouseLeave={onClose}>
      <button
        onClick={onToggle}
        onMouseEnter={onToggle}
        className={`text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-1 ${isOpen ? 'bg-surfaceLight text-textPrimary' : 'text-textSecondary hover:bg-surfaceLight'}`}
      >
        {label} <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-surfaceMid border border-borderC rounded-xl shadow-2xl p-2 z-40">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-surfaceLight"
            >
              <item.Icon size={18} className="text-cmBlue mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-textPrimary">{item.label}</p>
                <p className="text-xs text-textTertiary">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileLink({ to, label, onClick }: { to: string; label: string; onClick: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `text-sm font-medium px-2 py-2.5 rounded-lg ${isActive ? 'bg-cmBlue text-white' : 'text-textSecondary'}`
      }
    >
      {label}
    </NavLink>
  );
}
