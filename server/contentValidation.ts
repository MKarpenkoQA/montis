import type { Language, SiteContent, SiteMedia } from "../src/content/types.js";
import { defaultSiteMedia } from "../src/content/defaults.js";

const LANGUAGES: Language[] = ["ru", "uz", "en"];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type UrlSettingKey = "mapEmbedUrl" | "mapExternalUrl" | "instagramUrl" | "telegramUrl";

const OPTIONAL_URL_SETTINGS = new Set<UrlSettingKey>(["instagramUrl", "telegramUrl"]);

const normalizeHttpUrlSetting = (
  settings: Partial<SiteContent["settings"]>,
  key: UrlSettingKey,
): string => {
  const rawValue = settings[key];

  if (rawValue === undefined && OPTIONAL_URL_SETTINGS.has(key)) {
    return "";
  }

  if (typeof rawValue !== "string") {
    throw new Error(`Invalid URL setting: ${key}`);
  }

  const value = rawValue.trim();
  if (value === "" && OPTIONAL_URL_SETTINGS.has(key)) {
    return "";
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid URL setting: ${key}`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Invalid URL setting: ${key}`);
  }

  return value;
};

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

  const settings = value.settings as Partial<SiteContent["settings"]>;

  return {
    ...(value as SiteContent),
    media: mergeMedia(value.media),
    settings: {
      ...(settings as SiteContent["settings"]),
      mapEmbedUrl: normalizeHttpUrlSetting(settings, "mapEmbedUrl"),
      mapExternalUrl: normalizeHttpUrlSetting(settings, "mapExternalUrl"),
      instagramUrl: normalizeHttpUrlSetting(settings, "instagramUrl"),
      telegramUrl: normalizeHttpUrlSetting(settings, "telegramUrl"),
    },
  };
};
