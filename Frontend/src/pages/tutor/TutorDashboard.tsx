import { useNavigate } from 'react-router-dom';
import { Avatar, Stars } from '@/shared/components/ui';
import { useGetProfile } from '@/features/auth/hooks/useAuthApi';

const REQUESTS = [
  { name: 'Sam Okafor',   course: 'Data Structures', topic: 'Binary search trees',       time: '10 min ago', color: 'var(--accent)' },
  { name: 'Blessing Eze', course: 'Algorithms',       topic: 'Dynamic programming',       time: '1h ago',     color: 'var(--cgreen)' },
  { name: 'Kwame B.',     course: 'Data Structures',  topic: 'Graph traversal (BFS/DFS)', time: '3h ago',     color: 'var(--cpurple)' },
];
const SESSIONS = [
  { name: 'Sam Okafor',   topic: 'Binary Trees',             time: 'Today, 4:00 PM', c: 'cgreen'  },
  { name: 'Ada Chibuike', topic: 'Algorithm Complexity',     time: 'Wed, 2:00 PM',   c: 'accent'  },
  { name: 'Tunde Bakare', topic: 'Sorting Algorithms',       time: 'Thu, 10:00 AM',  c: 'cpurple' },
  { name: 'Ngozi Eze',    topic: 'Recursion & Backtracking', time: 'Fri, 3:00 PM',   c: 'corange' },
];

export function TutorDashboard() {
  const navigate = useNavigate();
  const {user} = useGetProfile()
  return (
    <div className="page-enter">
      <div className="mb-7"><h1 className="font-display text-[26px] font-extrabold mb-1 tracking-[-0.5px] text-[var(--text)]">Tutor Dashboard</h1><p className="text-[var(--text2)] text-sm">Welcome back, {user?.first_name} Here's your activity overview.</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {[{ label: 'Sessions This Week', value: 8, icon: '📅', color: 'blue', change: '↑ 2 from last week' },{ label: 'Pending Requests', value: 3, icon: '📨', color: 'orange', change: '3 awaiting response' },{ label: 'Total Earnings', value: '$240', icon: '💰', color: 'green', change: '↑ $40 this week' },{ label: 'Rating', value: '4.9', icon: '⭐', color: 'purple', change: 'From 47 reviews' }].map((s) => (
          <div key={s.label} className={`stat-card ${s.color}`}><div className="text-[22px] mb-3">{s.icon}</div><div className="font-display text-[28px] font-extrabold mb-1">{s.value}</div><div className="text-[13px] text-[var(--text2)]">{s.label}</div><div className="text-[12px] mt-1.5 text-[var(--cgreen)]">{s.change}</div></div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4"><h2 className="font-display font-bold text-[17px] text-[var(--text)]">📨 Incoming Requests</h2><span className="badge badge-orange">3 new</span></div>
          <div className="flex flex-col gap-2.5">
            {REQUESTS.map((r, i) => (
              <div key={i} className="session-card">
                <Avatar name={r.name} color={r.color} size={38} />
                <div className="flex-1"><div className="font-semibold text-sm text-[var(--text)]">{r.name} · {r.course}</div><div className="text-xs text-[var(--text2)] mt-0.5">{r.topic}</div><div className="text-[11px] text-[var(--text3)] mt-0.5">Requested {r.time}</div></div>
                <div className="flex gap-2 flex-col"><button className="btn-primary text-xs px-3 py-1.5">Accept</button><button className="btn-secondary text-xs px-3 py-1.5">Decline</button></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4"><h2 className="font-display font-bold text-[17px] text-[var(--text)]">📅 Upcoming Sessions</h2></div>
          <div className="flex flex-col gap-2.5">
            {SESSIONS.map((s, i) => (
              <div key={i} className="session-card">
                <div className="w-1 self-stretch rounded-sm flex-shrink-0" style={{ background: `var(--${s.c})` }} />
                <div className="flex-1"><div className="font-semibold text-sm">{s.name}</div><div className="text-xs text-[var(--text2)] mt-0.5">{s.topic}</div></div>
                <div className="text-right"><div className="text-[12px] text-[var(--text3)]">{s.time}</div><button className="btn-ghost text-[11px] px-2 py-1 mt-1" onClick={() => navigate('/tutor/chat')}>💬 Chat</button></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4"><h2 className="font-display font-bold text-[17px] text-[var(--text)]">Profile Summary</h2><button className="btn-secondary text-[13px]" onClick={() => navigate('/tutor/profile')}>Edit Profile →</button></div>
        <div className="profile-hero">
          <Avatar name="Amara Osei" color="var(--accent)" initials="AO" size={72} />
          <div className="flex-1">
            <div className="font-display text-xl font-extrabold mb-1 text-[var(--text)]">Amara Osei</div>
            <div className="flex items-center gap-2 text-[15px]"><Stars rating={4.9} /><strong>4.9</strong><span className="text-[var(--text2)]">· 47 reviews · 120 sessions</span></div>
            <div className="flex gap-1.5 flex-wrap mt-2.5">{['Data Structures','Algorithms','CS Foundations'].map((c) => <span key={c} className="badge badge-blue">{c}</span>)}</div>
            <p className="text-sm text-[var(--text2)] mt-2">PhD student in Computer Science. Love breaking down complex algorithms into digestible concepts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
