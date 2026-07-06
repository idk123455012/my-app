'use client';

import { useEffect, useState } from 'react';
import { loadProfile, isProfileComplete, completionPercentage } from '../lib/store';
import { useColleges } from '../lib/useColleges';

export default function Home() {
  const [profile, setProfile] = useState(null);
  const { colleges, loading, source } = useColleges();

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  if (!profile) return null;

  const complete = isProfileComplete(profile);
  const pct = Math.round(completionPercentage(profile) * 100);

  return (
    <div className="container">
      <h1>College Path</h1>
      <p className="muted">Your personalized college list, built around your exact stats.</p>

      <div className="card" style={{ marginTop: 20 }}>
        {complete ? (
          <>
            <h2>Welcome back{profile.firstName ? `, ${profile.firstName}` : ''}</h2>
            <p className="muted">Your profile is ready. Check your results.</p>
            <a href="/results"><button className="btn btn-primary" style={{ marginTop: 12 }}>View My Results</button></a>
          </>
        ) : (
          <>
            <h2>Get started</h2>
            <p className="muted">Fill in your GPA, test scores, and preferences ({pct}% done) to see your matches.</p>
            <a href="/profile"><button className="btn btn-primary" style={{ marginTop: 12 }}>Complete Your Profile</button></a>
          </>
        )}
      </div>

      <div className="card">
        <h2>College database</h2>
        <p className="muted">
          {loading ? 'Loading colleges…' : `${colleges.length.toLocaleString()} colleges loaded${source === 'local' ? ' (local dataset — add COLLEGE_SCORECARD_API_KEY for the full 6,000+ list)' : ''}`}
        </p>
      </div>

      <div className="grid-2">
        <a href="/search"><div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>🔍<br />Search Colleges</div></a>
        <a href="/favorites"><div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>❤️<br />My Favorites</div></a>
      </div>
    </div>
  );
}
