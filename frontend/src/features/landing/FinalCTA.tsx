import { ArrowRight, Sparkles, Shield, Zap, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/app/router/routes";
import { useAuth } from "@/features/auth/auth-context";

const FinalCTA = () => {
  const { user } = useAuth();

  return (
    <section className="py-24 relative overflow-hidden" id="cta">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] bg-gradient-to-br from-blue-900/40 via-[#101726] to-purple-900/30 border border-white/[0.15] p-12 sm:p-20 text-center relative overflow-hidden shadow-[0_30px_100px_rgba(59,130,246,0.25)]">
          {/* Internal ambient glowing spheres */}
          <div aria-hidden="true" className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/25 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
          <div aria-hidden="true" className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/25 rounded-full blur-[100px] pointer-events-none" />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/15 text-slate-200 text-xs font-semibold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>EXPERIENCE THE ENGINE TODAY</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white font-['Outfit'] leading-[1.12]">
              Ready to Streamline Your{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                Creative Pipeline?
              </span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Join thousands of designers, developers, and studios automating background removal with zero latency.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Button
                  asChild
                  className="btn-premium w-full sm:w-auto px-10 py-6 text-base font-semibold border-0 shadow-xl shadow-blue-500/30"
                >
                  <Link to={appRoutes.workspace}>
                    <span>Launch AI Studio</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="btn-premium w-full sm:w-auto px-10 py-6 text-base font-semibold border-0 shadow-xl shadow-blue-500/30"
                >
                  <Link to={appRoutes.signup}>
                    <span>Get Started Free</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              )}

              <Button
                asChild
                variant="outline"
                className="btn-secondary-premium w-full sm:w-auto px-8 py-6 text-base font-medium"
              >
                <Link to={appRoutes.pricing}>
                  <span>View Pro Plan</span>
                </Link>
              </Button>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-white/[0.08] mt-8">
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 2 Free Daily Credits</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-400" /> 256-Bit TLS Security</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-purple-400" /> No Credit Card Required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
