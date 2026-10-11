import { toApiError, toNetworkError } from "@/lib/api-error";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/services/auth-session";
import type { AuthTokens } from "@/types/api";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:3000";

/** Prefix chung cua moi endpoint backend. */
const API_PREFIX = "/v1";

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  /**
   * Bo qua lop auth (gan Bearer header + tu dong refresh). Dung cho chinh cac
   * endpoint auth nhu login va refresh de tranh vong lap.
   */
  skipAuth?: boolean;
}

/** Mot file blob tai ve kem ten file goi y tu backend. */
export interface DownloadedBlob {
  blob: Blob;
  /** Ten file lay tu header Content-Disposition, neu co. */
  filename: string | null;
}

function buildUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_ORIGIN}${API_PREFIX}${normalized}`;
}

async function rawFetch(path: string, options: RequestOptions, accessToken: string | null) {
  const { method = "GET", body, signal } = options;

  return fetch(buildUrl(path), {
    method,
    signal,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

interface BinaryRequestInit {
  method: "GET" | "POST";
  accept: string;
  /** FormData gui len (multipart); de trinh duyet tu dat Content-Type co boundary. */
  formData?: FormData;
  signal?: AbortSignal;
}

/**
 * Fetch cho payload nhi phan (upload FormData, download blob). Khong dat
 * Content-Type khi gui FormData de trinh duyet tu them boundary.
 */
async function rawBinaryFetch(path: string, init: BinaryRequestInit, accessToken: string | null) {
  return fetch(buildUrl(path), {
    method: init.method,
    signal: init.signal,
    headers: {
      Accept: init.accept,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: init.formData,
  });
}

/**
 * Chi mot lan refresh chay tai mot thoi diem. Cac request 401 dong thoi cung
 * cho chung mot promise refresh thay vi moi request tu refresh rieng (tranh
 * xoay vong token nhieu lan va vo hieu lan nhau).
 */
let refreshInFlight: Promise<AuthTokens | null> | null = null;

async function refreshTokens(): Promise<AuthTokens | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const response = await rawFetch(
          "/auth/refresh",
          { method: "POST", body: { refreshToken } },
          null,
        );
        if (!response.ok) {
          clearTokens();
          return null;
        }
        const tokens = (await response.json()) as AuthTokens;
        setTokens(tokens);
        return tokens;
      } catch {
        clearTokens();
        return null;
      } finally {
        refreshInFlight = null;
      }
    })();
  }

  return refreshInFlight;
}

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw await toApiError(response);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

/**
 * HTTP client cho backend meal-platform-api.
 *
 * Gui va nhan JSON, gan Authorization: Bearer tu phien auth hien tai, va map
 * moi truong hop loi thanh ApiError co cau truc. Khi gap 401, thu refresh
 * token mot lan roi phat lai request; neu van 401 thi xoa phien va nem loi.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false } = options;
  const accessToken = skipAuth ? null : getAccessToken();

  let response: Response;
  try {
    response = await rawFetch(path, options, accessToken);
  } catch (cause) {
    throw toNetworkError(cause);
  }

  if (response.status === 401 && !skipAuth) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      try {
        response = await rawFetch(path, options, refreshed.accessToken);
      } catch (cause) {
        throw toNetworkError(cause);
      }
    }
  }

  return parse<T>(response);
}

function parseFilename(disposition: string | null): string | null {
  if (!disposition) {
    return null;
  }
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }
  const plainMatch = disposition.match(/filename="?([^"]+)"?/i);
  return plainMatch?.[1] ?? null;
}

/**
 * Chay request nhi phan voi cung co che refresh 401 mot lan nhu `request`.
 * Tra thang Response de nguoi goi doc blob; neu !ok thi nem ApiError.
 */
async function binaryRequest(path: string, init: BinaryRequestInit): Promise<Response> {
  const accessToken = getAccessToken();

  let response: Response;
  try {
    response = await rawBinaryFetch(path, init, accessToken);
  } catch (cause) {
    throw toNetworkError(cause);
  }

  if (response.status === 401) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      try {
        response = await rawBinaryFetch(path, init, refreshed.accessToken);
      } catch (cause) {
        throw toNetworkError(cause);
      }
    }
  }

  if (!response.ok) {
    throw await toApiError(response);
  }
  return response;
}

export const httpClient = {
  /** POST FormData (multipart) va nhan JSON tra ve. Dung cho upload file. */
  postForm: async <T>(
    path: string,
    formData: FormData,
    options?: { signal?: AbortSignal },
  ): Promise<T> => {
    const response = await binaryRequest(path, {
      method: "POST",
      accept: "application/json",
      formData,
      signal: options?.signal,
    });
    if (response.status === 204) {
      return undefined as T;
    }
    return (await response.json()) as T;
  },
  /** GET mot file nhi phan (vd .xlsx) kem ten file goi y tu backend. */
  getBlob: async (
    path: string,
    options?: { accept?: string; signal?: AbortSignal },
  ): Promise<DownloadedBlob> => {
    const response = await binaryRequest(path, {
      method: "GET",
      accept: options?.accept ?? "application/octet-stream",
      signal: options?.signal,
    });
    return {
      blob: await response.blob(),
      filename: parseFilename(response.headers.get("Content-Disposition")),
    };
  },
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
