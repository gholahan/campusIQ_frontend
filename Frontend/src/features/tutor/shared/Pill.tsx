import type { CSSProperties, ReactNode, MouseEventHandler } from "react";

type PillVariant = "purple" | "teal" | "ghost";

interface PillProps {
  children: ReactNode;
  variant?: PillVariant;
  onRemove?: () => void;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLSpanElement>;
  active?: boolean;
  style?: CSSProperties;
}

const VARIANTS: Record<PillVariant, CSSProperties> = {
  purple: {
    background: "#EEEDFE",
    border: "0.5px solid #AFA9EC",
    color: "#3C3489",
  },
  teal: {
    background: "#E1F5EE",
    border: "0.5px solid #5DCAA5",
    color: "#0F6E56",
  },
  ghost: {
    background: "transparent",
    border: "0.5px solid var(--color-border-secondary)",
    color: "var(--color-text-secondary)",
  },
};

export function Pill({
  children,
  variant = "ghost",
  onRemove,
  onClick,
  active,
  style,
}: PillProps) {
  const variantStyle = active
    ? variant === "teal"
      ? VARIANTS.teal
      : VARIANTS.purple
    : VARIANTS[variant];

  const baseStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
    fontFamily: "var(--font-sans)",
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.15s",
    ...variantStyle,
    ...style,
  };

  if (onClick) {
    return (
      <button onClick={onClick} style={{ ...baseStyle, border: variantStyle.border as string }}>
        {children}
        {onRemove && (
          <span
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            aria-label="Remove"
            style={{ fontSize: 14, lineHeight: 1, cursor: "pointer", marginLeft: 2 }}
          >
            ×
          </span>
        )}
      </button>
    );
  }

  return (
    <span style={baseStyle}>
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "inherit",
            fontSize: 14,
            lineHeight: 1,
            padding: "0 1px",
            opacity: 0.6,
            fontFamily: "var(--font-sans)",
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}