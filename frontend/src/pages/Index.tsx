import HeroSection from "@/features/landing/HeroSection";
import BeforeAfterSlider from "@/features/landing/BeforeAfterSlider";
import HowItWorks from "@/features/landing/HowItWorks";
import FeaturesSection from "@/features/landing/FeaturesSection";
import ComparisonSection from "@/features/landing/ComparisonSection";
import TargetUsers from "@/features/landing/TargetUsers";
import PricingSection from "@/features/landing/PricingSection";
import Testimonials from "@/features/landing/Testimonials";
import FAQSection from "@/features/landing/FAQSection";
import FinalCTA from "@/features/landing/FinalCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 selection:bg-blue-500/30 font-sans">
      <HeroSection />
      <BeforeAfterSlider />
      <HowItWorks />
      <FeaturesSection />
      <ComparisonSection />
      <TargetUsers />
      <PricingSection />
      <Testimonials />
      <FAQSection />
      <FinalCTA />
    </div>
  );
};

export default Index;
