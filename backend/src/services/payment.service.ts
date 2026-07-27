import crypto from "node:crypto";
import { razorpay } from "../config/razorpay.js";
import { env } from "../config/env.js";
import { supabaseAdmin } from "../config/supabase.js";
import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";

export const createProOrder = async (userId: string) => {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.plan === "PRO") {
    throw new AppError("You are already subscribed to the Pro Enterprise plan.", 400);
  }

  const receipt = `pro_${userId.slice(0, 8)}_${Date.now()}`;

  const order = await razorpay.orders.create({
    amount: env.RAZORPAY_PRO_PLAN_AMOUNT,
    currency: env.RAZORPAY_CURRENCY,
    receipt,
    notes: {
      userId,
      plan: "PRO",
    },
  });

  const { error } = await supabaseAdmin.from("payment_orders").insert({
    razorpay_order_id: order.id,
    user_id: userId,
    plan: "PRO",
    amount: order.amount,
    currency: order.currency,
    status: order.status,
  });

  if (error) {
    throw new AppError("Failed to save payment order.", 500, error.message);
  }

  return {
    ...order,
    key_id: env.RAZORPAY_KEY_ID,
  };
};

export const verifyWebhookSignature = (rawBody: Buffer, signature: string | undefined) => {
  if (!signature) {
    throw new AppError("Missing Razorpay signature.", 400);
  }

  const expected = crypto.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
    throw new AppError("Invalid Razorpay webhook signature.", 400);
  }
};

export const verifyPaymentSignature = (orderId: string, paymentId: string, signature: string) => {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", env.RAZORPAY_KEY_SECRET).update(body).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
    throw new AppError("Invalid payment verification signature.", 400);
  }
};

export const markOrderPaid = async (razorpayOrderId: string, razorpayPaymentId: string, eventId?: string) => {
  const { data: order, error: fetchError } = await supabaseAdmin
    .from("payment_orders")
    .select("*")
    .eq("razorpay_order_id", razorpayOrderId)
    .maybeSingle();

  if (fetchError) {
    throw new AppError("Failed to fetch payment order.", 500, fetchError.message);
  }

  if (!order) {
    throw new AppError("Payment order not found.", 404);
  }

  if (order.status === "paid") {
    if (order.razorpay_payment_id && order.razorpay_payment_id !== razorpayPaymentId) {
      logger.warn("payment.duplicate_mismatch", {
        razorpayOrderId,
        existingPaymentId: order.razorpay_payment_id,
        receivedPaymentId: razorpayPaymentId,
      });
    }
    return order;
  }

  const { data: rpcResult, error } = await supabaseAdmin.rpc("process_payment_webhook_atomic", {
    p_order_id: razorpayOrderId,
    p_payment_id: razorpayPaymentId,
    p_event_id: eventId || `manual_${razorpayOrderId}_${Date.now()}`,
    p_user_id: order.user_id,
  });

  if (error) {
    throw new AppError("Failed to update payment order atomically.", 500, error.message);
  }

  if (rpcResult === "DUPLICATE_EVENT_IGNORED" || rpcResult === "DUPLICATE_PAYMENT_IGNORED") {
    logger.info("payment.idempotent_duplicate_ignored", { razorpayOrderId, razorpayPaymentId, eventId, reason: rpcResult });
    return order;
  }

  return {
    ...order,
    status: "paid",
    razorpay_payment_id: razorpayPaymentId,
  };
};
