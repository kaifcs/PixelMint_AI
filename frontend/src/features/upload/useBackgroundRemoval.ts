import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/features/auth/auth-context";
import { uploadApi } from "@/services/api/upload";

const acceptedMimeTypes = ["image/jpeg", "image/png", "image/webp"] as const;
const maxUploadSizeBytes = 10 * 1024 * 1024;

const uploadFileSchema = z
  .instanceof(File, { message: "Please choose an image to upload." })
  .refine((file) => acceptedMimeTypes.includes(file.type as (typeof acceptedMimeTypes)[number]), {
    message: "Please upload a JPG, PNG, or WEBP image.",
  })
  .refine((file) => file.size <= maxUploadSizeBytes, {
    message: "Image size must be 10MB or less.",
  });

export const formatFileSize = (file: File) => `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

export const useBackgroundRemoval = () => {
  const { authEnabled, getAccessToken } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [remainingFreeQuota, setRemainingFreeQuota] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const parsed = uploadFileSchema.safeParse(file);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "Invalid file.");
      }

      const token = await getAccessToken();
      if (authEnabled && !token) {
        throw new Error("Please sign in to remove backgrounds.");
      }

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      return uploadApi.removeBackground(file, token || undefined, abortRef.current.signal);
    },
    retry: 1,
    onSuccess: (response) => {
      setResultUrl(response.data.processedImageUrl);
      setOriginalUrl(response.data.originalImageUrl);
      setRemainingFreeQuota(response.data.remainingFreeQuota);
      toast.success("Background removed successfully.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to process image.");
    },
  });

  const selectFile = (file: File | null) => {
    if (!file) {
      return;
    }

    const parsed = uploadFileSchema.safeParse(file);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid file.");
      return;
    }

    setSelectedFile(file);
    setResultUrl(null);
    setOriginalUrl(null);
  };

  const reset = () => {
    abortRef.current?.abort();
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setOriginalUrl(null);
    setRemainingFreeQuota(null);
    setIsDragging(false);
  };

  return {
    selectedFile,
    previewUrl,
    resultUrl,
    originalUrl,
    remainingFreeQuota,
    isDragging,
    isSubmitting: mutation.isPending,
    selectFile,
    submit: () => {
      if (!selectedFile) {
        toast.error("Please choose an image first.");
        return;
      }

      mutation.mutate(selectedFile);
    },
    setDragging: setIsDragging,
    reset,
  };
};
