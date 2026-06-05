import { useNavigate, useLocation } from 'react-router-dom';
import type { Role, BottomNavLink } from '@/shared/types';

import {
  LayoutGrid,
  Search,
  Sparkles,
  MessageSquare,
  CalendarDays,
  PencilLine,
  Users,
  ShieldAlert,
} from 'lucide-react';

const LINKS: Record<Role, BottomNavLink[]> = {
  student: [
    {
      key: 'dashboard',
      path: '/student/dashboard',
      icon: LayoutGrid,
      label: 'Home',
    },
    {
      key: 'tutors',
      path: '/student/tutors',
      icon: Search,
      label: 'Tutors',
    },
    {
      key: 'ai',
      path: '/student/ai',
      icon: Sparkles,
      label: 'AI',
    },
    {
      key: 'chat',
      path: '/student/chat',
      icon: MessageSquare,
      label: 'Chat',
      badge: 2,
    },
    {
      key: 'booking',
      path: '/student/sessions',
      icon: CalendarDays,
      label: 'Sessions',
    },
  ],

  tutor: [
    {
      key: 'dashboard',
      path: '/tutor/dashboard',
      icon: LayoutGrid,
      label: 'Home',
      badge: 3,
    },
    {
      key: 'chat',
      path: '/tutor/chat',
      icon: MessageSquare,
      label: 'Messages',
      badge: 3,
    },
    {
      key: 'profile',
      path: '/tutor/profile',
      icon: PencilLine,
      label: 'Profile',
    },
  ],

  admin: [
    {
      key: 'dashboard',
      path: '/admin/dashboard',
      icon: LayoutGrid,
      label: 'Overview',
    },
    {
      key: 'users',
      path: '/admin/users',
      icon: Users,
      label: 'Users',
    },
    {
      key: 'moderation',
      path: '/admin/moderation',
      icon: ShieldAlert,
      label: 'Reports',
      badge: 4,
    },
  ],
};

export function BottomNav({ role }: { role: Role }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const links = LINKS[role] ?? [];

  const isActive = (path: string) =>
    pathname.startsWith(path);

  return (
    <div
      className="
        md:hidden
        fixed bottom-0 left-0 right-0
        z-[200]
        flex justify-center
        pointer-events-none
      "
      style={{
        paddingBottom:
          'max(env(safe-area-inset-bottom, 0px), 16px)',
      }}
    >
      <nav className="floating-pill pointer-events-auto">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <button
              key={link.key}
              onClick={() => navigate(link.path)}
              className="floating-pill-item"
              aria-label={link.label}
            >
              {/* active bg */}
              {isActive(link.path) && (
                <span className="floating-pill-active-bg" />
              )}

              {/* badge */}
              {!!link.badge &&
                !isActive(link.path) && (
                  <span className="floating-pill-badge">
                    {link.badge}
                  </span>
                )}

              {/* icon */}
              <span className="floating-pill-icon">
                <Icon
                  size={18}
                  strokeWidth={2.2}
                  className={
                    isActive(link.path)
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--text3)]'
                  }
                />
              </span>

              {/* label */}
              <span
                className={`
                  floating-pill-label
                  ${
                    isActive(link.path)
                      ? 'text-[var(--accent2)]'
                      : 'text-[var(--text3)]'
                  }
                `}
              >
                {link.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}