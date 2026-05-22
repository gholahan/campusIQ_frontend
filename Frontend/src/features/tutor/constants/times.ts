/** All selectable times from 06:00 → 22:30 in 30-minute increments */
export const ALL_TIMES: string[] = Array.from({ length: 34 }, (_, i) => {
  const h = Math.floor(i / 2) + 6;
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});