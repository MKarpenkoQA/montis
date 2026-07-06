import assert from "node:assert/strict";
import { defaultSiteContent } from "./defaults";
import { normalizeSiteContent } from "./normalizeSiteContent";

const fromNull = normalizeSiteContent(null);
assert.deepEqual(fromNull, defaultSiteContent);

const partial = normalizeSiteContent({
  translations: {
    ru: {
      hero: {
        title: "Custom hero title",
      },
    },
  },
});

assert.equal(partial.translations.ru.hero.title, "Custom hero title");
assert.equal(partial.translations.ru.hero.subtitle, defaultSiteContent.translations.ru.hero.subtitle);
assert.equal(partial.translations.ru.nav.source, defaultSiteContent.translations.ru.nav.source);
assert.deepEqual(partial.settings, defaultSiteContent.settings);
assert.deepEqual(partial.translations.uz, defaultSiteContent.translations.uz);

const malformed = normalizeSiteContent({
  settings: {
    phones: "+998",
    distributorMarquee: ["bad-row"],
  },
  translations: {
    ru: null,
    uz: {
      purification: {
        steps: [
          {
            title: "Custom step",
          },
        ],
      },
    },
  },
});

assert.deepEqual(malformed.settings.phones, defaultSiteContent.settings.phones);
assert.deepEqual(malformed.settings.distributorMarquee, defaultSiteContent.settings.distributorMarquee);
assert.deepEqual(malformed.translations.ru, defaultSiteContent.translations.ru);
assert.equal(malformed.translations.uz.purification.steps[0].title, "Custom step");
assert.equal(
  malformed.translations.uz.purification.steps[0].desc,
  defaultSiteContent.translations.uz.purification.steps[0].desc,
);

console.log("normalizeSiteContent tests passed");
