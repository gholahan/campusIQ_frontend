import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { User, Session, AuthResponse } from "@supabase/supabase-js";

export type AuthStatus =
  | "loading"
  | "anonymous"
  | "authenticated"
  | "verification_pending";

interface AuthState {
  user: User | null;
  session: Session | null;
  accessToken: string | null;
  status: AuthStatus;
  initialized: boolean;

  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  accessToken: null,
  status: "loading",
  initialized: false,

  // ================= SIGN UP =================
  signUp: async (email, password) => {
    set({ status: "loading" });

    const res = await supabase.auth.signUp({
      email,
      password,
    });

    const { data, error } = res;

    if (error) {
      set({ status: "anonymous" });
      throw error;
    }

    /**
     * IMPORTANT:
     * session is NULL when email confirmation is ON
     */
    if (!data.session) {
      set({
        user: data.user ?? null,
        session: null,
        accessToken: null,
        status: "verification_pending",
      });
    } else {
      set({
        user: data.user ?? null,
        session: data.session,
        accessToken: data.session.access_token,
        status: "authenticated",
      });
    }

    return res;
  },

  // ================= SIGN IN =================
  signIn: async (email, password) => {
    set({ status: "loading" });

    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const { data, error } = res;

    if (error) {
      set({ status: "anonymous" });
      throw error;
    }

    set({
      user: data.user,
      session: data.session,
      accessToken: data.session.access_token,
      status: "authenticated",
    });

    return res;
  },

  // ================= GOOGLE =================
  signInWithGoogle: async () => {
    set({ status: "loading" });

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      set({ status: "anonymous" });
      throw error;
    }
  },

  // ================= SIGN OUT =================
  signOut: async () => {
    await supabase.auth.signOut();

    set({
      user: null,
      session: null,
      accessToken: null,
      status: "anonymous",
    });
  },

  // ================= INIT (SOURCE OF TRUTH) =================
  initialize: () => {
    if (get().initialized) return () => {};

    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;

      set({
        session,
        user: session?.user ?? null,
        accessToken: session?.access_token ?? null,
        status: session ? "authenticated" : "anonymous",
        initialized: true,
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
        accessToken: session?.access_token ?? null,
        status: session ? "authenticated" : "anonymous",
        initialized: true,
      });
    });

    return () => subscription.unsubscribe();
  },
}));