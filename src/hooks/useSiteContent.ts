import { useEffect, useState } from "react";
import type { SiteContent } from "../content/types";
import { defaultSiteContent } from "../content/defaults";
import { loadSiteContent } from "../lib/loadSiteContent";

const CONTENT_LOAD_TIMEOUT_MS = 10_000;

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Avoid showing bundled content before normal API responses, but don't lock the site forever.
    const timeoutId = window.setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, CONTENT_LOAD_TIMEOUT_MS);

    void loadSiteContent()
      .then((data) => {
        if (!cancelled) {
          window.clearTimeout(timeoutId);
          setContent(data);
          setLoading(false);
        }
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return { content, loading };
};
