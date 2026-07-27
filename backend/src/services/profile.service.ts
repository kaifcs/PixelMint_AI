import { supabaseAdmin } from "../config/supabase.js";
import { AppError } from "../utils/AppError.js";
import type { UserProfile } from "../utils/types.js";

export const getOrCreateProfile = async (userId: string, email: string, fullName: string | null): Promise<UserProfile> => {
  const { data: existing, error: existingError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (existingError) {
    throw new AppError("Failed to fetch user profile.", 500, existingError.message);
  }

  if (existing) {
    return existing as UserProfile;
  }

  // Attempt upsert with ignoreDuplicates to prevent lock contention on concurrent requests
  const { error: upsertError } = await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        id: userId,
        email,
        full_name: fullName,
        plan: "FREE",
      },
      { onConflict: "id", ignoreDuplicates: true },
    );

  if (upsertError) {
    throw new AppError("Failed to create user profile.", 500, upsertError.message);
  }

  // Reliably fetch the created or existing profile
  const { data: finalProfile, error: finalError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (finalError || !finalProfile) {
    throw new AppError("Failed to retrieve user profile after creation.", 500, finalError?.message);
  }

  return finalProfile as UserProfile;
};

export const upgradeUserToPro = async (userId: string) => {
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      plan: "PRO",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    throw new AppError("Failed to upgrade user plan.", 500, error.message);
  }
};
