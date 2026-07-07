/** Canonical breakpoints — aligned with Tailwind defaults. */
export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

export const mediaQuery = {
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  "2xl": `(min-width: ${BREAKPOINTS["2xl"]}px)`,
  "3xl": `(min-width: ${BREAKPOINTS["3xl"]}px)`,
  mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
} as const;
