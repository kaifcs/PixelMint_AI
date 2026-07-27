import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  FRONTEND_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_FOLDER: z.string().min(1).default("pixelmint-ai"),
  REMOVE_BG_API_KEY: z.string().min(1),
  REMOVE_BG_SIZE: z.string().default("auto"),
  FREE_DAILY_LIMIT: z.coerce.number().int().positive().default(2),
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
  RAZORPAY_CURRENCY: z.string().length(3).default("INR"),
  RAZORPAY_PRO_PLAN_AMOUNT: z.coerce.number().int().positive(),
  BREVO_API_KEY: z.string().optional(),
  MAIL_FROM_EMAIL: z.string().email().default("support@pixelmint.ai"),
  MAIL_FROM_NAME: z.string().default("PixelMint AI Support"),
  CONTACT_RECEIVER_EMAIL: z.string().email().default("support@pixelmint.ai"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables", parsed.error.flatten().fieldErrors);
  throw new Error("Environment validation failed");
}

export const env = parsed.data;
