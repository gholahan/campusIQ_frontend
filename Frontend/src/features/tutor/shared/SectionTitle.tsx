import type { CSSProperties, ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
  icon?: string; // Tabler icon name e.g. "ti-calendar"
  style?: CSSProperties;
}

export function SectionTitle({ children, icon, style }: SectionTitleProps) {
  return (
    <p
      style={{
        fontSize: 14,
        fontWeight: 500,
        marginBottom: "0.75rem",
        display: "flex",
        alignItems: "center",
        gap: 7,
        color: "var(--color-text-primary)",
        ...style,
      }}
    >
      {icon && (
        <i
          className={`ti ${icon}`}
          style={{ fontSize: 16, color: "var(--color-text-secondary)" }}
          aria-hidden="true"
        />
      )}
      {children}
    </p>
  );
}

/** Uppercase field label above an input */
export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: "var(--color-text-secondary)",
        display: "block",
        marginBottom: 6,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </label>
  );
}