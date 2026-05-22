import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  padding?: string;
}

const baseStyle: CSSProperties = {
  background: "var(--color-background-primary)",
  border: "0.5px solid var(--color-border-tertiary)",
  borderRadius: "var(--border-radius-lg)",
  padding: "1.5rem",
};

export function Card({ children, style, padding }: CardProps) {
  return (
    <div style={{ ...baseStyle, ...(padding ? { padding } : {}), ...style }}>
      {children}
    </div>
  );
}