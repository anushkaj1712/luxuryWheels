/**
 * Axios instance — JWT from auth store, timeouts, retries, and **demo fallbacks** when the API is offline.
 * Live API is always attempted first; synthetic success payloads mirror the Express `{ success, data }` shape.
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_URL } from "@/constants/site";
import { useAuthStore } from "@/store/auth-store";
import { setApiLoading } from "@/components/providers/ApiLoadingBridge";
import { buildDemoAxiosResponse, shouldAttemptDemoFallback } from "@/lib/demo-axios-resolver";

const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_GET_RETRIES = 2;
const RETRY_DELAY_MS = 600;

export const api = axios.create({
  baseURL: API_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  setApiLoading(true);
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    setApiLoading(false);
    return response;
  },
  async (error: AxiosError) => {
    setApiLoading(false);
    const config = error.config as (InternalAxiosRequestConfig & { __retryCount?: number }) | undefined;
    if (!config) return Promise.reject(error);

    const demo = buildDemoAxiosResponse(config, error);
    if (demo) {
      return demo;
    }

    const status = error.response?.status;
    const method = config.method?.toUpperCase() ?? "GET";
    const isTimeout = error.code === "ECONNABORTED" || error.message?.includes("timeout");

    if (
      shouldAttemptDemoFallback(error) &&
      method === "GET" &&
      (isTimeout || status === 502 || status === 503 || status === 504) &&
      (config.__retryCount ?? 0) < MAX_GET_RETRIES
    ) {
      config.__retryCount = (config.__retryCount ?? 0) + 1;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * config.__retryCount!));
      return api(config);
    }

    return Promise.reject(error);
  },
);
