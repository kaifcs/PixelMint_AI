import { Star, Sparkles, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "E-Commerce Director, StyleCraft",
    content: "PixelMint AI cut our post-production catalog turnaround time by 85%. What used to take our photo team 30 minutes per garment now happens instantaneously.",
    rating: 5,
    avatar: "PS",
  },
  {
    name: "Arjun Mehta",
    role: "Senior Lead Designer, StudioVibe",
    content: "The neural edge detection is incredibly precise around fine hair and transparent glass. I've tested every commercial tool, and PixelMint is by far the cleanest.",
    rating: 5,
    avatar: "AM",
  },
  {
    name: "Sneha Patel",
    role: "Creative Producer & YouTuber",
    content: "We use PixelMint daily for our video thumbnails and sponsor banners. The fast AI processing and high-quality PNG output are absolute game-changers.",
    rating: 5,
    avatar: "SP",
  },
  {
    name: "Rahul Verma",
    role: "Frontend Engineer, TechGrid",
    content: "The web studio took us minutes to integrate into our workflow. Clean alpha channels and reliable cloud processing.",
    rating: 5,
    avatar: "RV",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="testimonials">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMUNITY PROOF</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-['Outfit'] mb-4">
            Loved by <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Creative Teams</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg">
            See how designers, developers, and e-commerce studios rely on PixelMint AI for their production pipelines.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group relative overflow-hidden rounded-[26px] bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.08] p-7 hover:bg-white/[0.09] hover:border-white/[0.18] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] transition-all duration-300 cursor-default flex flex-col justify-between"
            >
              <div className="absolute top-6 right-6 text-white/5 group-hover:text-blue-500/10 transition-colors pointer-events-none">
                <Quote className="w-12 h-12" />
              </div>

              <div>
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-8 relative z-10">"{t.content}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white font-['Outfit']">{t.name}</p>
                  <p className="text-[11px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
