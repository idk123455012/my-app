import { Link } from 'react-router-dom';
import {
  GraduationCap, ArrowRight, ShieldCheck, CircleEqual, TrendingUp, Flame,
  Brain, FileEdit, Star, Search, MapPin, Heart,
} from 'lucide-react';
import { loadLocal } from '../lib/storage';
import { emptyProfile } from '../data/types';
import type { StudentProfile } from '../data/types';
import { useCollegeDatabase } from '../lib/useCollegeDatabase';
import { categorizeAll } from '../lib/matchEngine';
import { asPercent } from '../lib/format';

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
  const featured = colleges.slice(0, 3);

  return (
    <div>
      {/* Hero banner */}
      <section className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #3380ff 0%, transparent 40%), radial-gradient(circle at 80% 70%, #f2c748 0%, transparent 40%)',
        }} />
        <div className="relative max-w-[1600px] mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold text-white mb-6">
            <GraduationCap size={14} className="text-cmGold" /> Trusted college planning for high school students
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
            Find Colleges That<br />Actually Fit You
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            CollegePath analyzes your GPA, test scores, and preferences against 6,000+ real colleges —
            sorting every school into Safety, Match, Reach, or Highly Competitive, just for you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to={hasProfile ? '/results' : '/profile'} className="inline-flex items-center gap-2 bg-cmGold text-cmNavy font-bold px-7 py-3.5 rounded-full">
              {hasProfile ? 'View My Matches' : 'Build My Profile'} <ArrowRight size={16} />
            </Link>
            <Link to="/search" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-full">
              <Search size={16} /> Browse Colleges
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-borderC bg-surfaceMid">
        <div className="max-w-[1600px] mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <StatStrip value={loading ? '…' : colleges.length.toLocaleString()} label="Colleges Tracked" />
          <StatStrip value="U.S. Dept of Ed" label="Live Data Source" />
          <StatStrip value="On-Device" label="AI Advisor Privacy" />
          <StatStrip value="Free" label="Always, No Ads" />
        </div>
      </section>

      {/* Your matches (only if profile exists) */}
      {hasProfile && (
        <section className="max-w-[1600px] mx-auto px-6 py-14">
          <SectionHeader eyebrow="Your Results" title="Your Match Summary" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <CategoryCard Icon={ShieldCheck} count={counts.Safety} label="Safety" color="text-cmSafety" bg="bg-cmSafety/10" />
            <CategoryCard Icon={CircleEqual} count={counts.Match} label="Match" color="text-cmMatch" bg="bg-cmMatch/10" />
            <CategoryCard Icon={TrendingUp} count={counts.Reach} label="Reach" color="text-cmReach" bg="bg-cmReach/10" />
            <CategoryCard Icon={Flame} count={counts['Highly Competitive']} label="Highly Competitive" color="text-cmHC" bg="bg-cmHC/10" />
          </div>
          <Link to="/results" className="inline-flex items-center gap-1.5 text-cmBlue font-semibold text-sm">
            See your full list <ArrowRight size={14} />
          </Link>
        </section>
      )}

      {/* Featured colleges */}
      <section className="bg-surfaceMid border-y border-borderC">
        <div className="max-w-[1600px] mx-auto px-6 py-14">
          <SectionHeader eyebrow="Explore" title="Featured Colleges" />
          {loading && colleges.length === 0 ? (
            <p className="text-textSecondary text-sm">Loading colleges…</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {featured.map((c) => (
                <div key={c.id} className="bg-surface border border-borderC rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-cmBlue to-indigo-700 text-white font-bold flex items-center justify-center">
                      {c.name[0]}
                    </div>
                    <Heart size={18} className="text-textTertiary" />
                  </div>
                  <h3 className="font-bold text-textPrimary mb-1">{c.name}</h3>
                  <p className="text-xs text-textTertiary flex items-center gap-1 mb-4">
                    <MapPin size={11} /> {c.city}, {c.state}
                  </p>
                  <div className="flex justify-between text-xs font-semibold border-t border-borderC pt-3">
                    <div><div className="text-textPrimary">{asPercent(c.admissions.acceptanceRate)}</div><div className="text-textTertiary font-normal">Accept Rate</div></div>
                    <div><div className="text-textPrimary">${Math.round(c.financials.tuitionOutOfState / 1000)}k</div><div className="text-textTertiary font-normal">Tuition</div></div>
                    <div><div className="text-textPrimary">{c.rankings.usNewsNational ? `#${c.rankings.usNewsNational}` : '—'}</div><div className="text-textTertiary font-normal">Rank</div></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/search" className="inline-flex items-center gap-1.5 text-cmBlue font-semibold text-sm mt-6">
            Browse all {colleges.length.toLocaleString()} colleges <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-[1600px] mx-auto px-6 py-14">
        <SectionHeader eyebrow="Tools" title="Everything You Need to Apply" />
        <div className="grid md:grid-cols-3 gap-5">
          <ToolCard to="/advisor" Icon={Brain} title="AI Advisor" desc="Ask Alex about essays, deadlines, and strategy — runs entirely on your device." color="text-purple-400" bg="bg-purple-500/10" />
          <ToolCard to="/essay-review" Icon={FileEdit} title="Essay Review" desc="Instant feedback on word count, structure, and common clichés." color="text-indigo-400" bg="bg-indigo-500/10" />
          <ToolCard to="/scholarships" Icon={Star} title="Scholarship Finder" desc="Discover real national scholarships open to high school seniors." color="text-cmGold" bg="bg-cmGold/10" />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-bold uppercase tracking-wide text-cmBlue mb-1">{eyebrow}</p>
      <h2 className="text-2xl md:text-3xl font-bold text-textPrimary">{title}</h2>
    </div>
  );
}

function StatStrip({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-xl font-bold text-textPrimary">{value}</p>
      <p className="text-xs text-textTertiary mt-0.5">{label}</p>
    </div>
  );
}

function CategoryCard({ Icon, count, label, color, bg }: { Icon: typeof ShieldCheck; count: number; label: string; color: string; bg: string }) {
  return (
    <div className={`${bg} border border-borderC rounded-xl p-5 text-center`}>
      <Icon size={22} className={`mx-auto mb-2 ${color}`} />
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
      <p className="text-xs text-textSecondary font-semibold mt-1">{label}</p>
    </div>
  );
}

function ToolCard({ to, Icon, title, desc, color, bg }: { to: string; Icon: typeof Brain; title: string; desc: string; color: string; bg: string }) {
  return (
    <Link to={to} className="bg-surfaceMid border border-borderC rounded-xl p-6 hover:border-cmBlue/40 transition-colors">
      <div className={`w-11 h-11 rounded-lg ${bg} flex items-center justify-center mb-4`}>
        <Icon size={22} className={color} />
      </div>
      <h3 className="font-bold text-textPrimary mb-1.5">{title}</h3>
      <p className="text-sm text-textSecondary">{desc}</p>
    </Link>
  );
}
