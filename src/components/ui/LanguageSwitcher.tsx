import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import type { Language } from "../../content/types";

const LANGUAGES: Language[] = ["ru", "uz", "en"];

type LanguageSwitcherProps = {
  lang: Language;
  setLang: (language: Language) => void;
  dropUp?: boolean;
  className?: string;
};

export const LanguageSwitcher = ({ lang, setLang, dropUp = false, className = "" }: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-montis-ink/15 hover:border-montis-navy/40 transition-colors min-h-[44px]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Выбор языка"
      >
        <Globe className="w-3.5 h-3.5 text-montis-navy" />
        <span className="eyebrow-s">{lang}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropUp ? 8 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dropUp ? 8 : -8 }}
            transition={{ duration: 0.2 }}
            role="listbox"
            className={`absolute right-0 w-28 bg-montis-cream rounded-xl shadow-xl border border-montis-ink/10 overflow-hidden z-10 ${
              dropUp ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            {LANGUAGES.map((language) => (
              <button
                key={language}
                type="button"
                role="option"
                aria-selected={lang === language}
                onClick={() => {
                  setLang(language);
                  setIsOpen(false);
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
  );
};
