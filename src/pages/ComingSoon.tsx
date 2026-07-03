import type { LucideIcon } from 'lucide-react';

export default function ComingSoon({ title, Icon }: { title: string; Icon: LucideIcon }) {
  return (
    <div className="pb-8 px-5 pt-6 flex flex-col items-center text-center py-20">
      <div className="w-20 h-20 rounded-full bg-surfaceLight flex items-center justify-center mb-5">
        <Icon size={32} className="text-textTertiary" />
      </div>
      <h1 className="text-lg font-bold text-textPrimary mb-2">{title}</h1>
      <p className="text-textSecondary text-sm max-w-xs">This feature is coming soon.</p>
    </div>
  );
}
