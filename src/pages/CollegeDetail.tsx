import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Heart, Share2, Percent, Award, CheckCircle2, Users,
  ShieldCheck, DollarSign, GraduationCap, Landmark, Info, ExternalLink,
  ClipboardList, UserRoundPlus,
} from 'lucide-react';
import { useCollegeDatabase } from '../lib/useCollegeDatabase';
import { emptyProfile } from '../data/types';
import type { StudentProfile } from '../data/types';
import { loadLocal, saveLocal } from '../lib/storage';
import { categorize } from '../lib/matchEngine';
import { asCurrency, asPercent, asEnrollment, categoryColor } from '../lib/format';

type Tab = 'Overview' | 'My Stats' | 'Admissions' | 'Costs' | 'Academics' | 'Campus';
const TABS: Tab[] = ['Overview', 'My Stats', 'Admissions', 'Costs', 'Academics', 'Campus'];

export default function CollegeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colleges } = useCollegeDatabase();
  const [tab, setTab] = useState<Tab>('Overview');
  const profile = loadLocal<StudentProfile>('studentProfile') ?? emptyProfile();
  const favorites = loadLocal<string[]>('favoriteIds') ?? [];

  const college = colleges.find((c) => c.id === id);

  if (!college) {
    return (
      <div className="px-6 md:px-10 pt-8 max-w-3xl mx-auto text-center py-20">
        <p className="text-textSecondary mb-4">College not found — it may still be loading.</p>
        <Link to="/search" className="text-cmBlue font-semibold">Back to Search</Link>
      </div>
    );
  }

  const result = categorize(college, profile);
  const isFavorite = favorites.includes(college.id);
  const hasProfile = profile.academic.unweightedGPA > 0;

  function toggleFavorite() {
    const next = isFavorite ? favorites.filter((f) => f !== college!.id) : [...favorites, college!.id];
    saveLocal('favoriteIds', next);
    window.location.reload();
  }

  return (
    <div className="pb-12">
      {/* Header banner */}
      <div className="bg-gradient-to-br from-indigo-950 to-purple-950 px-6 md:px-10 pt-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-300">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2">
            <button onClick={toggleFavorite} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <Heart size={16} className={isFavorite ? 'fill-cmHC text-cmHC' : 'text-white'} />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <Share2 size={16} className="text-white" />
            </button>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-white/15 text-white font-bold text-2xl flex items-center justify-center shrink-0">
            {college.name[0]}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{college.name}</h1>
            <p className="text-slate-300 text-sm mb-2">{college.city}, {college.state}</p>
            {hasProfile && (
              <span className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${categoryColor(result.category)}`}>
                {result.category}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 max-w-5xl mx-auto -mt-6">
        {/* Quick stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <QuickStat Icon={Percent} value={asPercent(college.admissions.acceptanceRate)} label="Acceptance" color="text-cmSafety" />
          <QuickStat Icon={Award} value={college.rankings.usNewsNational ? `#${college.rankings.usNewsNational}` : '—'} label="US News" color="text-cmGold" />
          <QuickStat Icon={CheckCircle2} value={asPercent(college.academics.graduationRate)} label="Grad Rate" color="text-cmSafety" />
          <QuickStat Icon={Users} value={asEnrollment(college.studentLife.undergradEnrollment)} label="Students" color="text-cmBlue" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-6 pb-1 border-b border-borderC">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px ${
                tab === t ? 'border-cmBlue text-cmBlue' : 'border-transparent text-textSecondary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Overview' && (
          <div className="flex flex-col gap-4">
            <Card title="About" Icon={Info}>
              <p className="text-sm text-textSecondary leading-relaxed">
                {college.description || `${college.name} is a ${college.institutionType.toLowerCase()} institution located in ${college.city}, ${college.state}.`}
              </p>
            </Card>
            {!hasProfile && (
              <Link to="/profile" className="flex items-center justify-between bg-cmBlue/10 border border-cmBlue/25 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <UserRoundPlus size={20} className="text-cmBlue" />
                  <div>
                    <p className="font-semibold text-textPrimary text-sm">Add your stats</p>
                    <p className="text-xs text-textSecondary">Compare your profile against this college</p>
                  </div>
                </div>
                <ArrowLeft size={16} className="text-cmBlue rotate-180" />
              </Link>
            )}
          </div>
        )}

        {tab === 'My Stats' && (
          <div className="flex flex-col gap-4">
            {!hasProfile ? (
              <Card title="No Profile Yet" Icon={Info}>
                <p className="text-sm text-textSecondary mb-3">Add your GPA and test scores to see how you compare.</p>
                <Link to="/profile" className="text-cmBlue font-semibold text-sm">Go to My Profile →</Link>
              </Card>
            ) : (
              <Card title="Match Score" Icon={ShieldCheck}>
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-bold ${categoryColor(result.category).split(' ')[0]}`}>{result.matchScore}%</div>
                  <div>
                    <p className="font-semibold text-textPrimary text-sm">{result.category}</p>
                    <p className="text-xs text-textSecondary">Estimated admission likelihood based on your profile</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-borderC">
                  <StatRow label="Your GPA" value={profile.academic.unweightedGPA.toFixed(2)} />
                  <StatRow label="School Avg (est.)" value={college.admissions.averageGPA.toFixed(2)} />
                  {profile.academic.hasSAT && <StatRow label="Your SAT" value={String(profile.academic.satScore)} />}
                  <StatRow label="SAT Range" value={`${college.admissions.satRange.low}–${college.admissions.satRange.high}`} />
                </div>
              </Card>
            )}
          </div>
        )}

        {tab === 'Admissions' && (
          <Card title="Admissions" Icon={ShieldCheck}>
            <StatRow label="Acceptance Rate" value={asPercent(college.admissions.acceptanceRate)} highlight />
            <StatRow label="Institution Type" value={college.institutionType} />
            <StatRow label="SAT Range (25th–75th)" value={`${college.admissions.satRange.low}–${college.admissions.satRange.high}`} />
            <StatRow label="ACT Range (25th–75th)" value={`${college.admissions.actRange.low}–${college.admissions.actRange.high}`} />
          </Card>
        )}

        {tab === 'Costs' && (
          <Card title="Cost" Icon={DollarSign}>
            <StatRow label="Tuition (Out-of-State)" value={asCurrency(college.financials.tuitionOutOfState)} />
            <StatRow label="Tuition (In-State)" value={asCurrency(college.financials.tuitionInState)} />
            <StatRow label="Room & Board" value={asCurrency(college.financials.roomAndBoard)} />
            <StatRow label="Average Net Price" value={asCurrency(college.financials.averageNetPrice)} highlight />
          </Card>
        )}

        {tab === 'Academics' && (
          <Card title="Academics" Icon={GraduationCap}>
            <StatRow label="Graduation Rate" value={asPercent(college.academics.graduationRate)} highlight />
            {college.academics.popularMajors.length > 0 && (
              <StatRow label="Popular Majors" value={college.academics.popularMajors.join(', ')} />
            )}
          </Card>
        )}

        {tab === 'Campus' && (
          <Card title="Campus" Icon={Landmark}>
            <StatRow label="Location" value={`${college.city}, ${college.state}`} />
            <StatRow label="Undergrad Students" value={asEnrollment(college.studentLife.undergradEnrollment)} />
          </Card>
        )}

        <p className="flex items-start gap-2 text-xs text-textTertiary mt-4">
          <Info size={13} className="shrink-0 mt-0.5" />
          Data sourced from the U.S. Dept. of Education College Scorecard. Some fields may be estimated where the government dataset doesn't publish them directly.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <a
            href={college.websiteURL || '#'}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-surfaceMid border border-borderC text-textPrimary font-bold py-3.5 rounded-xl"
          >
            <ExternalLink size={16} /> Visit Website
          </a>
          <a
            href={college.websiteURL ? `${college.websiteURL.replace(/\/$/, '')}/apply` : '#'}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cmBlue to-indigo-600 text-white font-bold py-3.5 rounded-xl"
          >
            <ClipboardList size={16} /> Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ Icon, value, label, color }: { Icon: typeof Percent; value: string; label: string; color: string }) {
  return (
    <div className="bg-surfaceMid border border-borderC rounded-xl p-3 text-center">
      <Icon size={16} className={`mx-auto mb-1 ${color}`} />
      <p className="font-bold text-textPrimary text-sm">{value}</p>
      <p className="text-[10px] text-textTertiary font-semibold">{label}</p>
    </div>
  );
}

function Card({ title, Icon, children }: { title: string; Icon: typeof Info; children: React.ReactNode }) {
  return (
    <div className="bg-surfaceMid border border-borderC rounded-xl p-5">
      <h3 className="flex items-center gap-2 font-bold text-textPrimary mb-4">
        <Icon size={17} className="text-cmBlue" />{title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function StatRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-borderC last:border-0">
      <span className="text-sm text-textSecondary">{label}</span>
      <span className={`text-sm font-bold ${highlight ? 'text-cmSafety' : 'text-textPrimary'}`}>{value}</span>
    </div>
  );
}
