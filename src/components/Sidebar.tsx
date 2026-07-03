import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  GraduationCap, Sun, Moon, Menu, X,
  Home as HomeIcon, Search, ClipboardList, Heart, Brain, FileEdit, Star,
  ArrowLeftRight, DollarSign, BadgeCheck, UserRound, CheckSquare, MoreHorizontal,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const primaryLinks = [
  { to: '/', label: 'Home', Icon: HomeIcon },
  { to: '/search', label: 'Search Colleges', Icon: Search },
  { to: '/results', label: 'My Matches', Icon: ClipboardList },
  { to: '/favorites', label: 'Favorites', Icon: Heart },
];

const toolLinks = [
  { to: '/advisor', label: 'AI Advisor', Icon: Brain },
  { to: '/essay-review', label: 'Essay Review', Icon: FileEdit },
  { to: '/scholarships', label: 'Scholarships', Icon: Star },
  { to: '/net-price', label: 'Net Price Calculator', Icon: DollarSign },
  { to: '/tracker', label: 'Application Tracker', Icon: CheckSquare },
  { to: '/outcomes', label: 'My Outcomes', Icon: BadgeCheck },
];

const moreLinks = [
  { to: '/compare', label: 'Compare Schools', Icon: ArrowLeftRight },
  { to: '/profile', label: 'My Profile', Icon: UserRound },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface md:flex">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 bg-surfaceMid border-b border-borderC flex items-center justify-between px-4 h-14">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap size={22} className="text-cmGold" />
          <span className="font-bold text-textPrimary">CollegePath</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="w-8 h-8 rounded-full bg-surfaceLight border border-borderC flex items-center justify-center">
            {theme === 'dark' ? <Sun size={14} className="text-cmGold" /> : <Moon size={14} className="text-cmBlue" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="w-8 h-8 flex items-center justify-center text-textPrimary">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${mobileOpen ? 'block' : 'hidden'} md:block
        w-full md:w-64 shrink-0 bg-surfaceMid border-r border-borderC
        md:h-screen md:sticky md:top-0 md:overflow-y-auto
      `}>
        <div className="hidden md:flex items-center gap-2 px-5 h-16 border-b border-borderC">
          <GraduationCap size={24} className="text-cmGold" />
          <span className="font-bold text-lg text-textPrimary">CollegePath</span>
        </div>

        <nav className="p-4 flex flex-col gap-1">
          {primaryLinks.map((l) => <SideLink key={l.to} {...l} onClick={() => setMobileOpen(false)} />)}

          <p className="text-[10px] uppercase font-bold text-textTertiary mt-5 mb-1 px-3">Tools</p>
          {toolLinks.map((l) => <SideLink key={l.to} {...l} onClick={() => setMobileOpen(false)} />)}

          <p className="text-[10px] uppercase font-bold text-textTertiary mt-5 mb-1 px-3">More</p>
          {moreLinks.map((l) => <SideLink key={l.to} {...l} onClick={() => setMobileOpen(false)} />)}
        </nav>

        <div className="hidden md:flex items-center justify-between px-5 py-4 mt-auto border-t border-borderC">
          <span className="text-xs text-textTertiary">Theme</span>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full bg-surfaceLight border border-borderC flex items-center justify-center"
          >
            {theme === 'dark' ? <Sun size={14} className="text-cmGold" /> : <Moon size={14} className="text-cmBlue" />}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

function SideLink({ to, label, Icon, onClick }: { to: string; label: string; Icon: typeof HomeIcon; onClick: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
          isActive ? 'bg-cmBlue text-white' : 'text-textSecondary hover:bg-surfaceLight'
        }`
      }
    >
      <Icon size={17} />
      {label}
    </NavLink>
  );
}
