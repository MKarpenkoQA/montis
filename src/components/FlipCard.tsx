import { type ReactNode } from "react";

type FlipCardProps = {
  flipped: boolean;
  onFlip: () => void;
  front: ReactNode;
  back: ReactNode;
  className?: string;
  heightClass?: string;
  ariaLabel?: string;
};

export const FlipCard = ({
  flipped,
  onFlip,
  front,
  back,
  className = "",
  heightClass = "h-[340px] sm:h-96",
  ariaLabel,
}: FlipCardProps) => (
  <button
    type="button"
    onClick={onFlip}
    aria-label={ariaLabel}
    aria-pressed={flipped}
    className={`flip-card-root block w-full text-left ${heightClass} ${className}`}
  >
    <div className={`flip-card-inner ${flipped ? "is-flipped" : ""}`}>
      <div className="flip-card-face flip-card-front">{front}</div>
      <div className="flip-card-face flip-card-back">{back}</div>
    </div>
  </button>
);
