import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { RevealLines } from "../ui/RevealLines";
import { getPreloadedHeroVideoSrc } from "../../preloadContent";
import { useMutedAutoplayVideo } from "../../hooks/useMutedAutoplayVideo";
import { isDesktopViewport } from "../../lib/networkAware";
import { getOptimalMediaUrl, normalizeMediaPath } from "../../lib/responsiveMedia";
import { resolveMediaUrl } from "../../lib/mediaUrl";
import type { SiteMedia, TranslationBundle } from "../../content/types";

type HeroProps = {
  t: TranslationBundle;
  media: SiteMedia;
};

export const Hero = ({ t, media }: HeroProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = getPreloadedHeroVideoSrc(resolveMediaUrl(media.heroVideo));
  const posterPath = normalizeMediaPath(media.heroPoster) ?? "media/mountain-lake-hero.jpg";
  const posterSrc =
    typeof window !== "undefined"
      ? getOptimalMediaUrl(posterPath)
      : resolveMediaUrl(`${posterPath.replace(/\.[^.]+$/, "")}-828.webp`);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.25, 0.6]);

  useMutedAutoplayVideo(videoRef, videoSrc);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-[100dvh] w-full overflow-hidden bg-montis-navy text-white"
    >
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover object-[56%_center]"
          autoPlay
          muted
          loop
          playsInline
          preload={isDesktopViewport() ? "auto" : "metadata"}
          poster={posterSrc}
          width={1920}
          height={1080}
          aria-hidden
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <motion.div
          style={{ opacity: overlay }}
          className="absolute inset-0 bg-gradient-to-b from-montis-navy/40 via-montis-navy/10 to-montis-navy"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-[12vh] right-[var(--spacing-site-x)] max-w-xs text-right hidden sm:block"
      >
        <div className="eyebrow text-white/70 mb-3">{t.hero.eyebrow}</div>
        <RevealLines
          as="p"
          className="font-sans not-italic text-xl sm:text-2xl md:text-3xl text-white leading-tight"
          text={t.hero.subtitle}
          delay={0.4}
        />
      </motion.div>

      <motion.div
        style={{ y: textY }}
        className="absolute left-0 right-0 bottom-0 site-container pb-[clamp(4rem,10vh,6rem)]"
      >
        <RevealLines
          as="h1"
          className="font-sans not-italic text-hero-display text-white tracking-tighter"
          text={t.hero.title}
        />
      </motion.div>
    </section>
  );
};
