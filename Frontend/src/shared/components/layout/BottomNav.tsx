import { useNavigate, useLocation } from 'react-router-dom';
import type { Role, BottomNavLink } from '@/shared/types';

const LINKS: Record<Role, BottomNavLink[]> = {
  student: [
    { key: 'dashboard', path: '/student/dashboard', icon: '⊞', label: 'Home' },
    { key: 'tutors',    path: '/student/tutors',    icon: '🔍', label: 'Tutors' },
    { key: 'ai',        path: '/student/ai',        icon: '✦',  label: 'AI' },
    { key: 'chat',      path: '/student/chat',      icon: '💬', label: 'Chat',     badge: 2 },
    { key: 'booking',   path: '/student/booking',   icon: '📅', label: 'Sessions' },
  ],
  tutor: [
    { key: 'dashboard', path: '/tutor/dashboard', icon: '⊞', label: 'Home',     badge: 3 },
    { key: 'chat',      path: '/tutor/chat',      icon: '💬', label: 'Messages', badge: 3 },
    { key: 'profile',   path: '/tutor/profile',   icon: '✏️', label: 'Profile' },
  ],
  admin: [
    { key: 'dashboard',  path: '/admin/dashboard',  icon: '⊞', label: 'Overview' },
    { key: 'users',      path: '/admin/users',      icon: '👥', label: 'Users' },
    { key: 'moderation', path: '/admin/moderation', icon: '🛡️', label: 'Reports', badge: 4 },
  ],
};

export function BottomNav({ role }: { role: Role }) {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const links        = LINKS[role] ?? [];
  const isActive     = (path: string) => pathname.startsWith(path);

  return (
    /* Outer positioner — full-width fixed, but pill is centered inside */
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-[200] flex justify-center pointer-events-none"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
    >
      {/* The pill itself */}
      <nav className="floating-pill pointer-events-auto">
        {links.map((link) => (
          <button
            key={link.key}
            onClick={() => navigate(link.path)}
            className="floating-pill-item"
            aria-label={link.label}
          >
            {/* Active filled background */}
            {isActive(link.path) && (
              <span className="floating-pill-active-bg" />
            )}

            {/* Badge */}
            {link.badge && !isActive(link.path) && (
              <span className="floating-pill-badge">{link.badge}</span>
            )}

            <span
              className="floating-pill-icon"
              style={{ color: isActive(link.path) ? 'var(--accent)' : 'var(--text3)' }}
            >
              {link.icon}
            </span>
            <span
              className="floating-pill-label"
              style={{ color: isActive(link.path) ? 'var(--accent2)' : 'var(--text3)' }}
            >
              {link.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
