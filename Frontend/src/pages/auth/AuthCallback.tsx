import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useSyncUser } from '@/features/auth/hooks/useAuthApi'
import { PENDING_ROLE_KEY } from '@/pages/auth/SignupPage'
import { queryClient } from '@/lib/react-query'
import { get_me } from '@/features/auth/api/authApi'
import type { Role } from '@/shared/types'

export function AuthCallback() {
  const navigate = useNavigate()
  const { syncUserAsync } = useSyncUser()

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        navigate('/login', { replace: true });
        return;
      }

      // cancel any /me queries that auto-fired on token set
      await queryClient.cancelQueries({ queryKey: ['me'] });
      await queryClient.cancelQueries({ queryKey: ['profile'] });
      queryClient.removeQueries({ queryKey: ['me'] });
      queryClient.removeQueries({ queryKey: ['profile'] });

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
        // returning Google user — fetch /me directly
        try {
          const me = await get_me();
          role = me.role;
          queryClient.setQueryData(['me'], me);

          if (role === 'tutor' && !me.onboarding_complete) {
            navigate('/tutor/onboarding', { replace: true });
            return;
          }
        } catch {
          navigate('/login', { replace: true });
          return;
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['me'] });
      navigate(`/${role}/dashboard`, { replace: true });
    };

    handleAuth();
  }, []);

  return <div>Signing you in…</div>
}