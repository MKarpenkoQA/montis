import type { SiteContent } from "../src/content/types.js";

export class ContentConflictError extends Error {
  constructor(message = "Content changed on the server. Reload before saving again.") {
    super(message);
    this.name = "ContentConflictError";
  }
}

export const getContentUpdatedAt = (content: SiteContent): string | null => {
  const updatedAt = content.meta?.updatedAt;
  return typeof updatedAt === "string" && updatedAt.length > 0 ? updatedAt : null;
};

export const assertContentRevisionMatches = (expected: string | null, current: string | null): void => {
  if (!expected) {
    throw new ContentConflictError("Missing content revision. Reload before saving again.");
  }

  if (!current || current !== expected) {
    throw new ContentConflictError();
  }
};

export const createNextUpdatedAt = (previous: string | null): string => {
  const now = new Date();
  if (!previous) return now.toISOString();

  const previousTime = Date.parse(previous);
  if (!Number.isFinite(previousTime)) return now.toISOString();

  if (now.getTime() <= previousTime) {
    return new Date(previousTime + 1).toISOString();
  }

  return now.toISOString();
};
