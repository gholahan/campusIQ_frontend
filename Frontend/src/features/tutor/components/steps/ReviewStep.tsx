import { Card } from "../../shared/Card";
import { SectionTitle } from "../../shared/SectionTitle";
import { DAYS, DAY_LABEL } from "../../constants/days";
import { Avatar } from "@/shared/components";
import type { DayKey, DayValue } from "../../types";

interface ReviewStepProps {
  name: string;
  title: string;
  bio: string;
  rate: number;
  availability: Record<DayKey, DayValue>;
  courses: string[];
}

export function ReviewStep({ name, title, bio, rate, availability, courses }: ReviewStepProps) {
  const activeDays = DAYS.filter((d) => {
    const day = availability?.[d];
    return day?.enabled && day.start && day.end && day.end > day.start;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Profile header */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1rem" }}>
          <Avatar name={name} />
          <div>
            <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>{name || "—"}</p>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>
              {title || "—"}
            </p>
          </div>
          <div
            style={{
              marginLeft: "auto",
              padding: "4px 12px",
              background: "#EEEDFE",
              border: "0.5px solid #AFA9EC",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              color: "#3C3489",
            }}
          >
            ${Number(rate) || 0}/hr
          </div>
        </div>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.65, margin: 0 }}>
          {bio || "—"}
        </p>
      </Card>

      {/* Availability */}
      <Card>
        <SectionTitle icon="ti-calendar">Availability</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {activeDays.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
              No availability set.
            </p>
          ) : (
            activeDays.map((d) => (
              <div key={d} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                    width: 32,
                    flexShrink: 0,
                  }}
                >
                  {DAY_LABEL[d]}
                </span>
                <span
                  style={{
                    padding: "3px 10px",
                    background: "#EEEDFE",
                    borderRadius: 999,
                    fontSize: 11,
                    color: "#3C3489",
                    fontWeight: 500,
                  }}
                >
                  {availability[d].start} — {availability[d].end}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Courses */}
      <Card>
        <SectionTitle icon="ti-book">Courses ({courses.length})</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {courses.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>No courses selected.</p>
          ) : (
            courses.map((c) => (
              <span
                key={c}
                style={{
                  padding: "4px 11px",
                  background: "#E1F5EE",
                  border: "0.5px solid #5DCAA5",
                  borderRadius: 999,
                  fontSize: 12,
                  color: "#0F6E56",
                  fontWeight: 500,
                }}
              >
                {c}
              </span>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}