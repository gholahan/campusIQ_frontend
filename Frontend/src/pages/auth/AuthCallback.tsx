import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useSyncUser } from '@/features/auth/hooks/useAuthApi'
import { PENDING_ROLE_KEY } from '@/pages/auth/SignupPage'
import type { Role } from '@/shared/types'
import { useAuthStore } from '@/features/auth/authStore'

export function AuthCallback() {
  const navigate = useNavigate()
  const { syncUserAsync } = useSyncUser()
  const session = useAuthStore((state) => state.session);
  const metadata = session?.user.app_metadata as
  | { role?: Role; onboarding_complete?: boolean }
  | undefined;
  

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        navigate('/login', { replace: true });
        return;
      }
      const pendingRole = localStorage.getItem(PENDING_ROLE_KEY) as Role | null;

      let role: Role;

      if (pendingRole) {
        // new Google signup — sync the user with their chosen role
        try {
          const syncedUser = await syncUserAsync({ role: pendingRole });
          role = syncedUser.role;
        } catch (err) {
          console.error('[AuthCallback] syncUser failed:', err);
          navigate('/login', { replace: true });
          return;
        } finally {
          localStorage.removeItem(PENDING_ROLE_KEY);
        }
      } else {
        // returning Google user — use user's jwt supabase metadata role  
        try {
          role = metadata?.role;

          if (role === 'tutor' && !metadata?.onboarding_complete) {
            navigate('/tutor/onboarding', { replace: true });
            return;
          }
        } catch {
          navigate('/login', { replace: true });
          return;
        }
      }

      navigate(`/${role}/dashboard`, { replace: true });
    };

    handleAuth();
  }, []);

  return <div className="bg-white flex justify-center items-center h-full" >Signing you in…</div>
}