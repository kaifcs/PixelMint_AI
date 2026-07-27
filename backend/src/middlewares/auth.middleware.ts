import type { NextFunction, Request, Response } from "express";
import { supabaseAuthClient } from "../config/supabase.js";
import { AppError } from "../utils/AppError.js";
import { getOrCreateProfile } from "../services/profile.service.js";

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError("Missing or invalid Authorization header.", 401);
    }

    const accessToken = authorization.replace("Bearer ", "").trim();
    const {
      data: { user },
      error,
    } = await supabaseAuthClient.auth.getUser(accessToken);

    if (error || !user?.email) {
      throw new AppError("Invalid or expired access token.", 401, error?.message);
    }

    const profile = await getOrCreateProfile(user.id, user.email, user.user_metadata?.full_name ?? null);

    req.user = {
      id: user.id,
      email: user.email,
      accessToken,
      profile,
    };

    next();
  } catch (error) {
    next(error);
  }
};
