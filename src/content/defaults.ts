import type { SiteContent } from "./types";
import siteJson from "../../content/site.json";

export const defaultSiteContent = siteJson as SiteContent;
export const defaultTranslations = defaultSiteContent.translations;

export type { Language, TranslationBundle, SiteSettings, SiteContent } from "./types";
