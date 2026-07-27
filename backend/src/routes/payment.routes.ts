import { Router } from "express";
import { createOrder, verifyOrder } from "../controllers/payment.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/create-order", requireAuth, asyncHandler(createOrder));
router.post("/verify-order", requireAuth, asyncHandler(verifyOrder));

export default router;
