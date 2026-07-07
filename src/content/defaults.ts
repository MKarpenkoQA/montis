import type { SiteContent, SiteMedia } from "./types";
import siteJson from "../../content/site.json";

export const defaultSiteMedia: SiteMedia = {
  heroVideo: "/media/montis-hero.mp4",
  heroPoster: "/media/mountain-lake-hero.jpg",
  logo: "/media/logo-montis.png",
  logoIcon: "/media/logo-montis-icon.png",
  sourceVideo: "/media/montis-bottle.mp4",
  sourcePoster: "/media/montis-bottle-poster.jpg",
  sourceMobileImage: "/media/black.png",
  purificationSteps: [
    "/media/filtration.png",
    "/media/uv.png",
    "/media/ozone.png",
    "/media/osmos.png",
  ],
  ctaBackground: "/media/back.png",
};

export const defaultSiteContent: SiteContent = {
  ...(siteJson as Omit<SiteContent, "media">),
  media: { ...defaultSiteMedia, ...(siteJson as SiteContent).media },
};

export type { Language, TranslationBundle, SiteSettings, SiteMedia, SiteContent } from "./types";
