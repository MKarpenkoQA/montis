import type { TranslationBundle } from "../content/types";

export const PRIMARY_NAV_ITEMS = [
  { href: "#video", labelKey: "source" },
  { href: "#composition", labelKey: "composition" },
  { href: "#purification", labelKey: "purification" },
] as const satisfies ReadonlyArray<{
  href: string;
  labelKey: keyof TranslationBundle["nav"];
}>;
