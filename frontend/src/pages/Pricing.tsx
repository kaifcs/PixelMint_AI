import PricingSection from "@/features/landing/PricingSection";
import FAQSection from "@/features/landing/FAQSection";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-blue-500/30">
      <div className="pt-32 pb-12 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-['Outfit'] mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Transparent Pricing
            </span>{" "}
            for Every Scale
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Start free with 2 daily credits. Scale up for increased commercial background removals with zero hidden fees.
          </p>
        </div>
      </div>

      <PricingSection />
      <FAQSection />
    </div>
  );
};

export default Pricing;
