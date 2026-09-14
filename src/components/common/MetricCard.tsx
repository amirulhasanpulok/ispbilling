import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subValue?: string;
  change?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
  };
  color?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate' | 'indigo';
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon: Icon,
  subValue,
  change,
  color = 'cyan',
  onClick,
  className = ''
}) => {
  const colorMap = {
    cyan: {
      border: 'border-cyan-100 hover:border-cyan-300',
      iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-100',
      accent: 'text-cyan-600'
    },
    emerald: {
      border: 'border-emerald-100 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      accent: 'text-emerald-600'
    },
    amber: {
      border: 'border-amber-100 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      accent: 'text-amber-600'
    },
    rose: {
      border: 'border-rose-100 hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      accent: 'text-rose-600'
    },
    slate: {
      border: 'border-slate-200 hover:border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
      accent: 'text-slate-700'
    },
    indigo: {
      border: 'border-indigo-100 hover:border-indigo-300',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      accent: 'text-indigo-600'
    }
  };

  const currentTheme = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 border transition-all shadow-xs ${currentTheme.border} ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
              {value}
            </span>
            {change && (
              <span
                className={`text-xs font-semibold ${
                  change.trend === 'up'
                    ? 'text-emerald-600'
                    : change.trend === 'down'
                    ? 'text-rose-600'
                    : 'text-slate-500'
                }`}
              >
                {change.trend === 'up' ? '↑' : change.trend === 'down' ? '↓' : '•'} {change.value}
              </span>
            )}
          </div>
          {subValue && (
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              {subValue}
            </p>
          )}
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${currentTheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
