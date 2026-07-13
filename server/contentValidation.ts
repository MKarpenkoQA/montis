import type { Language, SiteContent, SiteMedia } from "../src/content/types.js";
import { defaultSiteMedia } from "../src/content/defaults.js";

const LANGUAGES: Language[] = ["ru", "uz", "en"];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const mergeMedia = (value: unknown): SiteMedia => {
  if (!isRecord(value)) return defaultSiteMedia;

  const steps = Array.isArray(value.purificationSteps)
    ? value.purificationSteps.filter((item): item is string => typeof item === "string")
    : [];

  return {
    ...defaultSiteMedia,
    ...(value as Partial<SiteMedia>),
    purificationSteps:
      steps.length === 4
        ? (steps as SiteMedia["purificationSteps"])
        : defaultSiteMedia.purificationSteps,
  };
};

/** Validate and narrow an untrusted payload to SiteContent. */
export const parseSiteContent = (value: unknown): SiteContent => {
  if (!isRecord(value)) {
    throw new Error("Content must be an object");
  }

  if (!isRecord(value.settings)) {
    throw new Error("Missing settings");
  }

  if (!isRecord(value.translations)) {
    throw new Error("Missing translations");
  }

  for (const language of LANGUAGES) {
    if (!isRecord(value.translations[language])) {
      throw new Error(`Missing translation bundle: ${language}`);
    }
  }

  const settings = value.settings as SiteContent["settings"];

  return {
    ...(value as SiteContent),
    media: mergeMedia(value.media),
    settings: {
      ...settings,
      instagramUrl: settings.instagramUrl ?? "",
      telegramUrl: settings.telegramUrl ?? "",
    },
  };
};
