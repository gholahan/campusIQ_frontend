import { FieldError } from "@/shared/components/ui";
import { DAYS } from "../../constants/days";
import { Card } from "../../shared/Card";
import type { DayKey } from "../../types";
import { DayRow } from "../availabilty/DayRow";

interface DayValue {
  enabled: boolean;
  start: string;
  end: string;
}

interface AvailabilityStepProps {
  availability: Record<DayKey, DayValue>;
  onDayChange: (day: DayKey, val: DayValue) => void;
  error?: Record<DayKey, any> | string;
  touched?: Record<DayKey, any> | boolean;
}

export function AvailabilityStep({ availability, onDayChange, error, touched }: AvailabilityStepProps) {
  if (!availability) return null;

  const topLevelError = typeof error === "string" && typeof touched === "boolean" && touched
    ? error
    : undefined;

  const dayErrors = typeof error === "object" ? error as Record<DayKey, any> : undefined;
  const dayTouched = typeof touched === "object" ? touched as Record<DayKey, any> : undefined;

  const getError = (day: DayKey): string | undefined => {
    if (!dayTouched?.[day] || !dayErrors?.[day]) return undefined;
    const e = dayErrors[day];
    if (typeof e === "string") return e;
    if (typeof e === "object") {
      return (e as any).start ?? (e as any).end ?? (e as any).message ?? "Invalid time range";
    }
    return undefined;
  };

  return (
    <Card>
      <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
        Weekly availability
      </p>
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: "1.25rem" }}>
        Set availability time window per day <br /> And at Least one day is required.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {DAYS.map((day) => (
          <DayRow
            key={day}
            day={day}
            value={availability[day]}
            onChange={(val) => onDayChange(day, val)}
            error={getError(day)}
          />
        ))}
      </div>
      {topLevelError && (
        <FieldError message={topLevelError} />
      )}
    </Card>
  );
}