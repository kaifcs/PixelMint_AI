import axios from "axios";
import { env } from "../config/env.js";
import { AppError } from "./AppError.js";
import { logger } from "./logger.js";

export const mailSender = async (
  to: string,
  title: string,
  body: string,
  replyTo?: string
): Promise<unknown> => {
  try {
    if (!env.BREVO_API_KEY) {
      logger.warn("mailSender.skipped", {
        reason: "BREVO_API_KEY is not configured.",
        to,
        replyTo,
        title,
      });

      throw new AppError(
        "Email service is not configured (missing BREVO_API_KEY).",
        503
      );
    }

    const payload = {
      sender: {
        email: env.MAIL_FROM_EMAIL || "support@pixelmint.ai",
        name: env.MAIL_FROM_NAME || "PixelMint AI Support",
      },
      to: [{ email: to }],
      subject: title,
      htmlContent: body,
      ...(replyTo && {
        replyTo: {
          email: replyTo,
        },
      }),
    };

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      payload,
      {
        headers: {
          accept: "application/json",
          "api-key": env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        timeout: 15000,
      }
    );

    logger.info("mailSender.success", {
      to,
      replyTo,
      messageId: response.data?.messageId,
    });

    return response.data;
  } catch (error: any) {
    logger.error("mailSender.failed", {
      to,
      replyTo,
      error:
        error?.response?.data ||
        error?.message ||
        "Unknown mail sender error",
    });

    if (error instanceof AppError) {
      throw error;
    }

    if (error?.code === "ECONNABORTED" || error?.message?.toLowerCase().includes("timeout")) {
      throw new AppError("Email service request timed out. Please try again later.", 504);
    }

    const brevoStatus = error?.response?.status;
    const brevoErrorMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to send email via Brevo.";

    if (brevoStatus === 401) {
      throw new AppError("Email service authentication failed (invalid API key).", 502);
    }

    if (brevoStatus === 400) {
      throw new AppError(`Email service rejected request: ${brevoErrorMsg}`, 502);
    }

    throw new AppError(brevoErrorMsg, 500);
  }
};

export default mailSender;