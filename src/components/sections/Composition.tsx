import { motion } from "motion/react";
import { BadgeCheck, Droplets, Heart, Leaf, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { RevealLines } from "../ui/RevealLines";
import { ResponsiveImage } from "../ui/ResponsiveImage";
import { resolveMediaUrl } from "../../lib/mediaUrl";
import type { TranslationBundle } from "../../content/types";

const MINERAL_ICONS = {
  ca: ShieldCheck,
  mg: Heart,
  na: Droplets,
  k: Zap,
  hco3: Leaf,
  so4: Sparkles,
} as const;

type MineralKey = keyof typeof MINERAL_ICONS;

const LEFT_MINERALS: MineralKey[] = ["ca", "mg", "na"];
const RIGHT_MINERALS: MineralKey[] = ["k", "hco3", "so4"];

type MineralCardProps = {
  item: TranslationBundle["composition"]["items"][MineralKey];
  mineralKey: MineralKey;
  index: number;
};

const MineralCard = ({ item, mineralKey, index }: MineralCardProps) => {
  const Icon = MINERAL_ICONS[mineralKey];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-6 md:p-8 rounded-2xl border border-montis-navy/8 bg-white/85 hover:border-montis-navy/20 hover:shadow-[0_12px_40px_rgba(26,43,86,0.1)] transition-all duration-300 group cursor-default shadow-[0_8px_32px_rgba(26,43,86,0.06)]"
    >
      <div className="flex items-center gap-4 mb-3">
        <div className="w-10 h-10 rounded-full bg-montis-navy/5 flex items-center justify-center group-hover:bg-montis-navy transition-colors">
          <Icon className="w-5 h-5 text-montis-navy group-hover:text-white transition-colors" />
        </div>
        <span className="font-sans not-italic text-2xl text-montis-navy">{item.label}</span>
      </div>
      <div className="flex justify-between items-baseline gap-4">
        <p className="text-montis-ink/70 text-sm leading-relaxed">{item.desc}</p>
        <span className="eyebrow tabular-nums text-montis-blue shrink-0 ml-4 text-[9px]">{item.value}</span>
      </div>
    </motion.div>
  );
};

type CompositionProps = {
  t: TranslationBundle;
};

export const Composition = ({ t }: CompositionProps) => {
  const bottleSrc = resolveMediaUrl(t.composition.bottleImage);

  return (
    <section id="composition" className="relative py-[clamp(5rem,12vh,7.5rem)] bg-white overflow-hidden">
      <div className="site-container max-w-[1280px]">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <Eyebrow className="text-montis-blue tracking-[0.2em] mb-4">{t.composition.eyebrow}</Eyebrow>
          <RevealLines
            as="h2"
            className="font-sans not-italic text-4xl md:text-5xl text-montis-navy mt-4 mb-6"
            text={t.composition.title}
          />
          <p className="text-montis-ink/70 text-base md:text-lg leading-relaxed">{t.composition.text}</p>
        </div>

        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0">
          <div className="w-full lg:w-1/3 space-y-6 md:space-y-8 z-20">
            {LEFT_MINERALS.map((key, index) => (
              <MineralCard key={key} mineralKey={key} item={t.composition.items[key]} index={index} />
            ))}
          </div>

          <div className="w-full lg:w-1/3 relative flex justify-center items-center py-8 lg:py-0">
            <div className="absolute inset-0 bg-montis-blue/10 rounded-full blur-3xl animate-pulse" />
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-[400px] aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            >
              <ResponsiveImage
                src={bottleSrc}
                alt="MONTIS"
                loading="lazy"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 400px"
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-montis-navy/40 to-transparent pointer-events-none" />
            </motion.div>
          </div>

          <div className="w-full lg:w-1/3 space-y-6 md:space-y-8 z-20">
            {RIGHT_MINERALS.map((key, index) => (
              <MineralCard key={key} mineralKey={key} item={t.composition.items[key]} index={index + 3} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 md:mt-20 p-8 md:p-10 rounded-3xl bg-montis-navy/95 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-montis-blue/20 flex items-center justify-center shrink-0">
              <BadgeCheck className="w-8 h-8 text-montis-blue" />
            </div>
            <div>
              <h3 className="text-white font-sans not-italic text-xl md:text-2xl mb-1">{t.composition.mineralization}</h3>
              <p className="text-white/60 text-sm md:text-base leading-relaxed">{t.composition.mineralizationDesc}</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <span className="text-montis-blue block text-xs uppercase tracking-[0.3em] font-bold mb-2">
              {t.composition.tableTitle}
            </span>
            <div className="flex items-baseline justify-center md:justify-end gap-2">
              <span className="text-white font-sans not-italic text-4xl md:text-5xl">{t.composition.mineralizationValue}</span>
              <span className="text-white/50 text-xl font-sans not-italic">{t.composition.mineralizationUnit}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
