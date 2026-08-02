import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Zap, Shield, ArrowRight, Lock, Cpu, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/app/router/routes";
import { useAuth } from "@/features/auth/auth-context";

const formSchema = z.object({
  email: z.string().email("Please enter a valid work or personal email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service and Privacy Policy.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (!password) return { score: 0, label: "", color: "bg-slate-700", text: "text-slate-500" };
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score === 1) return { score: 1, label: "Weak", color: "bg-red-500", text: "text-red-400" };
  if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-400" };
  if (score === 3) return { score: 3, label: "Good", color: "bg-blue-500", text: "text-blue-400" };
  if (score === 4) return { score: 4, label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
  return { score: 0, label: "", color: "bg-slate-700", text: "text-slate-500" };
};

const Signup = () => {
  const { signUp, authEnabled, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(appRoutes.dashboard, { replace: true });
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      termsAccepted: true,
    },
  });

  const passwordValue = watch("password");
  const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);


  return (
    <div className="min-h-screen w-full grid lg:grid-cols-12 bg-[#090D16] text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Left Column — Benefits of Joining & Trust Indicators */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative overflow-hidden flex-col justify-between p-12 xl:p-16 border-r border-white/[0.08] bg-gradient-to-br from-[#0B111E] via-[#090D16] to-[#05080F]">
        {/* Ambient Glowing Background */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Link to={appRoutes.home} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-['Outfit']">PixelMint AI</span>
          </Link>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-purple-500/10 text-purple-400 border border-purple-500/20">
            CREATIVE STUDIO
          </span>
        </div>

        {/* Middle Benefits */}
        <div className="relative z-10 my-auto max-w-lg py-12">
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white font-['Outfit'] leading-[1.15]">
            Start Creating with <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Zero Resistance.
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Join thousands of designers, developers, and e-commerce studios using PixelMint AI to automate background removal with unmatched precision.
          </p>

          <div className="mt-10 space-y-4">
            {[
              {
                icon: CreditCard,
                title: "2 Free Daily Credits Forever",
                desc: "No credit card required. Experience HD quality background removal refreshed every 24 hours.",
              },
              {
                icon: Cpu,
                title: "Ultra-Fast AI Processing",
                desc: "Our neural network processes complex edge hierarchies, hair, and fur in under 5 seconds.",
              },
              {
                icon: Shield,
                title: "Secure Authentication & Limited Storage",
                desc: "Studio-grade architecture with automatic 30-day asset purging for maximum privacy.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] transition-colors">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-6 text-xs text-slate-400 pt-6 border-t border-white/[0.08]">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 256-bit TLS</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Instant Setup</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Cancel Anytime</span>
          </div>
        </div>

        {/* Bottom Trust Quote */}
        <div className="relative z-10 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-500">
          <span>Studio-grade computer vision for modern creators</span>
          <span>© {new Date().getFullYear()} PixelMint AI</span>
        </div>
      </div>

      {/* Right Column — Glassmorphism Account Creation Card */}
      <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-y-auto">
        {/* Mobile Header Logo */}
        <div className="lg:hidden w-full max-w-md mb-8 flex items-center justify-between">
          <Link to={appRoutes.home} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold text-white font-['Outfit']">PixelMint AI</span>
          </Link>
          <Link to={appRoutes.login} className="text-xs font-medium text-blue-400 hover:text-blue-300">
            Sign in →
          </Link>
        </div>

        {/* Main Auth Card */}
        <div className="w-full max-w-md bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/[0.1] rounded-[28px] p-8 sm:p-10 shadow-2xl shadow-black/80 animate-fade-in-up">
          <div className="text-left mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">Create your account</h1>
            <p className="mt-2 text-sm text-slate-400">
              {authEnabled ? "Start removing backgrounds in seconds with 2 free daily credits." : "Supabase authentication is offline in this environment."}
            </p>
          </div>


          <form
            className="space-y-4"
            noValidate
            onSubmit={(e) => void handleSubmit(async (values) => {
              if (!authEnabled) {
                toast.error("Supabase authentication is offline.");
                return;
              }
              try {
                const result = await signUp(values.email, values.password);
                if (result?.session) {
                  navigate(appRoutes.dashboard);
                } else {
                  toast.info("Please verify your email before signing in.");
                }
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to create account.");
              }
            })(e)}
          >
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 ml-1">Work or personal email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="name@company.com"
                aria-invalid={Boolean(errors.email)}
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 transition-all duration-200"
              />
              {errors.email ? <p className="text-xs text-red-400 ml-1">{errors.email.message}</p> : null}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 ml-1">Create password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  aria-invalid={Boolean(errors.password)}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 pl-4 pr-11 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password ? <p className="text-xs text-red-400 ml-1">{errors.password.message}</p> : null}

              {/* Live Password Strength Indicator */}
              {passwordValue && passwordValue.length > 0 ? (
                <div className="pt-2 space-y-1">
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          strength.score >= bar ? strength.color : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Security strength:</span>
                    <span className={`font-semibold ${strength.text}`}>{strength.label || "Too short"}</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-start gap-2.5 pt-1 pb-2">
              <input
                {...register("termsAccepted")}
                id="termsAccepted"
                type="checkbox"
                className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 transition-colors cursor-pointer"
              />
              <label htmlFor="termsAccepted" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
                I agree to PixelMint AI's{" "}
                <Link to={appRoutes.terms} className="text-blue-400 hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link to={appRoutes.privacy} className="text-blue-400 hover:underline">Privacy Policy</Link>.
              </label>
            </div>
            {errors.termsAccepted ? <p className="text-xs text-red-400 ml-1 -mt-1">{errors.termsAccepted.message}</p> : null}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 border-0"
            >
              <span>{isSubmitting ? "Creating account..." : "Create account & start free"}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link to={appRoutes.login} className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
              Sign in to your account
            </Link>
          </p>
        </div>

        {/* Minimal Professional Footer */}
        <div className="mt-8 text-center text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-500" />
              256-bit TLS Protected
            </span>
            <span>•</span>
            <Link to={appRoutes.privacy} className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to={appRoutes.terms} className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
