import { useNavigate, useLocation } from 'react-router-dom';
import type { Role } from '@/shared/types';

interface SidebarLink    { path: string; icon: string; label: string; count?: number; }
interface SidebarSection { heading: string; links: SidebarLink[]; }

const CONFIG: Record<Role, SidebarSection[]> = {
  student: [
    { heading: 'Main', links: [
      { path: '/student/dashboard', icon: '⊞', label: 'Dashboard' },
      { path: '/student/tutors',    icon: '🔍', label: 'Find Tutors' },
      { path: '/student/ai',        icon: '✦',  label: 'AI Assistant' },
    ]},
    { heading: 'Sessions', links: [
      { path: '/student/chat',    icon: '💬', label: 'Messages', count: 2 },
      { path: '/student/booking', icon: '📅', label: 'Bookings' },
    ]},
  ],
  tutor: [
    { heading: 'Overview', links: [
      { path: '/tutor/dashboard', icon: '⊞', label: 'Dashboard' },
      { path: '/tutor/chat',      icon: '💬', label: 'Messages', count: 3 },
    ]},
    { heading: 'Profile', links: [
      { path: '/tutor/profile', icon: '✏️', label: 'Edit Profile' },
    ]},
  ],
  admin: [
    { heading: 'Admin', links: [
      { path: '/admin/dashboard',  icon: '⊞', label: 'Overview' },
      { path: '/admin/users',      icon: '👥', label: 'Users' },
      { path: '/admin/moderation', icon: '🛡️', label: 'Moderation' },
    ]},
  ],
};

export function Sidebar({ role }: { role: Role }) {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const isActive     = (path: string) => pathname.startsWith(path);

  return (
    <div className="hidden md:flex md:w-56 lg:w-60 xl:w-64 border-r flex-col gap-1 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto
                    px-3 py-5 bg-[var(--bg2)] border-[var(--border)]">
      {CONFIG[role].map((section) => (
        <div key={section.heading}>
          <div className="text-[11px] font-bold uppercase tracking-widest px-3 pt-3 pb-1.5 text-[var(--text3)]">
            {section.heading}
          </div>
          {section.links.map((l) => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              className={`flex items-center gap-2.5 leading-none px-3 py-3 md:py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left border-none cursor-pointer
                ${isActive(l.path)
                  ? 'text-[var(--accent2)] bg-[var(--accent)]/8 font-semibold'
                  : 'text-[var(--text2)] bg-transparent hover:text-[var(--text)] hover:bg-[var(--bg3)]'}`}
            >
              <span>{l.icon}</span>
              {l.label}
              {l.count && (
                <span className="ml-auto text-[11px] font-bold px-1.5 py-0.5 rounded-full text-white bg-[var(--accent)]">
                  {l.count}
                </span>
              )}
            </button>
          ))}
        </div>
      ))}

      {/* Footer widget */}
      <div className="mt-auto pt-4">
        {role === 'student' && (
          <div className="rounded-xl p-3.5 border border-[var(--accent)]/15 bg-[var(--accent)]/5">
            <div className="text-[13px] font-bold mb-1 text-[var(--accent2)]">✦ AI Credits</div>
            <div className="text-xs text-[var(--text2)]">47 / 100 questions used</div>
            <div className="h-1.5 rounded-full mt-2 overflow-hidden bg-[var(--border)]">
              <div className="h-full w-[47%] rounded-full bg-[var(--accent)]" />
            </div>
          </div>
        )}
        {role === 'tutor' && (
          <div className="rounded-xl p-3.5 border border-[var(--cgreen)]/15 bg-[var(--cgreen)]/5">
            <div className="text-[13px] font-bold mb-1 text-[var(--cgreen)]">● Online</div>
            <div className="text-xs text-[var(--text2)]">Accepting sessions</div>
            <button className="btn-secondary text-xs mt-2 w-full justify-center py-1.5 px-3">
              Go Offline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
