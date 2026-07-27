import { Link } from "react-router-dom";
import { Zap, Shield, Sparkles, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { appRoutes } from "@/app/router/routes";
import { useAuth } from "@/features/auth/auth-context";

const Footer = () => {
  const { user } = useAuth();

  const links = {
    Product: [
      { label: "AI Background Removal", href: appRoutes.home },
      { label: "Features", href: `${appRoutes.home}#features` },
    ],
    Company: [
      { label: "About", href: appRoutes.about },
      { label: "Contact Us", href: appRoutes.contact },
    ],
    Legal: [
      { label: "Privacy Policy", href: appRoutes.privacy },
      { label: "Terms of Service", href: appRoutes.terms },
    ],
  };

  const handleNavClick = (href: string) => {
    if (href === appRoutes.home && window.location.pathname === appRoutes.home) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      if (window.location.pathname === path || (path === "" && window.location.pathname === "/")) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#070A12] pt-20 pb-12 overflow-hidden">
      {/* Subtle background glow */}
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Status & Value Banner */}
        <div className="mb-16 pb-12 border-b border-white/[0.08] grid lg:grid-cols-12 gap-8 items-center justify-between">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Neural Edge Vision Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] tracking-tight">
              Ready to streamline your design workflow?
            </h3>
            <p className="text-sm text-slate-400 max-w-xl">
              Experience zero-latency background removal with 2 free daily credits. No credit card required.
            </p>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end">
            {user ? (
              <Link
                to={appRoutes.workspace}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 min-h-[44px]"
              >
                <span>Launch AI Studio</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to={appRoutes.signup}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 min-h-[44px]"
              >
                <span>Get Started Free</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 pb-16">
          <div className="col-span-2 sm:col-span-3 md:col-span-6 lg:col-span-6 space-y-4 md:pr-4">
            <Link to={appRoutes.home} onClick={() => handleNavClick(appRoutes.home)} className="flex items-center gap-2.5 group inline-flex min-h-[44px]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-['Outfit']">
                PixelMint <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Next-generation computer vision for background removal. Engineered for designers, developers, and high-volume studios.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-400" /> 256-bit TLS</span>
              <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> Fast AI Processing</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> High-Quality PNG</span>
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2 space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-200 font-['Outfit']">{title}</h4>
              <ul className="space-y-1">
                {items.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center py-1 min-h-[44px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PixelMint AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to={appRoutes.privacy} className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to={appRoutes.terms} className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
