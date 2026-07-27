import FeaturesSection from "@/features/landing/FeaturesSection";
import { Sparkles, Cpu, Shield, Zap, Globe, Clock } from "lucide-react";

const Features = () => {
  const extraFeatures = [
    { icon: Sparkles, title: "AI-Powered Precision", desc: "State-of-the-art neural networks detect edges with pixel-perfect accuracy, even for complex subjects like hair and fur." },
    { icon: Cpu, title: "Optimized AI Processing", desc: "Processing runs on high-speed cloud infrastructure for consistent results regardless of image complexity." },
    { icon: Shield, title: "Studio Security", desc: "End-to-end encryption, TLS 1.3 security, and automatic image deletion ensure your data stays private." },
    { icon: Zap, title: "Seamless Studio Pipeline", desc: "Integrate background removal into your daily workflow with our studio tools and reliable processing." },
    { icon: Globe, title: "Fast Cloud Storage", desc: "Reliable servers worldwide ensure fast uploads and downloads regardless of your geographic location." },
    { icon: Clock, title: "Reliable Uptime", desc: "24/7 availability with automatic failover and retry mechanisms built directly into the commercial platform." },
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-blue-500/30">
      <div className="pt-32 pb-12 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEURAL ARCHITECTURE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-['Outfit'] mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Capabilities
            </span>{" "}
            That Set Us Apart
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover why thousands of design studios and developers rely on PixelMint AI for their production workflows.
          </p>
        </div>
      </div>

      <FeaturesSection />

      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] mb-4">
              Under the <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Hood</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Studio-grade infrastructure designed for high throughput and zero data leakage.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {extraFeatures.map((f) => (
              <div
                key={f.title}
                className="group rounded-[24px] bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.08] p-7 hover:border-white/[0.18] hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/40 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-blue-400/40 transition-all duration-300">
                    <f.icon className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2.5 font-['Outfit'] group-hover:text-blue-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
