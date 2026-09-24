import type { ReactNode } from 'react';

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
  delta?: number;
  deltaLabel?: string;
  subtext?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  color = 'blue',
  delta,
  deltaLabel = 'from last week',
  subtext,
  className = '',
}: StatCardProps) {
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <div
      className={`stat-card ${color} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      <div className="text-[20px] sm:text-[22px] mb-2 sm:mb-3 select-none flex items-center justify-between">
        <span>{icon}</span>
      </div>

      <div className="font-display text-[22px] sm:text-[28px] font-extrabold mb-1 tracking-tight text-[var(--text)] truncate">
        {value}
      </div>

      <div className="text-[12px] sm:text-[13px] text-[var(--text2)] truncate font-medium">
        {label}
      </div>

      {delta !== undefined && (
        <div
          className={`text-[11px] sm:text-[12px] mt-1.5 font-medium flex items-center gap-1 ${
            isPositive ? 'text-[var(--cgreen)]' : 'text-[var(--cred)]'
          }`}
        >
          <span>{isPositive ? '↑' : '↓'}</span>
          <span>
            {Math.abs(delta)} {deltaLabel}
          </span>
        </div>
      )}

      {subtext && delta === undefined && (
        <div className="text-[11px] sm:text-[12px] mt-1.5 font-medium text-[var(--text3)] truncate">
          {subtext}
        </div>
      )}
    </div>
  );
}
