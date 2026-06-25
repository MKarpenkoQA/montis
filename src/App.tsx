/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
  useInView,
} from "motion/react";
import {
  Instagram,
  Send,
  Phone,
  MapPin,
  ChevronDown,
  Globe,
  Mountain,
  Droplets,
  ShieldCheck,
  Sparkles,
  Filter,
  Sun,
  Wind,
  Layers,
} from "lucide-react";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react";
import { MontisLogo, MontisLogoLink } from "./components/MontisLogo";
import { FlipCard } from "./components/FlipCard";
import {
  getPreloadedHeroVideoSrc,
  preloadCriticalContent,
  prefetchSecondaryContent,
} from "./preloadContent";
import { registerServiceWorker } from "./serviceWorkerRegistration";
import type { Language, SiteContent, TranslationBundle } from "./content/types";
import { useSiteContent } from "./hooks/useSiteContent";

/* ------------------------------------------------------------------ */
/* Reusable atoms                                                      */
/* ------------------------------------------------------------------ */

/** The signature curly arrow glyph used across baikal430 – reused for buttons,
 *  list items and the hero scroll cue. */
const ArrowGlyph = ({ className = "", style }: { className?: string; style?: CSSProperties }) => (
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

/** A horizontal rule that draws itself from left to right when it enters view. */
const AnimatedLine = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <span
      ref={ref}
      className={`animated-line ${inView ? "in-view" : ""} ${className}`}
      aria-hidden
    />
  );
};

/** A word-mask reveal that pushes text up from below as it enters view. */
const RevealLines = ({
  text,
  className = "",
  delay = 0,
  as = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const lines = text.split("\n");
  const Tag = as as any;
  return (
    <Tag ref={ref as any} className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          className="block overflow-hidden leading-[1.05] pb-[0.05em]"
        >
          <motion.span
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 0.9, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

/** Small eyebrow label like `✦ УНИКАЛЬНОСТЬ` with wide tracking. */
const Eyebrow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <span className={`eyebrow inline-flex items-center gap-2 ${className}`}>{children}</span>
);

/* ------------------------------------------------------------------ */
/* Preloader                                                           */
/* ------------------------------------------------------------------ */

const Preloader = ({ onDone }: { onDone: () => void }) => {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("00");

  useEffect(() => {
    let cancelled = false;

    void preloadCriticalContent((progress) => {
      if (cancelled) return;
      const rounded = Math.min(100, Math.floor(progress));
      setDisplay(String(rounded).padStart(2, "0"));
      mv.set(progress);
    }).then(() => {
      if (cancelled) return;
      setTimeout(onDone, 420);
    });

    return () => {
      cancelled = true;
    };
  }, [mv, onDone]);

  const maskInset = useTransform(mv, [0, 100], [0, 100]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-montis-cream py-10 px-8"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex-1 flex items-center justify-center">
        <MontisLogo iconSize={88} fillProgress={maskInset} />
      </div>

      <div className="w-full flex items-end">
        <span className="font-serif text-6xl md:text-8xl text-montis-navy leading-none tabular-nums">
          {display}
          <span className="text-montis-navy/40">%</span>
        </span>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Hide-on-scroll hook                                                 */
/* ------------------------------------------------------------------ */

const useScrollDirection = () => {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 64) setHidden(false);
      else if (y > lastY + 4) setHidden(true);
      else if (y < lastY - 4) setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
};

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

const Header = ({
  t,
  lang,
  setLang,
  isLangOpen,
  setIsLangOpen,
}: {
  t: TranslationBundle;
  lang: Language;
  setLang: (l: Language) => void;
  isLangOpen: boolean;
  setIsLangOpen: (v: boolean) => void;
}) => {
  const hidden = useScrollDirection();
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hidden ? "header-hidden" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 md:px-12 py-3 sm:py-4 md:py-5 backdrop-blur-md bg-montis-cream/70 border-b border-montis-ink/10">
        <MontisLogoLink iconSize={36} variant="full" className="max-w-[140px] sm:max-w-[160px] md:max-w-none" />

        <nav className="hidden md:flex items-center gap-10">
          <a href="#video" className="eyebrow text-montis-ink/80 hover:text-montis-navy transition-colors">
            {t.nav.source}
          </a>
          <a href="#composition" className="eyebrow text-montis-ink/80 hover:text-montis-navy transition-colors">
            {t.nav.composition}
          </a>
          <a href="#purification" className="eyebrow text-montis-ink/80 hover:text-montis-navy transition-colors">
            {t.nav.purification}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-montis-ink/15 hover:border-montis-navy/40 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-montis-navy" />
              <span className="eyebrow-s">{lang}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-28 bg-montis-cream rounded-xl shadow-xl border border-montis-ink/10 overflow-hidden"
                >
                  {(["ru", "uz", "en"] as Language[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setIsLangOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left eyebrow-s transition-colors ${
                        lang === l ? "bg-montis-navy text-white" : "text-montis-ink hover:bg-montis-ink/5"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="#contact"
            className="group relative inline-flex min-h-[44px] items-center gap-2 sm:gap-3 pl-4 sm:pl-5 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-montis-navy text-white rounded-full overflow-hidden"
          >
            <span className="eyebrow-s relative z-10 truncate max-w-[30vw] sm:max-w-none">{t.buy}</span>
            <span className="relative z-10 w-4 h-4 overflow-hidden inline-block shrink-0">
              <ArrowGlyph
                className="absolute inset-0 m-auto"
                style={{ animation: "arrow-loop 1.6s ease-in-out infinite" }}
              />
            </span>
            <span className="absolute inset-0 bg-montis-blue translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          </a>
        </div>
      </div>
    </header>
  );
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const Hero = ({ t }: { t: TranslationBundle }) => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = getPreloadedHeroVideoSrc();
  const posterSrc = `${import.meta.env.BASE_URL}media/mountain-lake-hero.jpg`;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.25, 0.6]);

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

    const playEvents = ["loadeddata", "canplay", "canplaythrough"] as const;
    tryPlay();
    for (const event of playEvents) {
      video.addEventListener(event, tryPlay);
    }

    return () => {
      for (const event of playEvents) {
        video.removeEventListener(event, tryPlay);
      }
    };
  }, [videoSrc]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-[100svh] w-full overflow-hidden bg-montis-navy text-white"
    >
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover object-[56%_center]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterSrc}
          aria-hidden
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <motion.div
          style={{ opacity: overlay }}
          className="absolute inset-0 bg-gradient-to-b from-montis-navy/40 via-montis-navy/10 to-montis-navy"
        />
      </motion.div>

      {/* Eyebrow corner label, like baikal430's top-right caption */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-[12vh] right-6 md:right-12 max-w-xs text-right hidden sm:block"
      >
        <div className="eyebrow text-white/70 mb-3">{t.hero.eyebrow}</div>
        <RevealLines
          as="p"
          className="font-serif text-2xl md:text-3xl text-white leading-tight"
          text={t.hero.subtitle}
          delay={0.4}
        />
      </motion.div>

      {/* Giant wordmark, appears to push up from the bottom edge */}
      <motion.div
        style={{ y: textY }}
        className="absolute left-0 right-0 bottom-0 px-4 sm:px-6 md:px-12 pb-16 sm:pb-18 md:pb-24"
      >
        <RevealLines
          as="h1"
          className="font-serif text-[16vw] sm:text-[14vw] md:text-[11vw] leading-[0.9] text-white tracking-tighter"
          text={t.hero.title}
        />
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Second screen video                                                 */
/* ------------------------------------------------------------------ */

const ADVANTAGE_ICONS = [Mountain, Droplets, ShieldCheck, Sparkles] as const;
const PURIFICATION_ICONS = [Filter, Sun, Wind, Layers] as const;

const SecondScreenVideo = ({ t }: { t: TranslationBundle }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasStartedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoSrc = `${import.meta.env.BASE_URL}media/montis-bottle.mp4`;
  const mobileImageSrc = `${import.meta.env.BASE_URL}media/black.png`;
  const posterSrc = `${import.meta.env.BASE_URL}media/montis-bottle-poster.jpg`;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["center center", "end center"] });
  // Progress only moves forward — elements stay locked when scrolling back up.
  const maxScrollProgress = useMotionValue(0);
  // Intro text fades out between 0.05–0.12 scroll progress.
  const INTRO_FADE_END = 0.12;
  const introBlackOpacity = useTransform(maxScrollProgress, [0, 0.05, INTRO_FADE_END], [1, 1, 0]);
  const textBlockY = useTransform(maxScrollProgress, [0.1, 0.35], [180, 0]);
  const textBlockOpacity = useTransform(maxScrollProgress, [0.1, 0.28], [0, 1]);
  const depthBlockY = useTransform(maxScrollProgress, [0.16, 0.42], [180, 0]);
  const depthBlockOpacity = useTransform(maxScrollProgress, [0.16, 0.34], [0, 1]);
  const currentDepth = useTransform(maxScrollProgress, (v) => Math.round(v * t.source.depthMax));
  const advantageOpacity0 = useTransform(maxScrollProgress, [0.16, 0.24], [0, 1]);
  const advantageOpacity1 = useTransform(maxScrollProgress, [0.24, 0.32], [0, 1]);
  const advantageOpacity2 = useTransform(maxScrollProgress, [0.32, 0.40], [0, 1]);
  const advantageOpacity3 = useTransform(maxScrollProgress, [0.40, 0.48], [0, 1]);
  const advantageOpacities = [advantageOpacity0, advantageOpacity1, advantageOpacity2, advantageOpacity3];
  const [depthDisplay, setDepthDisplay] = useState(0);

  useEffect(() => {
    const syncMax = (v: number) => {
      const clamped = Math.max(0, Math.min(1, v));
      if (clamped > maxScrollProgress.get()) maxScrollProgress.set(clamped);
    };
    syncMax(scrollYProgress.get());
    return scrollYProgress.on("change", syncMax);
  }, [scrollYProgress, maxScrollProgress]);

  useEffect(() => {
    return currentDepth.on("change", (v) => setDepthDisplay(Math.round(v)));
  }, [currentDepth]);

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
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Start playback only after the intro line has fully faded out.
  useEffect(() => {
    if (isMobile) return;

    const maybePlay = (progress: number) => {
      if (progress >= INTRO_FADE_END) tryPlayVideo();
    };

    maybePlay(maxScrollProgress.get());
    const unsubscribe = maxScrollProgress.on("change", maybePlay);
    return () => unsubscribe();
  }, [isMobile, maxScrollProgress, tryPlayVideo]);

  return (
    <section ref={sectionRef} id="video" className="relative h-[320svh] w-full bg-black">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          className={`section-motion-layer absolute inset-0 ${isMobile ? "bg-black" : "bg-black"}`}
          aria-hidden="true"
        >
          {isMobile ? (
            <img
              src={mobileImageSrc}
              alt=""
              aria-hidden
              className="absolute inset-0 z-0 h-full w-full object-contain scale-[0.78]"
              loading="eager"
              decoding="async"
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
                <source src={videoSrc} type="video/mp4" />
              </video>
            </>
          )}
          {!isMobile && <div className="absolute -right-[10%] md:-right-[20%] top-[-10%] z-10 h-[70%] md:h-[85%] w-[60%] md:w-[55%] rounded-full bg-gradient-to-bl from-montis-blue/[0.07] via-transparent to-transparent blur-3xl"></div>}
          {!isMobile && <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_80%_50%_at_70%_0%,rgba(26,43,86,0.06),transparent)]"></div>}
          {!isMobile && <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-black/30"></div>}
          {!isMobile && <motion.div className="absolute inset-0 z-20 bg-black" style={{ opacity: introBlackOpacity }} />}
          {!isMobile && (
            <motion.div
              className="absolute inset-0 z-25 flex items-center justify-center px-6 text-center"
              style={{ opacity: introBlackOpacity }}
            >
              <p className="font-serif text-3xl md:text-5xl leading-tight text-white max-w-4xl">
                {t.source.introLine}
              </p>
            </motion.div>
          )}
          {!isMobile && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 bottom-8 z-30 flex flex-col items-center gap-2 text-white/80"
              style={{ opacity: introBlackOpacity }}
            >
              <span className="eyebrow-s">scroll down</span>
              <div className="relative h-10 w-[21px] overflow-hidden">
                <ArrowGlyph
                  className="absolute left-0 top-0 rotate-90"
                  style={{ animation: "scroll-arrow 2.2s ease-in-out infinite" }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Advantages */}
        {!isMobile && (
          <div className="absolute inset-0 z-35 pointer-events-none">
            {t.source.advantages.map((adv, i) => {
              const Icon = ADVANTAGE_ICONS[i] ?? Sparkles;
              const positions = [
                "left-[14%] md:left-[20%] top-[34%] max-w-[155px]",
                "right-[24%] md:right-[30%] top-[36%] max-w-[155px]",
                "left-[14%] md:left-[20%] bottom-[34%] max-w-[155px]",
                "right-[24%] md:right-[30%] bottom-[32%] max-w-[155px]",
              ];
              return (
                <motion.div
                  key={adv.title}
                  className={`absolute ${positions[i]} flex gap-2.5 items-start`}
                  style={{ opacity: advantageOpacities[i] }}
                >
                  <span className="shrink-0 w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-montis-blue" />
                  </span>
                  <div>
                    <p className="eyebrow-s text-white mb-0.5 leading-tight">{adv.title}</p>
                    <p className="text-[10px] md:text-[11px] text-white/70 leading-snug">{adv.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="absolute inset-0 z-40 pointer-events-none px-4 sm:px-6 md:px-12 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-14">
          <div className="relative w-full h-full">
            <motion.div
              className="absolute left-0 md:left-0 top-0 z-10 max-w-[78vw] sm:max-w-md text-left"
              style={isMobile ? { y: 0, opacity: 1 } : { y: textBlockY, opacity: textBlockOpacity }}
            >
              <h2 className="font-serif text-[9vw] sm:text-3xl md:text-5xl leading-[0.95] tracking-tight whitespace-pre-line text-white">
                {t.source.title}
              </h2>
              <p className="eyebrow text-white/75 mt-3 md:mt-4 max-w-sm leading-relaxed normal-case">
                {t.source.text}
              </p>
            </motion.div>

            <motion.div
              className="absolute right-0 md:right-0 top-[12%] bottom-[4%] md:bottom-[2%] w-20 md:w-24"
              style={isMobile ? { y: 0, opacity: 1 } : { y: depthBlockY, opacity: depthBlockOpacity }}
            >
              <div className="relative h-full">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-32 md:bottom-36 w-px bg-white/20" />
                <div className="absolute inset-x-0 top-0 bottom-32 md:bottom-36">
                  {t.source.depthScale.map((mark) => {
                    const active = depthDisplay >= mark;
                    const pct = (mark / t.source.depthMax) * 100;
                    return (
                      <div
                        key={mark}
                        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5"
                        style={{ bottom: `${pct}%`, transform: "translate(-50%, 50%)" }}
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
                            active ? "bg-montis-blue shadow-[0_0_6px_rgba(0,174,239,0.8)]" : "bg-white/30"
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
                  <p className="font-serif text-4xl md:text-5xl text-white tabular-nums leading-none mt-2">
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

/* ------------------------------------------------------------------ */
/* Section Sequence (sticky depth visualization)                       */
/* ------------------------------------------------------------------ */

const SectionSequence = ({ t }: { t: TranslationBundle }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const sourceVideo = `${import.meta.env.BASE_URL}media/Meshy_AI_video.mp4`;
  const sourcePoster = `${import.meta.env.BASE_URL}media/mountain-valley.jpg`;

  return (
    <section
      ref={ref}
      id="source"
      className="relative bg-montis-navy text-white"
      style={{ height: "100svh" }}
    >
      <div className="h-[100svh] overflow-hidden">
        {/* Parallax background */}
        <motion.div style={{ y: bgY }} className="absolute inset-0">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={sourcePoster}
            aria-hidden
          >
            <source src={sourceVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-montis-navy/25" />
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Composition                                                         */
/* ------------------------------------------------------------------ */

const Composition = ({ t }: { t: TranslationBundle }) => {
  const items = [
    { ...t.composition.items.ca, pos: "top-[2%] left-1/2 -translate-x-1/2" },
    { ...t.composition.items.mg, pos: "top-[20%] right-[0%]" },
    { ...t.composition.items.na, pos: "top-[48%] right-[-2%] -translate-y-1/2" },
    { ...t.composition.items.so4, pos: "bottom-[16%] right-[0%]" },
    { ...t.composition.items.k, pos: "bottom-[2%] left-1/2 -translate-x-1/2" },
    { ...t.composition.items.hco3, pos: "bottom-[16%] left-[0%]" },
  ];

  return (
    <section id="composition" className="relative py-20 md:py-28 bg-montis-cream overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-center">
          <div className="md:col-span-5">
            <Eyebrow className="text-montis-navy/80 mb-4 md:mb-5">{t.composition.eyebrow}</Eyebrow>
            <RevealLines
              as="h2"
              className="font-serif text-4xl md:text-6xl text-montis-navy mb-5 md:mb-6"
              text={t.composition.title}
            />
            <p className="text-montis-ink/70 max-w-md mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
              {t.composition.text}
            </p>
            <div className="border-t border-montis-ink/15 pt-5 md:pt-6">
              <div className="eyebrow text-montis-ink/70 mb-2">{t.composition.mineralization}</div>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl md:text-5xl text-montis-navy">
                  {t.composition.mineralizationValue}
                </span>
                <span className="eyebrow text-montis-ink/70">{t.composition.mineralizationUnit}</span>
              </div>
            </div>
            <p className="eyebrow text-montis-ink/60 mt-6 hidden md:block">{t.composition.tableTitle}</p>
          </div>

          <div className="md:col-span-7">
            <div className="relative mx-auto w-full max-w-xl aspect-[4/5] md:aspect-[5/6]">
              <div className="absolute inset-[14%] rounded-full border border-montis-navy/10 bg-gradient-to-b from-white/80 to-montis-cream overflow-hidden flex items-center justify-center">
                <img
                  src="/media/1l.png"
                  alt="MONTIS"
                  className="relative z-10 h-full w-full object-cover object-[center_42%] scale-[1.35] drop-shadow-[0_20px_50px_rgba(26,43,86,0.16)]"
                />
              </div>
              {items.map((it, i) => (
                <motion.div
                  key={it.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute ${it.pos} z-20 w-[96px] sm:w-[104px] rounded-xl border border-montis-navy/10 bg-white/92 backdrop-blur-sm px-2.5 py-2 shadow-[0_6px_24px_rgba(26,43,86,0.07)] overflow-hidden`}
                >
                  <div className="font-serif text-lg text-montis-navy leading-none">{it.label}</div>
                  <div className="text-montis-ink/60 mt-0.5 text-[6.5px] md:text-[7px] leading-[1.2] font-semibold uppercase tracking-[0.06em] break-words hyphens-auto">
                    {it.desc}
                  </div>
                  <div className="eyebrow tabular-nums text-montis-blue mt-1 text-[9px]">{it.value}</div>
                </motion.div>
              ))}
            </div>
            <p className="eyebrow text-montis-ink/60 mt-4 md:hidden text-center">{t.composition.tableTitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Purification                                                        */
/* ------------------------------------------------------------------ */

const Purification = ({ t }: { t: TranslationBundle }) => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const stepBackgrounds = ["/media/filtration.png", "/media/uv.png", "/media/ozone.png", "/media/osmos.png"];

  return (
    <section id="purification" className="relative py-28 md:py-40 bg-montis-navy text-white overflow-hidden">
      <div className="absolute inset-0 opacity-25 blur-3xl bg-gradient-to-r from-montis-blue via-transparent to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="grid md:grid-cols-12 mb-20 gap-10">
          <div className="md:col-span-7">
            <Eyebrow className="text-montis-blue mb-6">{t.purification.eyebrow}</Eyebrow>
            <RevealLines
              as="h2"
              className="font-serif text-5xl md:text-7xl text-white"
              text={t.purification.title}
            />
          </div>
          <p className="md:col-span-5 text-white/65 leading-relaxed md:pt-4">{t.purification.text}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.purification.steps.map((step, i) => {
            const Icon = PURIFICATION_ICONS[i] ?? Filter;
            const flipped = flippedIndex === i;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <FlipCard
                  flipped={flipped}
                  onFlip={() => setFlippedIndex(flipped ? null : i)}
                  ariaLabel={step.title}
                  className="rounded-3xl p-[1px] bg-gradient-to-b from-white/15 to-transparent hover:from-montis-blue/60"
                  front={
                    <div className="relative h-full bg-montis-navy overflow-hidden">
                      <img
                        src={stepBackgrounds[i]}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 w-full h-full object-cover"
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-montis-navy/60" />
                      <div className="relative z-10 h-full p-6 md:p-7 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="eyebrow-s text-white/70">0{i + 1}</span>
                          <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-montis-blue" />
                          </span>
                        </div>
                        <h3 className="font-serif text-3xl text-white leading-tight">{step.title}</h3>
                      </div>
                    </div>
                  }
                  back={
                    <div className="relative h-full bg-montis-navy p-6 md:p-7 flex flex-col justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-montis-blue/20 to-transparent" />
                      <div className="relative z-10">
                        <span className="eyebrow-s text-montis-blue mb-4 block">0{i + 1}</span>
                        <h3 className="font-serif text-2xl text-white mb-4">{step.title}</h3>
                        <p className="text-sm text-white/85 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  }
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Formats                                                             */
/* ------------------------------------------------------------------ */

const FormatProductCard = ({
  card,
  index,
  stillLabel,
}: {
  card: TranslationBundle["formats"]["cards"][number];
  index: number;
  stillLabel: string;
}) => {
  const [flipped, setFlipped] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setFlipped((f) => !f), 5000);
    return () => window.clearInterval(id);
  }, [paused]);

  const cardShell = (
    volume: string,
    desc: string,
    image: string,
    label: string,
    bgClass: string,
  ) => (
    <div className={`relative h-full overflow-hidden ${bgClass}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#a5bfdb]/40 via-[#d7e5f5]/30 to-[#9ab7d6]/35" />
      <div className="relative z-10 h-full p-6 md:p-8 flex flex-col">
        <div>
          <span className="eyebrow-s text-white/80">{label}</span>
          <h3 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-none text-white mt-2">{volume}</h3>
          <p className="mt-3 sm:mt-4 text-white/95 text-lg sm:text-xl leading-tight whitespace-pre-line">{desc}</p>
        </div>
        <div className="mt-auto flex justify-center items-end">
          <img
            src={image}
            alt=""
            className="max-h-[300px] sm:max-h-[420px] md:max-h-[500px] w-auto object-contain drop-shadow-[0_18px_45px_rgba(10,18,45,0.24)]"
          />
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="rounded-[24px] md:rounded-[28px] border border-white/30 shadow-[0_12px_40px_rgba(15,29,61,0.12)]"
    >
      <FlipCard
        flipped={flipped}
        onFlip={() => setFlipped((f) => !f)}
        heightClass="h-[440px] sm:h-[520px] md:h-[620px]"
        className="overflow-hidden rounded-[24px] md:rounded-[28px]"
        ariaLabel={`MONTIS ${card.volume}`}
        front={cardShell(card.volume, card.desc, card.image, stillLabel, "bg-montis-navy/15")}
        back={cardShell(card.volume, card.desc, card.sparkImage, card.sparkLabel, "bg-montis-navy")}
      />
    </motion.div>
  );
};

const Formats = ({ t }: { t: TranslationBundle }) => (
  <section id="formats" className="relative py-28 md:py-36 bg-montis-cream overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 md:px-12">
      <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-end mb-12 md:mb-14">
        <div className="md:col-span-7">
          <Eyebrow className="text-montis-navy mb-5">{t.formats.eyebrow}</Eyebrow>
          <RevealLines
            as="h2"
            className="font-serif text-5xl md:text-7xl text-montis-navy"
            text={t.formats.title}
          />
        </div>
        <p className="md:col-span-5 text-montis-ink/70 leading-relaxed max-w-md">{t.formats.text}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {t.formats.cards.map((card, i) => (
          <FormatProductCard key={card.volume} card={card} index={i} stillLabel={t.formats.stillLabel} />
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Distributors – vertical marquees                                    */
/* ------------------------------------------------------------------ */

const DistributorCell = ({ name }: { name: string }) => (
  <div className="h-24 md:h-32 flex items-center justify-center px-6 border-b border-montis-ink/10">
    <span className="font-serif text-montis-navy text-2xl md:text-3xl whitespace-nowrap tracking-tight">
      {name}
    </span>
  </div>
);

const Distributors = ({
  t,
  settings,
}: {
  t: TranslationBundle;
  settings: SiteContent["settings"];
}) => (
  <section id="distributors" className="relative py-28 md:py-36 bg-montis-cream overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 md:px-12 mb-14 md:mb-16">
      <div className="grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-7">
          <Eyebrow className="text-montis-navy mb-6">{t.distributors.eyebrow}</Eyebrow>
          <RevealLines
            as="h2"
            className="font-serif text-5xl md:text-7xl text-montis-navy"
            text={t.distributors.title}
          />
        </div>
        <p className="md:col-span-5 text-montis-ink/70 leading-relaxed">{t.distributors.text}</p>
      </div>
    </div>

    <div className="container mx-auto px-4 sm:px-6 md:px-12 mb-14 md:mb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
        <Eyebrow className="text-montis-navy">{t.distributors.mapTitle}</Eyebrow>
        <a
          href={settings.mapExternalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow-s text-montis-navy hover:text-montis-blue transition-colors"
        >
          {t.distributors.mapLink} ↗
        </a>
      </div>
      <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-3xl overflow-hidden border border-montis-ink/10 bg-white shadow-[0_12px_40px_rgba(15,29,61,0.08)]">
        <iframe
          title={t.distributors.mapTitle}
          src={settings.mapEmbedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>

    <div
      className="relative h-[56vh] md:h-[64vh] border-y border-montis-ink/15"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4">
        {settings.distributorMarquee.map((col, ci) => {
          const track = ci % 2 === 0 ? "marquee-track-up" : "marquee-track-down";
          // Duplicate the list twice to create a seamless loop.
          const items = [...col, ...col];
          return (
            <div key={ci} className="relative overflow-hidden border-l border-montis-ink/10 first:border-l-0">
              <div className={`flex flex-col ${track}`} style={{ animationDuration: `${30 + ci * 6}s` }}>
                {items.map((n, i) => (
                  <DistributorCell key={`${ci}-${i}`} name={n} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="container mx-auto px-4 sm:px-6 md:px-12 mt-12 md:mt-14 flex flex-wrap gap-3 sm:gap-4">
      <a
        href={settings.mapExternalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex min-h-[44px] items-center gap-3 pl-5 sm:pl-6 pr-4 sm:pr-5 py-3 sm:py-4 border border-montis-navy text-montis-navy rounded-full relative overflow-hidden"
      >
        <span className="eyebrow-s relative z-10 transition-colors group-hover:text-white">{t.distributors.offline}</span>
        <ArrowGlyph className="relative z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-white" />
        <span className="absolute inset-0 bg-montis-navy translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
      </a>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* CTA                                                                 */
/* ------------------------------------------------------------------ */

const CTA = ({ t }: { t: TranslationBundle }) => (
  <section className="relative py-28 md:py-36 bg-montis-blue overflow-hidden">
    <div className="absolute inset-0 opacity-25">
      <img
        src="/media/back.png"
        alt=""
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="relative container mx-auto px-4 sm:px-6 md:px-12">
      <Eyebrow className="text-white mb-8">{t.cta.eyebrow}</Eyebrow>
      <RevealLines
        as="h2"
        className="font-serif text-5xl md:text-8xl text-white mb-12"
        text={t.cta.title}
      />
      <a
        href="#contact"
        className="group inline-flex min-h-[44px] items-center gap-3 sm:gap-4 pl-6 sm:pl-8 pr-5 sm:pr-6 py-3.5 sm:py-5 bg-white text-montis-navy rounded-full relative overflow-hidden"
      >
        <span className="eyebrow relative z-10 transition-colors duration-500 group-hover:text-white text-[10px] sm:text-[11px]">
          {t.cta.button}
        </span>
        <ArrowGlyph className="relative z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-white" />
        <span className="absolute inset-0 bg-montis-navy translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
      </a>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

const Footer = ({
  t,
  settings,
}: {
  t: TranslationBundle;
  settings: SiteContent["settings"];
}) => (
  <footer id="contact" className="relative bg-montis-cream border-t border-montis-ink/10">
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-28">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <MontisLogoLink iconSize={56} variant="full" className="mb-6" />
          <p className="text-montis-ink/70 max-w-md">{t.footer.desc}</p>
          <div className="flex gap-3 mt-8">
            <a href="#" className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-montis-ink/15 flex items-center justify-center text-montis-navy hover:bg-montis-navy hover:text-white transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-montis-ink/15 flex items-center justify-center text-montis-navy hover:bg-montis-navy hover:text-white transition-colors">
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="eyebrow text-montis-ink/60 mb-6">{t.footer.contacts}</div>
          <ul className="space-y-3 text-montis-navy">
            {settings.phones.map((phone) => (
              <li key={phone} className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-montis-blue" /> {phone}
              </li>
            ))}
            <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-montis-blue" /> {settings.address}</li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="eyebrow text-montis-ink/60 mb-6">{t.footer.nav}</div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-montis-navy">
            <li><a href="#video" className="hover:text-montis-blue transition-colors">{t.nav.source}</a></li>
            <li><a href="#composition" className="hover:text-montis-blue transition-colors">{t.nav.composition}</a></li>
            <li><a href="#purification" className="hover:text-montis-blue transition-colors">{t.nav.purification}</a></li>
            <li><a href="#formats" className="hover:text-montis-blue transition-colors">{t.formats.eyebrow.replace("✦ ", "")}</a></li>
            <li><a href="#distributors" className="hover:text-montis-blue transition-colors">{t.footer.brand}</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-10 sm:pt-12 mt-12 sm:mt-16 border-t border-montis-ink/10 flex flex-col md:flex-row justify-between gap-4 sm:gap-6 eyebrow-s text-montis-ink/60">
        <span>© 2026 MONTIS. {t.footer.rights}</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-montis-navy transition-colors">{t.footer.privacy}</a>
          <a href="#" className="hover:text-montis-navy transition-colors">{t.footer.terms}</a>
        </div>
      </div>
    </div>
  </footer>
);

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [lang, setLang] = useState<Language>("ru");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { content } = useSiteContent();

  const t = content.translations[lang];

  const handlePreloaderDone = useCallback(() => {
    setLoading(false);
    prefetchSecondaryContent();
    registerServiceWorker();
  }, []);

  useEffect(() => {
    const handle = () => setIsLangOpen(false);
    if (isLangOpen) window.addEventListener("click", handle);
    return () => window.removeEventListener("click", handle);
  }, [isLangOpen]);

  // Keep scroll position at the very top while the preloader is visible.
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence>
        {loading && <Preloader key="preloader" onDone={handlePreloaderDone} />}
      </AnimatePresence>

      {!loading && (
        <>
          <Header
            t={t}
            lang={lang}
            setLang={setLang}
            isLangOpen={isLangOpen}
            setIsLangOpen={setIsLangOpen}
          />

          <main>
            <Hero t={t} />
            <SecondScreenVideo t={t} />
            <Composition t={t} />
            <Purification t={t} />
            <Formats t={t} />
            <Distributors t={t} settings={content.settings} />
            <CTA t={t} />
          </main>

          <Footer t={t} settings={content.settings} />
        </>
      )}
    </div>
  );
}
