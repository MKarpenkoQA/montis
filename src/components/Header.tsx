import { MontisLogoLink } from "./MontisLogo";
import { ArrowPillButton } from "./ui/ArrowPillButton";
import { LanguageSwitcher } from "./ui/LanguageSwitcher";
import { PRIMARY_NAV_ITEMS } from "../constants/navigation";
import { useScrollDirection } from "../hooks/useScrollDirection";
import type { Language, SiteMedia, TranslationBundle } from "../content/types";

type HeaderProps = {
  t: TranslationBundle;
  lang: Language;
  setLang: (language: Language) => void;
  media: SiteMedia;
};

export const Header = ({ t, lang, setLang, media }: HeaderProps) => {
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
          <LanguageSwitcher lang={lang} setLang={setLang} className="hidden md:block" />

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
