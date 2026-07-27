import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, hasSupabaseConfig } from "../config/env";

let client: SupabaseClient | null = null;

export const getSupabaseClient = () => {
  if (!hasSupabaseConfig) {
    return null;
  }

  if (!client) {
    client = createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return client;
};
