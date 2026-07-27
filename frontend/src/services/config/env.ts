import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().optional(),
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error("Invalid frontend environment variables.");
}

export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL || "",
  supabaseUrl: parsed.data.VITE_SUPABASE_URL,
  supabaseAnonKey: parsed.data.VITE_SUPABASE_ANON_KEY,
};

export const hasSupabaseConfig = Boolean(
  env.supabaseUrl && env.supabaseAnonKey
);