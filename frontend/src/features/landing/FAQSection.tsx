import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle } from "lucide-react";
import { appRoutes } from "@/app/router/routes";

const faqs = [
  {
    question: "Can I try PixelMint AI for free without a credit card?",
    answer:
      "Yes! Our free tier provides 2 high-resolution background removals refreshed every 24 hours forever. You do not need to enter any payment details to create an account and start using the platform immediately.",
  },
  {
    question: "How fast is the background removal processing?",
    answer:
      "Our optimized computer vision pipeline processes images in under 5 seconds on average. The neural network is custom-engineered for fine edge detection, ensuring pixel-perfect cutouts even around complex hair, fur, and transparent objects.",
  },
  {
    question: "What happens to my uploaded images and data privacy?",
    answer:
      "We adhere to strict commercial security standards. All asset transfers are encrypted with 256-bit TLS. For complete data privacy, uploaded images and processed cutouts are automatically purged from our servers after 24 hours. We never use your customer data to train public AI models.",
  },
  {
    question: "Can I cancel or change my Pro subscription anytime?",
    answer:
      "Absolutely. You have full control over your subscription directly from your account dashboard. You can cancel with a single click at any time with zero cancellation fees. Your Pro benefits will continue until the end of your current billing cycle.",
  },
  {
    question: "What file formats and image resolutions are supported?",
    answer:
      "We support standard JPG, PNG, and WEBP input files up to 10MB. Every processed image is exported as an ultra-clean, transparent PNG with optimized alpha channels ready for e-commerce, design studios, and print.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative overflow-hidden" id="faq">
      {/* Subtle ambient lighting */}
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>SUPPORT & KNOWLEDGE BASE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-['Outfit'] mb-4">
            Frequently Asked <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Everything you need to know about our technology, pricing, and security.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className={`rounded-[22px] transition-all duration-300 border overflow-hidden ${
                  isOpen
                    ? "bg-gradient-to-b from-white/[0.08] to-white/[0.03] border-white/[0.18] shadow-xl shadow-black/40"
                    : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.12]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-7 py-5 sm:py-6 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-semibold text-white font-['Outfit']">{faq.question}</span>
                  <div
                    className={`p-1.5 rounded-full transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "bg-blue-500/20 text-blue-400 rotate-180" : "bg-white/5 text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen ? (
                  <div className="px-7 pb-6 text-sm text-slate-300 leading-relaxed border-t border-white/[0.06] pt-4 animate-fade-in-up">
                    <p>{faq.answer}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-14 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] p-8">
          <p className="text-sm text-slate-300">
            Have a custom commercial requirement or technical question?{" "}
            <Link to={appRoutes.contact} className="font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4 ml-1">
              Contact our engineering team →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
