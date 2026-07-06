'use client';

import { useEffect, useState } from 'react';
import { loadProfile, saveProfile } from '../../lib/store';

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  if (!profile) return null;

  function update(field, value) {
    const next = { ...profile, [field]: value };
    setProfile(next);
    setSaved(false);
  }

  function handleSave() {
    saveProfile(profile);
    setSaved(true);
  }

  return (
    <div className="container">
      <h1>My Profile</h1>
      <p className="muted">This stays in your browser's local storage on this device.</p>

      <div className="card">
        <h2>Basics</h2>
        <div className="field">
          <label>First Name</label>
          <input value={profile.firstName} onChange={(e) => update('firstName', e.target.value)} />
        </div>
        <div className="field">
          <label>Home State</label>
          <select value={profile.homeState} onChange={(e) => update('homeState', e.target.value)}>
            <option value="">Select…</option>
            {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <h2>Academics</h2>
        <div className="grid-2">
          <div className="field">
            <label>Unweighted GPA</label>
            <input type="number" step="0.01" min="0" max="4" value={profile.unweightedGPA || ''}
                   onChange={(e) => update('unweightedGPA', parseFloat(e.target.value) || 0)} />
          </div>
          <div className="field">
            <label>Weighted GPA</label>
            <input type="number" step="0.01" min="0" max="5" value={profile.weightedGPA || ''}
                   onChange={(e) => update('weightedGPA', parseFloat(e.target.value) || 0)} />
          </div>
        </div>
        <div className="grid-2">
          <div className="field">
            <label>SAT Score</label>
            <input type="number" min="0" max="1600" value={profile.satScore || ''}
                   onChange={(e) => update('satScore', parseInt(e.target.value) || 0)} />
          </div>
          <div className="field">
            <label>ACT Score</label>
            <input type="number" min="0" max="36" value={profile.actScore || ''}
                   onChange={(e) => update('actScore', parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <div className="grid-3">
          <div className="field">
            <label>AP Courses</label>
            <input type="number" min="0" value={profile.apCourses || ''}
                   onChange={(e) => update('apCourses', parseInt(e.target.value) || 0)} />
          </div>
          <div className="field">
            <label>Honors Courses</label>
            <input type="number" min="0" value={profile.honorsCourses || ''}
                   onChange={(e) => update('honorsCourses', parseInt(e.target.value) || 0)} />
          </div>
          <div className="field">
            <label>Dual Enrollment</label>
            <input type="number" min="0" value={profile.dualEnrollment || ''}
                   onChange={(e) => update('dualEnrollment', parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <div className="field">
          <label>Intended Major</label>
          <input value={profile.intendedMajor} onChange={(e) => update('intendedMajor', e.target.value)} placeholder="e.g. Computer Science" />
        </div>
      </div>

      <div className="card">
        <h2>Other</h2>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" style={{ width: 'auto' }} checked={profile.isFirstGeneration}
                 onChange={(e) => update('isFirstGeneration', e.target.checked)} />
          First-generation college student
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, cursor: 'pointer' }}>
          <input type="checkbox" style={{ width: 'auto' }} checked={profile.hasLegacyStatus}
                 onChange={(e) => update('hasLegacyStatus', e.target.checked)} />
          Legacy status
        </label>
      </div>

      <button className="btn btn-primary" onClick={handleSave}>
        {saved ? 'Saved ✓' : 'Save Profile'}
      </button>
      {saved && (
        <a href="/results">
          <button className="btn btn-secondary" style={{ marginTop: 10 }}>View My Results →</button>
        </a>
      )}
    </div>
  );
}
