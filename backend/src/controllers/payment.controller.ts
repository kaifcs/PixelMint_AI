import type { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { createProOrder, markOrderPaid, verifyPaymentSignature, verifyWebhookSignature } from "../services/payment.service.js";

export const createOrder = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  if (req.user.profile.plan === "PRO") {
    throw new AppError("User is already on the PRO plan.", 400);
  }

  const order = await createProOrder(req.user.id);

  res.status(201).json({
    success: true,
    data: order,
  });
};

export const verifyOrder = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new AppError("Missing required payment verification fields.", 400);
  }

  verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  const order = await markOrderPaid(razorpay_order_id, razorpay_payment_id);

  res.json({
    success: true,
    data: order,
  });
};

export const verifyPaymentWebhook = async (req: Request, res: Response) => {
  const rawBody = req.body as Buffer;

  verifyWebhookSignature(rawBody, req.headers["x-razorpay-signature"] as string | undefined);

  const payload = JSON.parse(rawBody.toString("utf8")) as {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
        };
      };
    };
  };

  if (payload.event === "payment.captured") {
    const razorpayOrderId = payload.payload?.payment?.entity?.order_id;
    const razorpayPaymentId = payload.payload?.payment?.entity?.id;

    if (!razorpayOrderId || !razorpayPaymentId) {
      throw new AppError("Incomplete payment payload.", 400);
    }

    const eventId = (payload as Record<string, unknown>).id as string | undefined || `evt_${razorpayPaymentId}_${Date.now()}`;
    await markOrderPaid(razorpayOrderId, razorpayPaymentId, eventId);
  }

  res.status(200).json({ received: true });
};
