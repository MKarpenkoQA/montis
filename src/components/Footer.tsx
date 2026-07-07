import { Instagram, MapPin, Phone, Send } from "lucide-react";
import { MontisLogoLink } from "./MontisLogo";
import { LanguageSwitcher } from "./ui/LanguageSwitcher";
import { PRIMARY_NAV_ITEMS } from "../constants/navigation";
import { scrollToSection } from "../lib/scrollToSection";
import type { Language, SiteContent, TranslationBundle } from "../content/types";

type FooterProps = {
  t: TranslationBundle;
  settings: SiteContent["settings"];
  lang: Language;
  setLang: (language: Language) => void;
};

export const Footer = ({ t, settings, lang, setLang }: FooterProps) => (
  <footer id="contact" className="relative bg-montis-cream border-t border-montis-ink/10 pb-safe">
    <div className="site-container py-16 sm:py-20 md:py-28">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <MontisLogoLink iconSize={56} className="mb-6" />
          <p className="text-montis-ink/70 max-w-md">{t.footer.desc}</p>
          <div className="flex gap-3 mt-8">
            {settings.instagramUrl ? (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-montis-ink/10 flex items-center justify-center text-montis-navy hover:border-montis-blue hover:text-montis-blue transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            ) : (
              <span
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-montis-ink/10 flex items-center justify-center text-montis-ink/30 cursor-not-allowed"
                aria-hidden
                title="Instagram — скоро"
              >
                <Instagram className="w-4 h-4" />
              </span>
            )}
            {settings.telegramUrl ? (
              <a
                href={settings.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-montis-ink/10 flex items-center justify-center text-montis-navy hover:border-montis-blue hover:text-montis-blue transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            ) : (
              <span
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-montis-ink/10 flex items-center justify-center text-montis-ink/30 cursor-not-allowed"
                aria-hidden
                title="Telegram — скоро"
              >
                <Send className="w-4 h-4" />
              </span>
            )}
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
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-montis-blue" /> {settings.address}
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="eyebrow text-montis-ink/60 mb-6">{t.footer.nav}</div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-montis-navy">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-montis-blue transition-colors">
                  {t.nav[item.labelKey]}
                </a>
              </li>
            ))}
            <li>
              <a href="#formats" className="hover:text-montis-blue transition-colors">
                {t.formats.eyebrow.replace("✦ ", "")}
              </a>
            </li>
            <li>
              <a href="#distributors" className="hover:text-montis-blue transition-colors">
                {t.footer.brand}
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="hover:text-montis-blue transition-colors text-left"
              >
                {t.nav.contact}
              </button>
            </li>
          </ul>
          <div className="mt-6">
            <LanguageSwitcher lang={lang} setLang={setLang} />
          </div>
        </div>
      </div>

      <div className="pt-10 sm:pt-12 mt-12 sm:mt-16 border-t border-montis-ink/10 flex flex-col md:flex-row justify-between gap-4 sm:gap-6 eyebrow-s text-montis-ink/60">
        <span>© 2026 MONTIS. {t.footer.rights}</span>
        <div className="flex gap-6">
          <span className="text-montis-ink/40 cursor-not-allowed">{t.footer.privacy}</span>
          <span className="text-montis-ink/40 cursor-not-allowed">{t.footer.terms}</span>
        </div>
      </div>
    </div>
  </footer>
);
