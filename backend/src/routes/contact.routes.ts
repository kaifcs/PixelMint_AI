import express from "express";
import { contactUs } from "../controllers/contact.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { contactLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/contact", contactLimiter, asyncHandler(contactUs));

export default router;
