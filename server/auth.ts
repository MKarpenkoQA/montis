import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const SESSION_COOKIE = "montis_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const sessions = new Map<string, number>();

const DEFAULT_ADMIN_PASSWORD = "montis-admin";
const LOGIN_ATTEMPT_WINDOW_MS = 1000 * 60 * 15;
const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_LOCK_MS = 1000 * 60 * 15;

type LoginAttemptState = {
  failedAttempts: number;
  firstFailedAt: number;
  lockedUntil: number;
};

const loginAttempts = new Map<string, LoginAttemptState>();

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;

export const assertSecureAdminPassword = (): void => {
  if (process.env.NODE_ENV !== "production") return;
  if (ADMIN_PASSWORD === DEFAULT_ADMIN_PASSWORD) {
    console.error("FATAL: Set ADMIN_PASSWORD before running in production.");
    process.exit(1);
  }
};

const purgeExpiredSessions = () => {
  const now = Date.now();
  for (const [token, expiresAt] of sessions) {
    if (expiresAt <= now) sessions.delete(token);
  }
};

const purgeExpiredLoginAttempts = () => {
  const now = Date.now();
  for (const [key, attempt] of loginAttempts) {
    if (attempt.lockedUntil > now) continue;
    if (now - attempt.firstFailedAt <= LOGIN_ATTEMPT_WINDOW_MS) continue;
    loginAttempts.delete(key);
  }
};

export const getLoginRetryAfterMs = (key: string): number | null => {
  purgeExpiredLoginAttempts();
  const attempt = loginAttempts.get(key);
  if (!attempt || attempt.lockedUntil <= Date.now()) return null;
  return attempt.lockedUntil - Date.now();
};

export const recordFailedLoginAttempt = (key: string): number | null => {
  purgeExpiredLoginAttempts();
  const now = Date.now();
  const current = loginAttempts.get(key);
  const attempt =
    current && now - current.firstFailedAt <= LOGIN_ATTEMPT_WINDOW_MS
      ? current
      : { failedAttempts: 0, firstFailedAt: now, lockedUntil: 0 };

  attempt.failedAttempts += 1;
  if (attempt.failedAttempts >= LOGIN_ATTEMPT_LIMIT) {
    attempt.lockedUntil = now + LOGIN_LOCK_MS;
  }
  loginAttempts.set(key, attempt);

  return attempt.lockedUntil > now ? attempt.lockedUntil - now : null;
};

export const clearLoginAttempts = (key: string) => {
  loginAttempts.delete(key);
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
