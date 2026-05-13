import { queryClient } from '@/lib/react-query';
import { supabase } from "@/lib/supabase";
import type { AuthResponse, Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

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
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Reset store state
      set({
        user: null,
        session: null,
        accessToken: null,
        status: "anonymous",
      });

      // Clear React Query cache
      queryClient.clear();
    } catch (error) {
      // Reset store state even if signOut fails
      set({
        user: null,
        session: null,
        accessToken: null,
        status: "anonymous",
      });
      queryClient.clear();
      throw error;
    }
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
  //      if (event === "SIGNED_OUT") {
  //     // 1. clear zustand
  //     useAuthStore.getState().logout();

  //   // 2. clear react-query cache
  //   queryClient.clear();
  // }

  // if (event === "SIGNED_IN") {
  //   useAuthStore.getState().setSession(session);
  // }
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