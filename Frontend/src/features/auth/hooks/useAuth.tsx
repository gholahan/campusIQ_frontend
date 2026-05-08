import { useAuthStore } from '@/features/auth/authStore'
import { useEffect, useRef } from 'react'


export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize)
  const initializedRef = useRef(false)

  useEffect(() => {
    // prevent double init in StrictMode
    if (initializedRef.current) return
    initializedRef.current = true

    const cleanup = initialize()
    return cleanup
  }, [initialize])

  return <>{children}</>
}

