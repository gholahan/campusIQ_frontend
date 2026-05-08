import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  initialized: boolean

  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>

  initialize: () => () => void // returns cleanup
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,

  signUp: async (email, password) => {
    set({ loading: true })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      set({ loading: false })
      throw error
    }

    // Only trust session if it exists (email confirmation may block login)
    set({
      user: data.session ? data.user : null,
      session: data.session,
      loading: false,
    })
  },

  signIn: async (email, password) => {
    set({ loading: true })

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      set({ loading: false })
      throw error
    }

    set({
      user: data.user,
      session: data.session,
      loading: false,
    })
  },

  signInWithGoogle: async () => {
    set({ loading: true })

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        set({ loading: false })
        throw error
      }

      // redirect happens → don't reset loading here
  },

  signOut: async () => {
    set({ loading: true })

    const { error } = await supabase.auth.signOut()

    if (error) {
      set({ loading: false })
      throw error
    }

    set({
      user: null,
      session: null,
      loading: false,
    })
  },

  initialize: () => {
    // prevent double init (React StrictMode safe)
    if (get().initialized) return () => {}

    // initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({
        session,
        user: session?.user ?? null,
        loading: false,
        initialized: true,
      })
    })

    // listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        set({
          session,
          user: session?.user ?? null,
          loading: false,
          initialized: true,
        })
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  },
}))