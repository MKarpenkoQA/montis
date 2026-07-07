import type { CSSProperties, MouseEvent } from "react";
import { ArrowGlyph } from "./ArrowGlyph";
import { scrollToSection } from "../../lib/scrollToSection";

type ArrowPillVariant = "filled" | "outline" | "light";

type ArrowPillButtonProps = {
  href?: string;
  scrollToId?: string;
  label: string;
  variant?: ArrowPillVariant;
  labelClassName?: string;
  arrowStyle?: CSSProperties;
  className?: string;
  target?: string;
  rel?: string;
};

const VARIANT_STYLES: Record<ArrowPillVariant, { button: string; label: string; hover: string }> = {
  filled: {
    button: "bg-montis-navy text-white",
    label: "eyebrow-s",
    hover: "bg-montis-blue",
  },
  outline: {
    button: "border border-montis-navy text-montis-navy",
    label: "eyebrow-s",
    hover: "bg-montis-navy",
  },
  light: {
    button: "bg-white text-montis-navy",
    label: "eyebrow text-[10px] sm:text-[11px]",
    hover: "bg-montis-navy",
  },
};

export const ArrowPillButton = ({
  href,
  scrollToId,
  label,
  variant = "filled",
  labelClassName = "",
  arrowStyle,
  className = "",
  target,
  rel,
}: ArrowPillButtonProps) => {
  const styles = VARIANT_STYLES[variant];

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!scrollToId) return;
    event.preventDefault();
    scrollToSection(scrollToId);
  };

  return (
    <a
      href={scrollToId ? "#" : href}
      onClick={handleClick}
      target={target}
      rel={rel}
      className={`group relative inline-flex min-h-[44px] items-center gap-2 sm:gap-3 rounded-full overflow-hidden transition-transform duration-200 btn-press ${styles.button} ${className}`}
    >
      <span className={`${styles.label} relative z-10 transition-colors duration-500 group-hover:text-white ${labelClassName}`}>
        {label}
      </span>
      <ArrowGlyph
        className="relative z-10 shrink-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-white"
        style={arrowStyle}
      />
      <span
        className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${styles.hover}`}
      />
    </a>
  );
};
