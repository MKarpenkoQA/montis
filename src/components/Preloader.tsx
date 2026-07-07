import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { MontisLogo } from "./MontisLogo";
import { preloadCriticalContent } from "../preloadContent";
import type { SiteMedia } from "../content/types";

type PreloaderProps = {
  onDone: () => void;
  media: SiteMedia;
};

export const Preloader = ({ onDone, media }: PreloaderProps) => {
  const progress = useMotionValue(0);
  const [display, setDisplay] = useState("00");

  useEffect(() => {
    let cancelled = false;

    void preloadCriticalContent(media, (value: number) => {
      if (cancelled) return;
      const rounded = Math.min(100, Math.floor(value));
      setDisplay(String(rounded).padStart(2, "0"));
      progress.set(value);
    }).then(() => {
      if (cancelled) return;
      setTimeout(onDone, 420);
    });

    return () => {
      cancelled = true;
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
