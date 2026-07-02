import { useState } from 'react';

type Tab = 'Applications' | 'Essays' | 'Deadlines' | 'Outcomes';
const TABS: Tab[] = ['Applications', 'Essays', 'Deadlines', 'Outcomes'];

const EMPTY_STATE: Record<Tab, { icon: string; title: string; body: string; cta: string }> = {
  Applications: { icon: '📋', title: 'No Applications Yet', body: 'Track every school you apply to, its status, and requirements in one place.', cta: 'Add First Application' },
  Essays: { icon: '📝', title: 'No Essays Yet', body: 'Track your college essays, word counts, and progress all in one place.', cta: 'Add First Essay' },
  Deadlines: { icon: '📅', title: 'No Deadlines Yet', body: 'Add application deadlines for your favorite colleges and get reminders 7 days before each one.', cta: 'Add First Deadline' },
  Outcomes: { icon: '✅', title: 'No Outcomes Logged', body: 'Log your admissions results to help future students see real acceptance data.', cta: 'Log First Outcome' },
};

export default function Tracker() {
  const [tab, setTab] = useState<Tab>('Applications');
  const state = EMPTY_STATE[tab];

  return (
    <div className="pb-24 px-5 pt-6">
      <h1 className="text-2xl font-bold text-textPrimary mb-4">Tracker</h1>

      <div className="flex gap-2 overflow-x-auto mb-8 pb-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold ${
              tab === t ? 'bg-cmBlue text-white' : 'bg-surfaceLight text-textSecondary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center text-center py-16">
        <div className="w-20 h-20 rounded-full bg-surfaceLight flex items-center justify-center text-3xl mb-5">
          {state.icon}
        </div>
        <h2 className="text-lg font-bold text-textPrimary mb-2">{state.title}</h2>
        <p className="text-textSecondary text-sm max-w-xs mb-6">{state.body}</p>
        <button className="bg-cmBlue text-white font-bold px-6 py-3 rounded-xl text-sm">
          + {state.cta}
        </button>
      </div>
    </div>
  );
}
