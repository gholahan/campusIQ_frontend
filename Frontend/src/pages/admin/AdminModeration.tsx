type Sev = 'high' | 'medium' | 'low';
const REPORTS = [
  { title: 'Inappropriate message in chat', reporter: 'Sam Okafor',       subject: 'User: Emeka Ike',    time: '2h ago',     sev: 'high'   as Sev },
  { title: 'Tutor no-show — unresponsive',  reporter: 'Blessing Eze',     subject: 'Tutor: Unknown',    time: '5h ago',     sev: 'medium' as Sev },
  { title: 'Incorrect information shared',  reporter: 'Ngozi Adeyemi',    subject: 'AI response #4421', time: 'Yesterday',  sev: 'low'    as Sev },
  { title: 'Spam booking requests',         reporter: 'Fatima Al-Hassan', subject: 'User: Anonymous',   time: '2 days ago', sev: 'medium' as Sev },
];
const SEV_COLOR: Record<Sev, string> = { high: 'var(--cred)', medium: 'var(--corange)', low: 'var(--cgreen)' };
const SEV_BADGE: Record<Sev, string> = { high: 'badge-red', medium: 'badge-orange', low: 'badge-green' };

export function AdminModeration() {
  return (
    <div className="page-enter">
      <div className="mb-7"><h1 className="font-display text-[26px] font-extrabold mb-1 tracking-[-0.5px] text-[var(--text)]">Content Moderation</h1><p className="text-[var(--text2)] text-sm">Review flagged content and reports</p></div>
      <div className="grid gap-4 mb-7" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
        {[{ label: 'Open Reports', value: 4, c: 'cred' },{ label: 'Under Review', value: 2, c: 'corange' },{ label: 'Resolved (30d)', value: 18, c: 'cgreen' },{ label: 'Auto-removed', value: 7, c: 'cpurple' }].map((s) => (
          <div key={s.label} className="stat-card"><div className="font-display text-[32px] font-extrabold mb-1" style={{ color: `var(--${s.c})` }}>{s.value}</div><div className="text-[13px] text-[var(--text2)]">{s.label}</div></div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-3.5"><h2 className="font-display font-bold text-[17px] text-[var(--text)]">Flagged Reports</h2></div>
      <div className="flex flex-col gap-2.5">
        {REPORTS.map((r, i) => (
          <div key={i} className="session-card">
            <div className="w-1.5 self-stretch rounded-sm flex-shrink-0" style={{ background: SEV_COLOR[r.sev] }} />
            <div className="flex-1"><div className="font-semibold text-sm">{r.title}</div><div className="text-xs text-[var(--text2)] mt-0.5">Reported by {r.reporter} · {r.subject}</div></div>
            <div className="text-right flex-shrink-0">
              <span className={`badge ${SEV_BADGE[r.sev]} block mb-1.5`}>{r.sev}</span>
              <div className="text-[12px] text-[var(--text3)] mb-1.5">{r.time}</div>
              <div className="flex gap-1.5"><button className="btn-primary text-[11px] px-2.5 py-1">Review</button><button className="btn-ghost text-[11px] px-2.5 py-1">Dismiss</button></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
