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

  useEffect(() => {
    let active = true;

    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (error || !data.session) {
        navigate('/login', { replace: true });
        return;
      }

      // set token in store so interceptors work — status stays 'loading' until sync completes
      useAuthStore.setState({
        accessToken: data.session.access_token,
        session: data.session,
      });

      const metadata = data.session.user.app_metadata as
        | { role?: Role; onboarding_complete?: boolean }
        | undefined;

      // Read and immediately remove the key to prevent duplicate syncs across tabs
      const pendingRole = localStorage.getItem(PENDING_ROLE_KEY) as Role | null;
      if (pendingRole) localStorage.removeItem(PENDING_ROLE_KEY);

      if (pendingRole) {
        try {
          const syncedUser = await syncUserAsync({ role: pendingRole });
          if (!active) return;
          useAuthStore.setState({ status: 'authenticated' });
          navigate(`/${syncedUser.role}/dashboard`, { replace: true });
        } catch (err) {
          console.error('[AuthCallback] syncUser failed:', err);
          if (!active) return;
          navigate('/login', { replace: true });
        }
        return;
      }

      const role = metadata?.role;
      if (!role) {
        navigate('/login', { replace: true });
        return;
      }

      useAuthStore.setState({ status: 'authenticated' });

      if (role === 'tutor' && !metadata?.onboarding_complete) {
        navigate('/tutor/onboarding', { replace: true });
        return;
      }

      navigate(`/${role}/dashboard`, { replace: true });
    };

    handleAuth();
    return () => { active = false; };
  }, []);

  return <div className="bg-white flex justify-center items-center h-full">Signing you in…</div>
}