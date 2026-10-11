import type { ApiErrorBody } from "@/types/api";

/**
 * Loi co cau truc nem ra tu HTTP client.
 *
 * Giu nguyen shape { code, message, details?, requestId } cua backend de UI
 * hien thi dong nhat. Khi backend khong tra JSON hop le (vd mang loi, 502 tu
 * reverse proxy), ta tu tao mot ApiError voi code noi bo de UI van co du
 * truong hien thi.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;
  readonly requestId?: string;

  constructor(input: {
    code: string;
    message: string;
    status: number;
    details?: unknown;
    requestId?: string;
  }) {
    super(input.message);
    this.name = "ApiError";
    this.code = input.code;
    this.status = input.status;
    this.details = input.details;
    this.requestId = input.requestId;
  }
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value &&
    typeof (value as ApiErrorBody).code === "string" &&
    typeof (value as ApiErrorBody).message === "string"
  );
}

/** Chuyen response loi thanh ApiError co cau truc. */
export async function toApiError(response: Response): Promise<ApiError> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = undefined;
  }

  if (isApiErrorBody(body)) {
    return new ApiError({
      code: body.code,
      message: body.message,
      status: response.status,
      details: body.details,
      requestId: body.requestId,
    });
  }

  return new ApiError({
    code: "unexpected_error",
    message: `May chu tra ve ${response.status} ${response.statusText}`.trim(),
    status: response.status,
  });
}

/** Loi mang hoac loi truoc khi co response (vd backend chua chay). */
export function toNetworkError(cause: unknown): ApiError {
  const message = cause instanceof Error ? cause.message : "Khong ket noi duoc may chu";
  return new ApiError({
    code: "network_error",
    message,
    status: 0,
  });
}
