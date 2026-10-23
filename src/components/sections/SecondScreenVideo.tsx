import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import { Mountain, Droplets, ShieldCheck, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowGlyph } from "../ui/ArrowGlyph";
import { ResponsiveImage } from "../ui/ResponsiveImage";
import { useAdvantageOpacities } from "../../hooks/useAdvantageOpacities";
import { useIsMobile } from "../../hooks/useIsMobile";
import { resolveMediaUrl } from "../../lib/mediaUrl";
import type { Advantage, SiteMedia, TranslationBundle } from "../../content/types";

const ADVANTAGE_ICONS = [Mountain, Droplets, ShieldCheck, Sparkles] as const;

const MOBILE_ADV_SLOTS = ["38%", "49%", "60%", "71%"] as const;

const DESKTOP_ADVANTAGE_POSITIONS = [
  "left-[6%] md:left-[12%] top-[44%] max-w-[240px]",
  "right-[14%] md:right-[18%] top-[46%] max-w-[240px]",
  "left-[6%] md:left-[12%] bottom-[22%] max-w-[240px]",
  "right-[14%] md:right-[18%] bottom-[20%] max-w-[240px]",
] as const;

const INTRO_FADE_END = 0.12;

const getVideoMimeType = (src: string): "video/mp4" | "video/webm" => {
  const path = src.split(/[?#]/, 1)[0].toLowerCase();
  return path.endsWith(".webm") ? "video/webm" : "video/mp4";
};

type SecondScreenVideoProps = {
  t: TranslationBundle;
  media: SiteMedia;
};

const MobileAdvantages = ({
  advantages,
  expandedIndex,
  onToggle,
}: {
  advantages: Advantage[];
  expandedIndex: number | null;
  onToggle: (index: number) => void;
}) => (
  <div className="absolute inset-0 z-35 pointer-events-none">
    {advantages.map((advantage, index) => {
      const Icon = ADVANTAGE_ICONS[index] ?? Sparkles;
      const expanded = expandedIndex === index;
      const hidden = expandedIndex !== null && !expanded;

      return (
        <motion.div
          key={advantage.title}
          className="absolute left-4 flex items-center pointer-events-auto"
          initial={false}
          animate={{ opacity: hidden ? 0 : 1, scale: hidden ? 0.92 : 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ top: MOBILE_ADV_SLOTS[index], pointerEvents: hidden ? "none" : "auto" }}
        >
          <button
            type="button"
            aria-expanded={expanded}
            aria-label={advantage.title}
            onClick={() => onToggle(index)}
            className="flex items-center text-left"
          >
            <span className="w-11 h-11 shrink-0 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-montis-blue" />
            </span>
            <motion.div
              initial={false}
              animate={{
                width: expanded ? 200 : 0,
                opacity: expanded ? 1 : 0,
                marginLeft: expanded ? 12 : 0,
              }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden shrink-0"
              aria-hidden={!expanded}
            >
              <div className="w-[200px] rounded-xl border border-white/15 bg-black/85 backdrop-blur-sm p-3">
                <p className="eyebrow-s text-white mb-1 leading-tight">{advantage.title}</p>
                <p className="text-[10px] text-white/70 leading-snug">{advantage.text}</p>
              </div>
            </motion.div>
          </button>
        </motion.div>
      );
    })}
  </div>
);

const DesktopAdvantages = ({
  advantages,
  opacities,
}: {
  advantages: Advantage[];
  opacities: readonly [MotionValue<number>, MotionValue<number>, MotionValue<number>, MotionValue<number>];
}) => (
  <div className="absolute inset-0 z-35 pointer-events-none">
    {advantages.map((advantage, index) => {
      const Icon = ADVANTAGE_ICONS[index] ?? Sparkles;
      return (
        <motion.div
          key={advantage.title}
          className={`absolute ${DESKTOP_ADVANTAGE_POSITIONS[index]} flex gap-4 items-start`}
          style={{ opacity: opacities[index] }}
        >
          <span className="shrink-0 w-12 h-12 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-montis-blue" />
          </span>
          <div>
            <p className="eyebrow-s text-white mb-0.5 leading-tight">{advantage.title}</p>
            <p className="text-[10px] md:text-[11px] text-white/70 leading-snug">{advantage.text}</p>
          </div>
        </motion.div>
      );
    })}
  </div>
);

export const SecondScreenVideo = ({ t, media }: SecondScreenVideoProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasStartedRef = useRef(false);
  const isMobile = useIsMobile();
  const [videoReady, setVideoReady] = useState(false);
  const [depthDisplay, setDepthDisplay] = useState(0);
  const [mobileExpandedAdv, setMobileExpandedAdv] = useState<number | null>(null);

  const videoSrc = resolveMediaUrl(media.sourceVideo);
  const posterSrc = resolveMediaUrl(media.sourcePoster);
  const mobileImageSrc = resolveMediaUrl(media.sourceMobileImage);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["center center", "end center"] });
  const maxScrollProgress = useMotionValue(0);
  const introBlackOpacity = useTransform(maxScrollProgress, [0, 0.05, INTRO_FADE_END], [1, 1, 0]);
  const textBlockY = useTransform(maxScrollProgress, [0.1, 0.35], [180, 0]);
  const textBlockOpacity = useTransform(maxScrollProgress, [0.1, 0.28], [0, 1]);
  const depthBlockY = useTransform(maxScrollProgress, [0.16, 0.42], [180, 0]);
  const depthBlockOpacity = useTransform(maxScrollProgress, [0.16, 0.34], [0, 1]);
  const currentDepth = useTransform(maxScrollProgress, (value) => Math.round(value * t.source.depthMax));
  const advantageOpacities = useAdvantageOpacities(maxScrollProgress);

  useEffect(() => {
    const syncMax = (value: number) => {
      const clamped = Math.max(0, Math.min(1, value));
      if (clamped > maxScrollProgress.get()) maxScrollProgress.set(clamped);
    };
    syncMax(scrollYProgress.get());
    return scrollYProgress.on("change", syncMax);
  }, [scrollYProgress, maxScrollProgress]);

  useEffect(() => currentDepth.on("change", (value) => setDepthDisplay(Math.round(value))), [currentDepth]);

  const tryPlayVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video || !videoReady || hasStartedRef.current || video.ended) return;
    void video.play().then(() => {
      hasStartedRef.current = true;
    }).catch(() => {});
  }, [videoReady]);

  const freezeOnLastFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.pause();
    video.currentTime = Math.max(0, video.duration - 0.05);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const maybePlay = (progress: number) => {
      if (progress >= INTRO_FADE_END) tryPlayVideo();
    };
    maybePlay(maxScrollProgress.get());
    return maxScrollProgress.on("change", maybePlay);
  }, [isMobile, maxScrollProgress, tryPlayVideo]);

  const handleMobileToggle = (index: number) => {
    setMobileExpandedAdv((current) => (current === index ? null : index));
  };

  return (
    <section ref={sectionRef} id="video" className="relative h-[320svh] w-full !bg-black">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="section-motion-layer absolute inset-0 !bg-black" style={{ backgroundColor: "#000" }} aria-hidden="true">
          {isMobile ? (
            <ResponsiveImage
              src={mobileImageSrc}
              alt=""
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
              className="absolute inset-0 z-0 h-full w-full object-contain scale-[0.78]"
            />
          ) : (
            <>
              <img
                src={posterSrc}
                alt=""
                aria-hidden
                className={`absolute inset-0 z-0 h-full w-full object-contain transition-opacity duration-700 ${
                  videoReady ? "opacity-0" : "opacity-100"
                }`}
                decoding="async"
              />
              <video
                ref={videoRef}
                className={`absolute inset-0 z-0 h-full w-full object-contain transition-opacity duration-700 ${
                  videoReady ? "opacity-100" : "opacity-0"
                }`}
                muted
                playsInline
                preload="auto"
                poster={posterSrc}
                disablePictureInPicture
                aria-hidden
                onCanPlayThrough={() => setVideoReady(true)}
                onEnded={freezeOnLastFrame}
              >
                <source src={videoSrc} type={getVideoMimeType(media.sourceVideo)} />
              </video>
              <div className="absolute -right-[10%] md:-right-[20%] top-[-10%] z-10 h-[70%] md:h-[85%] w-[60%] md:w-[55%] rounded-full bg-gradient-to-bl from-montis-blue/[0.07] via-transparent to-transparent blur-3xl" />
              <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_80%_50%_at_70%_0%,rgba(26,43,86,0.06),transparent)]" />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
              <motion.div className="absolute inset-0 z-20 bg-black" style={{ opacity: introBlackOpacity }} />
              <motion.div
                className="absolute inset-0 z-25 flex items-center justify-center px-6 text-center"
                style={{ opacity: introBlackOpacity }}
              >
                <p className="font-sans not-italic text-3xl md:text-5xl leading-tight text-white max-w-4xl">
                  {t.source.introLine}
                </p>
              </motion.div>
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 bottom-8 z-30 flex flex-col items-center gap-2 text-white/80"
                style={{ opacity: introBlackOpacity }}
              >
                <span className="eyebrow-s">{t.source.scrollHint}</span>
                <div className="relative h-10 w-[21px] overflow-hidden">
                  <ArrowGlyph
                    className="absolute left-0 top-0 rotate-90"
                    style={{ animation: "scroll-arrow 2.2s ease-in-out infinite" }}
                  />
                </div>
              </motion.div>
            </>
          )}
        </div>

        {isMobile ? (
          <MobileAdvantages
            advantages={t.source.advantages}
            expandedIndex={mobileExpandedAdv}
            onToggle={handleMobileToggle}
          />
        ) : (
          <DesktopAdvantages advantages={t.source.advantages} opacities={advantageOpacities} />
        )}

        <div className="absolute inset-0 z-40 pointer-events-none site-container pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-14">
          <div className="relative w-full h-full">
            <motion.div
              className="absolute left-0 top-0 z-10 max-w-[78vw] sm:max-w-md text-left"
              style={isMobile ? { y: 0, opacity: 1 } : { y: textBlockY, opacity: textBlockOpacity }}
            >
              <h2 className="font-sans not-italic text-[9vw] sm:text-3xl md:text-5xl leading-[0.95] tracking-tight whitespace-pre-line text-white">
                {t.source.title}
              </h2>
              <p className="eyebrow text-white/75 mt-3 md:mt-4 max-w-sm leading-relaxed normal-case">
                {t.source.text}
              </p>
            </motion.div>

            <motion.div
              className="absolute right-0 top-[12%] bottom-[4%] md:bottom-[2%] w-20 md:w-24"
              style={isMobile ? { y: 0, opacity: 1 } : { y: depthBlockY, opacity: depthBlockOpacity }}
            >
              <div className="relative h-full">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-32 md:bottom-36 w-px bg-white/20" />
                <div className="absolute inset-x-0 top-0 bottom-32 md:bottom-36">
                  {t.source.depthScale.map((mark) => {
                    const active = depthDisplay >= mark;
                    const percent = (mark / t.source.depthMax) * 100;
                    return (
                      <div
                        key={mark}
                        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5"
                        style={{ bottom: `${percent}%`, transform: "translate(-50%, 50%)" }}
                      >
                        <span
                          className={`eyebrow-s tabular-nums text-[9px] md:text-[10px] ${
                            active ? "text-white" : "text-white/45"
                          }`}
                        >
                          {mark}
                        </span>
                        <span
                          className={`h-1 w-1 rounded-full shrink-0 ${
                            active ? "bg-montis-blue shadow-[0_0_6px_rgba(42,159,196,0.7)]" : "bg-white/30"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="absolute -bottom-2 md:-bottom-4 left-1/2 -translate-x-1/2 text-center w-28 md:w-32">
                  <p className="eyebrow text-white/75 text-[9px] md:text-[10px] leading-snug whitespace-pre-line">
                    {t.source.depthLabel}
                  </p>
                  <p className="font-sans not-italic text-4xl md:text-5xl text-white tabular-nums leading-none mt-2">
                    {depthDisplay}
                  </p>
                  <p className="eyebrow text-white/75 mt-1 text-[9px] md:text-[10px]">{t.source.depthUnit}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
