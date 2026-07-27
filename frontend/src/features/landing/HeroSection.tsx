import { useState, useEffect, useRef } from "react";
import { ClipboardPaste, Download, ImagePlus, LoaderCircle, RefreshCw, Upload, ArrowRight } from "lucide-react";
import { downloadImage } from "@/utils/downloadImage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBackgroundRemoval, formatFileSize } from "@/features/upload/useBackgroundRemoval";
import { useAuth } from "@/features/auth/auth-context";
import { appRoutes } from "@/app/router/routes";

const getClipboardImage = (items: DataTransferItemList | null) => {
  if (!items) return null;

  for (const item of Array.from(items)) {
    if (item.type.startsWith("image/")) {
      return item.getAsFile();
    }
  }

  return null;
};

const HeroSection = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const uploader = useBackgroundRemoval();
  const { authEnabled, user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!uploader.resultUrl || isDownloading) return;
    try {
      setIsDownloading(true);
      await downloadImage(uploader.resultUrl);
    } catch {
      // Error toast is handled by downloadImage
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      if (document.activeElement && dropZoneRef.current && !dropZoneRef.current.contains(document.activeElement)) {
        return;
      }

      const file = getClipboardImage(event.clipboardData?.items ?? null);
      if (!file) return;

      event.preventDefault();
      uploader.selectFile(file);
      dropZoneRef.current?.focus();
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [uploader]);

  return (
    <section className="relative overflow-hidden pt-24 pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,117,255,0.18),transparent_35%),linear-gradient(180deg,rgba(6,10,22,0.98),rgba(4,8,18,1))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:44px_44px] opacity-20" />

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-gradient-to-b from-[#101726]/90 to-[#0A0E18]/90 shadow-[0_30px_120px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
          <div className="border-b border-white/[0.08] px-6 py-12 text-center sm:px-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>AI COMPUTER VISION ENGINE v2.4</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl font-['Outfit'] leading-[1.12]">
              Remove Image Backgrounds <br className="hidden sm:block" />
              with <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Zero Latency</span>
            </h1>
            <p className="mt-4 text-base text-slate-400 sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Studio-grade edge detection for portraits, e-commerce merchandise, and graphics. Processed in browser with 2 free daily credits.
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                uploader.selectFile(event.target.files?.[0] ?? null);
                event.currentTarget.value = "";
              }}
            />

            <div
              ref={dropZoneRef}
              role="button"
              tabIndex={0}
              aria-label="Upload image area"
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
                uploader.setDragging(true);
              }}
              onDragEnter={(event) => {
                event.preventDefault();
                uploader.setDragging(true);
              }}
              onDragLeave={(event) => {
                if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  return;
                }

                uploader.setDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                uploader.setDragging(false);
                uploader.selectFile(event.dataTransfer.files?.[0] ?? null);
              }}
              className={`group relative overflow-hidden rounded-[24px] border border-dashed px-6 py-10 text-center outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-sky-400/70 sm:px-10 sm:py-14 ${
                uploader.isDragging
                  ? "border-sky-400 bg-sky-500/10 shadow-[0_0_0_1px_rgba(56,189,248,0.25)]"
                  : "border-white/12 bg-[radial-gradient(circle_at_center,rgba(14,31,61,0.85),rgba(5,8,17,0.95))] hover:border-sky-400/40"
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_55%)] opacity-80" />

              <div className="relative z-10 flex flex-col items-center">
                {uploader.resultUrl ? (
                  <div className="grid w-full gap-6 lg:grid-cols-2">
                    {[{ label: "Original", src: uploader.previewUrl || uploader.originalUrl }, { label: "Processed", src: uploader.resultUrl }].map((panel) => (
                      <div key={panel.label} className="overflow-hidden rounded-[22px] border border-sky-400/15 bg-[#050914] shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                        <div className="border-b border-white/10 px-4 py-3 text-left text-sm font-medium text-slate-300">{panel.label}</div>
                        {panel.src ? <img src={panel.src} alt={panel.label} className="h-72 w-full object-contain" /> : null}
                      </div>
                    ))}
                  </div>
                ) : uploader.previewUrl ? (
                  <div className="w-full max-w-xl overflow-hidden rounded-[22px] border border-sky-400/15 bg-[#050914] shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                    <img
                      src={uploader.previewUrl}
                      alt={uploader.selectedFile?.name ?? "Uploaded preview"}
                      className="h-72 w-full object-contain bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_60%)]"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sky-500/12 ring-1 ring-inset ring-sky-400/15">
                    <Upload className="h-10 w-10 text-sky-400" />
                  </div>
                )}

                <h2 className="mt-8 text-2xl font-semibold text-white">
                  {uploader.selectedFile ? uploader.selectedFile.name : "Drag and drop your image"}
                </h2>

                <p className="mt-2 text-base text-slate-400">
                  {uploader.selectedFile ? (
                    "Preview loaded. Upload, drop, or paste another image to replace it."
                  ) : (
                    <>
                      or{" "}
                      <span className="font-semibold text-sky-400 underline underline-offset-4">
                        browse files
                      </span>
                    </>
                  )}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-500">
                  <span>JPG, PNG, WEBP</span>
                  <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
                  <span>Max 10MB</span>
                  <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
                  <span>High Quality PNG</span>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    <Upload className="h-3.5 w-3.5 text-sky-400" />
                    Desktop upload
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    <ImagePlus className="h-3.5 w-3.5 text-sky-400" />
                    Drag and drop
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    <ClipboardPaste className="h-3.5 w-3.5 text-sky-400" />
                    Ctrl+V / Cmd+V
                  </span>
                </div>

                {uploader.selectedFile ? (
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/5 px-3 py-1.5 text-xs text-slate-300">
                    <ImagePlus className="h-3.5 w-3.5 text-sky-400" />
                    {formatFileSize(uploader.selectedFile)}
                  </div>
                ) : null}

                {uploader.remainingFreeQuota !== null ? (
                  <p className="mt-4 text-sm text-slate-400">{uploader.remainingFreeQuota} uploads remaining today</p>
                ) : null}

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      uploader.submit();
                    }}
                    disabled={uploader.isSubmitting || !uploader.selectedFile}
                    className="btn-premium px-8 py-6 text-sm font-semibold border-0"
                  >
                    {uploader.isSubmitting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    {uploader.isSubmitting ? "Removing Background..." : "Remove Background"}
                  </Button>

                  {uploader.resultUrl ? (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isDownloading}
                      className="btn-secondary-premium px-6 py-6 text-sm font-medium"
                      onClick={(e) => void handleDownload(e)}
                    >
                      {isDownloading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                      {isDownloading ? "Downloading..." : "Download Result"}
                    </Button>
                  ) : null}

                  {uploader.selectedFile ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-slate-300 hover:bg-white/10 rounded-xl px-4 py-6 font-medium"
                      onClick={(event) => {
                        event.stopPropagation();
                        uploader.reset();
                      }}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  ) : null}
                </div>

                {authEnabled && user ? (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                    <Button asChild className="btn-premium px-8 py-6 text-sm font-semibold border-0 shadow-lg shadow-blue-500/25 min-h-[48px]">
                      <Link to={appRoutes.workspace}>
                        <span>Launch AI Studio</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="btn-secondary-premium px-8 py-6 text-sm font-semibold min-h-[48px]">
                      <Link to={appRoutes.dashboard}>
                        <span>Overview</span>
                      </Link>
                    </Button>
                  </div>
                ) : null}

                {authEnabled && !user ? (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                    <Button asChild className="btn-premium px-6 py-5 text-sm font-semibold border-0 shadow-lg shadow-indigo-500/25">
                      <Link to={appRoutes.signup}>
                        <span>Get Started Free (2 Credits)</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="btn-secondary-premium px-6 py-5 text-sm font-medium">
                      <Link to={appRoutes.login}>Sign In</Link>
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
