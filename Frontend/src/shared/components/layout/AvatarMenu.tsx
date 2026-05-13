import { useAuthStore } from '@/features/auth';
import { useGetProfile } from '@/features/auth/hooks/useAuthApi';
import { Avatar } from '@/shared/components/ui';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AvatarMenuProps {
  /** Called after any navigation so parent drawers can close */
  onNavigate?: () => void;
  /** Only render the avatar trigger, no inline nav items */
  avatarOnly?: boolean;
}

export function AvatarMenu({ onNavigate, avatarOnly = false }: AvatarMenuProps) {
  const [open, setOpen]         = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const ref                     = useRef<HTMLDivElement>(null);
  const navigate                = useNavigate();
  const signOut                 = useAuthStore((s) => s.signOut);
  const { user }                = useGetProfile();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setLogoutError(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  if (!user) return null;
 
  const profile_picture = user.avatar_url
  const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();

  function go(path: string) {
    navigate(path);
    setOpen(false);
    onNavigate?.();
  }

  const handleLogout = async () => {
    setLogoutError(null);
    setIsLoggingOut(true);

    try {
      await signOut();

      setOpen(false);
      onNavigate?.();

      navigate('/', { replace: true });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to log out. Please try again.';

      setLogoutError(message);
      setIsLoggingOut(false);
    }
  };

  return (
    <div ref={ref} className="relative z-[200]">
      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-[var(--bg3)] transition-all bg-transparent border-none cursor-pointer"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <Avatar name={fullName} imageUrl={profile_picture} size={28}/>

        {/* Show name on md+ unless avatarOnly */}
        {!avatarOnly && (
          <span className="hidden lg:block text-sm font-medium text-[var(--text)] max-w-[120px] truncate">
            {fullName || 'Account'}
          </span>
        )}
      </button>

      {/* ── Dropdown ── */}
      <div
        className={`
          absolute right-0 top-full mt-2 w-52
          rounded-xl border shadow-xl
          bg-[var(--bg2)] border-[var(--border)]
          transition-all duration-150 origin-top-right
          z-[1000]
          ${open
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}
        `}
        role="menu"
      >
        {/* Arrow */}
        <div className="absolute -top-1.5 right-3 w-3 h-3 rotate-45 bg-[var(--bg2)] border-l border-t border-[var(--border)]" />

        {/* User info header */}
        <div className="px-3 pt-3 pb-2 flex items-center gap-2.5">
          <Avatar name={fullName} imageUrl={profile_picture} size={28}/>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text)] truncate">{fullName || '—'}</p>
            <p className="text-xs text-[var(--text2)] truncate">{user.email ?? ''}</p>
          </div>
        </div>

        <div className="mx-2 my-1 h-px bg-[var(--border)]" />

        <div className="p-1">
          <button onClick={() => go('/profile')}  className="menu-item" role="menuitem">Profile</button>
          <button onClick={() => go('/settings')} className="menu-item" role="menuitem">Settings</button>

          <div className="my-1 h-px bg-[var(--border)]" />

          {logoutError && (
            <div className="px-2 py-1.5 mb-1 text-xs text-red-500 bg-red-500/10 rounded">
              {logoutError}
            </div>
          )}

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="menu-item text-red-500 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            role="menuitem"
          >
            {isLoggingOut ? 'Logging out...' : 'Log Out'}
          </button>
        </div>
      </div>
    </div>
  );
}