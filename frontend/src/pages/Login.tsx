import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Zap, Shield, Sparkles, CheckCircle2, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/app/router/routes";
import { useAuth } from "@/features/auth/auth-context";

const formSchema = z.object({
  email: z.string().email("Please enter a valid work or personal email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { signIn, authEnabled, user, resetPasswordForEmail } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(appRoutes.dashboard, { replace: true });
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const handleForgotPassword = () => {
    setShowForgotModal(true);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email address.");
      return;
    }
    try {
      setIsResetting(true);
      await resetPasswordForEmail(forgotEmail);
      setShowForgotModal(false);
      setForgotEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reset link.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-12 bg-[#090D16] text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Left Column — Abstract Visual, Brand Story & Benefits */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative overflow-hidden flex-col justify-between p-12 xl:p-16 border-r border-white/[0.08] bg-gradient-to-br from-[#0B111E] via-[#090D16] to-[#05080F]">
        {/* Ambient Glowing Background */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Link to={appRoutes.home} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-['Outfit']">PixelMint AI</span>
          </Link>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20">
            PRO
          </span>
        </div>

        {/* Middle Feature Slogan */}
        <div className="relative z-10 my-auto max-w-lg py-12">
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white font-['Outfit'] leading-[1.15]">
            Next-Generation <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Background Removal,
            </span>{" "}
            Engineered for Speed.
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Experience studio-grade computer vision in your browser. Remove backgrounds from complex portraits, merchandise, and graphics with zero latency.
          </p>

          <div className="mt-10 space-y-4">
            {[
              {
                icon: Zap,
                title: "Fast AI Edge Detection",
                desc: "Powered by custom deep learning models optimized for hair and transparent objects.",
              },
              {
                icon: Shield,
                title: "Studio Grade Privacy",
                desc: "256-bit TLS encryption with automated 30-day asset purging. Limited data retention.",
              },
              {
                icon: Sparkles,
                title: "Seamless Studio Workflow",
                desc: "Process images quickly and reliably in your creative workflow.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] transition-colors">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Trust Quote */}
        <div className="relative z-10 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Loved by modern creative teams & developers</span>
          </div>
          <span>v2.4 Production</span>
        </div>
      </div>

      {/* Right Column — Glassmorphism Authentication Card */}
      <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-y-auto">
        {/* Mobile Header Logo */}
        <div className="lg:hidden w-full max-w-md mb-8 flex items-center justify-between">
          <Link to={appRoutes.home} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold text-white font-['Outfit']">PixelMint AI</span>
          </Link>
          <Link to={appRoutes.signup} className="text-xs font-medium text-blue-400 hover:text-blue-300">
            Create account →
          </Link>
        </div>

        {/* Main Auth Card */}
        <div className="w-full max-w-md bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-2xl border border-white/[0.1] rounded-[28px] p-8 sm:p-10 shadow-2xl shadow-black/80 animate-fade-in-up">
          <div className="text-left mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-400">
              {authEnabled ? "Enter your credentials to access your account and billing." : "Supabase authentication is offline in this environment."}
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
                await signIn(values.email, values.password);
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Invalid credentials.");
              }
            })(e)}
          >
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 ml-1">Email address</label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                aria-invalid={Boolean(errors.email)}
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 transition-all duration-200"
              />
              {errors.email ? <p className="text-xs text-red-400 ml-1">{errors.email.message}</p> : null}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => handleForgotPassword()}
                  className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
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
            </div>

            <div className="flex items-center gap-2 pt-1 pb-2">
              <input
                {...register("rememberMe")}
                id="rememberMe"
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 transition-colors cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-xs text-slate-400 cursor-pointer select-none">
                Remember this device for 30 days
              </label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 border-0"
            >
              <span>{isSubmitting ? "Authenticating..." : "Sign in to your account"}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Don't have an account yet?{" "}
            <Link to={appRoutes.signup} className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
              Create a free account
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

        {/* FORGOT PASSWORD MODAL */}
        {showForgotModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0C1220] border border-white/10 rounded-[28px] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in-up">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Reset Password</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Enter the email address associated with your account and we will send you a secure link to reset your password.
                </p>
              </div>
              <form onSubmit={(e) => void handleResetSubmit(e)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Email Address</label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/80 transition-all"
                  />
                </div> 
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForgotModal(false)}
                    disabled={isResetting}
                    className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isResetting}
                    className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs px-6 py-2.5 border-0 shadow-md shadow-indigo-500/25"
                  >
                    {isResetting ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Login;
