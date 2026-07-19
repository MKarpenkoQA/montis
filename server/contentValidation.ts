import type { Language, SiteContent, SiteMedia, SiteSettings, TranslationBundle } from "../src/content/types.js";

const LANGUAGES: Language[] = ["ru", "uz", "en"];
const MINERAL_KEYS = ["ca", "mg", "na", "hco3", "k", "so4"] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const requireRecord = (value: unknown, path: string): Record<string, unknown> => {
  if (!isRecord(value)) {
    throw new Error(`Missing ${path}`);
  }

  return value;
};

const requireString = (value: unknown, path: string): void => {
  if (typeof value !== "string") {
    throw new Error(`Missing ${path}`);
  }
};

const parseOptionalString = (value: unknown, path: string): string | undefined => {
  if (value !== undefined && typeof value !== "string") {
    throw new Error(`Invalid ${path}`);
  }

  return value;
};

const requireNumber = (value: unknown, path: string): void => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Missing ${path}`);
  }
};

const requireStringFields = (record: Record<string, unknown>, path: string, fields: readonly string[]): void => {
  for (const field of fields) {
    requireString(record[field], `${path}.${field}`);
  }
};

const requireStringArray = (value: unknown, path: string): string[] => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Missing ${path}`);
  }

  return value;
};

const requireRecordArray = (value: unknown, path: string): Record<string, unknown>[] => {
  if (!Array.isArray(value) || value.some((item) => !isRecord(item))) {
    throw new Error(`Missing ${path}`);
  }

  return value;
};

const requireNumberArray = (value: unknown, path: string): void => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number" || !Number.isFinite(item))) {
    throw new Error(`Missing ${path}`);
  }
};

const parseMedia = (value: unknown): SiteMedia => {
  const media = requireRecord(value, "media");
  requireStringFields(media, "media", [
    "heroVideo",
    "heroPoster",
    "logo",
    "logoIcon",
    "sourceVideo",
    "sourcePoster",
    "sourceMobileImage",
    "ctaBackground",
  ]);

  const steps = requireStringArray(media.purificationSteps, "media.purificationSteps");
  if (steps.length !== 4) {
    throw new Error("Missing media.purificationSteps");
  }

  return {
    ...(media as SiteMedia),
    purificationSteps: steps as SiteMedia["purificationSteps"],
  };
};

const parseSettings = (value: unknown): SiteSettings => {
  const settings = requireRecord(value, "settings");
  requireStringFields(settings, "settings", ["address", "mapEmbedUrl", "mapExternalUrl"]);
  requireStringArray(settings.phones, "settings.phones");
  const instagramUrl = parseOptionalString(settings.instagramUrl, "settings.instagramUrl");
  const telegramUrl = parseOptionalString(settings.telegramUrl, "settings.telegramUrl");

  if (!Array.isArray(settings.distributorMarquee)) {
    throw new Error("Missing settings.distributorMarquee");
  }
  for (let index = 0; index < settings.distributorMarquee.length; index += 1) {
    requireStringArray(settings.distributorMarquee[index], `settings.distributorMarquee.${index}`);
  }

  return {
    ...(settings as SiteSettings),
    instagramUrl: instagramUrl ?? "",
    telegramUrl: telegramUrl ?? "",
  };
};

const validateTranslationBundle = (value: unknown, path: string): TranslationBundle => {
  const bundle = requireRecord(value, path);
  requireString(bundle.buy, `${path}.buy`);

  const nav = requireRecord(bundle.nav, `${path}.nav`);
  requireStringFields(nav, `${path}.nav`, ["source", "composition", "purification", "contact"]);

  const hero = requireRecord(bundle.hero, `${path}.hero`);
  requireStringFields(hero, `${path}.hero`, ["eyebrow", "title", "subtitle"]);

  const source = requireRecord(bundle.source, `${path}.source`);
  requireStringFields(source, `${path}.source`, [
    "eyebrow",
    "title",
    "text",
    "introLine",
    "scrollHint",
    "depthLabel",
    "depthUnit",
  ]);
  requireNumber(source.depthMax, `${path}.source.depthMax`);
  requireNumberArray(source.depthScale, `${path}.source.depthScale`);
  requireRecordArray(source.advantages, `${path}.source.advantages`).forEach((advantage, index) => {
    requireStringFields(advantage, `${path}.source.advantages.${index}`, ["title", "text"]);
  });

  const composition = requireRecord(bundle.composition, `${path}.composition`);
  requireStringFields(composition, `${path}.composition`, [
    "eyebrow",
    "title",
    "text",
    "mineralization",
    "mineralizationDesc",
    "mineralizationValue",
    "mineralizationUnit",
    "tableTitle",
    "bottleImage",
  ]);
  const items = requireRecord(composition.items, `${path}.composition.items`);
  for (const mineral of MINERAL_KEYS) {
    const item = requireRecord(items[mineral], `${path}.composition.items.${mineral}`);
    requireStringFields(item, `${path}.composition.items.${mineral}`, ["label", "value", "desc"]);
  }

  const purification = requireRecord(bundle.purification, `${path}.purification`);
  requireStringFields(purification, `${path}.purification`, ["eyebrow", "title", "text"]);
  requireRecordArray(purification.steps, `${path}.purification.steps`).forEach((step, index) => {
    requireStringFields(step, `${path}.purification.steps.${index}`, ["title", "desc"]);
  });

  const formats = requireRecord(bundle.formats, `${path}.formats`);
  requireStringFields(formats, `${path}.formats`, ["eyebrow", "title", "text", "stillLabel"]);
  requireRecordArray(formats.cards, `${path}.formats.cards`).forEach((card, index) => {
    requireStringFields(card, `${path}.formats.cards.${index}`, [
      "volume",
      "desc",
      "image",
      "sparkImage",
      "sparkLabel",
    ]);
  });

  const distributors = requireRecord(bundle.distributors, `${path}.distributors`);
  requireStringFields(distributors, `${path}.distributors`, [
    "eyebrow",
    "title",
    "text",
    "offline",
    "mapTitle",
    "mapLink",
  ]);

  const cta = requireRecord(bundle.cta, `${path}.cta`);
  requireStringFields(cta, `${path}.cta`, ["eyebrow", "title", "button"]);

  const footer = requireRecord(bundle.footer, `${path}.footer`);
  requireStringFields(footer, `${path}.footer`, [
    "desc",
    "contacts",
    "nav",
    "brand",
    "rights",
    "privacy",
    "terms",
  ]);

  return bundle as TranslationBundle;
};

/** Validate and narrow an untrusted payload to SiteContent. */
export const parseSiteContent = (value: unknown): SiteContent => {
  if (!isRecord(value)) {
    throw new Error("Content must be an object");
  }

  const settings = parseSettings(value.settings);
  const media = parseMedia(value.media);
  const translations = requireRecord(value.translations, "translations");

  for (const language of LANGUAGES) {
    validateTranslationBundle(translations[language], `translations.${language}`);
  }

  return {
    ...(value as SiteContent),
    media,
    settings,
  };
};
