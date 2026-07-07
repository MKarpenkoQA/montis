import { Eyebrow } from "../ui/Eyebrow";
import { ArrowPillButton } from "../ui/ArrowPillButton";
import { SectionIntro } from "../ui/SectionIntro";
import type { SiteContent, TranslationBundle } from "../../content/types";

const DistributorCell = ({ name }: { name: string }) => (
  <div className="h-24 md:h-32 flex items-center justify-center px-6 border-b border-montis-ink/10">
    <span className="font-sans not-italic text-montis-navy text-2xl md:text-3xl whitespace-nowrap tracking-tight">
      {name}
    </span>
  </div>
);

type DistributorsProps = {
  t: TranslationBundle;
  settings: SiteContent["settings"];
};

export const Distributors = ({ t, settings }: DistributorsProps) => (
  <section id="distributors" className="relative py-[clamp(5rem,12vh,9rem)] bg-montis-cream overflow-hidden">
    <div className="site-container mb-14 md:mb-16">
      <SectionIntro
        eyebrow={t.distributors.eyebrow}
        title={t.distributors.title}
        description={t.distributors.text}
        eyebrowClassName="text-montis-navy mb-6"
        titleClassName="font-sans not-italic text-section-display-lg text-montis-navy"
        descriptionClassName="text-montis-ink/70"
      />
    </div>

    <div className="site-container mb-14 md:mb-16">
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
      className="relative h-[min(56vh,28rem)] md:h-[min(64vh,32rem)] border-y border-montis-ink/15"
      style={{
        maskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4">
        {settings.distributorMarquee.map((column, columnIndex) => {
          const track = columnIndex % 2 === 0 ? "marquee-track-up" : "marquee-track-down";
          const items = [...column, ...column];
          return (
            <div key={columnIndex} className="relative overflow-hidden border-l border-montis-ink/10 first:border-l-0">
              <div className={`flex flex-col ${track}`} style={{ animationDuration: `${30 + columnIndex * 6}s` }}>
                {items.map((name, itemIndex) => (
                  <DistributorCell key={`${columnIndex}-${itemIndex}`} name={name} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="site-container mt-12 md:mt-14 flex flex-wrap gap-3 sm:gap-4">
      <ArrowPillButton
        href={settings.mapExternalUrl}
        label={t.distributors.offline}
        variant="outline"
        className="pl-5 sm:pl-6 pr-4 sm:pr-5 py-3 sm:py-4"
        target="_blank"
        rel="noopener noreferrer"
      />
    </div>
  </section>
);
