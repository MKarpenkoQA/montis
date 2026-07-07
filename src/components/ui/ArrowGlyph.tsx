import type { CSSProperties } from "react";

type ArrowGlyphProps = {
  className?: string;
  style?: CSSProperties;
};

export const ArrowGlyph = ({ className = "", style }: ArrowGlyphProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="16"
    viewBox="0 0 21 16"
    className={className}
    style={style}
    aria-hidden
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12.421.236c-.018.118.018.851.061 1.234.212 1.904.977 3.56 2.204 4.775.517.511 1.005.878 1.711 1.287l.349.203-8.277.009-8.276.009-.01.498-.01.499 8.305.001h8.305l-.282.151c-1.872 1.006-3.189 2.665-3.757 4.732-.181.659-.319 1.571-.319 2.107v.254h.97l.024-.376c.07-1.114.33-2.133.764-3.001.817-1.634 2.281-2.826 4.249-3.459.711-.229 1.704-.409 2.255-.409h.243V7.735l-.289-.001c-.344 0-.893-.071-1.371-.175-2.447-.533-4.351-1.975-5.221-3.954-.375-.854-.587-1.818-.633-2.879L13.394.21h-.484c-.267 0-.487.012-.489.026"
      clipRule="evenodd"
    />
  </svg>
);
