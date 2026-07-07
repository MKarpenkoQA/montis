export type Language = "ru" | "uz" | "en";

export type Advantage = { title: string; text: string };
export type PurificationStep = { title: string; desc: string };
export type FormatCard = {
  volume: string;
  desc: string;
  image: string;
  sparkImage: string;
  sparkLabel: string;
};
export type MineralItem = { label: string; value: string; desc: string };

export type TranslationBundle = {
  nav: { source: string; composition: string; purification: string; contact: string };
  buy: string;
  hero: { eyebrow: string; title: string; subtitle: string };
  source: {
    eyebrow: string;
    title: string;
    text: string;
    introLine: string;
    scrollHint: string;
    depthLabel: string;
    depthUnit: string;
    depthMax: number;
    depthScale: number[];
    advantages: Advantage[];
  };
  composition: {
    eyebrow: string;
    title: string;
    text: string;
    mineralization: string;
    mineralizationDesc: string;
    mineralizationValue: string;
    mineralizationUnit: string;
    tableTitle: string;
    bottleImage: string;
    items: Record<"ca" | "mg" | "na" | "hco3" | "k" | "so4", MineralItem>;
  };
  purification: {
    eyebrow: string;
    title: string;
    text: string;
    steps: PurificationStep[];
  };
  formats: {
    eyebrow: string;
    title: string;
    text: string;
    stillLabel: string;
    cards: FormatCard[];
  };
  distributors: {
    eyebrow: string;
    title: string;
    text: string;
    offline: string;
    mapTitle: string;
    mapLink: string;
  };
  cta: { eyebrow: string; title: string; button: string };
  footer: {
    desc: string;
    contacts: string;
    nav: string;
    brand: string;
    rights: string;
    privacy: string;
    terms: string;
  };
};

export type SiteSettings = {
  phones: string[];
  address: string;
  mapEmbedUrl: string;
  mapExternalUrl: string;
  instagramUrl: string;
  telegramUrl: string;
  distributorMarquee: string[][];
};

export type SiteMedia = {
  heroVideo: string;
  heroPoster: string;
  logo: string;
  logoIcon: string;
  sourceVideo: string;
  sourcePoster: string;
  sourceMobileImage: string;
  purificationSteps: [string, string, string, string];
  ctaBackground: string;
};

export type SiteContent = {
  meta: { updatedAt: string };
  settings: SiteSettings;
  media: SiteMedia;
  translations: Record<Language, TranslationBundle>;
};
