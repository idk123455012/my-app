import { useState } from 'react';
import { saveLocal } from '../lib/storage';

const pages = [
  {
    icon: '🎓',
    title: 'Find Your Perfect College',
    subtitle: 'Personalized matches, not generic lists.',
    detail: 'CollegePath uses your GPA, test scores, and preferences to categorize every college into Safety, Match, Reach, and Highly Competitive — just for you.',
    color: 'from-cmBlue to-indigo-800',
  },
  {
    icon: '🧠',
    title: 'Ask Alex Anything',
    subtitle: 'Instant guidance, built for your profile.',
    detail: 'Ask Alex — your built-in college advisor — about which schools to apply to or how to approach your essays, tailored to your stats.',
    color: 'from-purple-600 to-purple-900',
  },
  {
    icon: '⭐',
    title: '6,000+ Colleges, Live Data',
    subtitle: 'Powered by the U.S. Department of Education.',
    detail: 'Real acceptance rates, tuition, SAT ranges, and graduation rates — updated directly from the College Scorecard API. Save favorites, compare side-by-side, and apply with confidence.',
    color: 'from-cmGold to-amber-600',
  },
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [page, setPage] = useState(0);
  const isLast = page === pages.length - 1;
  const current = pages[page];

  function finish() {
    saveLocal('hasSeenOnboarding', true);
    onComplete();
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col px-6 py-8">
      <div className="flex justify-end mb-8">
        {!isLast && (
          <button onClick={finish} className="text-sm text-textSecondary">Skip</button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${current.color} bg-opacity-20 border-2 border-white/10 flex items-center justify-center text-6xl mb-8`}>
          {current.icon}
        </div>
        <h1 className="text-2xl font-bold text-textPrimary mb-3">{current.title}</h1>
        <p className="text-cmBlue font-semibold mb-3">{current.subtitle}</p>
        <p className="text-textSecondary text-sm leading-relaxed max-w-sm">{current.detail}</p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {pages.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all ${i === page ? 'w-6 bg-cmBlue' : 'w-2 bg-borderC'}`} />
        ))}
      </div>

      <button
        onClick={() => (isLast ? finish() : setPage((p) => p + 1))}
        className={`w-full font-bold py-4 rounded-xl text-center ${
          isLast ? 'bg-cmGold text-cmNavy' : 'bg-cmBlue text-white'
        }`}
      >
        {isLast ? 'Get Started ✓' : 'Next →'}
      </button>
    </div>
  );
}
