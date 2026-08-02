import { env } from "../config/env";
import { errorResponseSchema } from "./schemas";

export class ApiClientError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

const withBaseUrl = (path: string) => (env.apiBaseUrl ? `${env.apiBaseUrl}${path}` : path);

const parseError = async (response: Response): Promise<never> => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const parsed = errorResponseSchema.safeParse(await response.json());
    if (parsed.success) {
      throw new ApiClientError(parsed.data.error, response.status);
    }
  }

  throw new ApiClientError(`Request failed with status ${response.status}`, response.status);
};

export const apiClient = {
  async get<T>(path: string, schema: { parse: (data: unknown) => T }, options?: { token?: string; signal?: AbortSignal }): Promise<T> {
    const response = await fetch(withBaseUrl(path), {
      signal: options?.signal,
      headers: options?.token ? { Authorization: `Bearer ${options.token}` } : undefined,
    });

    if (!response.ok) {
      return parseError(response);
    }

    return schema.parse(await response.json());
  },
  async post<T>(
    path: string,
    body: unknown,
    schema: { parse: (data: unknown) => T },
    options?: { token?: string; signal?: AbortSignal },
  ): Promise<T> {
    const response = await fetch(withBaseUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    });

    if (!response.ok) {
      return parseError(response);
    }

    return schema.parse(await response.json());
  },
  async delete<T>(path: string, schema: { parse: (data: unknown) => T }, options?: { token?: string; signal?: AbortSignal }): Promise<T> {
    const response = await fetch(withBaseUrl(path), {
      method: "DELETE",
      headers: options?.token ? { Authorization: `Bearer ${options.token}` } : undefined,
      signal: options?.signal,
    });

    if (!response.ok) {
      return parseError(response);
    }

    return schema.parse(await response.json());
  },
  async postFormData<T>(
    path: string,
    formData: FormData,
    schema: { parse: (data: unknown) => T },
    options?: { token?: string; signal?: AbortSignal },
  ): Promise<T> {
    const response = await fetch(withBaseUrl(path), {
      method: "POST",
      body: formData,
      signal: options?.signal,
      headers: options?.token ? { Authorization: `Bearer ${options.token}` } : undefined,
    });

    if (!response.ok) {
      return parseError(response);
    }

    return schema.parse(await response.json());
  },
};
