import React from 'react';

interface StatusBadgeProps {
  status: string | boolean;
  type?: 'client' | 'billing' | 'mikrotik' | 'ticket' | 'priority' | 'generic';
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'generic',
  className = '',
  size = 'sm'
}) => {
  const statusStr = typeof status === 'boolean' ? (status ? 'Active' : 'Disabled') : String(status);
  const normalized = statusStr.toLowerCase().trim();

  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotClass = 'bg-slate-400';

  if (['active', 'paid', 'online', 'solved', 'enabled', 'true', 'success'].includes(normalized)) {
    bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotClass = 'bg-emerald-500';
  } else if (['unpaid', 'expired', 'high', 'critical', 'danger', 'offline', 'error'].includes(normalized)) {
    bgClass = 'bg-rose-50 text-rose-700 border-rose-200';
    dotClass = 'bg-rose-500';
  } else if (['pending', 'processing', 'partially paid', 'warning', 'medium', 'paused'].includes(normalized)) {
    bgClass = 'bg-amber-50 text-amber-800 border-amber-200';
    dotClass = 'bg-amber-500';
  } else if (['disabled', 'inactive', 'leftout', 'low', 'idle'].includes(normalized)) {
    bgClass = 'bg-slate-100 text-slate-600 border-slate-200';
    dotClass = 'bg-slate-400';
  } else if (['info', 'running', 'cat5', 'optical fiber'].includes(normalized)) {
    bgClass = 'bg-cyan-50 text-cyan-700 border-cyan-200';
    dotClass = 'bg-cyan-500';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border whitespace-nowrap leading-none ${sizeClasses} ${bgClass} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
      <span>{statusStr}</span>
    </span>
  );
};
