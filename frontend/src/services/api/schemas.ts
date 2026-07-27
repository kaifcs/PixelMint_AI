import { z } from "zod";

export const removeBgResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    originalImageUrl: z.string().url(),
    processedImageUrl: z.string().url(),
    remainingFreeQuota: z.number().nullable(),
  }),
});

export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.unknown().optional(),
});

export const userUsageSchema = z.object({
  success: z.literal(true),
  data: z.object({
    plan: z.enum(["FREE", "PRO"]),
    dailyUsed: z.number(),
    dailyLimit: z.number().nullable(),
    remaining: z.number().nullable(),
  }),
});

export const userHistorySchema = z.object({
  success: z.literal(true),
  data: z.array(
    z.object({
      id: z.string(),
      original_image_url: z.string().url(),
      processed_image_url: z.string().url(),
      source_filename: z.string(),
      status: z.string(),
      created_at: z.string(),
    }),
  ),
});

export const createOrderResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.string(),
    entity: z.string(),
    amount: z.number(),
    amount_paid: z.number(),
    amount_due: z.number(),
    currency: z.string(),
    receipt: z.string().optional().nullable(),
    status: z.string(),
    key_id: z.string(),
  }),
});

export const verifyOrderResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.string(),
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string().nullable().optional(),
    user_id: z.string(),
    plan: z.string(),
    amount: z.number(),
    currency: z.string(),
    status: z.string(),
  }),
});

export type RemoveBgResponse = z.infer<typeof removeBgResponseSchema>;
export type CreateOrderResponse = z.infer<typeof createOrderResponseSchema>;
export type VerifyOrderResponse = z.infer<typeof verifyOrderResponseSchema>;

export const contactResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export type ContactResponse = z.infer<typeof contactResponseSchema>;
