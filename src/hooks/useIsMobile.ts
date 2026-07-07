import { useEffect, useState } from "react";
import { BREAKPOINTS } from "../constants/breakpoints";

export const useIsMobile = (maxWidth = BREAKPOINTS.md - 1): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const handleChange = () => setIsMobile(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [maxWidth]);

  return isMobile;
};
