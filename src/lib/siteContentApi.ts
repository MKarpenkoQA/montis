import type { SiteContent } from "../content/types";

const parseError = async (response: Response): Promise<string> => {
  const body = await response.json().catch(() => ({}));
  return typeof body.error === "string" ? body.error : `Request failed: ${response.status}`;
};

export const fetchSiteContent = async (init?: RequestInit): Promise<SiteContent> => {
  const response = await fetch("/api/content", init);
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json() as Promise<SiteContent>;
};

export const saveSiteContent = async (content: SiteContent): Promise<SiteContent> => {
  const response = await fetch("/api/content", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json() as Promise<SiteContent>;
};

export const checkAuth = async (): Promise<{ authenticated: boolean }> => {
  const response = await fetch("/api/auth/me", { credentials: "include" });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json() as Promise<{ authenticated: boolean }>;
};

export const login = async (password: string): Promise<{ ok: boolean }> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json() as Promise<{ ok: boolean }>;
};

export const logout = async (): Promise<{ ok: boolean }> => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json() as Promise<{ ok: boolean }>;
};

export const uploadFile = async (file: File): Promise<{ url: string }> => {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch("/api/upload", {
    method: "POST",
    body: form,
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json() as Promise<{ url: string }>;
};
