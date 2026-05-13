import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useSyncUser } from '@/features/auth/hooks/useAuthApi'
import { PENDING_ROLE_KEY } from '@/pages/auth/SignupPage'
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

    const pendingRole = localStorage.getItem(
      PENDING_ROLE_KEY
    ) as Role | null;

    let role: Role = pendingRole ?? 'student';

    if (pendingRole) {
      try {
        const syncedUser = await syncUserAsync({
          role: pendingRole,
        });

        role = syncedUser.role;
      } catch (err) {
        console.error('[AuthCallback] syncUser failed:', err);
      } finally {
        localStorage.removeItem(PENDING_ROLE_KEY);
      }
    }

    navigate(`/${role}/dashboard`, {
      replace: true,
    });
  };

  handleAuth();
}, []);

  return <div>Signing you in…</div>
}