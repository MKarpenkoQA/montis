import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { MontisLogo } from "./MontisLogo";
import { preloadCriticalContent } from "../preloadContent";
import type { SiteMedia } from "../content/types";

type PreloaderProps = {
  onDone: () => void;
  media: SiteMedia;
};

const PRELOADER_MIN_MS = 4000;
const PRELOADER_EXIT_MS = 420;

const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

export const Preloader = ({ onDone, media }: PreloaderProps) => {
  const progress = useMotionValue(0);
  const [display, setDisplay] = useState("00");

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      const t = Math.min(1, elapsed / PRELOADER_MIN_MS);
      const value = easeOutCubic(t) * 99;
      const rounded = Math.floor(value);
      setDisplay(String(rounded).padStart(2, "0"));
      progress.set(value);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    void Promise.all([
      preloadCriticalContent(media, () => {}),
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, PRELOADER_MIN_MS);
      }),
    ]).then(() => {
      if (cancelled) return;
      cancelAnimationFrame(rafId);
      setDisplay("100");
      progress.set(100);
      window.setTimeout(onDone, PRELOADER_EXIT_MS);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [media, onDone, progress]);

  const maskInset = useTransform(progress, [0, 100], [0, 100]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-montis-cream pt-safe pb-safe py-10 px-8"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex-1 flex items-center justify-center">
        <MontisLogo iconSize={88} fillProgress={maskInset} logoSrc={media.logo} />
      </div>
      <div className="w-full flex items-end">
        <span className="font-sans not-italic text-6xl md:text-8xl text-montis-navy leading-none tabular-nums">
          {display}
          <span className="text-montis-navy/40">%</span>
        </span>
      </div>
    </motion.div>
  );
};
