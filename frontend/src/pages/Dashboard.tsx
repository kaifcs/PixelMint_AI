import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Zap,
  Clock,
  Image as ImageIcon,
  Shield,
  CreditCard,
  HardDrive,
  Download,
  Trash2,
  Search,
  Grid,
  List,
  Eye,
  AlertCircle,
  LoaderCircle,
  Sparkles,
  BarChart3,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { appRoutes } from "@/app/router/routes";
import { Button } from "@/components/ui/button";
import { downloadImage } from "@/utils/downloadImage";
import { useAuth } from "@/features/auth/auth-context";
import { useProCheckout } from "@/features/billing/useProCheckout";
import { apiClient } from "@/services/api/client";
import { userHistorySchema, userUsageSchema } from "@/services/api/schemas";

const Dashboard = () => {
  const { authEnabled, getAccessToken, user } = useAuth();
  const { handleUpgrade, isUpgrading } = useProCheckout();

  // UI State for History & Analytics
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [downloadingItemId, setDownloadingItemId] = useState<string | null>(null);

  const handleAssetDownload = async (url: string, filename: string, id: string) => {
    if (downloadingItemId === id) return;
    try {
      setDownloadingItemId(id);
      await downloadImage(url, filename);
    } catch {
      // Error toast is handled by downloadImage
    } finally {
      setDownloadingItemId(null);
    }
  };

  const [previewItem, setPreviewItem] = useState<{
    id: string;
    original_image_url: string;
    processed_image_url: string;
    source_filename: string;
    status: string;
    created_at: string;
  } | null>(null);

  // Queries
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

  const historyQuery = useQuery({
    queryKey: ["history", user?.id],
    enabled: Boolean(authEnabled && user?.id),
    queryFn: async () => {
      const token = await getAccessToken();
      if (!token) throw new Error("No access token available.");
      return apiClient.get("/api/history", userHistorySchema, { token });
    },
    select: (res) => res.data,
  });

  // Derived user details
  const userName = useMemo(() => {
    return user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Creator";
  }, [user]);

  const initials = useMemo(() => {
    return userName.substring(0, 2).toUpperCase();
  }, [userName]);

  const currentPlan = usageQuery.data?.plan ?? "FREE";
  const dailyUsed = usageQuery.data?.dailyUsed ?? 0;
  const dailyLimit = usageQuery.data?.dailyLimit ?? 2;
  const remainingCredits = currentPlan === "PRO" ? "Unlimited" : (usageQuery.data?.remaining ?? Math.max(0, dailyLimit - dailyUsed));
  const totalHistoryCount = historyQuery.data?.length ?? 0;

  // Filter & Paginate History
  const filteredHistory = useMemo(() => {
    const raw = historyQuery.data || [];
    return raw
      .filter((item) => !deletedIds.includes(item.id))
      .filter((item) => {
        const matchesSearch = item.source_filename.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || item.status.toUpperCase() === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [historyQuery.data, deletedIds, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / itemsPerPage));
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(start, start + itemsPerPage);
  }, [filteredHistory, currentPage, itemsPerPage]);

  const handleDeleteItem = (id: string, filename: string) => {
    setDeletedIds((prev) => [...prev, id]);
    toast.success(`Removed "${filename}" from archive history.`);
  };

  // Mock weekly data for visual analytics
  const weeklyUsageDays = [
    { day: "Mon", count: Math.max(1, Math.floor(dailyUsed * 0.4)), max: 10 },
    { day: "Tue", count: Math.max(2, Math.floor(dailyUsed * 0.7)), max: 10 },
    { day: "Wed", count: Math.max(1, Math.floor(dailyUsed * 0.5)), max: 10 },
    { day: "Thu", count: Math.max(3, Math.floor(dailyUsed * 0.9)), max: 10 },
    { day: "Fri", count: Math.max(4, Math.floor(dailyUsed * 1.2)), max: 10 },
    { day: "Sat", count: Math.max(1, Math.floor(dailyUsed * 0.3)), max: 10 },
    { day: "Sun", count: dailyUsed, max: 10, current: true },
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-blue-500/30 pb-24 pt-24">
      {/* Ambient background glow */}
      <div className="fixed top-20 left-1/4 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* ================================================== */}
        {/* TOP HEADER */}
        {/* ================================================== */}
        <div id="profile" className="rounded-[28px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.1] p-6 sm:p-8 shadow-2xl shadow-black/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/25 flex-shrink-0">
              <div className="w-full h-full rounded-[14px] bg-[#0C1220] flex items-center justify-center text-lg sm:text-xl font-bold text-white font-['Outfit']">
                {initials}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
                  Welcome back, {userName} 👋
                </h1>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase border flex items-center gap-1.5 shadow-sm ${
                    currentPlan === "PRO"
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 text-blue-300"
                      : "bg-white/10 border-white/15 text-slate-300"
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  {currentPlan === "PRO" ? "Pro Plan" : "Free Creator"}
                </span>
              </div>

              <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">
                {currentPlan === "PRO"
                  ? "Unlimited high-throughput GPU background removal quota active."
                  : `You have used ${dailyUsed} of ${dailyLimit} daily free credits today. Upgrade for unlimited processing.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {currentPlan !== "PRO" ? (
              <Button
                onClick={() => void handleUpgrade()}
                disabled={isUpgrading}
                className="btn-premium w-full md:w-auto px-6 py-5 text-sm font-semibold border-0 shadow-lg shadow-blue-500/25"
              >
                <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                {isUpgrading ? "Opening Checkout..." : "Upgrade to Pro"}
              </Button>
            ) : (
              <Button variant="outline" className="btn-secondary-premium px-5 py-5 text-xs font-semibold" asChild>
                <Link to={appRoutes.pricing}>
                  <span>Manage Subscription</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {!authEnabled ? (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-amber-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <span>Supabase authentication is offline in this environment. Showing demo dashboard state.</span>
          </div>
        ) : null}

        {/* ================================================== */}
        {/* QUICK STATS CARDS */}
        {/* ================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            {
              title: "Free Uploads Remaining",
              value: remainingCredits,
              subtitle: "Refreshes in 24 hours",
              icon: Clock,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              title: "Images Processed",
              value: totalHistoryCount,
              subtitle: "Lifetime processed assets",
              icon: ImageIcon,
              color: "text-purple-400",
              bg: "bg-purple-500/10",
            },
            {
              title: "Current Plan Tier",
              value: currentPlan,
              subtitle: currentPlan === "PRO" ? "Priority GPU Pipeline" : "Standard Speed",
              icon: Shield,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              title: "Credits Remaining",
              value: currentPlan === "PRO" ? "∞ Pro Quota" : `${remainingCredits} / ${dailyLimit}`,
              subtitle: "Daily Free Tier",
              icon: CreditCard,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
            {
              title: "Storage Archive",
              value: `${totalHistoryCount} Assets`,
              subtitle: `~${(totalHistoryCount * 1.4).toFixed(1)} MB stored`,
              icon: HardDrive,
              color: "text-sky-400",
              bg: "bg-sky-500/10",
            },
          ].map((stat) => (
            <div
              key={stat.title}
              className="group rounded-[24px] bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.08] p-6 hover:border-white/[0.18] hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-black/40 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
                  {stat.value}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ================================================== */}
        {/* LAUNCHPAD COMMAND CENTER */}
        {/* ================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group rounded-[28px] bg-gradient-to-b from-blue-950/20 via-[#0C1222] to-white/[0.02] border border-blue-500/30 hover:border-blue-400/60 p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">AI Removal Studio</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Launch the dedicated AI studio suite. Fast neural processing, comparison sliders, and clipboard paste.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.08]">
              <Button asChild className="w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 border-0 shadow-lg shadow-blue-500/25 min-h-[44px]">
                <Link to={appRoutes.workspace}>
                  <span>Launch AI Studio</span>
                  <ArrowUpRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="group rounded-[28px] bg-gradient-to-b from-purple-950/20 via-[#0C1222] to-white/[0.02] border border-purple-500/30 hover:border-purple-400/60 p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Account Profile</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Manage your account profile, update security settings, review billing quotas, and monitor data privacy.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.08]">
              <Button asChild variant="outline" className="w-full justify-center rounded-xl border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-semibold py-3 min-h-[44px]">
                <Link to={appRoutes.profile}>
                  <span>Open Profile</span>
                  <ArrowUpRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="group rounded-[28px] bg-gradient-to-b from-emerald-950/20 via-[#0C1222] to-white/[0.02] border border-emerald-500/30 hover:border-emerald-400/60 p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Pro Plan</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Upgrade to unlock unlimited daily background removals, priority cloud processing, and priority support.
                </p>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.08]">
              {currentPlan !== "PRO" ? (
                <Button
                  onClick={() => void handleUpgrade()}
                  disabled={isUpgrading}
                  className="w-full justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 border-0 shadow-lg shadow-emerald-500/25 min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 mr-1.5 text-yellow-300" />
                  <span>{isUpgrading ? "Opening Checkout..." : "Upgrade to Pro (Rs 999/mo)"}</span>
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full justify-center rounded-xl border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-semibold py-3 min-h-[44px]">
                  <Link to={appRoutes.pricing}>
                    <Check className="w-4 h-4 mr-1.5" />
                    <span>Manage Pro Quota</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* USAGE ANALYTICS SECTION */}
        {/* ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: 7-Day Activity Trend Chart */}
          <div className="lg:col-span-7 rounded-[28px] bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.1] p-8 shadow-2xl shadow-black/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>USAGE ANALYTICS</span>
                </div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Weekly Processing Volume</h3>
              </div>
              <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full font-medium">
                Last 7 Days
              </span>
            </div>

            {/* CSS Bar Chart */}
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-white/[0.08]">
              {weeklyUsageDays.map((col) => {
                const heightPercent = Math.min(100, Math.max(12, (col.count / col.max) * 100));
                return (
                  <div key={col.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[11px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      {col.count}
                    </span>
                    <div className="w-full max-w-[40px] bg-white/5 rounded-t-xl h-full flex items-end p-1">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          col.current
                            ? "bg-gradient-to-t from-blue-600 via-indigo-500 to-purple-500 shadow-lg shadow-blue-500/30"
                            : "bg-white/20 group-hover:bg-blue-400/60"
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${col.current ? "text-blue-400 font-bold" : "text-slate-500"}`}>
                      {col.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-2">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>+24% processing speed efficiency this week</span>
              </span>
              <span>Total: {dailyUsed * 3} assets</span>
            </div>
          </div>

          {/* Right: Quota & Compute Breakdown */}
          <div className="lg:col-span-5 rounded-[28px] bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.1] p-8 shadow-2xl shadow-black/50 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
                <Shield className="w-4 h-4" />
                <span>QUOTA DISTRIBUTION</span>
              </div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">Daily Compute Allocation</h3>
              <p className="text-xs text-slate-400 mt-1">Real-time GPU cluster utilization and daily free tier limits.</p>
            </div>

            <div className="space-y-6 py-2">
              {/* Progress Bar 1: Daily Free Quota */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Free Daily Tier Usage</span>
                  <span className="text-blue-400 font-bold">{currentPlan === "PRO" ? "0 / 0 (Bypassed)" : `${dailyUsed} / ${dailyLimit} Credits`}</span>
                </div>
                <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                  <div
                    style={{ width: currentPlan === "PRO" ? "100%" : `${Math.min(100, (dailyUsed / (dailyLimit || 1)) * 100)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      currentPlan === "PRO" ? "bg-emerald-500" : "bg-gradient-to-r from-blue-500 to-purple-500"
                    }`}
                  />
                </div>
              </div>

              {/* Progress Bar 2: Storage Retention */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Archive Capacity</span>
                  <span className="text-purple-400 font-bold">{totalHistoryCount} items archived</span>
                </div>
                <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                  <div
                    style={{ width: `${Math.min(100, totalHistoryCount * 5)}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-slate-400">Need higher throughput?</span>
              <Link to={appRoutes.pricing} className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4">
                Explore Pro Plan →
              </Link>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* HISTORY SECTION (TABLE & GRID WITH PREVIEW, SEARCH, FILTERS) */}
        {/* ================================================== */}
        <div id="history" className="rounded-[32px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.12] p-8 sm:p-10 shadow-2xl shadow-black/80 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">Asset History</h2>
              <p className="text-sm text-slate-400 mt-1">
                Review, download, or delete processed transparent cutouts from your cloud archive.
              </p>
            </div>

            {/* Controls Bar: Search, Filters, View Mode */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search filename..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
                {["ALL", "COMPLETED", "FAILED"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      statusFilter === status
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {status === "ALL" ? "All Status" : status}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  title="Table View"
                  aria-label="Table View"
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "table" ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  aria-label="Grid View"
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading & Empty States */}
          {historyQuery.isLoading ? (
            <div className="py-16 text-center space-y-3">
              <LoaderCircle className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
              <p className="text-sm text-slate-400">Loading archive...</p>
            </div>
          ) : null}

          {!historyQuery.isLoading && filteredHistory.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-white/[0.02] border border-white/[0.05] p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">No Processed Assets Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery || statusFilter !== "ALL"
                  ? "No images match your current search or status filter. Try clearing filters."
                  : "You haven't processed any images yet. Upload your first asset above to begin."}
              </p>
              {(searchQuery || statusFilter !== "ALL") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                  }}
                  className="rounded-xl border-white/15 bg-white/5 text-xs text-slate-200"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : null}

          {/* Table View */}
          {!historyQuery.isLoading && filteredHistory.length > 0 && viewMode === "table" ? (
            <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.03] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Asset Preview</th>
                    <th className="py-4 px-6">Source Filename</th>
                    <th className="py-4 px-6">Timestamp</th>
                    <th className="py-4 px-6">Pipeline Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-sm">
                  {paginatedHistory.map((item) => {
                    const isCompleted = item.status.toUpperCase() === "COMPLETED";
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4 px-6">
                          <button
                            type="button"
                            onClick={() => setPreviewItem(item)}
                            className="relative w-14 h-14 rounded-xl bg-[#050914] border border-white/10 overflow-hidden flex items-center justify-center group/img hover:border-blue-400/60 transition-colors"
                            title="Click to preview comparison"
                          >
                            <img
                              src={item.processed_image_url}
                              alt={item.source_filename}
                              className="w-full h-full object-contain p-1"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white">
                              <Eye className="w-4 h-4" />
                            </div>
                          </button>
                        </td>
                        <td className="py-4 px-6 font-medium text-white max-w-[200px] truncate">
                          {item.source_filename}
                          <span className="block text-[11px] text-slate-500 font-mono mt-0.5">ID: {item.id.substring(0, 8)}...</span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-400">
                          {new Date(item.created_at).toLocaleDateString()}{" "}
                          <span className="text-slate-500">{new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border ${
                              isCompleted
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setPreviewItem(item)}
                              title="View Preview"
                              aria-label="View Preview"
                              className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={downloadingItemId === item.id}
                              onClick={() => void handleAssetDownload(item.processed_image_url, `cutout-${item.source_filename}`, item.id)}
                              title="Download PNG"
                              aria-label="Download PNG"
                              className="h-8 w-8 p-0 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            >
                              {downloadingItemId === item.id ? <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id, item.source_filename)}
                              title="Delete Asset"
                              aria-label="Delete Asset"
                              className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}

          {/* Grid View */}
          {!historyQuery.isLoading && filteredHistory.length > 0 && viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedHistory.map((item) => {
                const isCompleted = item.status.toUpperCase() === "COMPLETED";
                return (
                  <div
                    key={item.id}
                    className="group rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 hover:border-white/[0.18] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video rounded-xl bg-[#050914] border border-white/10 overflow-hidden mb-4 flex items-center justify-center">
                        <img
                          src={item.processed_image_url}
                          alt={item.source_filename}
                          className="w-full h-full object-contain p-2"
                        />
                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border backdrop-blur-md ${
                              isCompleted
                                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                                : "bg-red-500/20 border-red-500/30 text-red-300"
                            }`}
                          >
                            <span className="w-1 h-1 rounded-full bg-current" />
                            {item.status}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white gap-2 font-medium text-xs"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Inspect Comparison</span>
                        </button>
                      </div>

                      <h4 className="font-bold text-white truncate text-sm font-['Outfit']">{item.source_filename}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {new Date(item.created_at).toLocaleDateString()} at{" "}
                        {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06]">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={downloadingItemId === item.id}
                        onClick={() => void handleAssetDownload(item.processed_image_url, `cutout-${item.source_filename}`, item.id)}
                        className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-3 py-1.5 h-auto rounded-lg font-semibold flex items-center gap-1.5"
                      >
                        {downloadingItemId === item.id ? <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                        <span>{downloadingItemId === item.id ? "Downloading..." : "Download PNG"}</span>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteItem(item.id, item.source_filename)}
                        className="text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-1.5 h-auto rounded-lg"
                        title="Delete Asset"
                        aria-label="Delete Asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Pagination Controls */}
          {!historyQuery.isLoading && filteredHistory.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.08] text-xs text-slate-400">
              <div>
                Showing <span className="font-semibold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-semibold text-white">{Math.min(currentPage * itemsPerPage, filteredHistory.length)}</span> of{" "}
                <span className="font-semibold text-white">{filteredHistory.length}</span> assets
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs px-3 py-1.5 h-auto"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  <span>Prev</span>
                </Button>

                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs px-3 py-1.5 h-auto"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* ================================================== */}
      {/* IMAGE PREVIEW MODAL */}
      {/* ================================================== */}
      {previewItem ? (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-[#0B111E] border border-white/15 rounded-[28px] max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit'] truncate max-w-md">
                  {previewItem.source_filename}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Processed on {new Date(previewItem.created_at).toLocaleString()} • ID: {previewItem.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close modal"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto flex-1 p-2">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Original Source</span>
                <div className="rounded-2xl bg-[#050810] border border-white/10 aspect-video flex items-center justify-center p-4">
                  <img src={previewItem.original_image_url} alt="Original source" className="max-h-64 w-auto object-contain rounded-lg" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">AI Transparent Cutout</span>
                <div className="rounded-2xl bg-[linear-gradient(45deg,#0E1626_25%,transparent_25%),linear-gradient(-45deg,#0E1626_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#0E1626_75%),linear-gradient(-45deg,transparent_75%,#0E1626_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] bg-[#050810] border border-white/10 aspect-video flex items-center justify-center p-4">
                  <img src={previewItem.processed_image_url} alt="Processed cutout" className="max-h-64 w-auto object-contain rounded-lg" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreviewItem(null)}
                className="rounded-xl border-white/10 bg-white/5 text-slate-300 text-xs font-medium px-5 py-2.5 h-auto"
              >
                Close Preview
              </Button>
              <Button
                type="button"
                disabled={downloadingItemId === previewItem.id}
                onClick={() => void handleAssetDownload(previewItem.processed_image_url, `cutout-${previewItem.source_filename}`, previewItem.id)}
                className="btn-premium px-6 py-2.5 h-auto text-xs font-semibold border-0"
              >
                {downloadingItemId === previewItem.id ? <LoaderCircle className="w-4 h-4 mr-1.5 animate-spin" /> : <Download className="w-4 h-4 mr-1.5" />}
                <span>{downloadingItemId === previewItem.id ? "Downloading..." : "Download Transparent PNG"}</span>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
