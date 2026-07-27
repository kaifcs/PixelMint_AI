import { ShoppingBag, Palette, Video, GraduationCap, Sparkles } from "lucide-react";

const users = [
  {
    icon: ShoppingBag,
    title: "E-Commerce Sellers",
    description: "Clean product photos for Shopify, Amazon, and WooCommerce catalogs in seconds.",
    badge: "MERCHANDISE",
  },
  {
    icon: Palette,
    title: "Design Studios",
    description: "Extract subjects for complex composites, UI mockups, and client campaigns.",
    badge: "CREATIVE",
  },
  {
    icon: Video,
    title: "Content Creators",
    description: "Create high-CTR YouTube thumbnails, social media banners, and branded visuals.",
    badge: "MARKETING",
  },
  {
    icon: GraduationCap,
    title: "Developers & Students",
    description: "Integrate background removal into apps or presentations with our free daily credits.",
    badge: "EDUCATION",
  },
];

const TargetUsers = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="target-users">
      {/* Ambient lighting */}
      <div className="absolute top-1/2 left-10 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INDUSTRY SOLUTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-['Outfit'] mb-4">
            Engineered for <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Every Creator</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg">
            Whether you're running a high-throughput studio or building your first presentation, PixelMint AI adapts to your workflow.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user.title}
              className="group relative overflow-hidden rounded-[24px] bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.08] p-7 hover:bg-white/[0.09] hover:border-white/[0.18] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] transition-all duration-300 cursor-default flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-blue-600/20 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-500/40 transition-all duration-300">
                    <user.icon className="w-6 h-6 text-purple-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-slate-200 transition-colors">
                    {user.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5 font-['Outfit'] group-hover:text-purple-300 transition-colors">
                  {user.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {user.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center gap-1.5 text-xs font-semibold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>View workflow</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetUsers;
