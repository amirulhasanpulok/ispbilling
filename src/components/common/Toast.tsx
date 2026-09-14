import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  const config = {
    success: {
      icon: CheckCircle2,
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      bg: 'bg-slate-900 text-white'
    },
    error: {
      icon: AlertCircle,
      border: 'border-rose-500/30',
      iconColor: 'text-rose-400',
      bg: 'bg-slate-900 text-white'
    },
    warning: {
      icon: AlertCircle,
      border: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      bg: 'bg-slate-900 text-white'
    },
    info: {
      icon: Info,
      border: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
      bg: 'bg-slate-900 text-white'
    }
  };

  const current = config[type];
  const Icon = current.icon;

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 ${current.bg} px-4 py-3 rounded-xl shadow-2xl text-xs z-50 flex items-center gap-3 border ${current.border} animate-in fade-in slide-in-from-bottom-3 duration-200`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${current.iconColor}`} />
      <span className="font-medium pr-2 max-w-sm">{message}</span>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white transition-colors p-0.5 rounded focus:outline-none"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
