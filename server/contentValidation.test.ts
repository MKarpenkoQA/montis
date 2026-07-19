import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultSiteContent } from "../src/content/defaults.ts";
import { parseSiteContent } from "./contentValidation.ts";

describe("content validation", () => {
  it("accepts the complete CMS document", () => {
    const content = structuredClone(defaultSiteContent);

    const parsed = parseSiteContent(content);

    assert.equal(parsed.translations.ru.hero.title, content.translations.ru.hero.title);
    assert.deepEqual(parsed.media.purificationSteps, content.media.purificationSteps);
  });

  it("rejects hollow content that would wipe nested translation data", () => {
    const hollowContent = {
      ...structuredClone(defaultSiteContent),
      settings: {},
      media: {},
      translations: {
        ru: {},
        uz: {},
        en: {},
      },
    };

    assert.throws(() => parseSiteContent(hollowContent), /Missing settings.address/);
  });

  it("rejects missing nested fields required by the public site render", () => {
    const content = structuredClone(defaultSiteContent);
    delete (content.translations.ru.composition.items as Partial<typeof content.translations.ru.composition.items>).ca;

    assert.throws(() => parseSiteContent(content), /Missing translations\.ru\.composition\.items\.ca/);
  });
});
