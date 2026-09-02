import path from "node:path";

const BYPASS_PREFIXES = ["/api", "/media", "/assets"] as const;

export const shouldServeSpaFallback = (requestPath: string): boolean => {
  if (BYPASS_PREFIXES.some((prefix) => requestPath === prefix || requestPath.startsWith(`${prefix}/`))) {
    return false;
  }

  return path.extname(requestPath) === "";
};
