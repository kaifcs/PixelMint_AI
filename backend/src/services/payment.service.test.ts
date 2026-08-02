import { describe, it, expect, vi, beforeEach } from "vitest";

const supabaseFromMock = vi.fn();
const ordersCreateMock = vi.fn();

vi.mock("../config/supabase.js", () => ({
  supabaseAdmin: {
    from: (...args: unknown[]) => supabaseFromMock(...args),
  },
}));

vi.mock("../config/razorpay.js", () => ({
  razorpay: {
    orders: {
      create: (...args: unknown[]) => ordersCreateMock(...args),
    },
  },
}));

const { env } = await import("../config/env.js");
const { createProOrder } = await import("./payment.service.js");

describe("createProOrder — Razorpay amount passthrough", () => {
  beforeEach(() => {
    supabaseFromMock.mockReset();
    ordersCreateMock.mockReset();
  });

  it("sends RAZORPAY_PRO_PLAN_AMOUNT to Razorpay unmodified, with no rupees<->paise conversion applied", async () => {
    // .from("profiles").select("plan").eq("id", userId).maybeSingle()
    supabaseFromMock.mockImplementationOnce(() => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: { plan: "FREE" }, error: null }),
        }),
      }),
    }));

    ordersCreateMock.mockResolvedValue({
      id: "order_test123",
      amount: env.RAZORPAY_PRO_PLAN_AMOUNT,
      currency: env.RAZORPAY_CURRENCY,
      status: "created",
    });

    // .from("payment_orders").insert({...})
    supabaseFromMock.mockImplementationOnce(() => ({
      insert: async () => ({ error: null }),
    }));

    await createProOrder("user-1");

    expect(ordersCreateMock).toHaveBeenCalledTimes(1);
    const [args] = ordersCreateMock.mock.calls[0];

    // The configured value is already in paise; it must reach Razorpay as-is.
    // A future accidental `* 100` or `/ 100` here would silently misprice every
    // Pro subscription charge.
    expect(args.amount).toBe(env.RAZORPAY_PRO_PLAN_AMOUNT);
  });
});
