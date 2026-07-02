import { Link } from 'react-router-dom';
import { loadLocal } from '../lib/storage';
import type { StudentProfile } from '../data/types';

export default function Home() {
  const profile = loadLocal<StudentProfile>('studentProfile');
  const hasProfile = !!profile && profile.academic.unweightedGPA > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center text-4xl shadow-lg shadow-cmBlue/30 mb-4">
          🎓
        </div>
        <h1 className="text-3xl font-bold text-cmTextPrimary mb-2">College Match</h1>
        <p className="text-cmTextSecondary">Your personalized college list, built around your exact stats.</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {['6,000+ Colleges', 'Personalized Match', 'Net Price Calc'].map((f) => (
          <span key={f} className="text-xs font-semibold bg-cmBlue/10 border border-cmBlue/25 text-cmTextPrimary px-3 py-1.5 rounded-full">
            {f}
          </span>
        ))}
      </div>

      <div className="bg-cmNavyMid border border-cmBorder rounded-md p-6 text-center">
        {hasProfile ? (
          <>
            <p className="text-cmTextSecondary mb-4">Your profile is ready. See your personalized college list.</p>
            <Link to="/results" className="inline-block bg-cmGold text-cmNavy font-bold px-6 py-3 rounded-md">
              View My Results →
            </Link>
          </>
        ) : (
          <>
            <p className="text-cmTextSecondary mb-4">Enter your GPA and test scores to get started — takes about 3 minutes.</p>
            <Link to="/profile" className="inline-block bg-cmBlue text-white font-bold px-6 py-3 rounded-md">
              Build My Profile →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
