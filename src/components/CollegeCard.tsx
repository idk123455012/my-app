import { Link } from 'react-router-dom';
import { Heart, MapPin, ExternalLink } from 'lucide-react';
import type { CategorizedCollege } from '../data/types';
import { asCurrency, asPercent, asEnrollment, categoryColor } from '../lib/format';

interface Props {
  item: CategorizedCollege;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function CollegeCard({ item, isFavorite, onToggleFavorite }: Props) {
  const { college, category } = item;

  return (
    <div className="rounded-md overflow-hidden border border-borderC bg-surfaceMid shadow-lg shadow-black/40">
      <div className="flex items-center justify-between px-4 py-2.5 bg-surfaceLight">
        <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border ${categoryColor(category)}`}>
          {category}
        </span>
        {college.rankings.usNewsNational && (
          <span className="text-xs font-bold text-cmGold bg-cmGold/10 px-2 py-1 rounded">
            #{college.rankings.usNewsNational}
          </span>
        )}
      </div>

      <Link to={`/college/${college.id}`} className="block p-4 flex flex-col gap-3.5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-cmBlue to-indigo-700 flex items-center justify-center text-white font-bold text-xl shrink-0">
            {college.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-textPrimary leading-snug">{college.name}</h3>
            <p className="text-xs text-textTertiary font-medium">{college.institutionType}</p>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); onToggleFavorite(); }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="shrink-0"
          >
            <Heart size={20} className={isFavorite ? 'fill-cmHC text-cmHC' : 'text-textTertiary'} />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-textSecondary flex items-center gap-1"><MapPin size={12} /> {college.city}, {college.state}</span>
          <span className="font-bold text-cmGold bg-cmGold/15 px-2 py-0.5 rounded-full">
            {asPercent(college.admissions.acceptanceRate)}
          </span>
        </div>

        <div className="h-px bg-borderC" />

        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Net Price" value={asCurrency(college.financials.averageNetPrice)} />
          <Stat label="SAT" value={`${college.admissions.satRange.low}–${college.admissions.satRange.high}`} />
          <Stat label="Enrollment" value={asEnrollment(college.studentLife.undergradEnrollment)} />
        </div>
      </Link>

      <div className="px-4 pb-4">
        <div className="h-px bg-borderC mb-3" />
        <a
          href={college.websiteURL}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-semibold text-cmBlue bg-cmBlue/10 border border-cmBlue/25 rounded-sm px-3 py-1.5 w-fit flex items-center gap-1.5"
        >
          Visit Website <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surfaceLight border border-borderC rounded-sm py-2 px-1">
      <div className="text-xs font-bold text-textPrimary">{value}</div>
      <div className="text-[9px] font-semibold text-textTertiary mt-0.5">{label}</div>
    </div>
  );
}
