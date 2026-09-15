import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Role } from '@/shared/types';
import {
  LayoutGrid,
  Search,
  Sparkles,
  MessageSquare,
  CalendarDays,
  Edit,
  Users,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarLink {
  path: string;
  icon: React.ElementType;
  label: string;
  count?: number;
}
interface SidebarSection {
  heading: string;
  links: SidebarLink[];
}

const CONFIG: Record<Role, SidebarSection[]> = {
  student: [
    { heading: 'Main', links: [
      { path: '/student/dashboard', icon: LayoutGrid, label: 'Dashboard' },
      { path: '/student/tutors',    icon: Search,         label: 'Find Tutors' },
      { path: '/student/ai',        icon: Sparkles,       label: 'AI Assistant' },
    ]},
    { heading: 'Sessions', links: [
      { path: '/student/chat',      icon: MessageSquare,  label: 'Messages', count: 2 },
      { path: '/student/sessions',  icon: CalendarDays,   label: 'Sessions' },
    ]},
  ],
  tutor: [
    { heading: 'Overview', links: [
      { path: '/tutor/dashboard', icon: LayoutGrid, label: 'Dashboard' },
      { path: '/tutor/chat',      icon: MessageSquare, label: 'Messages', count: 3 },
    ]},
    { heading: 'Profile', links: [
      { path: '/tutor/profile', icon: Edit, label: 'Edit Profile' },
    ]},
  ],
  admin: [
    { heading: 'Admin', links: [
      { path: '/admin/dashboard',   icon: LayoutGrid,   label: 'Overview' },
      { path: '/admin/users',       icon: Users,        label: 'Users' },
      { path: '/admin/moderation',  icon: ShieldAlert,  label: 'Moderation' },
    ]},
  ],
};

export function Sidebar({ role }: { role: Role }) {
  const navigate    = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div
      className={`
        hidden md:flex
        sticky top-16 h-full
        flex-col border-r bg-[var(--bg2)] border-[var(--border)]
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        overflow-hidden
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Scrollable nav links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {CONFIG[role].map((section) => (
          <div key={section.heading} className="mb-4">
            {/* Section heading */}
            <div
              className={`
                transition-all duration-200 overflow-hidden
                ${collapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'}
              `}
            >
              <div className="px-3 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text3)]">
                  {section.heading}
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-0.5">
              {section.links.map((l) => {
                const active = isActive(l.path);
                const Icon = l.icon;

                return (
                  <div key={l.path} className="relative">
                    <button
                      onClick={() => navigate(l.path)}
                      title={collapsed ? l.label : undefined}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left border-none cursor-pointer overflow-visible
                        ${active
                          ? 'bg-[var(--accent)]/8 text-[var(--accent2)]'
                          : 'text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--bg3)]'
                        }
                      `}
                    >
                      {/* Active left accent bar */}
                      <span className={`
                        absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full transition-all duration-150
                        ${active ? 'bg-[var(--accent)]' : 'bg-transparent group-hover:bg-[var(--border2)]'}
                      `} />

                      {/* Icon */}
                      <span className={`
                        flex items-center justify-center w-5 shrink-0
                        ${active ? 'text-[var(--accent)]' : 'text-[var(--text3)]'}
                      `}>
                        <Icon size={18} strokeWidth={1.8} />
                      </span>

                      {/* Label */}
                      <span
                        className={`
                          truncate transition-all duration-200
                          ${collapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100'}
                        `}
                      >
                        {l.label}
                      </span>

                      {/* Count badge */}
                      {l.count && !collapsed && (
                        <span className={`
                          ml-auto text-[11px] font-bold px-1.5 py-0.5 rounded-full shrink-0
                          ${active
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-[var(--bg3)] text-[var(--text3)]'
                          }
                        `}>
                          {l.count}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky footer widget + toggle */}
      <div className="flex-shrink-0 border-t border-[var(--border)] p-2 space-y-2">
        {/* Widget */}
        {!collapsed && role === 'student' && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] p-3.5 text-white">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} />
                <span className="text-xs font-bold tracking-wide">AI Credits</span>
              </div>
              <div className="text-lg font-extrabold">47 <span className="text-sm font-normal opacity-70">/ 100</span></div>
              <div className="mt-2 h-1.5 rounded-full bg-white/20">
                <div className="h-full w-[47%] rounded-full bg-white/80" />
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          </div>
        )}
        {!collapsed && role === 'tutor' && (
          <div className="rounded-2xl border border-[var(--cgreen)]/15 bg-[var(--cgreen)]/5 p-3.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cgreen)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--cgreen)]" />
              </span>
              <span className="text-xs font-bold text-[var(--cgreen)]">Online</span>
            </div>
            <div className="text-xs text-[var(--text2)] mb-3">Accepting sessions</div>
            <button className="w-full text-xs font-medium py-2 rounded-xl border border-[var(--cgreen)]/20 bg-transparent text-[var(--cgreen)] hover:bg-[var(--cgreen)]/10 transition-colors cursor-pointer">
              Go Offline
            </button>
          </div>
        )}

        {/* Collapsed widget placeholder */}
        {collapsed && role === 'student' && (
          <div className="relative mx-auto w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
            <div className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-white/20 blur-sm" />
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            group w-full flex items-center justify-center gap-2
            py-2 rounded-xl border border-[var(--border)]
            bg-[var(--bg3)] text-[var(--text3)]
            hover:text-[var(--accent2)] hover:border-[var(--accent)]/30 hover:bg-[var(--bg2)]
            transition-all duration-150 cursor-pointer
          "
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          <span
            className={`text-[11px] font-medium transition-all duration-200 ${collapsed ? 'max-w-0 opacity-0 overflow-hidden' : 'max-w-[80px] opacity-100'}`}
          >
            {collapsed ? '' : 'Collapse'}
          </span>
        </button>
      </div>
    </div>
  );
}
