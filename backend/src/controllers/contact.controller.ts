import type { Request, Response } from "express";
import { z } from "zod";
import { mailSender } from "../utils/mailSender.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const contactSchema = z.object({
  name: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().email("Please provide a valid email address."),
  subject: z.string().optional(),
  countrycode: z.string().optional(),
  phoneNo: z.string().optional(),
  message: z.string().min(1, "Message is required."),
});

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const contactUs = async (req: Request, res: Response): Promise<void> => {
  const parseResult = contactSchema.safeParse(req.body);

  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues
      .map((issue) => issue.message)
      .join(" ");
    throw new AppError(errorMsg || "Invalid contact form submission.", 400);
  }

  const {
    name,
    firstname,
    lastname,
    email,
    subject,
    countrycode,
    phoneNo,
    message,
  } = parseResult.data;

  const rawName = (name || `${firstname || ""} ${lastname || ""}`).trim();

  if (!rawName) {
    throw new AppError("Please provide your name.", 400);
  }

  const safeName = escapeHtml(rawName);
  const safeEmail = escapeHtml(email);
  const safeSubject = subject ? escapeHtml(subject) : "New Contact Request - PixelMint AI";
  const safePhone = phoneNo ? `${countrycode ? escapeHtml(countrycode) + " " : ""}${escapeHtml(phoneNo)}` : "";
  const safeMessage = escapeHtml(message);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #4F46E5; margin-top: 0;">New Support Inquiry — PixelMint AI</h2>
      <p style="margin-bottom: 8px;"><b>Name:</b> ${safeName}</p>
      <p style="margin-bottom: 8px;"><b>Email:</b> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
      ${safePhone ? `<p style="margin-bottom: 8px;"><b>Phone:</b> ${safePhone}</p>` : ""}
      <p style="margin-bottom: 16px;"><b>Subject:</b> ${safeSubject}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
      <h3 style="color: #1F2937; margin-bottom: 8px;">Message:</h3>
      <div style="background-color: #F9FAFB; padding: 16px; border-radius: 6px; color: #374151; white-space: pre-wrap;">${safeMessage}</div>
    </div>
  `;

  logger.info("contact.submission.received", {
    email: safeEmail,
    subject: safeSubject,
  });

  await mailSender(
    env.CONTACT_RECEIVER_EMAIL,
    safeSubject,
    htmlContent,
    email
  );

  res.status(200).json({
    success: true,
    message: "Message sent successfully! Our support team will respond shortly.",
  });
};
