import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import type { CSSProperties } from "react";

const iconSrc = `${import.meta.env.BASE_URL}media/logo-montis-icon.png`;
const fullSrc = `${import.meta.env.BASE_URL}media/logo-montis.png`;

type MontisLogoProps = {
  className?: string;
  /** Icon height in px; wordmark scales with it. */
  iconSize?: number;
  /** Reveal fill on the icon from bottom to top (0–100). */
  fillProgress?: MotionValue<number>;
  /** Static full logo image instead of icon + wordmark. */
  variant?: "mark" | "full";
  style?: CSSProperties;
};

export const MontisLogo = ({
  className = "",
  iconSize = 72,
  fillProgress,
  variant = "mark",
  style,
}: MontisLogoProps) => {
  const fallbackProgress = useMotionValue(100);
  const progress = fillProgress ?? fallbackProgress;
  const clipPath = useTransform(progress, (v) => `inset(${100 - v}% 0% 0% 0%)`);

  if (variant === "full") {
    return (
      <img
        src={fullSrc}
        alt="MONTIS"
        className={`h-auto w-auto object-contain ${className}`}
        style={{ maxHeight: iconSize, ...style }}
        decoding="async"
      />
    );
  }

  const showFill = Boolean(fillProgress);

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`} style={style}>
      <div className="relative shrink-0" style={{ width: iconSize, height: iconSize }}>
        <img
          src={iconSrc}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain opacity-25"
          decoding="async"
        />
        {showFill ? (
          <motion.div className="absolute inset-0" style={{ clipPath }}>
            <img
              src={iconSrc}
              alt=""
              aria-hidden
              className="h-full w-full object-contain"
              decoding="async"
            />
          </motion.div>
        ) : (
          <img
            src={iconSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-contain"
            decoding="async"
          />
        )}
      </div>
      <span
        className="font-bold tracking-tighter text-montis-navy leading-none"
        style={{ fontSize: iconSize * 0.62 }}
      >
        MONTIS
      </span>
    </div>
  );
};

type MontisLogoLinkProps = MontisLogoProps & {
  href?: string;
};

export const MontisLogoLink = ({
  href = "#top",
  className = "",
  iconSize = 48,
  variant = "full",
}: MontisLogoLinkProps) => (
  <a
    href={href}
    aria-label="MONTIS — на главную"
    className={`inline-flex shrink-0 transition-opacity hover:opacity-80 ${className}`}
  >
    <MontisLogo variant={variant} iconSize={iconSize} />
  </a>
);
