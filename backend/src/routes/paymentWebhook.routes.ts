import { Router } from "express";
import express from "express";
import { verifyPaymentWebhook } from "../controllers/payment.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/verify-payment", express.raw({ type: "application/json", limit: "256kb" }), asyncHandler(verifyPaymentWebhook));

export default router;
