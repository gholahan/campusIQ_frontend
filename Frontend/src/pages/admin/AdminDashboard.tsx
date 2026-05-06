import { Avatar } from '@/shared/components/ui';

const SIGNUPS = [
  { name: 'Bola Adeyemi', role: 'Student', time: '2 min ago',  color: 'var(--accent)' },
  { name: 'Chisom Nwosu', role: 'Tutor',   time: '14 min ago', color: 'var(--cgreen)' },
  { name: 'David Mensah', role: 'Student', time: '1h ago',     color: 'var(--cpurple)' },
  { name: 'Emeka Ike',    role: 'Student', time: '2h ago',     color: 'var(--corange)' },
];
const HEALTH = [
  { label: 'Server Uptime',        value: '99.97%',  s: 'cgreen'  },
  { label: 'Avg Session Rating',   value: '4.8/5.0', s: 'cgreen'  },
  { label: 'AI Response Time',     value: '1.2s avg', s: 'cgreen'  },
  { label: 'Open Support Tickets', value: '7',        s: 'corange' },
  { label: 'Flagged Content',      value: '4',        s: 'cred'    },
];

export function AdminDashboard() {
  return (
    <div className="page-enter">
      <div className="mb-7"><h1 className="font-display text-[26px] font-extrabold mb-1 tracking-[-0.5px] text-[var(--text)]">Admin Overview</h1><p className="text-[var(--text2)] text-sm">Platform health and activity metrics</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {[{ label: 'Total Users', value: '2,584', icon: '👥', color: 'blue', change: '↑ 48 this week' },{ label: 'Active Sessions', value: 23, icon: '📅', color: 'green', change: '↑ 5 from yesterday' },{ label: 'Pending Reports', value: 4, icon: '🛡️', color: 'orange', change: 'Needs review' },{ label: 'Platform Revenue', value: '$8.4k', icon: '💰', color: 'purple', change: '↑ $1.2k this week' }].map((s) => (
          <div key={s.label} className={`stat-card ${s.color}`}><div className="text-[22px] mb-3">{s.icon}</div><div className="font-display text-[28px] font-extrabold mb-1">{s.value}</div><div className="text-[13px] text-[var(--text2)]">{s.label}</div><div className="text-[12px] mt-1.5 text-[var(--cgreen)]">{s.change}</div></div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-display font-bold mb-3.5 text-[var(--text)]">Recent Signups</h3>
          {SIGNUPS.map((u, i) => (
            <div key={i} className="flex gap-2.5 items-center py-2.5" style={{ borderBottom: i < SIGNUPS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <Avatar name={u.name} color={u.color} size={34} />
              <div className="flex-1"><div className="font-semibold text-sm">{u.name}</div><span className={`badge ${u.role === 'Tutor' ? 'badge-purple' : 'badge-blue'} text-[11px]`}>{u.role}</span></div>
              <div className="text-xs text-[var(--text3)]">{u.time}</div>
            </div>
          ))}
        </div>
        <div className="card p-5">
          <h3 className="font-display font-bold mb-3.5 text-[var(--text)]">Platform Health</h3>
          {HEALTH.map((m, i) => (
            <div key={i} className="flex justify-between items-center py-2.5" style={{ borderBottom: i < HEALTH.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span className="text-sm text-[var(--text2)]">{m.label}</span>
              <span className="font-bold" style={{ color: `var(--${m.s})` }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
