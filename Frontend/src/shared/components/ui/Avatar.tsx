interface AvatarProps {
  name?: string | null;
  imageUrl?: string | null;
  color?: string;
  size?: number;
  initials?: string;
}

const getInitials = (name?: string | null) => {
  if (!name) return "";

  const parts = name.trim().split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

  return (first + last).toUpperCase();
};

export function Avatar({
  name,
  imageUrl,
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
        overflow: 'hidden',
        fontWeight: 700,
        fontSize: size > 50 ? size * 0.3 : size * 0.38,
        color: 'white',
        flexShrink: 0,
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="avatar"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        initials ?? fallbackInitials
      )}
    </div>
  );
}