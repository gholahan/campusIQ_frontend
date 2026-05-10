interface AvatarProps {
  name: string | undefined;
  color?: string;
  size?: number;
  initials?: string;
}

const getInitials = (name?: string) => {
  if (!name) return "";

  const parts = name.trim().split(" ").filter(Boolean);

  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

  return (first + last).toUpperCase();
};

export function Avatar({
  name,
  color = 'var(--accent)',
  size = 38,
  initials,
}: AvatarProps) {

  const fallbackInitials = getInitials(name);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size > 50 ? 14 : '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size > 50 ? size * 0.3 : size * 0.38,
        color: 'white',
        flexShrink: 0,
      }}
    >
      {initials ?? fallbackInitials}
    </div>
  );
}
