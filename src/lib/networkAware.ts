import { mediaQuery } from "../constants/breakpoints";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
};

const getConnection = (): NetworkInformation | undefined =>
  (navigator as Navigator & { connection?: NetworkInformation }).connection;

/** Skip non-critical prefetch on slow or metered connections. */
export const shouldPrefetch = (): boolean => {
  const connection = getConnection();
  if (!connection) return true;
  if (connection.saveData) return false;
  if (connection.effectiveType === "slow-2g" || connection.effectiveType === "2g") return false;
  return true;
};

export const isDesktopViewport = (): boolean =>
  window.matchMedia(mediaQuery.md).matches;
