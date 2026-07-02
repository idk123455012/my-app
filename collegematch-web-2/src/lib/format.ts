export function asCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export function asPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

export function asEnrollment(n: number): string {
  return n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`;
}

export function categoryColor(category: string): string {
  switch (category) {
    case 'Safety': return 'text-cmSafety bg-cmSafety/10 border-cmSafety/30';
    case 'Match': return 'text-cmMatch bg-cmMatch/10 border-cmMatch/30';
    case 'Reach': return 'text-cmReach bg-cmReach/10 border-cmReach/30';
    case 'Highly Competitive': return 'text-cmHC bg-cmHC/10 border-cmHC/30';
    default: return 'text-cmTextSecondary bg-white/5 border-cmBorder';
  }
}
