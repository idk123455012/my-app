import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { GraduationCap, Activity, UserRound, DollarSign, SlidersHorizontal, BarChart3, ClipboardList, BookOpen, Star, HeartHandshake, Tag, Search } from 'lucide-react';
import { emptyProfile } from '../data/types';
import type { StudentProfile } from '../data/types';
import { loadLocal, saveLocal } from '../lib/storage';

type Tab = 'Academic' | 'Activities' | 'Personal' | 'Financial' | 'Preferences';
const TABS: { key: Tab; Icon: LucideIcon }[] = [
  { key: 'Academic', Icon: GraduationCap },
  { key: 'Activities', Icon: Activity },
  { key: 'Personal', Icon: UserRound },
  { key: 'Financial', Icon: DollarSign },
  { key: 'Preferences', Icon: SlidersHorizontal },
];

export default function Profile() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('Academic');
  const [profile, setProfile] = useState<StudentProfile>(
    () => loadLocal<StudentProfile>('studentProfile') ?? emptyProfile()
  );

  function update<K extends keyof StudentProfile>(section: K, patch: Partial<StudentProfile[K]>) {
    const next = { ...profile, [section]: { ...profile[section], ...patch } };
    setProfile(next);
    saveLocal('studentProfile', next); // autosave, like the app
  }

  const completion = [
    profile.academic.unweightedGPA > 0,
    profile.academic.hasSAT || profile.academic.hasACT,
    profile.personal.homeState !== '',
    profile.academic.intendedMajor !== '',
    profile.activities.extracurriculars.length > 0,
  ].filter(Boolean).length;
  const completionPct = Math.round((completion / 5) * 100);

  return (
    <div className="pb-24 md:pb-8 px-5 pt-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-textPrimary mb-4">My Profile</h1>

      <div className="mb-5">
        <div className="flex justify-between text-xs font-semibold mb-1.5">
          <span className="text-textSecondary">Profile Completion</span>
          <span className="text-cmBlue">{completionPct}%</span>
        </div>
        <div className="h-1.5 bg-surfaceLight rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cmBlue to-indigo-600" style={{ width: `${completionPct}%` }} />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-6 pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-xs font-semibold ${
              tab === t.key ? 'bg-cmBlue text-white' : 'bg-surfaceLight text-textSecondary'
            }`}
          >
            <t.Icon size={18} />
            {t.key}
          </button>
        ))}
      </div>

      {tab === 'Academic' && (
        <div className="flex flex-col gap-4">
          <Card title="GPA" Icon={BarChart3}>
            <NumberField label="Unweighted GPA" value={profile.academic.unweightedGPA} max={4} step={0.01}
              onChange={(v) => update('academic', { unweightedGPA: v })} />
            <NumberField label="Weighted GPA" value={profile.academic.weightedGPA} max={5} step={0.01}
              onChange={(v) => update('academic', { weightedGPA: v })} />
          </Card>
          <Card title="Test Scores" Icon={ClipboardList}>
            <NumberField label="SAT Score" value={profile.academic.satScore} max={1600}
              onChange={(v) => update('academic', { satScore: v, hasSAT: v > 0 })} />
            <NumberField label="ACT Score" value={profile.academic.actScore} max={36}
              onChange={(v) => update('academic', { actScore: v, hasACT: v > 0 })} />
          </Card>
          <Card title="Coursework" Icon={BookOpen}>
            <NumberField label="AP Courses Taken" value={profile.academic.apCoursesCount} max={20}
              onChange={(v) => update('academic', { apCoursesCount: v })} />
            <TextField label="Intended Major" value={profile.academic.intendedMajor}
              onChange={(v) => update('academic', { intendedMajor: v })} />
          </Card>
        </div>
      )}

      {tab === 'Activities' && (
        <div className="flex flex-col gap-4">
          <Card title="Extracurricular Activities" Icon={Star}>
            <ListField
              items={profile.activities.extracurriculars}
              placeholder="Add activity (e.g. Band, Debate)…"
              onChange={(items) => update('activities', { extracurriculars: items })}
            />
          </Card>
          <Card title="Volunteer Hours" Icon={HeartHandshake}>
            <NumberField label="Total Hours" value={profile.activities.volunteerHours} max={2000}
              onChange={(v) => update('activities', { volunteerHours: v })} />
          </Card>
        </div>
      )}

      {tab === 'Personal' && (
        <div className="flex flex-col gap-4">
          <Card title="Basic Info" Icon={UserRound}>
            <TextField label="Full Name" value={profile.personal.fullName}
              onChange={(v) => update('personal', { fullName: v })} />
            <TextField label="Home State (2-letter)" value={profile.personal.homeState}
              onChange={(v) => update('personal', { homeState: v.toUpperCase().slice(0, 2) })} />
          </Card>
          <Card title="Background" Icon={Tag}>
            <CheckField label="First-generation college student" checked={profile.personal.isFirstGeneration}
              onChange={(v) => update('personal', { isFirstGeneration: v })} />
            <CheckField label="Legacy status at a school I'm considering" checked={profile.personal.hasLegacyStatus}
              onChange={(v) => update('personal', { hasLegacyStatus: v })} />
          </Card>
        </div>
      )}

      {tab === 'Financial' && (
        <div className="flex flex-col gap-4">
          <Card title="Financial Planning" Icon={DollarSign}>
            <p className="text-sm text-textSecondary">
              Use the Net Price Calculator from Results to estimate real costs at specific schools based on income.
            </p>
          </Card>
        </div>
      )}

      {tab === 'Preferences' && (
        <div className="flex flex-col gap-4">
          <Card title="College Preferences" Icon={SlidersHorizontal}>
            <p className="text-sm text-textSecondary">
              More preference filters (campus size, setting, Greek life, etc.) can be added here as the app grows.
            </p>
          </Card>
        </div>
      )}

      <button
        onClick={() => navigate('/results')}
        disabled={profile.academic.unweightedGPA <= 0}
        className="w-full bg-gradient-to-r from-cmBlue to-indigo-600 text-white font-bold py-4 rounded-xl mt-6 disabled:opacity-40 flex items-center justify-center gap-2"
      >
        <Search size={18} /> Find My Colleges
      </button>
    </div>
  );
}

function Card({ title, Icon, children }: { title: string; Icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="bg-surfaceMid border border-borderC rounded-xl p-4">
      <h3 className="flex items-center gap-2 font-bold text-textPrimary text-sm mb-3">
        <Icon size={16} />{title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function NumberField({ label, value, max, step = 1, onChange }: { label: string; value: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-textSecondary">{label}</span>
        <span className="font-bold text-cmBlue">{value > 0 ? value : 'Not set'}</span>
      </div>
      <input
        type="range" min={0} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-cmBlue"
      />
    </label>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-xs text-textSecondary mb-1.5">{label}</span>
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surfaceLight border border-borderC rounded-lg px-3 py-2.5 text-sm text-textPrimary"
      />
    </label>
  );
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-textSecondary">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-cmBlue" />
      {label}
    </label>
  );
}

function ListField({ items, placeholder, onChange }: { items: string[]; placeholder: string; onChange: (items: string[]) => void }) {
  const [draft, setDraft] = useState('');
  function add() {
    if (!draft.trim()) return;
    onChange([...items, draft.trim()]);
    setDraft('');
  }
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text" value={draft} placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          className="flex-1 bg-surfaceLight border border-borderC rounded-lg px-3 py-2.5 text-sm text-textPrimary"
        />
        <button onClick={add} className="bg-cmBlue text-white font-bold px-4 rounded-lg text-sm">+</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="text-xs bg-cmBlue/10 text-cmBlue border border-cmBlue/25 px-2.5 py-1 rounded-full">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
