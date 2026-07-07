import type { ImgHTMLAttributes } from "react";
import { getWebpSrcSet } from "../../lib/responsiveMedia";

type ResponsiveImageProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  srcSet?: string;
  width?: number;
  height?: number;
  ariaHidden?: boolean;
} & Pick<ImgHTMLAttributes<HTMLImageElement>, "referrerPolicy">;

export const ResponsiveImage = ({
  src,
  alt,
  className = "",
  loading = "lazy",
  fetchPriority,
  sizes,
  srcSet,
  width,
  height,
  ariaHidden,
  referrerPolicy,
}: ResponsiveImageProps) => {
  const webpSrcSet = getWebpSrcSet(src);
  const hidden = ariaHidden ?? (alt === "" ? true : undefined);

  const img = (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      sizes={sizes}
      srcSet={srcSet}
      width={width}
      height={height}
      fetchPriority={fetchPriority}
      referrerPolicy={referrerPolicy}
      aria-hidden={hidden}
    />
  );

  if (!webpSrcSet) return img;

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      {img}
    </picture>
  );
};
