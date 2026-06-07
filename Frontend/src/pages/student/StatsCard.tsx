import { StatCardData } from "@/features/student/types";

type StatCardProps = StatCardData;

export function StatCard({
  label,
  value,
  icon,
  color,
  delta,
}: StatCardProps) {
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <div className={`stat-card ${color}`}>
      <div className="text-[22px] mb-3">{icon}</div>

      <div className="font-display text-[28px] font-extrabold mb-1 text-[var(--text)]">
        {value}
      </div>

      <div className="text-[13px] text-[var(--text2)]">
        {label}
      </div>

      {delta !== undefined && (
        <div
          className={`text-[12px] mt-1.5 ${
            isPositive
              ? 'text-[var(--cgreen)]'
              : 'text-[var(--cred)]'
          }`}
        >
          {isPositive ? '↑' : '↓'} {Math.abs(delta)} from last week
        </div>
      )}
    </div>
  );
}