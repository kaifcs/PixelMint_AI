import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/auth-context";
import { apiClient } from "@/services/api/client";
import { createOrderResponseSchema, verifyOrderResponseSchema } from "@/services/api/schemas";

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayHandlerResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay?: {
      new (options: RazorpayOptions): {
        open: () => void;
        close?: () => void;
      };
    };
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const useProCheckout = () => {
  const { getAccessToken, user } = useAuth();
  const queryClient = useQueryClient();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async (onSuccessCallback?: () => void) => {
    try {
      setIsUpgrading(true);
      const token = await getAccessToken();
      if (!token) {
        toast.error("Please sign in to upgrade your plan.");
        setIsUpgrading(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        toast.error("Failed to load Razorpay checkout SDK. Please check your internet connection.");
        setIsUpgrading(false);
        return;
      }

      const orderRes = await apiClient.post("/api/create-order", {}, createOrderResponseSchema, { token });
      const razorpayOrder = orderRes.data;

      const razorpayInstance = new window.Razorpay({
        key: razorpayOrder.key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "PixelMint AI",
        description: "Pro Subscription (Unlimited Images)",
        order_id: razorpayOrder.id,
        prefill: {
          email: user?.email ?? undefined,
          name: user?.user_metadata?.full_name ?? undefined,
        },
        theme: {
          color: "#3b82f6",
        },
        handler: async (response: RazorpayHandlerResponse) => {
          try {
            await apiClient.post(
              "/api/verify-order",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              verifyOrderResponseSchema,
              { token },
            );
            toast.success("Welcome to Pro! Your account has been upgraded.");
            void queryClient.invalidateQueries({ queryKey: ["usage"] });
            onSuccessCallback?.();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Payment verification failed.");
          } finally {
            setIsUpgrading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsUpgrading(false);
            toast.info("Payment checkout cancelled.");
          },
        },
      });

      razorpayInstance.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to initiate payment.");
      setIsUpgrading(false);
    }
  };

  return {
    handleUpgrade,
    isUpgrading,
  };
};
