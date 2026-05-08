import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        navigate('/login')
        return
      }

      // TEMP: redirect (we'll make this role-based later)
      navigate('/student/dashboard')
    }

    handleAuth()
  }, [])

  return <div>Signing you in...</div>
}