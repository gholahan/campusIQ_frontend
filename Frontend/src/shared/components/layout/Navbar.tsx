import { useTheme } from '@/shared/hooks/useTheme';
import type { Role } from '@/shared/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { AvatarMenu } from './AvatarMenu';
import { Moon, Sun} from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS: Record<Role, { label: string; path: string }[]> = {
  student: [
    { label: 'Dashboard',    path: '/student/dashboard' },
    { label: 'Find Tutors',  path: '/student/tutors'    },
    { label: 'AI Assistant', path: '/student/ai'        },
    { label: 'Chat',         path: '/student/chat'      },
  ],
  tutor: [
    { label: 'Dashboard', path: '/tutor/dashboard' },
    { label: 'Profile',   path: '/tutor/profile'   },
    { label: 'Chat',      path: '/tutor/chat'      },
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
  const navigate        = useNavigate();
  const { pathname }    = useLocation();
  const role            = useRoleFromPath();
  const links           = role ? NAV_LINKS[role] : [];
  const isActive        = (path: string) => pathname.startsWith(path);
  const { isDark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* ── Main bar ── */}
      <nav className="
        sticky top-0 z-[100]
        backdrop-blur-xl border-b
        bg-[var(--bg2)]/90 border-[var(--border)]
        px-4 sm:px-6 lg:px-8
        h-14 sm:h-16 py-3
        flex items-center justify-between
        overflow-visible
      ">
        {/* Brand */}
        <button
          onClick={() => { navigate('/'); closeMobile(); }}
          className="flex items-center gap-2 font-display font-extrabold text-lg sm:text-xl brand-gradient bg-transparent border-none cursor-pointer p-0"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
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
          <span className="truncate">CampusIQ</span>
        </button>

        {/* ── Desktop nav ── */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all bg-transparent border-none cursor-pointer
                ${isActive(l.path)
                  ? 'text-[var(--accent2)] bg-[var(--accent)]/10'
                  : 'text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--bg3)]'}`}
            >
              {l.label}
            </button>
          ))}

         {!role && (
  <>
    <button
      onClick={() => navigate('/login')}
      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer
        ${
          pathname === '/login'
            ? 'text-[var(--accent2)] bg-[var(--accent)]/10'
            : 'text-[var(--text2)] bg-transparent hover:text-[var(--text)] hover:bg-[var(--bg3)]'
        }`}
    >
      Log In
    </button>

    <button
      onClick={() => navigate('/signup')}
      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer
        ${
          pathname === '/signup'
            ? 'text-[var(--accent2)] bg-[var(--accent)]/10'
            : 'text-[var(--text2)] bg-transparent hover:text-[var(--text)] hover:bg-[var(--bg3)]'
        }`}
    >
      Get Started
    </button>
  </>
)}
        </div>

        {/* ── Right cluster ── */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="theme-toggle"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Avatar — desktop (md+) */}
          <div className="hidden md:block">
            <AvatarMenu onNavigate={closeMobile} />
          </div>

          {/* Mobile: hamburger OR avatar+hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Show avatar on sm so the user knows they're logged in */}
            <AvatarMenu onNavigate={closeMobile} avatarOnly />
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div
        className={`
          md:hidden fixed inset-x-0 top-14 sm:top-16 z-[99]
          bg-[var(--bg2)]/95 backdrop-blur-xl border-b border-[var(--border)]
          transition-all duration-200 origin-top
          ${mobileOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'}
        `}
      >
      
          {links.map((l) => (
            <button
              key={l.path}
              onClick={() => { navigate(l.path); closeMobile(); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-transparent border-none cursor-pointer
                ${isActive(l.path)
                  ? 'text-[var(--accent2)] bg-[var(--accent)]/10'
                  : 'text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--bg3)]'}`}
            >
              {l.label}
            </button>
          ))}

          {!role && (
            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)] mt-1">
              <button
                onClick={() => { navigate('/login'); closeMobile(); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--bg3)] transition-all bg-transparent border-none cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => { navigate('/signup'); closeMobile(); }}
                className="btn-primary w-full text-center"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
    </>
  );
}