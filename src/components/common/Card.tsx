import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', id }) => {
  return (
    <div
      id={id}
      className={`bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden transition-all ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className = '',
  icon
}) => {
  return (
    <div
      className={`p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        {icon && <div className="shrink-0 text-cyan-600">{icon}</div>}
        <div>
          <h3 className="font-bold text-sm text-slate-800 leading-snug">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  noPadding = false
}) => {
  return <div className={`${noPadding ? '' : 'p-4'} ${className}`}>{children}</div>;
};
