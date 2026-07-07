import { useEffect, type RefObject } from "react";

const PLAY_EVENTS = ["loadeddata", "canplay", "canplaythrough"] as const;

export const useMutedAutoplayVideo = (
  videoRef: RefObject<HTMLVideoElement | null>,
  videoSrc: string,
): void => {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      void video.play().catch(() => {});
    };

    tryPlay();
    for (const event of PLAY_EVENTS) {
      video.addEventListener(event, tryPlay);
    }

    return () => {
      for (const event of PLAY_EVENTS) {
        video.removeEventListener(event, tryPlay);
      }
    };
  }, [videoRef, videoSrc]);
};
