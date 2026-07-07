import type { SiteContent } from "../content/types";
import { defaultSiteContent } from "../content/defaults";
import { fetchSiteContent } from "./siteContentApi";

/** Fetch site content from the API, falling back to bundled defaults. */
export const loadSiteContent = async (): Promise<SiteContent> => {
  try {
    return await fetchSiteContent();
  } catch {
    return defaultSiteContent;
  }
};
