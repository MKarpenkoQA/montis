import { useEffect, useState } from "react";
import type { SiteContent } from "../content/types";
import { defaultSiteContent } from "../content/defaults";
import { normalizeSiteContent } from "../content/normalizeSiteContent";

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content")
      .then((res) => (res.ok ? res.json() : defaultSiteContent))
      .then((data: unknown) => {
        if (!cancelled) setContent(normalizeSiteContent(data));
      })
      .catch(() => {
        if (!cancelled) setContent(defaultSiteContent);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { content, ready };
};
