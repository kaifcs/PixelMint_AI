import { Check, X, Zap, Shield, Clock, Award, Sparkles } from "lucide-react";

const comparisonData = [
  {
    feature: "Processing Speed",
    pixelmint: "Fast AI processing",
    traditional: "15–30 minutes per image",
    genericAi: "30–60 seconds with queue delays",
    icon: Clock,
  },
  {
    feature: "Edge Detection & Hair Precision",
    pixelmint: "Custom neural network trained on hair/fur",
    traditional: "Manual pen tool & refining edges",
    genericAi: "Blurry halos and pixelated cutouts",
    icon: Award,
  },
  {
    feature: "Maximum Resolution",
    pixelmint: "High-quality transparent PNG",
    traditional: "Depends on source file quality",
    genericAi: "Downscaled to 1080p or compressed",
    icon: Sparkles,
  },
  {
    feature: "Commercial Security & Privacy",
    pixelmint: "256-bit TLS & automated 24-hour asset purging",
    traditional: "Local file storage & manual cleanup",
    genericAi: "Images retained for model training",
    icon: Shield,
  },
  {
    feature: "Seamless Studio Workflow",
    pixelmint: "Reliable cloud processing",
    traditional: "No automation available",
    genericAi: "Rate limited & expensive API tiers",
    icon: Zap,
  },
];

const ComparisonSection = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="comparison">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BENCHMARK ANALYSIS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-['Outfit'] mb-4">
            Why Teams Upgrade to{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              PixelMint AI
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base">
            See how our dedicated computer vision pipeline outperforms manual design work and legacy background removal tools.
          </p>
        </div>

        {/* Desktop Comparison Table */}
        <div className="hidden md:block rounded-[28px] bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/[0.1] overflow-hidden shadow-2xl shadow-black/60">
          <div className="grid grid-cols-12 border-b border-white/[0.08] bg-white/[0.03] px-8 py-6 text-sm font-semibold">
            <div className="col-span-4 text-slate-300">Capability / Benchmark</div>
            <div className="col-span-4 text-blue-400 flex items-center gap-2 font-['Outfit'] text-base">
              <Zap className="w-4 h-4 fill-blue-400" />
              <span>PixelMint AI (Pro)</span>
            </div>
            <div className="col-span-2 text-slate-400">Manual / Photoshop</div>
            <div className="col-span-2 text-slate-400">Generic AI Tools</div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {comparisonData.map((row) => (
              <div key={row.feature} className="grid grid-cols-12 px-8 py-5 items-center hover:bg-white/[0.02] transition-colors">
                <div className="col-span-4 flex items-center gap-3 font-medium text-slate-200">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <row.icon className="w-4 h-4" />
                  </div>
                  <span>{row.feature}</span>
                </div>
                <div className="col-span-4 flex items-center gap-2 text-emerald-400 font-medium">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span className="text-slate-200 text-sm">{row.pixelmint}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-slate-500 text-xs">
                  <X className="w-4 h-4 text-red-400/80 flex-shrink-0" />
                  <span>{row.traditional}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-slate-500 text-xs">
                  <X className="w-4 h-4 text-amber-400/80 flex-shrink-0" />
                  <span>{row.genericAi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Comparison Cards */}
        <div className="md:hidden space-y-6">
          {comparisonData.map((row) => (
            <div key={row.feature} className="rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.1] p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <row.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white">{row.feature}</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 block">PixelMint AI</span>
                    <span className="text-slate-200 font-medium">{row.pixelmint}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 px-3 py-1">
                  <X className="w-4 h-4 text-red-400/80 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-slate-500 block">Manual Tool</span>
                    <span className="text-slate-400 text-xs">{row.traditional}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
