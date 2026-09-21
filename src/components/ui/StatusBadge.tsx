import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (normalized === 'new') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/10';
  } else if (normalized === 'reviewing') {
    styles = 'bg-amber-50 text-amber-800 border-amber-200 ring-1 ring-amber-500/10';
  } else if (normalized === 'accepted' || normalized === 'published') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/10';
  } else if (normalized === 'rejected' || normalized === 'cancelled') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/10';
  } else if (normalized === 'draft') {
    styles = 'bg-slate-100 text-slate-600 border-slate-200';
  } else if (normalized === 'upcoming') {
    styles = 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500/10';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border whitespace-nowrap ${padding} ${styles}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5" />
      {status}
    </span>
  );
};
