import { injectDeferredMediaHints } from "./mediaManifest";

const mediaUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const HERO_VIDEO = mediaUrl("media/montis-hero.mp4");
const HERO_POSTER = mediaUrl("media/mountain-lake-hero.jpg");
const LOGO_ICON = mediaUrl("media/logo-montis-icon.png");

const loadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

const loadHeroVideo = (onProgress: (ratio: number) => void) =>
  new Promise<void>((resolve) => {
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

    video.src = HERO_VIDEO;
    video.load();
  });

/** Phase 1: assets required before the preloader can finish. */
export const preloadCriticalContent = async (onProgress: (percent: number) => void) => {
  onProgress(0);

  await Promise.all([loadImage(LOGO_ICON), loadImage(HERO_POSTER)]);
  onProgress(8);

  await loadHeroVideo((ratio) => {
    onProgress(8 + ratio * 92);
  });

  onProgress(100);
};

/** Phase 2: below-the-fold media, fetched after hero is ready. */
export const prefetchSecondaryContent = () => {
  const run = () => {
    injectDeferredMediaHints();
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 2500 });
  } else {
    window.setTimeout(run, 200);
  }
};
