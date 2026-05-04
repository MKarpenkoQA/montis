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
  animate,
} from "motion/react";
import {
  Instagram,
  Send,
  Phone,
  MapPin,
  ChevronDown,
  Globe,
} from "lucide-react";
import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react";

type Language = "ru" | "uz" | "en";

/* ------------------------------------------------------------------ */
/* Translations                                                        */
/* ------------------------------------------------------------------ */

const translations = {
  ru: {
    nav: { source: "Источник", composition: "Состав", purification: "Очистка", gallery: "Галерея", contact: "Связаться" },
    buy: "Где купить",
    hero: {
      eyebrow: "✦ Реликтовая вода",
      title: "Вода,\nсозданная\nприродой",
      subtitle: "100% источник природной энергии из самого сердца гор",
      scroll: "Листайте вниз",
    },
    source: {
      eyebrow: "✦ Уникальность",
      title: "Сила, добытая\nс глубины",
      text: "Мы берём воду там, где ничто не влияет на её состав — из защищённого артезианского горизонта под толщей горных пород.",
      depthLabel: "Точка забора воды\nнаходится на глубине",
      depthUnit: "метров",
      scale: [50, 90, 130, 170, 195, 210],
    },
    composition: {
      eyebrow: "✦ Минеральный состав",
      title: "Природный\nбаланс",
      text: "MONTIS обладает лёгкой минерализацией и оптимальным содержанием микроэлементов для ежедневного употребления.",
      mineralization: "Сверхлёгкая минерализация",
      mineralizationValue: "до 0,2",
      mineralizationUnit: "г/л",
      tableTitle: "Основной состав, мг/л",
      items: {
        ca: { label: "Ca", value: "20—25", desc: "Кальций" },
        mg: { label: "Mg", value: "6—11", desc: "Магний" },
        na: { label: "Na", value: "2—7", desc: "Натрий" },
        hco3: { label: "HCO₃", value: "50—100", desc: "Гидрокарбонаты" },
        k:  { label: "K",  value: "0,1—2", desc: "Калий" },
        so4:{ label: "SO₄", value: "1—12", desc: "Сульфаты" },
      },
    },
    purification: {
      eyebrow: "✦ Технологии",
      title: "4 ступени\nочистки",
      text: "Самые современные методы фильтрации сохраняют природные свойства воды и делают её абсолютно безопасной.",
      steps: [
        { title: "Фильтрация", desc: "Удаление механических примесей через систему многослойных фильтров." },
        { title: "УФ-обработка", desc: "Обеззараживание ультрафиолетом, уничтожающим бактерии и вирусы." },
        { title: "Озонирование", desc: "Насыщение озоном для глубокой дезинфекции и чистоты вкуса." },
        { title: "Осмос", desc: "Тонкая очистка на молекулярном уровне." },
      ],
    },
    formats: {
      eyebrow: "✦ Форматы",
      title: "Удобство в\nкаждом формате",
      text: "MONTIS представлена в различных объемах, чтобы вода, которой вы доверяете, всегда была рядом.",
      cards: [
        { volume: "0,5 л", desc: "Идеально\nна каждый день", image: "/media/0,5.png" },
        { volume: "1 л", desc: "Баланс\nпользы и объема", image: "/media/1l.png" },
        { volume: "1,5 л", desc: "Легко утоляет\nжажду", image: "/media/1.5l.png" },
      ],
    },
    gallery: { eyebrow: "✦ Галерея" },
    distributors: {
      eyebrow: "✦ Где купить",
      title: "MONTIS рядом\nс вами",
      text: "Вы найдёте MONTIS в супермаркетах, ресторанах и кофейнях по всей стране, а также на популярных площадках доставки.",
      online: "Купить онлайн",
      offline: "Найти магазин",
    },
    cta: { eyebrow: "✦ Поддержать баланс", title: "Почувствуйте\nэнергию гор", button: "Заказать доставку" },
    footer: {
      desc: "Новый стандарт природной воды. Мы заботимся о вашем здоровье, предоставляя продукт высочайшего качества.",
      contacts: "Контакты", nav: "Навигация", brand: "Где купить", rights: "Все права защищены.",
      privacy: "Политика конфиденциальности", terms: "Условия использования",
    },
  },
  uz: {
    nav: { source: "Manba", composition: "Tarkib", purification: "Tozalash", gallery: "Galereya", contact: "Bog'lanish" },
    buy: "Qayerdan sotib olish",
    hero: { eyebrow: "✦ Relikt suv", title: "Tabiat tomonidan\nyaratilgan suv", subtitle: "Tog'lar qalbidagi tabiiy energiya manbai", scroll: "Pastga suring" },
    source: {
      eyebrow: "✦ Noyoblik",
      title: "Chuqurlikdan\nolingan kuch",
      text: "Biz suvni uning tarkibiga hech narsa ta'sir qilmaydigan joyda — himoyalangan artezian gorizontidan olamiz.",
      depthLabel: "Suv olish nuqtasi\nchuqurlikda joylashgan",
      depthUnit: "metr",
      scale: [50, 90, 130, 170, 195, 210],
    },
    composition: {
      eyebrow: "✦ Mineral tarkib",
      title: "Tabiiy\nmuvozanat",
      text: "MONTIS yengil minerallashuv va kundalik iste'mol uchun maqbul tarkibga ega.",
      mineralization: "Ultra-yengil minerallashuv",
      mineralizationValue: "0,2 gacha",
      mineralizationUnit: "g/l",
      tableTitle: "Asosiy tarkib, mg/l",
      items: {
        ca: { label: "Ca", value: "20—25", desc: "Kalsiy" },
        mg: { label: "Mg", value: "6—11", desc: "Magniy" },
        na: { label: "Na", value: "2—7", desc: "Natriy" },
        hco3: { label: "HCO₃", value: "50—100", desc: "Gidrokarbonatlar" },
        k:  { label: "K",  value: "0,1—2", desc: "Kaliy" },
        so4:{ label: "SO₄", value: "1—12", desc: "Sulfatlar" },
      },
    },
    purification: {
      eyebrow: "✦ Texnologiyalar",
      title: "4 bosqichli\ntozalash",
      text: "Zamonaviy filtrlash usullari suvning tabiiy xossalarini saqlaydi va uni mutlaqo xavfsiz qiladi.",
      steps: [
        { title: "Filtrlash", desc: "Ko'p qatlamli filtrlar orqali mexanik zarralarni olib tashlash." },
        { title: "UB-ishlov", desc: "Ultrabinafsha nur bilan bakteriya va viruslarni yo'qotish." },
        { title: "Ozonlash", desc: "Chuqur dezinfeksiya uchun ozon bilan to'yintirish." },
        { title: "Osmos", desc: "Molekulyar darajadagi nozik tozalash." },
      ],
    },
    formats: {
      eyebrow: "✦ Formatlar",
      title: "Har bir\nformatda qulaylik",
      text: "MONTIS turli hajmlarda taqdim etiladi, shunda ishonchli suvingiz har doim yoningizda bo'ladi.",
      cards: [
        { volume: "0,5 l", desc: "Har kun uchun\nideal", image: "/media/0,5.png" },
        { volume: "1 l", desc: "Foyda va\nhajm muvozanati", image: "/media/1l.png" },
        { volume: "1,5 l", desc: "Chanqoqni\nyengil qondiradi", image: "/media/1.5l.png" },
      ],
    },
    gallery: { eyebrow: "✦ Galereya" },
    distributors: {
      eyebrow: "✦ Qayerdan topish mumkin",
      title: "MONTIS\nyoningizda",
      text: "MONTIS-ni supermarketlar, restoranlar va kafelarda, shuningdek mashhur yetkazib berish platformalarida topasiz.",
      online: "Onlayn sotib olish",
      offline: "Do'kon topish",
    },
    cta: { eyebrow: "✦ Muvozanatni saqlash", title: "Tog'lar\nenergiyasini his eting", button: "Yetkazib berishga buyurtma" },
    footer: {
      desc: "Tabiiy suvning yangi standarti. Biz sizning sog'lig'ingiz haqida qayg'uramiz.",
      contacts: "Kontaktlar", nav: "Navigatsiya", brand: "Brend haqida", rights: "Barcha huquqlar himoyalangan.",
      privacy: "Maxfiylik siyosati", terms: "Foydalanish shartlari",
    },
  },
  en: {
    nav: { source: "Source", composition: "Composition", purification: "Purification", gallery: "Gallery", contact: "Contact" },
    buy: "Where to buy",
    hero: { eyebrow: "✦ Relict water", title: "Water shaped\nby nature", subtitle: "100% source of natural energy from the heart of the mountains", scroll: "Scroll to explore" },
    source: {
      eyebrow: "✦ Uniqueness",
      title: "Strength\nfrom the depths",
      text: "We draw water where nothing can touch its composition — from a protected artesian horizon deep beneath the mountain rock.",
      depthLabel: "The intake point\nsits at a depth of",
      depthUnit: "meters",
      scale: [50, 90, 130, 170, 195, 210],
    },
    composition: {
      eyebrow: "✦ Mineral composition",
      title: "Natural\nbalance",
      text: "MONTIS has ultra-light mineralization and an optimal amount of trace elements for everyday drinking.",
      mineralization: "Ultra-light mineralization",
      mineralizationValue: "up to 0.2",
      mineralizationUnit: "g/l",
      tableTitle: "Core composition, mg/l",
      items: {
        ca: { label: "Ca", value: "20—25", desc: "Calcium" },
        mg: { label: "Mg", value: "6—11", desc: "Magnesium" },
        na: { label: "Na", value: "2—7", desc: "Sodium" },
        hco3: { label: "HCO₃", value: "50—100", desc: "Bicarbonates" },
        k:  { label: "K",  value: "0.1—2", desc: "Potassium" },
        so4:{ label: "SO₄", value: "1—12", desc: "Sulfates" },
      },
    },
    purification: {
      eyebrow: "✦ Technologies",
      title: "4 stages\nof purification",
      text: "Modern filtration preserves the water's natural properties while keeping it absolutely safe.",
      steps: [
        { title: "Filtration", desc: "Removal of mechanical impurities through a multi-layer filter system." },
        { title: "UV treatment", desc: "Ultraviolet light destroys bacteria and viruses." },
        { title: "Ozonation", desc: "Ozone saturation for deep disinfection and clean taste." },
        { title: "Osmosis", desc: "Fine purification at the molecular level." },
      ],
    },
    formats: {
      eyebrow: "✦ Formats",
      title: "Convenience in\nevery size",
      text: "MONTIS comes in different bottle sizes, so the water you trust is always with you.",
      cards: [
        { volume: "0.5 L", desc: "Perfect\nfor every day", image: "/media/0,5.png" },
        { volume: "1 L", desc: "Balanced\nvolume and benefit", image: "/media/1l.png" },
        { volume: "1.5 L", desc: "Easily\nquenches thirst", image: "/media/1.5l.png" },
      ],
    },
    gallery: { eyebrow: "✦ Gallery" },
    distributors: {
      eyebrow: "✦ Where to buy",
      title: "MONTIS close\nto you",
      text: "Find MONTIS in supermarkets, restaurants and cafés across the country, as well as on popular delivery platforms.",
      online: "Buy online",
      offline: "Find a store",
    },
    cta: { eyebrow: "✦ Stay balanced", title: "Feel the energy\nof pure mountains", button: "Order delivery" },
    footer: {
      desc: "A new standard of natural water. We care about your health by providing a product of the highest quality.",
      contacts: "Contacts", nav: "Navigation", brand: "About brand", rights: "All rights reserved.",
      privacy: "Privacy policy", terms: "Terms of use",
    },
  },
} as const;

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
    const controls = animate(mv, 100, {
      duration: 1.8,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: (v) => setDisplay(String(Math.floor(v)).padStart(2, "0")),
      onComplete: () => {
        // Slight linger before dismissing the preloader.
        setTimeout(onDone, 420);
      },
    });
    return () => controls.stop();
  }, [mv, onDone]);

  const maskInset = useTransform(mv, [0, 100], [100, 0]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-montis-cream py-10 px-8"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-[220px] h-[260px] text-montis-navy">
          {/* Outline shape */}
          <svg viewBox="0 0 220 260" className="absolute inset-0 w-full h-full" aria-hidden>
            <path
              d="M110 10 C 150 60, 200 110, 200 170 C 200 220, 160 250, 110 250 C 60 250, 20 220, 20 170 C 20 110, 70 60, 110 10 Z"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          </svg>
          {/* Progressively revealed fill */}
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: useTransform(maskInset, (v) => `inset(${v}% 0% 0% 0%)`) }}
          >
            <svg viewBox="0 0 220 260" className="w-full h-full" aria-hidden>
              <path
                d="M110 10 C 150 60, 200 110, 200 170 C 200 220, 160 250, 110 250 C 60 250, 20 220, 20 170 C 20 110, 70 60, 110 10 Z"
                fill="currentColor"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="w-full flex items-end justify-between">
        <span className="font-serif text-6xl md:text-8xl text-montis-navy leading-none tabular-nums">
          {display}
          <span className="text-montis-navy/40">%</span>
        </span>
        <span className="font-serif text-3xl md:text-4xl tracking-tighter text-montis-navy">MONTIS</span>
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
  t: typeof translations["en"];
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
        <a href="#top" className="shrink-0 font-serif text-xl sm:text-2xl md:text-[28px] tracking-tighter text-montis-navy">
          MONTIS
        </a>

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
          <a href="#gallery" className="eyebrow text-montis-ink/80 hover:text-montis-navy transition-colors">
            {t.nav.gallery}
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

const Hero = ({ t }: { t: typeof translations["en"] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.25, 0.6]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-[100svh] w-full overflow-hidden bg-montis-navy text-white"
    >
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        <img
          src="/media/mountain-lake-hero.jpg"
          alt="Mountain lake"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
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

      {/* Scroll indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex flex-col items-center gap-2 text-white/70">
        <span className="eyebrow-s">{t.hero.scroll}</span>
        <div className="relative h-10 w-[21px] overflow-hidden">
          <ArrowGlyph
            className="absolute left-0 top-0 rotate-90"
            style={{ animation: "scroll-arrow 2.2s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Second screen video                                                 */
/* ------------------------------------------------------------------ */

const SecondScreenVideo = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = `${import.meta.env.BASE_URL}media/Meshy_AI_video.mp4`;
  const posterSrc = `${import.meta.env.BASE_URL}media/mountain-lake-hero.jpg`;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["center center", "end center"] });
  const videoStartThreshold = 0.22; // ~half-screen scroll before playback begins
  const introBlackOpacity = useTransform(scrollYProgress, [0, 0.05, 0.12], [1, 1, 0]);
  const textBlockY = useTransform(scrollYProgress, [0.1, 0.35], [180, 0]);
  const textBlockOpacity = useTransform(scrollYProgress, [0.1, 0.28], [0, 1]);
  const depthBlockY = useTransform(scrollYProgress, [0.16, 0.42], [180, 0]);
  const depthBlockOpacity = useTransform(scrollYProgress, [0.16, 0.34], [0, 1]);
  const compositionBlockY = useTransform(scrollYProgress, [0.46, 0.68], [120, 0]);
  const compositionBlockOpacity = useTransform(scrollYProgress, [0.46, 0.62], [0, 1]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const clamped = Math.max(0, Math.min(1, v));
      const delayedProgress = Math.max(0, (clamped - videoStartThreshold) / (1 - videoStartThreshold));
      video.currentTime = delayedProgress * video.duration;
    });
    return () => unsubscribe();
  }, [scrollYProgress, videoStartThreshold]);

  return (
    <section ref={sectionRef} id="video" className="relative h-[320svh] w-full bg-black">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          className="section-motion-layer absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${posterSrc}")` }}
          aria-hidden="true"
        >
          <motion.video
            ref={videoRef}
            className="absolute inset-0 z-0 h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
            poster={posterSrc}
            disablePictureInPicture
            aria-hidden
            onLoadedMetadata={() => {
              const video = videoRef.current;
              if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
              const clamped = Math.max(0, Math.min(1, scrollYProgress.get()));
              const delayedProgress = Math.max(0, (clamped - videoStartThreshold) / (1 - videoStartThreshold));
              video.currentTime = delayedProgress * video.duration;
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <source src={videoSrc} type="video/mp4" />
          </motion.video>
          <div className="absolute -right-[10%] md:-right-[20%] top-[-10%] z-10 h-[70%] md:h-[85%] w-[60%] md:w-[55%] rounded-full bg-gradient-to-bl from-montis-blue/[0.07] via-transparent to-transparent blur-3xl"></div>
          <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_80%_50%_at_70%_0%,rgba(26,43,86,0.06),transparent)]"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-black/30"></div>
          <motion.div className="absolute inset-0 z-20 bg-black" style={{ opacity: introBlackOpacity }} />
          <motion.div
            className="absolute inset-0 z-25 flex items-center justify-center px-6 text-center"
            style={{ opacity: introBlackOpacity }}
          >
            <p className="font-serif text-3xl md:text-5xl leading-tight text-white max-w-4xl">
              Вода добывается из подземного источника
            </p>
          </motion.div>
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
        </div>
        <div className="absolute inset-0 z-30 flex items-end justify-start px-4 sm:px-6 md:px-12 pb-8 sm:pb-10 md:pb-16 pointer-events-none">
          <motion.div
            className="md:col-span-7 md:pl-6 w-full max-w-xl"
            style={{ y: compositionBlockY, opacity: compositionBlockOpacity }}
          >
            <p className="eyebrow text-white/80 mb-3">Основной состав, мг/л</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
              <div className="relative py-2 text-white">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-serif text-base sm:text-lg md:text-xl">Ca</span>
                  <div className="flex-1 flex items-center gap-3 justify-end">
                    <span className="eyebrow text-white/70">Кальций</span>
                    <span className="eyebrow tabular-nums">20—25</span>
                  </div>
                </div>
              </div>
              <div className="relative py-2 text-white">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-serif text-base sm:text-lg md:text-xl">Mg</span>
                  <div className="flex-1 flex items-center gap-3 justify-end">
                    <span className="eyebrow text-white/70">Магний</span>
                    <span className="eyebrow tabular-nums">6—11</span>
                  </div>
                </div>
              </div>
              <div className="relative py-2 text-white">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-serif text-base sm:text-lg md:text-xl">Na</span>
                  <div className="flex-1 flex items-center gap-3 justify-end">
                    <span className="eyebrow text-white/70">Натрий</span>
                    <span className="eyebrow tabular-nums">2—7</span>
                  </div>
                </div>
              </div>
              <div className="relative py-2 text-white">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-serif text-base sm:text-lg md:text-xl">HCO₃</span>
                  <div className="flex-1 flex items-center gap-3 justify-end">
                    <span className="eyebrow text-white/70">Гидрокарбонаты</span>
                    <span className="eyebrow tabular-nums">50—100</span>
                  </div>
                </div>
              </div>
              <div className="relative py-2 text-white">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-serif text-base sm:text-lg md:text-xl">K</span>
                  <div className="flex-1 flex items-center gap-3 justify-end">
                    <span className="eyebrow text-white/70">Калий</span>
                    <span className="eyebrow tabular-nums">0,1—2</span>
                  </div>
                </div>
              </div>
              <div className="relative py-2 text-white">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-serif text-base sm:text-lg md:text-xl">SO₄</span>
                  <div className="flex-1 flex items-center gap-3 justify-end">
                    <span className="eyebrow text-white/70">Сульфаты</span>
                    <span className="eyebrow tabular-nums">1—12</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-0 z-40 flex items-end px-4 sm:px-6 md:px-12 pb-8 sm:pb-10 md:pb-14 pointer-events-none">
          <div className="SequenceContent_rootWrapper__zwUHM SequenceContent_rootWrapper_InColumn__uvVk7 relative text-white w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6 sm:gap-8 md:gap-12">
            <motion.div
              className="TextInfographic_root__HlMeP SequenceContent_rootTextBlock__tg_D2 relative z-10 mb-2 sm:mb-8 md:mb-56 md:self-start flex flex-col items-start max-w-[80vw] sm:max-w-none"
              style={{ y: textBlockY, opacity: textBlockOpacity }}
            >
              <h2 className="TextInfographic_rootTitle__AHwO3 h-auto font-serif text-2xl sm:text-4xl md:text-6xl leading-[0.95] tracking-tight">
                Сила, добытая <br />
                с глубины
              </h2>
              <p className="TextInfographic_rootText__GOs4A all-caps eyebrow text-white/80 mt-4 sm:mt-8 md:mt-36 max-w-md">
                Мы берём воду там, где ничто не влияет на её состав
              </p>
            </motion.div>
            <motion.div
              className="DepthRange_root__HDQRC SequenceContent_rootDepthRange__UkmXB md:absolute md:right-0 md:bottom-0 text-right max-w-[70vw] sm:max-w-sm ml-auto"
              style={{ y: depthBlockY, opacity: depthBlockOpacity }}
            >
              <div className="DepthRange_rootTextContent__IgMuX">
                <p className="all-caps eyebrow text-white/80">
                  Точка забора<br />
                  воды находится<br />
                  на глубине
                </p>
                <div className="DepthRange_rootValue__7H6TY mt-5">
                  <span className="DepthRange_rootValueNumber__4OkQW flex items-end justify-end gap-3 font-serif text-6xl md:text-8xl leading-none">
                    <span className="h-1">430</span>
                    <ArrowGlyph className="mb-2 md:mb-3" />
                  </span>
                  <span className="all-caps eyebrow text-white/80 mt-2 inline-block">метров</span>
                </div>
              </div>
              <picture>
                <img
                  alt=""
                  loading="lazy"
                  width="80"
                  height="90"
                  decoding="async"
                  className="DepthRange_rootImage__SgzNl mt-6 ml-auto opacity-90"
                  src="https://api.baikal430.ru/storage/photos/shares/images/index/section-sequence/depthRangeImg.svg"
                  style={{ color: "transparent" }}
                />
              </picture>
              <div className="DepthRange_rootRanges__Vh2Se mt-5 flex items-end justify-end gap-5">
                <div className="DepthRange_rootRangesValues__KB2cG flex flex-col gap-2">
                  <span className="DepthRange_rootRangesValue__U94kd all-caps eyebrow-s text-white/70">85</span>
                  <span className="DepthRange_rootRangesValue__U94kd all-caps eyebrow-s text-white/70">170</span>
                  <span className="DepthRange_rootRangesValue__U94kd all-caps eyebrow-s text-white/70">250</span>
                  <span className="DepthRange_rootRangesValue__U94kd all-caps eyebrow-s text-white/70">340</span>
                  <span className="DepthRange_rootRangesValue__U94kd all-caps eyebrow-s text-white/70">400</span>
                  <span className="DepthRange_rootRangesValue__U94kd all-caps eyebrow-s text-white">430</span>
                </div>
                <picture>
                  <img
                    alt=""
                    loading="lazy"
                    width="10"
                    height="203"
                    decoding="async"
                    className="DepthRange_rootRangesImage__diGfb opacity-90"
                    src="https://api.baikal430.ru/storage/photos/shares/images/index/section-sequence/ranges.svg"
                    style={{ color: "transparent" }}
                  />
                </picture>
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

const SectionSequence = ({ t }: { t: typeof translations["en"] }) => {
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
            preload="metadata"
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

const Composition = ({ t }: { t: typeof translations["en"] }) => {
  const list = [
    t.composition.items.ca,
    t.composition.items.mg,
    t.composition.items.na,
    t.composition.items.hco3,
    t.composition.items.k,
    t.composition.items.so4,
  ];

  return (
    <section id="composition" className="relative py-28 md:py-40 bg-montis-cream">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 grid md:grid-cols-12 gap-8 md:gap-10">
        <div className="md:col-span-5">
          <Eyebrow className="text-montis-navy/80 mb-6">{t.composition.eyebrow}</Eyebrow>
          <RevealLines
            as="h2"
            className="font-serif text-5xl md:text-7xl text-montis-navy mb-8"
            text={t.composition.title}
          />
          <p className="text-montis-ink/70 max-w-md mb-10 leading-relaxed">{t.composition.text}</p>

          <div className="border-t border-montis-ink/15 pt-8">
            <div className="eyebrow text-montis-ink/70 mb-2">{t.composition.mineralization}</div>
            <div className="flex items-baseline gap-3">
              <span className="eyebrow text-montis-ink/70">↗</span>
              <span className="font-serif text-5xl md:text-6xl text-montis-navy">
                {t.composition.mineralizationValue}
              </span>
              <span className="eyebrow text-montis-ink/70">{t.composition.mineralizationUnit}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 md:pl-12">
          <p className="eyebrow text-montis-ink/70 mb-6">{t.composition.tableTitle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-10 gap-y-2">
            {list.map((it, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="relative py-4 text-montis-navy"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-serif text-2xl md:text-3xl">{it.label}</span>
                  <div className="flex-1 flex items-center gap-3 justify-end">
                    <span className="eyebrow text-montis-ink/70">{it.desc}</span>
                    <span className="eyebrow tabular-nums">{it.value}</span>
                  </div>
                </div>
                <div className="text-montis-navy/50 mt-3">
                  <AnimatedLine />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Purification                                                        */
/* ------------------------------------------------------------------ */

const Purification = ({ t }: { t: typeof translations["en"] }) => {
  const [active, setActive] = useState(0);
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

        <div className="relative">
          <div className="hidden lg:block absolute left-0 right-0 top-11 h-px bg-white/10" />
          <motion.div
            className="hidden lg:block absolute left-0 top-11 h-px bg-gradient-to-r from-montis-blue via-[#52c6ff] to-montis-blue shadow-[0_0_18px_rgba(0,174,239,0.65)]"
            animate={{ width: `${((active + 1) / t.purification.steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.purification.steps.map((step, i) => {
            const isActive = active === i;
            return (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative h-[340px] sm:h-96 rounded-3xl overflow-hidden p-[1px] text-left transition duration-500 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-b from-montis-blue/75 via-white/25 to-transparent shadow-[0_0_35px_rgba(0,174,239,0.45)]"
                    : "bg-gradient-to-b from-white/15 to-transparent hover:from-montis-blue/60"
                }`}
              >
                <img
                  src={stepBackgrounds[i] ?? "/media/mountain-lake-hero.jpg"}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-montis-navy/55" />
                <div className="absolute inset-0 bg-gradient-to-b from-montis-navy/20 via-montis-navy/35 to-montis-navy/80" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,174,239,0.20),transparent_60%)] opacity-0 transition duration-500 group-hover:opacity-100" />

                <div className="relative z-10 h-full p-6 md:p-7 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow-s text-white/70">0{i + 1}</span>
                    <div className="w-10 h-10 rounded-full border border-white/20 bg-white/[0.03] flex items-center justify-center text-white transition duration-500 group-hover:border-montis-blue/50 group-hover:translate-x-1">
                      <ArrowGlyph
                        className={`transition-all duration-500 ${isActive ? "text-montis-blue" : "text-white/90"}`}
                      />
                    </div>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{ y: isActive ? -2 : 0 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-3"
                  >
                    <h3 className="font-serif text-3xl text-white leading-tight">{step.title}</h3>
                    <p
                      className={`text-sm leading-relaxed transition-colors duration-500 ${
                        isActive ? "text-white/90" : "text-white/65"
                      }`}
                    >
                      {step.desc}
                    </p>
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Formats                                                             */
/* ------------------------------------------------------------------ */

const Formats = ({ t }: { t: typeof translations["en"] }) => (
  <section className="relative py-28 md:py-36 bg-montis-cream overflow-hidden">
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
          <motion.a
            key={card.volume}
            href="#contact"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group relative h-[440px] sm:h-[520px] md:h-[620px] rounded-[24px] md:rounded-[28px] overflow-hidden bg-montis-navy/15 border border-white/30 shadow-[0_12px_40px_rgba(15,29,61,0.12)]"
          >
            <img
              src="/media/mountain-lake-hero.jpg"
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#a5bfdb]/40 via-[#d7e5f5]/30 to-[#9ab7d6]/35" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />

            <div className="relative z-10 h-full p-6 md:p-8 flex flex-col">
              <div>
                <h3 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-none text-white">{card.volume}</h3>
                <p className="mt-3 sm:mt-4 text-white/95 text-lg sm:text-xl leading-tight whitespace-pre-line">{card.desc}</p>
              </div>

              <div className="mt-auto flex justify-center items-end">
                <img
                  src={card.image}
                  alt={`Бутылка MONTIS ${card.volume}`}
                  className="max-h-[300px] sm:max-h-[420px] md:max-h-[500px] w-auto object-contain drop-shadow-[0_18px_45px_rgba(10,18,45,0.24)] transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Gallery slider                                                      */
/* ------------------------------------------------------------------ */

const GALLERY: { src: string; alt: string }[] = [
  { src: "/media/mountain-stream.jpg", alt: "Mountain stream" },
  { src: "/media/alpine-vista.jpg", alt: "Alpine vista" },
  { src: "/media/reflective-lake.jpg", alt: "Reflective lake" },
  { src: "/media/mountain-valley.jpg", alt: "River valley" },
  { src: "/media/mountain-lake-hero.jpg", alt: "Mountain lake" },
];

const Gallery = ({ t }: { t: typeof translations["en"] }) => {
  const [index, setIndex] = useState(0);
  const max = GALLERY.length;
  return (
    <section id="gallery" className="relative py-24 md:py-32 bg-montis-cream">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 sm:gap-6">
          <Eyebrow className="text-montis-navy">{t.gallery.eyebrow}</Eyebrow>
          <div className="flex items-center gap-4">
            <span className="eyebrow tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(max).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous"
                onClick={() => setIndex((index - 1 + max) % max)}
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-montis-ink/15 text-montis-navy flex items-center justify-center hover:bg-montis-navy hover:text-white transition-colors"
              >
                <ArrowGlyph className="rotate-180" />
              </button>
              <button
                aria-label="Next"
                onClick={() => setIndex((index + 1) % max)}
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-montis-ink/15 text-montis-navy flex items-center justify-center hover:bg-montis-navy hover:text-white transition-colors"
              >
                <ArrowGlyph />
              </button>
            </div>
          </div>
        </div>

        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={GALLERY[index].src}
              src={GALLERY[index].src}
              alt={GALLERY[index].alt}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.02, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Distributors – vertical marquees                                    */
/* ------------------------------------------------------------------ */

const DISTRIBUTORS: string[][] = [
  ["Korzinka", "Makro", "Havas", "Carrefour", "Anglesey", "Smart Deli"],
  ["Havas", "OqTepa", "Uzum Market", "Lebhar", "Beeline Cafe", "Yandex Eats"],
  ["SmartLife", "Valio", "Maroqand", "Texnomart", "Osteria", "Black Bear"],
  ["Korzinka", "Gorod", "Xiva Cafe", "Miraterra", "Evos", "Baraka"],
];

const DistributorCell = ({ name }: { name: string }) => (
  <div className="h-24 md:h-32 flex items-center justify-center px-6 border-b border-montis-ink/10">
    <span className="font-serif text-montis-navy text-2xl md:text-3xl whitespace-nowrap tracking-tight">
      {name}
    </span>
  </div>
);

const Distributors = ({ t }: { t: typeof translations["en"] }) => (
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
        {DISTRIBUTORS.map((col, ci) => {
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
        href="#contact"
        className="group inline-flex min-h-[44px] items-center gap-3 pl-5 sm:pl-6 pr-4 sm:pr-5 py-3 sm:py-4 bg-montis-navy text-white rounded-full relative overflow-hidden"
      >
        <span className="eyebrow-s relative z-10">{t.distributors.online}</span>
        <ArrowGlyph className="relative z-10 transition-transform duration-500 group-hover:translate-x-1" />
        <span className="absolute inset-0 bg-montis-blue translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
      </a>
      <a
        href="#contact"
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

const CTA = ({ t }: { t: typeof translations["en"] }) => (
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

const Footer = ({ t }: { t: typeof translations["en"] }) => (
  <footer id="contact" className="relative bg-montis-cream border-t border-montis-ink/10">
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-28">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="font-serif text-5xl md:text-7xl text-montis-navy tracking-tighter mb-6">MONTIS</div>
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
            <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-montis-blue" /> +998(88) 141-09-80</li>
            <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-montis-blue" /> +998(97) 155-22-66</li>
            <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-montis-blue" /> Ташкент, Узбекистан</li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="eyebrow text-montis-ink/60 mb-6">{t.footer.nav}</div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-montis-navy">
            <li><a href="#video" className="hover:text-montis-blue transition-colors">{t.nav.source}</a></li>
            <li><a href="#composition" className="hover:text-montis-blue transition-colors">{t.nav.composition}</a></li>
            <li><a href="#purification" className="hover:text-montis-blue transition-colors">{t.nav.purification}</a></li>
            <li><a href="#gallery" className="hover:text-montis-blue transition-colors">{t.nav.gallery}</a></li>
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

  const t = translations[lang];

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
        {loading && <Preloader key="preloader" onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <Header
        t={t}
        lang={lang}
        setLang={setLang}
        isLangOpen={isLangOpen}
        setIsLangOpen={setIsLangOpen}
      />

      <main>
        <Hero t={t} />
        <SecondScreenVideo />
        <Composition t={t} />
        <Purification t={t} />
        <Formats t={t} />
        <Gallery t={t} />
        <Distributors t={t} />
        <CTA t={t} />
      </main>

      <Footer t={t} />
    </div>
  );
}
