import type { Role } from '@/shared/types';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function AppShell({ role }: { role?: Role }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      {role ? (
        <div className="flex">
          <Sidebar role={role} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pb-20">
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
