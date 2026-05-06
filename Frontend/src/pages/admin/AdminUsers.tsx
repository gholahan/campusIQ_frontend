import { Avatar } from '@/shared/components/ui';

const USERS = [
  { name: 'Sam Okafor',       email: 'sam@uni.edu',    role: 'Student', status: 'Active',    joined: 'Jan 2026', sessions: 12 },
  { name: 'Amara Osei',       email: 'amara@uni.edu',  role: 'Tutor',   status: 'Active',    joined: 'Sep 2025', sessions: 120 },
  { name: 'Bola Adeyemi',     email: 'bola@uni.edu',   role: 'Student', status: 'Active',    joined: 'Mar 2026', sessions: 3 },
  { name: 'Chisom Nwosu',     email: 'chisom@uni.edu', role: 'Tutor',   status: 'Active',    joined: 'Oct 2025', sessions: 95 },
  { name: 'Emeka Ike',        email: 'emeka@uni.edu',  role: 'Student', status: 'Suspended', joined: 'Feb 2026', sessions: 0 },
  { name: 'Fatima Al-Hassan', email: 'fatima@uni.edu', role: 'Tutor',   status: 'Active',    joined: 'Aug 2025', sessions: 140 },
];
const COLORS = ['var(--accent)','var(--cpurple)','var(--cgreen)','var(--corange)'];

export function AdminUsers() {
  return (
    <div className="page-enter">
      <div className="flex items-start justify-between mb-7"><div><h1 className="font-display text-[26px] font-extrabold mb-1 tracking-[-0.5px] text-[var(--text)]">User Management</h1><p className="text-[var(--text2)] text-sm">Manage all platform users</p></div><button className="btn-primary">+ Invite User</button></div>
      <div className="flex gap-3 items-center p-3 mb-5 rounded-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <span className="text-lg">🔍</span>
        <input className="flex-1 bg-transparent border-none text-sm text-[var(--text)] placeholder:text-[var(--text3)]" placeholder="Search users..." />
        <select className="form-input" style={{ width: 'auto', padding: '8px 12px', borderRadius: 8 }}><option>All Roles</option><option>Students</option><option>Tutors</option></select>
        <select className="form-input" style={{ width: 'auto', padding: '8px 12px', borderRadius: 8 }}><option>All Status</option><option>Active</option><option>Suspended</option></select>
      </div>
      <div className="card overflow-hidden admin-table-wrap">
        <table className="w-full border-collapse">
          <thead><tr style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>{['User','Email','Role','Sessions','Status','Actions'].map((h) => <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-[var(--text3)] uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {USERS.map((u, i) => (
              <tr key={i} className="transition-colors hover:bg-[var(--surface2)]" style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3"><div className="flex gap-2.5 items-center"><Avatar name={u.name} color={COLORS[i%4]} size={32} /><div><div className="font-semibold text-sm">{u.name}</div><div className="text-[12px] text-[var(--text3)]">Joined {u.joined}</div></div></div></td>
                <td className="px-4 py-3 text-[13px] text-[var(--text2)]">{u.email}</td>
                <td className="px-4 py-3"><span className={`badge ${u.role === 'Tutor' ? 'badge-purple' : 'badge-blue'}`}>{u.role}</span></td>
                <td className="px-4 py-3 text-sm font-semibold">{u.sessions}</td>
                <td className="px-4 py-3"><span className={`badge ${u.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{u.status}</span></td>
                <td className="px-4 py-3"><div className="flex gap-1.5"><button className="btn-ghost text-[12px] px-2.5 py-1.5">View</button><button className="btn-ghost text-[12px] px-2.5 py-1.5" style={{ color: u.status === 'Active' ? 'var(--cred)' : 'var(--cgreen)' }}>{u.status === 'Active' ? 'Suspend' : 'Restore'}</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
