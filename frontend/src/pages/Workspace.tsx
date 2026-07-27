import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Upload,
  Download,
  RefreshCw,
  LoaderCircle,
  Sparkles,
  Zap,
  Image as ImageIcon,
  Check,
  Shield,
  ArrowLeft,
  History,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBackgroundRemoval, formatFileSize } from "@/features/upload/useBackgroundRemoval";
import { downloadImage } from "@/utils/downloadImage";
import { appRoutes } from "@/app/router/routes";

export const WorkspacePage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const uploader = useBackgroundRemoval();
  const queryClient = useQueryClient();
  const [isDownloading, setIsDownloading] = useState(false);

  // Automatically refresh usage and history when upload completes
  useEffect(() => {
    if (uploader.resultUrl) {
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
    }
  }, [uploader.resultUrl, queryClient]);

  // Handle clipboard paste for upload
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      if (document.activeElement && dropZoneRef.current && !dropZoneRef.current.contains(document.activeElement)) {
        return;
      }
      const items = event.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            event.preventDefault();
            uploader.selectFile(file);
            dropZoneRef.current?.focus();
            break;
          }
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [uploader]);

  const handleDownload = async () => {
    if (!uploader.resultUrl || isDownloading) return;
    try {
      setIsDownloading(true);
      const filename = uploader.selectedFile?.name ? `cutout-${uploader.selectedFile.name}` : undefined;
      await downloadImage(uploader.resultUrl, filename);
    } catch {
      // Error toast handled by downloadImage
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-blue-500/30 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* ================================================== */}
        {/* TOP WORKSPACE HEADER */}
        {/* ================================================== */}
        <div className="rounded-[28px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.1] p-6 sm:p-8 shadow-2xl shadow-black/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/25 flex-shrink-0">
              <div className="w-full h-full rounded-[14px] bg-[#0C1220] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-blue-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit'] tracking-tight">AI Removal Studio</h1>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3 h-3 fill-blue-400" /> Neural Edge v3.4
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Drag and drop or paste images for instant zero-latency background extraction.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
            <Button asChild variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium flex-1 sm:flex-initial">
              <Link to={appRoutes.dashboard}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Overview
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium flex-1 sm:flex-initial">
              <Link to={`${appRoutes.dashboard}#history`}>
                <History className="w-3.5 h-3.5 mr-1.5" /> Archive
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium flex-1 sm:flex-initial">
              <Link to={appRoutes.profile}>
                <UserIcon className="w-3.5 h-3.5 mr-1.5" /> Profile
              </Link>
            </Button>
          </div>
        </div>

        {/* ================================================== */}
        {/* INTERACTIVE UPLOADER & PROCESSING ZONE */}
        {/* ================================================== */}
        <div className="rounded-[32px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.12] p-6 sm:p-10 shadow-2xl shadow-black/80">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/jpg"
            className="hidden"
            aria-label="Upload image for background removal"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploader.selectFile(file);
            }}
          />

          {!uploader.previewUrl ? (
            <div
              ref={dropZoneRef}
              tabIndex={0}
              role="button"
              aria-label="Drop zone for image upload. Press Enter or Space to choose a file."
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();
                const file = event.dataTransfer.files?.[0];
                if (file && file.type.startsWith("image/")) {
                  uploader.selectFile(file);
                }
              }}
              onClick={() => inputRef.current?.click()}
              className="group relative cursor-pointer overflow-hidden rounded-[24px] border-2 border-dashed border-white/15 bg-[#0C1220]/60 hover:bg-[#0C1220]/90 hover:border-blue-500/50 p-12 sm:p-20 text-center transition-all duration-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto space-y-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:border-blue-500/40 transition-all duration-300">
                  <Upload className="w-10 h-10 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                    Drop your image here, or <span className="text-blue-400 underline underline-offset-4">browse</span>
                  </h3>
                  <p className="text-sm text-slate-400 mt-2">
                    Supports PNG, JPG, JPEG, and WEBP up to 10MB. Or press <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-xs text-slate-300 font-mono">Ctrl+V / Cmd+V</kbd> to paste directly from clipboard.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> 100% Automatic</span>
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Zero Data Retention</span>
                  <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> HD Quality</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                      {uploader.selectedFile?.name || "Uploaded Image"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {uploader.selectedFile ? formatFileSize(uploader.selectedFile) : "Ready"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {!uploader.resultUrl ? (
                    <Button
                      type="button"
                      disabled={uploader.isSubmitting}
                      onClick={() => uploader.submit()}
                      className="btn-premium px-6 py-5 text-sm font-semibold border-0 flex-1 sm:flex-initial"
                    >
                      {uploader.isSubmitting ? (
                        <>
                          <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                          <span>Extracting Neural Edge...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
                          <span>Remove Background</span>
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      disabled={isDownloading}
                      onClick={() => void handleDownload()}
                      className="btn-premium px-6 py-5 text-sm font-semibold border-0 shadow-lg shadow-blue-500/25 flex-1 sm:flex-initial"
                    >
                      {isDownloading ? (
                        <>
                          <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          <span>Download HD PNG</span>
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => uploader.reset()}
                    className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl px-4 py-5 text-xs font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset
                  </Button>
                </div>
              </div>

              {/* PROCESSING PREVIEW & SLIDER */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-[#0C1220] border border-white/10 min-h-[350px] sm:min-h-[480px] flex items-center justify-center">
                {uploader.isSubmitting ? (
                  <div className="flex flex-col items-center justify-center space-y-4 p-12 text-center">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-lg font-bold text-white font-['Outfit']">Processing high-resolution cutout...</p>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Our edge-detection model separates hair, translucent fabric, and complex boundaries in real-time.
                    </p>
                  </div>
                ) : uploader.resultUrl ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 w-full">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
                        <span>Original Asset</span>
                        <span className="text-slate-500">Input</span>
                      </div>
                      <div className="rounded-xl overflow-hidden bg-black/40 border border-white/10 aspect-square sm:aspect-video flex items-center justify-center p-2 relative group">
                        <img src={uploader.previewUrl!} alt="Original" className="max-w-full max-h-full object-contain rounded-lg" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 px-1">
                        <span>Transparent Cutout</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px]">HD PNG</span>
                      </div>
                      <div className="rounded-xl overflow-hidden bg-gradient-to-tr from-slate-900 via-[#0F172A] to-slate-900 border border-emerald-500/30 aspect-square sm:aspect-video flex items-center justify-center p-2 relative group shadow-2xl shadow-emerald-500/10"
                           style={{ backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)", backgroundSize: "16px 16px" }}>
                        <img src={uploader.resultUrl} alt="Transparent Result" className="max-w-full max-h-full object-contain rounded-lg" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 w-full flex flex-col items-center justify-center">
                    <img src={uploader.previewUrl!} alt="Preview" className="max-h-[420px] object-contain rounded-xl shadow-2xl" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================================================== */}
        {/* SHORTCUTS & TIPS BAR */}
        {/* ================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/08 space-y-2">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" /> Instant Clipboard Paste
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Copy any image from your web browser or screenshot tool and press <kbd className="font-mono text-slate-300">Ctrl+V</kbd> anywhere in this studio to begin processing immediately.
            </p>
          </div>
          <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/08 space-y-2">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" /> Commercial Rights
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All generated transparent PNGs come with full royalty-free commercial usage rights for marketing, e-commerce, and product design.
            </p>
          </div>
          <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/08 space-y-2">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Fast AI Processing
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Need to process product photos quickly? Use our intuitive AI studio for clean alpha channels and instant background removal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;
