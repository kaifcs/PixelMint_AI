import { Upload, Cpu, Download, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Source Asset",
    description: "Drag & drop or select your image. We support JPG, PNG, and WEBP formats up to 10MB.",
    step: "01",
    badge: "INPUT STAGE",
  },
  {
    icon: Cpu,
    title: "AI Removes Background",
    description: "Our neural network detects subject boundaries and removes the background in under 5 seconds.",
    step: "02",
    badge: "NEURAL ENGINE",
  },
  {
    icon: Download,
    title: "Download HD Cutout",
    description: "Get your high-quality transparent PNG instantly with alpha channel optimization.",
    step: "03",
    badge: "EXPORT STAGE",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="how-it-works">
      {/* Ambient background lighting */}
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STREAMLINED PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-['Outfit'] mb-4">
            Three Steps to <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Studio Perfection</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg">
            Our automated computer vision workflow removes background complexity so you can focus on creativity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className="group relative overflow-hidden rounded-[26px] bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.08] p-8 hover:bg-white/[0.09] hover:border-white/[0.18] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] transition-all duration-300 cursor-default flex flex-col justify-between"
            >
              {/* Connector line on desktop */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 -right-4 w-8 h-0.5 bg-gradient-to-r from-white/20 to-transparent z-20" />
              )}

              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-500/40 transition-all duration-300 shadow-md">
                    <step.icon className="w-7 h-7 text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-3xl font-black text-white/10 group-hover:text-blue-500/20 transition-colors font-['Outfit']">
                    {step.step}
                  </span>
                </div>

                <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3 inline-block">
                  {step.badge}
                </span>

                <h3 className="text-xl font-bold text-white mb-3 font-['Outfit'] group-hover:text-blue-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.05] flex items-center gap-2 text-xs font-semibold text-slate-500 group-hover:text-blue-400 transition-colors">
                <span>Stage {step.step} Complete</span>
                <span>✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
