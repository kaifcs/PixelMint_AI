import { Router } from "express";
import { deleteHistoryItem, getHistory, getProfile, getUsage } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/profile", requireAuth, asyncHandler(getProfile));
router.get("/usage", requireAuth, asyncHandler(getUsage));
router.get("/history", requireAuth, asyncHandler(getHistory));
router.delete("/history/:id", requireAuth, asyncHandler(deleteHistoryItem));

export default router;
