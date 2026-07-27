import { Check, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/app/router/routes";
import { useAuth } from "@/features/auth/auth-context";
import { useProCheckout } from "@/features/billing/useProCheckout";

const plans = [
  {
    name: "Free",
    price: "Rs 0",
    period: "forever",
    description: "Get started with high-resolution background removal",
    features: ["2 free images per day", "Standard HD quality", "JPG, PNG, WEBP ingestion", "Auto-delete after 24 hours", "Community support"],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "Rs 999",
    period: "/month",
    description: "High power for designers and commercial studios",
    features: ["More daily background removals", "High-quality PNG output", "Priority cloud processing", "High-volume studio support", "Ultra-fast neural processing", "Dedicated 24/7 priority support"],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Credits",
    price: "Rs 99",
    period: "per 50 credits",
    description: "Flexible pay-as-you-go quota for intermittent bursts",
    features: ["50 high-resolution credits", "Credits never expire", "Rollover to next month", "Commercial usage license", "Email support"],
    cta: "Buy Credits Pack",
    highlighted: false,
  },
];

const PricingSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handleUpgrade, isUpgrading } = useProCheckout();

  return (
    <section className="py-24 relative" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT COMMERCIAL PLANS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-['Outfit'] mb-4">
            Predictable Pricing for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Every Stage of Scale
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg">
            Start free with 2 daily credits. Upgrade anytime for 3 daily Pro credits or pay-as-you-go credits.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[28px] p-8 sm:p-10 relative transition-all duration-300 flex flex-col justify-between ${
                plan.highlighted
                  ? "bg-gradient-to-b from-blue-900/30 via-[#101726] to-[#0A0E18] border-2 border-blue-500/60 shadow-[0_25px_80px_rgba(59,130,246,0.22)] scale-[1.03] z-10"
                  : "bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.08] hover:border-white/[0.18] shadow-2xl shadow-black/50"
              }`}
            >
              {plan.highlighted ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg">
                  Most Popular
                </div>
              ) : null}

              <div>
                <div className="flex justify-between items-baseline mb-6">
                  <h3 className="text-xl font-bold text-white font-['Outfit']">{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">{plan.price}</span>
                  <span className="text-slate-400 text-sm ml-2 font-medium">{plan.period}</span>
                </div>

                <p className="text-sm text-slate-400 mb-8 leading-relaxed min-h-[40px]">{plan.description}</p>

                <div className="border-t border-white/[0.08] my-8" />

                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className={`p-1 rounded-full mt-0.5 ${plan.highlighted ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-slate-300"}`}>
                        <Check className="w-3.5 h-3.5 flex-shrink-0" />
                      </div>
                      <span className="text-slate-200 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {plan.name === "Pro" && user ? (
                  <Button
                    onClick={() => void handleUpgrade(() => navigate(appRoutes.workspace))}
                    disabled={isUpgrading}
                    className="btn-premium w-full py-6 text-sm font-semibold border-0"
                  >
                    {isUpgrading ? "Opening Razorpay Checkout..." : plan.cta}
                  </Button>
                ) : (
                  <Button
                    asChild
                    className={
                      plan.highlighted
                        ? "btn-premium w-full py-6 text-sm font-semibold border-0"
                        : "btn-secondary-premium w-full py-6 text-sm font-semibold"
                    }
                  >
                    <Link to={user ? appRoutes.workspace : plan.highlighted ? appRoutes.signup : appRoutes.login}>
                      {user && plan.name === "Free" ? "Launch AI Studio" : plan.cta}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
