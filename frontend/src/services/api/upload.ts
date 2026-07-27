import { apiClient } from "./client";
import { removeBgResponseSchema, type RemoveBgResponse } from "./schemas";

export const uploadApi = {
  removeBackground(file: File, token?: string, signal?: AbortSignal): Promise<RemoveBgResponse> {
    const formData = new FormData();
    formData.append("image", file);

    return apiClient.postFormData("/api/remove-bg", formData, removeBgResponseSchema, {
      token,
      signal,
    });
  },
};
