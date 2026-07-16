import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const SESSION_COOKIE = "montis_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const sessions = new Map<string, number>();

const DEFAULT_ADMIN_PASSWORD = "montis-admin";
const EXAMPLE_ADMIN_PASSWORD = "change-me-in-production";
const INSECURE_ADMIN_PASSWORDS = new Set([
  DEFAULT_ADMIN_PASSWORD,
  EXAMPLE_ADMIN_PASSWORD,
]);

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;

export const isSecureAdminPassword = (password: string): boolean => {
  const normalized = password.trim();
  return normalized.length > 0 && !INSECURE_ADMIN_PASSWORDS.has(normalized);
};

export const assertSecureAdminPassword = (): void => {
  if (process.env.NODE_ENV !== "production") return;
  if (!isSecureAdminPassword(ADMIN_PASSWORD)) {
    console.error("FATAL: Set ADMIN_PASSWORD to a private non-empty value before running in production.");
    process.exit(1);
  }
};

const purgeExpiredSessions = () => {
  const now = Date.now();
  for (const [token, expiresAt] of sessions) {
    if (expiresAt <= now) sessions.delete(token);
  }
};

export const createSession = () => {
  purgeExpiredSessions();
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
};

export const destroySession = (token?: string) => {
  if (token) sessions.delete(token);
};

export const isValidSession = (token?: string) => {
  if (!token) return false;
  const expiresAt = sessions.get(token);
  if (!expiresAt) return false;
  if (expiresAt <= Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!isValidSession(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};

export const setSessionCookie = (res: Response, token: string) => {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS,
    path: "/",
  });
};

export const clearSessionCookie = (res: Response) => {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
};

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
