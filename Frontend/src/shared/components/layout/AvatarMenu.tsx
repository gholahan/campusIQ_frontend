import { useAuthStore } from '@/features/auth';
import { Avatar } from '@/shared/components/ui';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const signOut = useAuthStore(s=> s.signOut)

useEffect(() => {
  function handleClick(e: MouseEvent) {
    if (!ref.current?.contains(e.target as Node)) {
      setOpen(false);
    }
  }

  document.addEventListener('mousedown', handleClick);
  return () => document.removeEventListener('mousedown', handleClick);
}, []);
  return (
    <div ref={ref} className="relative md:hidden z-1000">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center"
      >
        <Avatar name="Sam" size={28} />
      </button>

      {/* Dropdown */}
      <div
        className={`
          absolute right-0 top-full mt-2 w-44
          rounded-xl border shadow-lg
          bg-[var(--bg2)] border-[var(--border)]
          transition-all duration-150 origin-top-right
          z-[1000]
          ${open
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}
        `}
      >
        {/* little arrow */}
        <div className="absolute -top-1.5 right-3 w-3 h-3 rotate-45 bg-[var(--bg2)] border-l border-t border-[var(--border)]" />

        <div className="p-1">
          <button
            onClick={() => {
              navigate('/profile');
              setOpen(false);
            }}
            className="menu-item"
          >
            Profile
          </button>

          <button
            onClick={() => {
              navigate('/settings');
              setOpen(false);
            }}
            className="menu-item"
          >
            Settings
          </button>

          <div className="my-1 h-px bg-[var(--border)]" />

          <button
            onClick={() =>{ signOut ; navigate("/")}}
            className="menu-item text-red-500"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}