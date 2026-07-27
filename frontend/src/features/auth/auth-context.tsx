import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSupabaseClient } from "@/services/supabase/client";
import { appRoutes } from "@/app/router/routes";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  authEnabled: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ session: Session | null; user: User | null } | undefined>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  resetPasswordForEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = getSupabaseClient();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    // Supabase v2 onAuthStateChange automatically emits an initial event (INITIAL_SESSION / SIGNED_IN)
    // Avoid calling getSession() concurrently to prevent out-of-order state updates and race conditions.
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isLoading,
      authEnabled: Boolean(supabase),
      signIn: async (email, password) => {
        const client = supabase;
        if (!client) {
          toast.error("Supabase is not configured.");
          return;
        }
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user ?? null);
        }
        toast.success("Signed in successfully.");
      },
      signUp: async (email, password) => {
        const client = supabase;
        if (!client) {
          toast.error("Supabase is not configured.");
          return { session: null, user: null };
        }
        const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}${appRoutes.dashboard}` : undefined;
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });
        if (error) throw error;
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user ?? null);
          toast.success("Account created and signed in successfully.");
        } else if (data.user && !data.session) {
          if (data.user.identities && data.user.identities.length === 0) {
            toast.error("An account with this email already exists. Please log in instead.");
          } else {
            toast.success("Check your email to confirm your account.");
          }
        }
        return { session: data.session, user: data.user };
      },
      signOut: async () => {
        const client = supabase;
        if (!client) {
          toast.error("Supabase is not configured.");
          return;
        }
        const { error } = await client.auth.signOut();
        if (error) throw error;
        setSession(null);
        setUser(null);
        queryClient.clear();
        toast.success("Signed out.");
      },
      getAccessToken: async () => {
        const client = supabase;
        if (!client) return null;
        const { data } = await client.auth.getSession();
        return data.session?.access_token ?? null;
      },
      resetPasswordForEmail: async (email) => {
        const client = supabase;
        if (!client) {
          toast.error("Supabase is not configured.");
          return;
        }
        const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
        const { error } = await client.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });
        if (error && !error.message.toLowerCase().includes("user not found")) {
          throw error;
        }
        toast.success("If an account exists with this email, a password reset link has been sent.");
      },
    }),
    [isLoading, queryClient, session, supabase, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

