import type { SiteContent } from "./types";
import { defaultSiteMedia } from "./mediaDefaults";
import siteJson from "../../content/site.json";

export const defaultSiteContent: SiteContent = {
  ...(siteJson as Omit<SiteContent, "media">),
  media: { ...defaultSiteMedia, ...(siteJson as SiteContent).media },
};

export type { Language, TranslationBundle, SiteSettings, SiteMedia, SiteContent } from "./types";
export { defaultSiteMedia } from "./mediaDefaults";
