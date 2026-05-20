import { useAuthStore } from '@/features/auth/authStore';
import { useEffect, useRef } from 'react';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const cleanup = useAuthStore.getState().initialize();
    return cleanup;
  }, []);

  return <>{children}</>;
}