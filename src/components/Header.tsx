import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Globe } from "lucide-react";
import { MontisLogoLink } from "./MontisLogo";
import { ArrowPillButton } from "./ui/ArrowPillButton";
import { PRIMARY_NAV_ITEMS } from "../constants/navigation";
import { useScrollDirection } from "../hooks/useScrollDirection";
import type { Language, SiteMedia, TranslationBundle } from "../content/types";

type HeaderProps = {
  t: TranslationBundle;
  lang: Language;
  setLang: (language: Language) => void;
  isLangOpen: boolean;
  setIsLangOpen: (open: boolean) => void;
  media: SiteMedia;
};

const LANGUAGES: Language[] = ["ru", "uz", "en"];

export const Header = ({ t, lang, setLang, isLangOpen, setIsLangOpen, media }: HeaderProps) => {
  const hidden = useScrollDirection();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 pt-safe transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hidden ? "header-hidden" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3 site-container py-3 sm:py-4 md:py-5 backdrop-blur-md bg-montis-cream/70 border-b border-montis-ink/10">
        <MontisLogoLink iconSize={36} className="max-w-[140px] sm:max-w-[160px] md:max-w-none" logoSrc={media.logo} />

        <nav className="hidden md:flex items-center gap-10">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="eyebrow text-montis-ink/80 hover:text-montis-navy transition-colors"
            >
              {t.nav[item.labelKey]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
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
                  {LANGUAGES.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => {
                        setLang(language);
                        setIsLangOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left eyebrow-s transition-colors ${
                        lang === language ? "bg-montis-navy text-white" : "text-montis-ink hover:bg-montis-ink/5"
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ArrowPillButton
            scrollToId="contact"
            label={t.buy}
            className="pl-4 sm:pl-5 pr-3 sm:pr-4 py-2.5 sm:py-3"
            labelClassName="truncate max-w-[30vw] sm:max-w-none"
            arrowStyle={{ animation: "arrow-loop 1.6s ease-in-out infinite" }}
          />
        </div>
      </div>
    </header>
  );
};
