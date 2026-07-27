import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Mail,
  Shield,
  Key,
  LogOut,
  Sparkles,
  Zap,
  Check,
  CreditCard,
  ArrowLeft,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-context";
import { useProCheckout } from "@/features/billing/useProCheckout";
import { getSupabaseClient } from "@/services/supabase/client";
import { apiClient } from "@/services/api/client";
import { userUsageSchema } from "@/services/api/schemas";
import { appRoutes } from "@/app/router/routes";

export const ProfilePage = () => {
  const { user, authEnabled, getAccessToken, signOut } = useAuth();
  const { handleUpgrade, isUpgrading } = useProCheckout();
  const supabase = getSupabaseClient();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const usageQuery = useQuery({
    queryKey: ["usage", user?.id],
    enabled: Boolean(authEnabled && user?.id),
    queryFn: async () => {
      const token = await getAccessToken();
      if (!token) throw new Error("No access token available.");
      return apiClient.get("/api/usage", userUsageSchema, { token });
    },
    select: (res) => res.data,
  });

  const plan = usageQuery.data?.plan ?? "FREE";
  const dailyUsed = usageQuery.data?.dailyUsed ?? 0;
  const dailyLimit = usageQuery.data?.dailyLimit ?? 2;
  const remaining = usageQuery.data?.remaining ?? Math.max(0, dailyLimit - dailyUsed);
  const isUnlimited = plan === "PRO";
  const progressPercent = isUnlimited ? 100 : Math.min(100, Math.round((dailyUsed / (dailyLimit || 1)) * 100));

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      toast.error("Supabase is not configured.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setIsChangingPassword(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update password.";
      toast.error(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const email = user?.email ?? "developer@pixelmint.ai";
  const displayName = user?.user_metadata?.full_name || email.split("@")[0] || "Authorized User";
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-blue-500/30 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* TOP HEADER */}
        <div className="rounded-[28px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.1] p-6 sm:p-8 shadow-2xl shadow-black/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/25 flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full rounded-[14px] object-cover" />
              ) : (
                <div className="w-full h-full rounded-[14px] bg-[#0C1220] flex items-center justify-center text-xl font-bold text-white uppercase font-['Outfit']">
                  {displayName.slice(0, 2)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">{displayName}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border ${
                  plan === "PRO"
                    ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10"
                    : "bg-white/10 border-white/20 text-slate-300"
                }`}>
                  <Sparkles className="w-3 h-3" /> {plan} PLAN
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> {email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button asChild variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium flex-1 sm:flex-initial">
              <Link to={appRoutes.dashboard}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Overview
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void signOut()}
              className="rounded-xl border-red-500/30 bg-red-500/5 hover:bg-red-500/15 text-red-300 text-xs font-medium flex-1 sm:flex-initial"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign out
            </Button>
          </div>
        </div>

        {/* PLAN & USAGE CARD */}
        <div className="rounded-[32px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.12] p-6 sm:p-10 shadow-2xl shadow-black/80 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2.5">
                <CreditCard className="w-6 h-6 text-blue-400" /> Subscription & Quota Usage
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Monitor your daily background removal credits and account billing status.
              </p>
            </div>
            {plan === "FREE" ? (
              <Button
                type="button"
                disabled={isUpgrading}
                onClick={() => void handleUpgrade()}
                className="btn-premium px-6 py-3 text-xs font-semibold border-0 shadow-lg shadow-indigo-500/25"
              >
                {isUpgrading ? <LoaderCircle className="w-4 h-4 mr-1.5 animate-spin" /> : <Zap className="w-4 h-4 mr-1.5 fill-white" />}
                <span>Upgrade to Pro (999/mo)</span>
              </Button>
            ) : (
              <span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Pro Plan Active
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end text-sm">
              <span className="text-slate-300 font-medium">Daily Credit Allowance</span>
              <span className="text-white font-bold">
                {isUnlimited ? "Unlimited Quota" : `${dailyUsed} / ${dailyLimit} Credits Used`}
              </span>
            </div>
            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isUnlimited
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : progressPercent > 80
                    ? "bg-gradient-to-r from-amber-500 to-red-500"
                    : "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 flex items-center justify-between">
              <span>{isUnlimited ? "Your account has zero rate limits or daily caps." : `${remaining} credits remaining for today.`}</span>
              <span className="text-slate-500">Resets every 24h at UTC 00:00</span>
            </p>
          </div>
        </div>

        {/* SECURITY & PASSWORD CHANGE */}
        <div className="rounded-[32px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.12] p-6 sm:p-10 shadow-2xl shadow-black/80 space-y-6">
          <div className="pb-6 border-b border-white/[0.08]">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2.5">
              <Shield className="w-6 h-6 text-purple-400" /> Security & Password
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Update your account access credentials and cryptographic authentication tokens.
            </p>
          </div>

          <form onSubmit={(e) => void handlePasswordChange(e)} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters..."
                  required
                  className="w-full bg-[#0C1220] border border-white/15 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password..."
                  required
                  className="w-full bg-[#0C1220] border border-white/15 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isChangingPassword}
              className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm px-6 py-3 shadow-md shadow-indigo-500/25 transition-all border-0"
            >
              {isChangingPassword ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : null}
              <span>Update Password</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
