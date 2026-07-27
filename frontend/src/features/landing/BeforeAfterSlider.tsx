import { useState, useRef } from "react";
import { Sparkles } from "lucide-react";

const BeforeAfterSlider = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, x)));
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>REAL-TIME COMPARISON</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-['Outfit'] mb-4">
            See the Computer Vision <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">In Action</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg">
            Drag the interactive slider to compare the raw source photo against our neural network's instant cutout.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative w-full max-w-4xl mx-auto aspect-[16/10] sm:aspect-[16/9] rounded-[28px] overflow-hidden bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.12] shadow-2xl shadow-black/80 cursor-col-resize select-none"
          onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        >
          {/* Left panel — Original */}
          <div className="absolute inset-0 bg-[#0C1220] flex items-center justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20 border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)]" />
              <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-blue-500/30 to-purple-500/30 border border-white/20 flex flex-col items-center justify-center text-center p-6 shadow-inner">
                <span className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-1">Source Asset</span>
                <span className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">Complex Subject</span>
              </div>
            </div>
            <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300 tracking-wide uppercase shadow-lg">
              Original Photo
            </div>
          </div>

          {/* Right panel — Processed (Transparent background pattern) */}
          <div
            className="absolute inset-0 bg-[linear-gradient(45deg,#0E1626_25%,transparent_25%),linear-gradient(-45deg,#0E1626_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#0E1626_75%),linear-gradient(-45deg,transparent_75%,#0E1626_75%)] bg-[size:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0] bg-[#070B14] flex items-center justify-center"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <div className="w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center relative">
              <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full border-2 border-dashed border-blue-400/40 bg-blue-500/10 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 shadow-2xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-1">Alpha Channel</span>
                <span className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">Transparent</span>
              </div>
            </div>
            <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-blue-600/80 backdrop-blur-md border border-blue-400/30 text-xs font-semibold text-white tracking-wide uppercase shadow-lg">
              AI Processed
            </div>
          </div>

          {/* Divider Line */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-white to-purple-400 z-10 shadow-[0_0_15px_rgba(59,130,246,0.8)]" style={{ left: `${sliderPos}%` }}>
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M5 3L2 8L5 13M11 3L14 8L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;
