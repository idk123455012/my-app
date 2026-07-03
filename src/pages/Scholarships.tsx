import { useState } from 'react';
import { Star, Calendar, ExternalLink } from 'lucide-react';

interface Scholarship {
  name: string;
  amount: number;
  deadline: string;
  category: string;
  description: string;
  url: string;
}

// Starter set of well-known, real, nationally-available scholarships.
// Expand this list as needed — a real production version would pull from
// an API, but a maintained static list works fine for launch.
const scholarships: Scholarship[] = [
  { name: 'Coca-Cola Scholars Program', amount: 20000, deadline: 'October 31', category: 'General', description: 'For graduating high school seniors demonstrating leadership and service.', url: 'https://www.coca-colascholarsfoundation.org' },
  { name: 'QuestBridge National College Match', amount: 200000, deadline: 'September 26', category: 'Need-Based', description: 'Full four-year scholarships for high-achieving, low-income students.', url: 'https://www.questbridge.org' },
  { name: 'Gates Scholarship', amount: 0, deadline: 'September 15', category: 'Need-Based', description: 'Full cost-of-attendance scholarship for outstanding minority students with financial need.', url: 'https://www.thegatesscholarship.org' },
  { name: 'Jack Kent Cooke Foundation Scholarship', amount: 55000, deadline: 'November', category: 'Need-Based', description: 'For high-achieving students with financial need, up to $55,000/year.', url: 'https://www.jkcf.org' },
  { name: 'National Merit Scholarship', amount: 2500, deadline: 'Varies (via PSAT)', category: 'Academic', description: 'Based on PSAT/NMSQT scores; many colleges offer additional matching funds.', url: 'https://www.nationalmerit.org' },
  { name: 'Ron Brown Scholar Program', amount: 40000, deadline: 'January 9', category: 'General', description: 'For African American high school seniors with strong academics and leadership.', url: 'https://www.ronbrown.org' },
  { name: 'Elks National Foundation Most Valuable Student', amount: 12500, deadline: 'Mid-November', category: 'General', description: 'For U.S. high school seniors based on scholarship, leadership, and financial need.', url: 'https://www.elks.org/scholars' },
  { name: 'Dell Scholars Program', amount: 20000, deadline: 'December', category: 'Need-Based', description: 'For students who have overcome significant obstacles, with financial need.', url: 'https://www.dellscholars.org' },
];

const categories = ['All', 'General', 'Need-Based', 'Academic'];

export default function Scholarships() {
  const [category, setCategory] = useState('All');
  const filtered = category === 'All' ? scholarships : scholarships.filter((s) => s.category === category);

  return (
    <div className="pb-8 px-6 md:px-10 pt-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Star size={26} className="text-cmGold" />
        <h1 className="text-2xl font-bold text-textPrimary">Scholarship Finder</h1>
      </div>
      <p className="text-textSecondary text-sm mb-6">Nationally-available scholarships open to most U.S. high school seniors.</p>

      <div className="flex gap-2 mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              category === c ? 'bg-cmGold text-cmNavy' : 'bg-surfaceLight text-textSecondary'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((s) => (
          <div key={s.name} className="bg-surfaceMid border border-borderC rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-textPrimary text-sm pr-2">{s.name}</h3>
              <span className="text-xs font-bold text-cmGold shrink-0">
                {s.amount > 0 ? `$${s.amount.toLocaleString()}` : 'Full Ride'}
              </span>
            </div>
            <p className="text-xs text-textSecondary mb-3">{s.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-textTertiary flex items-center gap-1"><Calendar size={12} /> Deadline: {s.deadline}</span>
              <a href={s.url} target="_blank" rel="noreferrer" className="text-cmBlue font-semibold flex items-center gap-1">
                Learn more <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
