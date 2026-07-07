/** Resolve a public media path against the Vite base URL. */
export const mediaUrl = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

/** Resolve a CMS media path (/media/... or media/...) to a full URL. */
export const resolveMediaUrl = (src: string): string => mediaUrl(src.replace(/^\//, ""));
