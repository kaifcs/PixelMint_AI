import { MousePointerClick, ImageIcon, Zap, Shield, FileImage, Layers, Sparkles } from "lucide-react";

const features = [
  {
    icon: MousePointerClick,
    title: "One-Click Edge Detection",
    description: "Simply upload or drop your asset. Our deep learning model segments subjects with sub-pixel precision.",
    badge: "AUTOMATED",
  },
  {
    icon: ImageIcon,
    title: "High-Quality PNG Output",
    description: "Export crisp, uncompressed transparent PNGs with clean alpha channels without loss of fidelity.",
    badge: "PRO QUALITY",
  },
  {
    icon: Zap,
    title: "Fast Neural Processing",
    description: "Engineered with optimized cloud AI pipelines to ensure your creative workflows run smoothly.",
    badge: "INSTANT",
  },
  {
    icon: Shield,
    title: "Automated Data Purging",
    description: "All uploads are encrypted via 256-bit TLS and permanently deleted within 24 hours. Minimal data retention.",
    badge: "SECURE",
  },
  {
    icon: FileImage,
    title: "Multi-Format Ingestion",
    description: "Seamlessly ingest JPG, PNG, and WEBP formats. Automatic alpha channel optimization on every export.",
    badge: "VERSATILE",
  },
  {
    icon: Layers,
    title: "Seamless Studio Workflow",
    description: "Process your images quickly and reliably. Engineered for creative teams and individual developers.",
    badge: "PRO",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="features">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STUDIO-GRADE CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-['Outfit'] mb-5">
            Engineered for{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Uncompromised Precision
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Everything you need for high-throughput background removal, powered by proprietary computer vision architecture.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-[26px] bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.08] p-8 hover:bg-white/[0.09] hover:border-white/[0.18] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] transition-all duration-300 cursor-default flex flex-col justify-between"
            >
              {/* Subtle top right badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-500/40 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-slate-200 transition-colors">
                  {feature.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3 font-['Outfit'] group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.05] flex items-center gap-2 text-xs font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Explore capability</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
