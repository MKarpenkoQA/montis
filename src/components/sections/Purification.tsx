import { motion } from "motion/react";
import { Filter, Layers, Sun, Wind } from "lucide-react";
import { useState } from "react";
import { FlipCard } from "../FlipCard";
import { SectionIntro } from "../ui/SectionIntro";
import { ResponsiveImage } from "../ui/ResponsiveImage";
import { resolveMediaUrl } from "../../lib/mediaUrl";
import type { SiteMedia, TranslationBundle } from "../../content/types";

const PURIFICATION_ICONS = [Filter, Sun, Wind, Layers] as const;

type PurificationProps = {
  t: TranslationBundle;
  media: SiteMedia;
};

export const Purification = ({ t, media }: PurificationProps) => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  return (
    <section id="purification" className="relative py-[clamp(5rem,12vh,10rem)] bg-montis-navy text-white overflow-hidden">
      <div className="absolute inset-0 opacity-25 blur-3xl bg-gradient-to-r from-montis-blue via-transparent to-transparent" />
      <div className="site-container relative z-10">
        <SectionIntro
          eyebrow={t.purification.eyebrow}
          title={t.purification.title}
          description={t.purification.text}
          eyebrowClassName="text-montis-blue mb-6"
          titleClassName="font-sans not-italic text-section-display-lg text-white"
          descriptionClassName="text-white/65 md:pt-4"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 mt-20">
          {t.purification.steps.map((step, index) => {
            const Icon = PURIFICATION_ICONS[index] ?? Filter;
            const flipped = flippedIndex === index;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <FlipCard
                  flipped={flipped}
                  onFlip={() => setFlippedIndex(flipped ? null : index)}
                  ariaLabel={step.title}
                  className="rounded-3xl p-[1px] bg-gradient-to-b from-white/15 to-transparent hover:from-montis-blue/60"
                  front={
                    <div className="relative h-full bg-montis-navy overflow-hidden">
                      <ResponsiveImage
                        src={resolveMediaUrl(media.purificationSteps[index])}
                        alt=""
                        loading={index === 0 ? "eager" : "lazy"}
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-montis-navy/60" />
                      <div className="relative z-10 h-full p-6 md:p-7 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="eyebrow-s text-white/70">0{index + 1}</span>
                          <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-montis-blue" />
                          </span>
                        </div>
                        <h3 className="font-sans not-italic text-3xl text-white leading-tight">{step.title}</h3>
                      </div>
                    </div>
                  }
                  back={
                    <div className="relative h-full bg-montis-navy p-6 md:p-7 flex flex-col justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-montis-blue/20 to-transparent" />
                      <div className="relative z-10">
                        <span className="eyebrow-s text-montis-blue mb-4 block">0{index + 1}</span>
                        <h3 className="font-sans not-italic text-2xl text-white mb-4">{step.title}</h3>
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
