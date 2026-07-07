import type { Language, SiteContent } from "../content/types";

export const updateTranslation = (
  content: SiteContent,
  setContent: (value: SiteContent) => void,
  language: Language,
  mutate: (bundle: SiteContent["translations"][Language]) => void,
): void => {
  const next = structuredClone(content);
  mutate(next.translations[language]);
  setContent(next);
};
