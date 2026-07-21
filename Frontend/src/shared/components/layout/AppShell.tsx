import type { Role } from '@/shared/types';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ScrollToTop } from '@/shared/components/ScrollToTop';

export function AppShell({ role }: { role?: Role }) {
  const { pathname } = useLocation();
  const isAI = pathname === '/student/ai';

  return (
    <div className="bg-[var(--bg)] flex flex-col" style={{ height: '100svh' }}>
      <ScrollToTop />
      <Navbar />

      {role ? (
        <div className="flex flex-1 min-h-0">
          <Sidebar role={role} />
          <main
            className={`flex-1 min-h-0 relative ${
              isAI
                ? 'overflow-hidden p-0'
                : 'overflow-y-auto p-2 md:p-4 lg:p-6 pb-20'
            }`}
          >
            <Outlet />
          </main>
        </div>
      ) : (
        <Outlet />
      )}

      {role && <BottomNav role={role} />}
    </div>
  );
}