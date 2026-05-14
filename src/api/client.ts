/**
 * Cliente HTTP fino sobre `fetch`. Base URL via `VITE_API_BASE_URL`.
 * Faz JSON parsing e lança `ApiError` em status >= 400.
 */

const DEFAULT_BASE_URL = "http://localhost:8765";

function getBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL;
}

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

function buildUrl(path: string, params?: object): string {
  const base = getBaseUrl().replace(/\/$/, "");
  const url = new URL(`${base}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request<T>(
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  path: string,
  opts: { params?: object; body?: unknown } = {},
): Promise<T> {
  const init: RequestInit = {
    method,
    headers: { Accept: "application/json" },
  };
  if (opts.body !== undefined) {
    init.headers = { ...init.headers, "Content-Type": "application/json" };
    init.body = JSON.stringify(opts.body);
  }
  const response = await fetch(buildUrl(path, opts.params), init);
  const body = await parseBody(response);
  if (!response.ok) {
    const detail =
      (typeof body === "object" &&
        body !== null &&
        "detail" in body &&
        typeof (body as { detail: unknown }).detail === "string" &&
        (body as { detail: string }).detail) ||
      `HTTP ${response.status} ${response.statusText}`;
    throw new ApiError(response.status, detail, body);
  }
  return body as T;
}

export function apiGet<T>(path: string, params?: object): Promise<T> {
  return request<T>("GET", path, { params });
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return request<T>("PATCH", path, { body });
}
