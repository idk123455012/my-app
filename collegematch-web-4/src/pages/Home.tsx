import { Link } from 'react-router-dom';
import { loadLocal } from '../lib/storage';
import { emptyProfile } from '../data/types';
import type { StudentProfile } from '../data/types';
import { useCollegeDatabase } from '../lib/useCollegeDatabase';
import { categorizeAll } from '../lib/matchEngine';
import { asPercent } from '../lib/format';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning ☀️';
  if (h < 18) return 'Good afternoon ☀️';
  return 'Good evening 🌙';
}

export default function Home() {
  const profile = loadLocal<StudentProfile>('studentProfile') ?? emptyProfile();
  const hasProfile = profile.academic.unweightedGPA > 0;
  const { colleges, loading } = useCollegeDatabase();

  const categorized = categorizeAll(colleges, profile);
  const counts = {
    Safety: categorized.filter((c) => c.category === 'Safety').length,
    Match: categorized.filter((c) => c.category === 'Match').length,
    Reach: categorized.filter((c) => c.category === 'Reach').length,
    'Highly Competitive': categorized.filter((c) => c.category === 'Highly Competitive').length,
  };

  const featured = colleges.slice(0, 4);

  // rough profile completeness estimate
  const completion = [
    profile.academic.unweightedGPA > 0,
    profile.academic.hasSAT || profile.academic.hasACT,
    profile.personal.homeState !== '',
    profile.academic.intendedMajor !== '',
    profile.activities.extracurriculars.length > 0,
  ].filter(Boolean).length;
  const completionPct = Math.round((completion / 5) * 100);

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-950 to-purple-950 px-6 pt-8 pb-10">
        <p className="text-textSecondary text-sm mb-1">{greeting()}</p>
        <h1 className="text-2xl font-bold text-white mb-2">Find Your Perfect College</h1>
        <p className="text-textSecondary text-sm mb-5">
          {hasProfile ? `${colleges.length.toLocaleString()} colleges analyzed for your profile.` : 'Complete your profile to see your matches.'}
        </p>
        {!hasProfile && (
          <Link to="/profile" className="inline-flex items-center gap-2 bg-cmGold text-cmNavy font-bold px-5 py-3 rounded-full text-sm">
            👤 Complete Profile
          </Link>
        )}
      </div>

      <div className="px-5 -mt-5">
        {/* Profile completion card */}
        <Link to="/profile" className="block bg-surfaceMid border border-borderC rounded-xl p-4 flex items-center gap-4 mb-6 shadow-lg">
          <div className="relative w-12 h-12 shrink-0">
            <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" stroke="rgb(var(--border))" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="16" fill="none" stroke="#3380ff" strokeWidth="3"
                strokeDasharray={`${completionPct} 100`} strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-cmBlue">{completionPct}%</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-textPrimary text-sm">Complete Your Profile</p>
            <p className="text-xs text-textSecondary">Fill in your GPA, test scores, and preferences to see your college matches.</p>
          </div>
          <span className="text-textTertiary">›</span>
        </Link>

        {/* Match summary */}
        <h2 className="font-bold text-textPrimary mb-3">Your Match Summary</h2>
        <div className="grid grid-cols-4 gap-2 mb-8">
          <StatBox icon="✅" count={counts.Safety} label="Safety" color="text-cmSafety" />
          <StatBox icon="🔵" count={counts.Match} label="Match" color="text-cmMatch" />
          <StatBox icon="🔺" count={counts.Reach} label="Reach" color="text-cmReach" />
          <StatBox icon="🔥" count={counts['Highly Competitive']} label="Highly Competitive" color="text-cmHC" />
        </div>

        {/* Featured colleges */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-textPrimary">Featured Colleges</h2>
          <Link to="/results" className="text-cmGold text-sm font-semibold">See All</Link>
        </div>
        {loading && colleges.length === 0 ? (
          <p className="text-textSecondary text-sm">Loading colleges…</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {featured.map((c) => (
              <div key={c.id} className="bg-white text-cmNavy rounded-xl p-4 relative">
                <div className="w-9 h-9 rounded-lg bg-cmHC text-white font-bold flex items-center justify-center mb-3">
                  {c.name[0]}
                </div>
                <span className="absolute top-4 right-4 text-lg">🤍</span>
                <p className="font-bold text-sm leading-tight mb-1">{c.name}</p>
                <p className="text-xs text-gray-500 mb-3">📍 {c.city}, {c.state}</p>
                <div className="flex justify-between text-xs font-semibold">
                  <div>
                    <div>{asPercent(c.admissions.acceptanceRate)}</div>
                    <div className="text-gray-400 font-normal">Accept</div>
                  </div>
                  <div>
                    <div>{c.rankings.usNewsNational ? `#${c.rankings.usNewsNational}` : '—'}</div>
                    <div className="text-gray-400 font-normal">Rank</div>
                  </div>
                  <div>
                    <div>${Math.round(c.financials.tuitionOutOfState / 1000)}k</div>
                    <div className="text-gray-400 font-normal">Tuition</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ icon, count, label, color }: { icon: string; count: number; label: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-3 text-center">
      <div className="text-lg mb-1">{icon}</div>
      <div className={`text-xl font-bold ${color}`}>{count}</div>
      <div className="text-[9px] text-gray-500 font-semibold leading-tight mt-0.5">{label}</div>
    </div>
  );
}
