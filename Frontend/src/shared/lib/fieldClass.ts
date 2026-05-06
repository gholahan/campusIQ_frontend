/**
 * Returns Tailwind className for a form input.
 * Layout/spacing are Tailwind. Colors use CSS token vars.
 */
export function fieldClass(touched?: boolean, error?: string): string {
  const base =
    'w-full px-3.5 py-3 rounded-xl text-sm transition-all ' +
    'bg-[var(--bg3)] border text-[var(--text)] ' +
    'focus:outline-none focus:bg-[var(--bg2)] focus:ring-2 ' +
    'placeholder:text-[var(--text3)]';
  if (touched && error)
    return base + ' border-[var(--cred)] focus:border-[var(--cred)] focus:ring-[var(--cred)]/10';
  return base + ' border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/10';
}
