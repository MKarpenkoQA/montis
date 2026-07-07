import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { FlipCard } from "../FlipCard";
import { SectionIntro } from "../ui/SectionIntro";
import { ResponsiveImage } from "../ui/ResponsiveImage";
import type { TranslationBundle } from "../../content/types";

type FormatProductCardProps = {
  card: TranslationBundle["formats"]["cards"][number];
  index: number;
  stillLabel: string;
};

const FormatProductCard = ({ card, index, stillLabel }: FormatProductCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const intervalId = window.setInterval(() => setFlipped((value) => !value), 5000);
    return () => window.clearInterval(intervalId);
  }, [paused]);

  const renderCardFace = (
    volume: string,
    description: string,
    image: string,
    label: string,
    backgroundClass: string,
  ) => (
    <div className={`relative h-full overflow-hidden ${backgroundClass}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#a5bfdb]/40 via-[#d7e5f5]/30 to-[#9ab7d6]/35" />
      <div className="relative z-10 h-full p-6 md:p-8 flex flex-col">
        <div>
          <span className="eyebrow-s text-white/80">{label}</span>
          <h3 className="font-sans not-italic text-4xl sm:text-5xl md:text-6xl leading-none text-white mt-2">{volume}</h3>
          <p className="mt-3 sm:mt-4 text-white/95 text-lg sm:text-xl leading-tight whitespace-pre-line">{description}</p>
        </div>
        <div className="mt-auto flex justify-center items-end">
          <ResponsiveImage
            src={image}
            alt=""
            loading="lazy"
            sizes="(max-width: 640px) 70vw, 300px"
            className="max-h-[min(300px,50vh)] sm:max-h-[min(420px,55vh)] md:max-h-[min(500px,60vh)] w-auto object-contain drop-shadow-[0_18px_45px_rgba(10,18,45,0.24)]"
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
        onFlip={() => setFlipped((value) => !value)}
        heightClass="h-[440px] sm:h-[520px] md:h-[620px]"
        className="overflow-hidden rounded-[24px] md:rounded-[28px]"
        ariaLabel={`MONTIS ${card.volume}`}
        front={renderCardFace(card.volume, card.desc, card.image, stillLabel, "bg-montis-navy/15")}
        back={renderCardFace(card.volume, card.desc, card.sparkImage, card.sparkLabel, "bg-montis-navy")}
      />
    </motion.div>
  );
};

type FormatsProps = {
  t: TranslationBundle;
};

export const Formats = ({ t }: FormatsProps) => (
  <section id="formats" className="relative py-[clamp(5rem,12vh,9rem)] bg-montis-cream overflow-hidden">
    <div className="site-container">
      <SectionIntro
        eyebrow={t.formats.eyebrow}
        title={t.formats.title}
        description={t.formats.text}
        eyebrowClassName="text-montis-navy mb-5"
        titleClassName="font-sans not-italic text-section-display-lg text-montis-navy"
        descriptionClassName="text-montis-ink/70 max-w-md"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mt-12 md:mt-14">
        {t.formats.cards.map((card, index) => (
          <FormatProductCard key={card.volume} card={card} index={index} stillLabel={t.formats.stillLabel} />
        ))}
      </div>
    </div>
  </section>
);
