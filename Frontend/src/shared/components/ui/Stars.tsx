interface StarsProps { rating: number; }

export function Stars({ rating }: StarsProps) {
  return (
    <span className="text-[var(--corange)] text-sm">
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </span>
  );
}
