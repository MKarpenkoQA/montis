import { useEffect, useState } from "react";
import { BREAKPOINTS } from "../constants/breakpoints";

const getMobileQuery = (maxWidth: number) => `(max-width: ${maxWidth}px)`;

const getInitialIsMobile = (maxWidth: number): boolean => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(getMobileQuery(maxWidth)).matches;
};

export const useIsMobile = (maxWidth = BREAKPOINTS.md - 1): boolean => {
  const [isMobile, setIsMobile] = useState(() => getInitialIsMobile(maxWidth));

  useEffect(() => {
    const mediaQuery = window.matchMedia(getMobileQuery(maxWidth));
    const handleChange = () => setIsMobile(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [maxWidth]);

  return isMobile;
};
