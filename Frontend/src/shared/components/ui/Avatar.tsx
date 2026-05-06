interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
  initials?: string;
}

export function Avatar({ name, color = 'var(--accent)', size = 38, initials }: AvatarProps) {
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
      {initials ?? name?.slice(0, 2).toUpperCase()}
    </div>
  );
}
