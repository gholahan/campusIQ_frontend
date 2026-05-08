import type { Role } from '@/shared/types';
import { Outlet } from 'react-router-dom';

import { BottomNav } from './BottomNav';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function AppShell({role,}: { role?: Role}) {
  return (
    <div
      className="
        h-dvh
        bg-[var(--bg)]
        flex flex-col
      "
    >
      <Navbar />

      {role ? (
        <div className="flex flex-1 min-h-0">
          <Sidebar role={role} />

          <main
            className="
              flex-1
              p-2 md:p-4 lg:p-6
              min-h-0
              overflow-y-auto
              relative
               pb-20
            "
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