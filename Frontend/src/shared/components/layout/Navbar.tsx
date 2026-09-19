import { useTheme } from '@/shared/hooks/useTheme';
import type { Role } from '@/shared/types';
import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AvatarMenu } from './AvatarMenu';

const NAV_LINKS: Record<Role, { label: string; path: string }[]> = {
  student: [
    { label: 'Dashboard',    path: '/student/dashboard' },
    { label: 'Find Tutors',  path: '/student/tutors'    },
    { label: 'AI Assistant', path: '/student/ai'        },
    // { label: 'Chat',         path: '/student/chat'      },
    { label: 'Session', path: '/student/sessions' }
  ],
  tutor: [
    { label: 'Dashboard', path: '/tutor/dashboard' },
    { label: 'Profile',   path: '/tutor/profile'   },
    {label: 'Sessions',  path: '/tutor/sessions'  },
    // { label: 'Chat',      path: '/tutor/chat'      },
  ],
  admin: [
    { label: 'Dashboard',  path: '/admin/dashboard'  },
    { label: 'Users',      path: '/admin/users'      },
    { label: 'Moderation', path: '/admin/moderation' },
  ],
};

function useRoleFromPath(): Role | null {
  const { pathname } = useLocation();
  if (pathname.startsWith('/student')) return 'student';
  if (pathname.startsWith('/tutor'))   return 'tutor';
  if (pathname.startsWith('/admin'))   return 'admin';
  return null;
}

export function Navbar() {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const role         = useRoleFromPath();
  const links        = role ? NAV_LINKS[role] : [];
  const isActive     = (path: string) => pathname.startsWith(path);
  const { isDark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* ── Main bar ── */}
      <nav className="sticky top-0 z-50 w-full bg-[var(--bg2)]/85 backdrop-blur-xl backdrop-saturate-150 border-b border-[var(--border)] px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between py-2.5">
        {/* Brand */}
        <button
          onClick={() => { navigate('/'); closeMobile(); }}
          className="flex items-center gap-2.5 font-display font-extrabold text-lg sm:text-xl bg-transparent border-none cursor-pointer p-0"
        >
          <div className="relative">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <rect width="24" height="24" rx="7" fill="url(#navGrad)" />
              <defs>
                <linearGradient id="navGrad" x1="0" y1="0" x2="24" y2="24">
                  <stop stopColor="var(--accent)" />
                  <stop offset="1" stopColor="var(--accent2)" />
                </linearGradient>
              </defs>
              <path d="M6 16L12 8l6 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="4" r="1" fill="white" />
            </svg>
          </div>
          <span className="tracking-tight">CampusIQ</span>
        </button>

        {/* ── Desktop nav ── */}
        <div className="navbar-desktop hidden md:flex items-center gap-0.5">
          {links.map((l) => {
            const active = isActive(l.path);
            return (
              <button
                key={l.path}
                onClick={() => navigate(l.path)}
                className={`
                  relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 bg-transparent border-none cursor-pointer
                  ${active
                    ? 'text-[var(--accent2)]'
                    : 'text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--bg3)]'
                  }
                `}
              >
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[3px] rounded-full bg-[var(--accent)]" />
                )}
                {l.label}
              </button>
            );
          })}

          {!role && (
            <>
              {/* <div className="w-px h-6 bg-[var(--border)] mx-2" /> */}
              <button
                onClick={() => navigate('/login')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-transparent border-none cursor-pointer
                  ${pathname === '/login' ? 'text-(--accent2)' : 'text-(--text2) hover:text-(--text) hover:bg-(--bg3)'}`}
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 bg-transparent border-none cursor-pointer
                  ${pathname === '/signup' ? 'text-(--accent2)' : 'text-(--text2) hover:text-(--text) hover:bg-(--bg3)'}`}
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* ── Right cluster ── */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="theme-toggle"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Avatar */}
          <div className="hidden sm:block">
            <AvatarMenu onNavigate={closeMobile} />
          </div>

          {/* Mobile avatar only */}
          <div className="flex items-center gap-1 md:hidden">
            <AvatarMenu onNavigate={closeMobile} avatarOnly />
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div
        className={`
          md:hidden fixed inset-x-0 top-14 z-[99]
          bg-[var(--bg2)]/95 backdrop-blur-xl border-b border-[var(--border)]
          transition-all duration-200 origin-top
          ${mobileOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}
        `}
      >
        <div className="flex flex-col p-2">
          {links.map((l) => {
            const active = isActive(l.path);
            return (
              <button
                key={l.path}
                onClick={() => { navigate(l.path); closeMobile(); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all bg-transparent border-none cursor-pointer
                  ${active
                    ? 'text-[var(--accent2)] bg-[var(--accent)]/10'
                    : 'text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--bg3)]'}`}
              >
                {l.label}
              </button>
            );
          })}

          {!role && (
            <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border)] mt-1">
              <button
                onClick={() => { navigate('/login'); closeMobile(); }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--bg3)] transition-all bg-transparent border-none cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => { navigate('/signup'); closeMobile(); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all bg-transparent border-none cursor-pointer
                  ${pathname === '/signup' ? 'text-(--accent2)' : 'text-(--text2) hover:text-(--text) hover:bg-(--bg3)'}`}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
