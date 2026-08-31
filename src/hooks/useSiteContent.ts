import { useEffect, useState } from "react";
import type { SiteContent } from "../content/types";
import { defaultSiteContent } from "../content/defaults";
import { loadSiteContent } from "../lib/loadSiteContent";

const CONTENT_RETRY_MS = 5_000;

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    let cancelled = false;
    let retryId: number | undefined;

    const load = () => {
      void loadSiteContent()
        .then((data) => {
          if (!cancelled) setContent(data);
        })
        .catch((error) => {
          if (cancelled) return;
          console.warn("[content] Failed to load live site content; retrying.", error);
          retryId = window.setTimeout(load, CONTENT_RETRY_MS);
        });
    };

    load();

    return () => {
      cancelled = true;
      if (retryId !== undefined) window.clearTimeout(retryId);
    };
  }, []);

  return { content };
};
