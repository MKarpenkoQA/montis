import { injectNearFoldHints } from "./mediaManifest";
import { isDesktopViewport } from "./lib/networkAware";
import { resolveMediaUrl } from "./lib/mediaUrl";
import { getOptimalMediaUrl, normalizeMediaPath } from "./lib/responsiveMedia";
import type { SiteMedia } from "./content/types";

let heroVideoBlobUrl: string | null = null;
let heroVideoBlobSourceUrl: string | null = null;
let activeHeroVideoPreloadUrl: string | null = null;

export type PreloadPhase = "idle" | "critical" | "ready";

/** Use the blob URL created during preload so hero playback starts instantly on desktop. */
export const getPreloadedHeroVideoSrc = (fallback: string): string =>
  heroVideoBlobSourceUrl === fallback && heroVideoBlobUrl ? heroVideoBlobUrl : fallback;

const revokePreloadedHeroVideo = (): void => {
  if (heroVideoBlobUrl) {
    URL.revokeObjectURL(heroVideoBlobUrl);
  }
  heroVideoBlobUrl = null;
  heroVideoBlobSourceUrl = null;
};

const beginHeroVideoPreload = (heroVideoUrl: string): void => {
  activeHeroVideoPreloadUrl = heroVideoUrl;
  if (heroVideoBlobSourceUrl !== heroVideoUrl) {
    revokePreloadedHeroVideo();
  }
};

const storePreloadedHeroVideo = (heroVideoUrl: string, blob: Blob): boolean => {
  if (activeHeroVideoPreloadUrl !== heroVideoUrl) return false;

  revokePreloadedHeroVideo();
  heroVideoBlobUrl = URL.createObjectURL(blob);
  heroVideoBlobSourceUrl = heroVideoUrl;
  return true;
};

const loadImage = (src: string): Promise<void> =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });

const loadHeroVideoWithFetch = async (
  heroVideoUrl: string,
  onProgress: (ratio: number) => void,
): Promise<boolean> => {
  try {
    const response = await fetch(heroVideoUrl, { cache: "force-cache" });
    if (!response.ok) return false;

    const contentLength = Number(response.headers.get("content-length")) || 0;
    const body = response.body;

    if (!body) {
      const blob = await response.blob();
      if (!storePreloadedHeroVideo(heroVideoUrl, blob)) return true;
      onProgress(1);
      return true;
    }

    const reader = body.getReader();
    const chunks: BlobPart[] = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      if (contentLength > 0) {
        onProgress(Math.min(0.98, received / contentLength));
      }
    }

    const blob = new Blob(chunks, { type: "video/mp4" });
    if (!storePreloadedHeroVideo(heroVideoUrl, blob)) return true;
    onProgress(1);
    return true;
  } catch {
    return false;
  }
};

const loadHeroVideoWithElement = (
  heroVideoUrl: string,
  onProgress: (ratio: number) => void,
): Promise<void> =>
  new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      onProgress(1);
      resolve();
    };

    const update = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return;
      if (video.buffered.length === 0) return;
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      onProgress(Math.min(1, bufferedEnd / video.duration));
    };

    video.addEventListener("progress", update);
    video.addEventListener("loadedmetadata", update);
    video.addEventListener("canplaythrough", finish, { once: true });
    video.addEventListener("error", finish, { once: true });

    const timeout = window.setTimeout(finish, 12_000);
    video.src = heroVideoUrl;
    video.load();
  });

const loadHeroVideo = async (
  heroVideoUrl: string,
  onProgress: (ratio: number) => void,
): Promise<void> => {
  const fetched = await loadHeroVideoWithFetch(heroVideoUrl, onProgress);
  if (!fetched) {
    await loadHeroVideoWithElement(heroVideoUrl, onProgress);
  }
};

const getHeroPosterUrl = (poster: string): string => {
  const posterPath = normalizeMediaPath(poster) ?? "media/mountain-lake-hero.jpg";
  return typeof window !== "undefined"
    ? getOptimalMediaUrl(posterPath)
    : resolveMediaUrl(`${posterPath.replace(/\.[^.]+$/, "")}-828.webp`);
};

/**
 * Phase 1: critical above-the-fold assets for the preloader.
 * Mobile skips full hero video download to save bandwidth.
 */
export const preloadCriticalContent = async (
  media: SiteMedia,
  onProgress: (percent: number) => void,
): Promise<void> => {
  onProgress(0);

  const logoUrl = resolveMediaUrl(media.logo);
  const posterUrl = getHeroPosterUrl(media.heroPoster);
  const heroVideoUrl = resolveMediaUrl(media.heroVideo);
  beginHeroVideoPreload(heroVideoUrl);

  await Promise.all([loadImage(logoUrl), loadImage(posterUrl)]);
  onProgress(8);

  if (isDesktopViewport()) {
    await loadHeroVideo(heroVideoUrl, (ratio) => {
      onProgress(8 + ratio * 92);
    });
  } else {
    onProgress(100);
    return;
  }

  onProgress(100);
};

/** Phase 2: near-fold media via idle callback — does not block main thread. */
export const prefetchSecondaryContent = (): void => {
  const run = () => {
    injectNearFoldHints();
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 2500 });
  } else {
    setTimeout(run, 200);
  }
};
