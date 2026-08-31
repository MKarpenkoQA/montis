import type { SiteContent } from "../content/types";
import { fetchSiteContent } from "./siteContentApi";

const CONTENT_LOAD_TIMEOUT_MS = 10_000;

/** Fetch live site content from the API, bounding hung requests so callers can retry. */
export const loadSiteContent = async (): Promise<SiteContent> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), CONTENT_LOAD_TIMEOUT_MS);

  try {
    return await fetchSiteContent({ signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
};
