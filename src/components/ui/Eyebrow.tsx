import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
};

export const Eyebrow = ({ children, className = "" }: EyebrowProps) => (
  <span className={`eyebrow inline-flex items-center gap-2 ${className}`}>{children}</span>
);
