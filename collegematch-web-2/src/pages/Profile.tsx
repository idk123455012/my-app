import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { emptyProfile } from '../data/types';
import type { StudentProfile } from '../data/types';
import { loadLocal, saveLocal } from '../lib/storage';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile>(
    () => loadLocal<StudentProfile>('studentProfile') ?? emptyProfile()
  );

  function update<K extends keyof StudentProfile>(section: K, patch: Partial<StudentProfile[K]>) {
    setProfile((p) => ({ ...p, [section]: { ...p[section], ...patch } }));
  }

  function handleSave() {
    saveLocal('studentProfile', profile);
    navigate('/results');
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-cmTextPrimary mb-1">Your Profile</h1>
      <p className="text-cmTextSecondary text-sm mb-6">Stored only in your browser — never sent anywhere.</p>

      <Section title="Academics">
        <Field label="Unweighted GPA (0–4.0)">
          <input
            type="number" step="0.01" min="0" max="4"
            value={profile.academic.unweightedGPA || ''}
            onChange={(e) => update('academic', { unweightedGPA: parseFloat(e.target.value) || 0 })}
            className="input"
          />
        </Field>
        <Field label="SAT Score (optional)">
          <input
            type="number" min="400" max="1600"
            value={profile.academic.satScore || ''}
            onChange={(e) => update('academic', { satScore: parseInt(e.target.value) || 0, hasSAT: !!e.target.value })}
            className="input"
          />
        </Field>
        <Field label="ACT Score (optional)">
          <input
            type="number" min="1" max="36"
            value={profile.academic.actScore || ''}
            onChange={(e) => update('academic', { actScore: parseInt(e.target.value) || 0, hasACT: !!e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Intended Major">
          <input
            type="text"
            value={profile.academic.intendedMajor}
            onChange={(e) => update('academic', { intendedMajor: e.target.value })}
            className="input"
          />
        </Field>
      </Section>

      <Section title="Personal">
        <Field label="Home State">
          <input
            type="text" maxLength={2} placeholder="e.g. VA"
            value={profile.personal.homeState}
            onChange={(e) => update('personal', { homeState: e.target.value.toUpperCase() })}
            className="input"
          />
        </Field>
        <Checkbox
          label="First-generation college student"
          checked={profile.personal.isFirstGeneration}
          onChange={(v) => update('personal', { isFirstGeneration: v })}
        />
        <Checkbox
          label="Legacy status at any school I'm considering"
          checked={profile.personal.hasLegacyStatus}
          onChange={(v) => update('personal', { hasLegacyStatus: v })}
        />
      </Section>

      <button
        onClick={handleSave}
        disabled={profile.academic.unweightedGPA <= 0}
        className="w-full bg-cmGold text-cmNavy font-bold py-3.5 rounded-md mt-4 disabled:opacity-40"
      >
        Save &amp; See My Results →
      </button>

      <style>{`
        .input {
          width: 100%;
          background: #1f2b57;
          border: 1px solid #42527f;
          border-radius: 10px;
          padding: 10px 12px;
          color: white;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-cmNavyMid border border-cmBorder rounded-md p-5 mb-4">
      <h2 className="text-base font-bold text-cmTextPrimary mb-4">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-cmTextSecondary mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-cmTextSecondary cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4" />
      {label}
    </label>
  );
}
