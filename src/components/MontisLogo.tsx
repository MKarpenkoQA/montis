import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import type { CSSProperties } from "react";
import { resolveMediaUrl } from "../lib/mediaUrl";
import { defaultSiteMedia } from "../content/defaults";

type MontisLogoProps = {
  className?: string;
  iconSize?: number;
  fillProgress?: MotionValue<number>;
  style?: CSSProperties;
  logoSrc?: string;
};

export const MontisLogo = ({
  className = "",
  iconSize = 72,
  fillProgress,
  style,
  logoSrc = defaultSiteMedia.logo,
}: MontisLogoProps) => {
  const fullSrc = resolveMediaUrl(logoSrc);
  const fallbackProgress = useMotionValue(100);
  const progress = fillProgress ?? fallbackProgress;
  const clipPath = useTransform(progress, (value) => `inset(${100 - value}% 0% 0% 0%)`);

  if (!fillProgress) {
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

  return (
    <div className={`relative shrink-0 ${className}`} style={{ height: iconSize, ...style }}>
      <img src={fullSrc} alt="" aria-hidden className="h-full w-auto object-contain opacity-25" decoding="async" />
      <motion.div className="absolute inset-0" style={{ clipPath }}>
        <img src={fullSrc} alt="MONTIS" className="h-full w-auto object-contain" decoding="async" />
      </motion.div>
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
  fillProgress,
  style,
  logoSrc,
}: MontisLogoLinkProps) => (
  <a
    href={href}
    aria-label="MONTIS — на главную"
    className={`inline-flex shrink-0 transition-opacity hover:opacity-80 ${className}`}
  >
    <MontisLogo iconSize={iconSize} fillProgress={fillProgress} style={style} logoSrc={logoSrc} />
  </a>
);
