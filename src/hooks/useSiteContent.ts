import { useEffect, useState } from "react";
import type { SiteContent } from "../content/types";
import { defaultSiteContent } from "../content/defaults";
import { loadSiteContent } from "../lib/loadSiteContent";

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    let cancelled = false;
    void loadSiteContent().then((data) => {
      if (!cancelled) setContent(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { content };
};
