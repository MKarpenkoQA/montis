import type { Dispatch, SetStateAction } from "react";
import type { Language, SiteContent } from "../content/types";

export const updateTranslation = (
  setContent: Dispatch<SetStateAction<SiteContent>>,
  language: Language,
  mutate: (bundle: SiteContent["translations"][Language]) => void,
): void => {
  setContent((current) => {
    const next = structuredClone(current);
    mutate(next.translations[language]);
    return next;
  });
};
