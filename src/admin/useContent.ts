import { useState, useEffect, useCallback } from "react";
import type { SiteContent } from "../content/types";
import { fetchContent } from "./api";

export const useAdminContent = () => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchContent();
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { content, loading, error, reload };
};
