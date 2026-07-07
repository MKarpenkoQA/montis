import { Eyebrow } from "../ui/Eyebrow";
import { ArrowPillButton } from "../ui/ArrowPillButton";
import { RevealLines } from "../ui/RevealLines";
import { ResponsiveImage } from "../ui/ResponsiveImage";
import { resolveMediaUrl } from "../../lib/mediaUrl";
import type { SiteMedia, TranslationBundle } from "../../content/types";

type CtaSectionProps = {
  t: TranslationBundle;
  media: SiteMedia;
};

export const CtaSection = ({ t, media }: CtaSectionProps) => (
  <section id="cta" className="relative py-[clamp(5rem,12vh,9rem)] bg-montis-navy overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-montis-navy via-[#1e3568] to-montis-charcoal" />
    <div className="absolute inset-0 opacity-20">
      <ResponsiveImage
        src={resolveMediaUrl(media.ctaBackground)}
        alt=""
        loading="lazy"
        sizes="100vw"
        className="w-full h-full object-cover mix-blend-overlay"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="absolute -right-[20%] top-[-30%] h-[80%] w-[60%] rounded-full bg-montis-blue/15 blur-3xl" />
    <div className="relative site-container">
      <Eyebrow className="text-white mb-8">{t.cta.eyebrow}</Eyebrow>
      <RevealLines
        as="h2"
        className="font-sans not-italic text-section-display-lg text-white mb-12"
        text={t.cta.title}
      />
      <ArrowPillButton
        scrollToId="contact"
        label={t.cta.button}
        variant="light"
        className="pl-6 sm:pl-8 pr-5 sm:pr-6 py-3.5 sm:py-5 gap-3 sm:gap-4"
      />
    </div>
  </section>
);
