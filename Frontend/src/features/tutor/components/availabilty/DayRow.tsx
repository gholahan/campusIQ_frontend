import { DAY_LABEL } from "../../constants/days";
import { TimePicker } from "./TimePicker";
import type { DayKey } from "../../types";
import { ALL_TIMES } from "../../constants/times";

interface DayValue {
  enabled: boolean;
  start: string;
  end: string;
}

interface Props {
  day: DayKey;
  value: DayValue;
  onChange: (v: DayValue) => void;
  error?: string;
}

export function DayRow({ day, value, onChange, error }: Props) {
  const safe = value ?? { enabled: false, start: "", end: "" };  // ← only change

  const isInvalid =
    safe.enabled && safe.start && safe.end && safe.end <= safe.start;

  const startIndex = ALL_TIMES.indexOf(safe.start);
  const excludedEndTimes =
    startIndex >= 0 ? ALL_TIMES.slice(0, startIndex + 1) : [];

  return (
    <div style={{ borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "7px 0" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "50px 1fr auto 1fr 120px",
          alignItems: "center",
          gap: 5,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: safe.enabled ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            transition: "color 0.15s",
          }}
        >
          {DAY_LABEL[day]}
        </span>

        <TimePicker
          value={safe.start}
          disabled={!safe.enabled}
          placeholder="Start"
          onSelect={(t) => onChange({ ...safe, start: t, end: "" })}
        />

        <span style={{ textAlign: "center", fontSize: 12, color: "var(--color-text-tertiary)" }}>
          to
        </span>

        <TimePicker
          value={safe.end}
          disabled={!safe.enabled || !safe.start}
          placeholder="End"
          excludedTimes={excludedEndTimes}
          onSelect={(t) => onChange({ ...safe, end: t })}
        />

        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={safe.enabled}
            onChange={() => onChange({ enabled: !safe.enabled, start: "", end: "" })}
            style={{ accentColor: "#534AB7", cursor: "pointer" }}
          />
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
            Available
          </span>
        </label>
      </div>

      {(isInvalid || error) && (
        <p style={{ margin: "4px 0 0", fontSize: 11, color: "#F87171" }}>
          {error ?? "Invalid time range"}
        </p>
      )}
    </div>
  );
}