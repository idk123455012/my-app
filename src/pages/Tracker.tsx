import { useState } from 'react';
import { ClipboardList, FileEdit, CalendarClock, BadgeCheck, Plus } from 'lucide-react';

type Tab = 'Applications' | 'Essays' | 'Deadlines' | 'Outcomes';
const TABS: Tab[] = ['Applications', 'Essays', 'Deadlines', 'Outcomes'];

const EMPTY_STATE: Record<Tab, { Icon: typeof ClipboardList; title: string; body: string; cta: string }> = {
  Applications: { Icon: ClipboardList, title: 'No Applications Yet', body: 'Track every school you apply to, its status, and requirements in one place.', cta: 'Add First Application' },
  Essays: { Icon: FileEdit, title: 'No Essays Yet', body: 'Track your college essays, word counts, and progress all in one place.', cta: 'Add First Essay' },
  Deadlines: { Icon: CalendarClock, title: 'No Deadlines Yet', body: 'Add application deadlines for your favorite colleges and get reminders 7 days before each one.', cta: 'Add First Deadline' },
  Outcomes: { Icon: BadgeCheck, title: 'No Outcomes Logged', body: 'Log your admissions results to help future students see real acceptance data.', cta: 'Log First Outcome' },
};

export default function Tracker() {
  const [tab, setTab] = useState<Tab>('Applications');
  const state = EMPTY_STATE[tab];

  return (
    <div className="pb-8 px-6 md:px-10 pt-8 max-w-7xl mx-auto">
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
        <div className="w-20 h-20 rounded-full bg-surfaceLight flex items-center justify-center mb-5">
          <state.Icon size={32} className="text-textTertiary" />
        </div>
        <h2 className="text-lg font-bold text-textPrimary mb-2">{state.title}</h2>
        <p className="text-textSecondary text-sm max-w-xs mb-6">{state.body}</p>
        <button className="bg-cmBlue text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2">
          <Plus size={16} /> {state.cta}
        </button>
      </div>
    </div>
  );
}
