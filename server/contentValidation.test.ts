import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultSiteContent } from "../src/content/defaults.js";
import type { SiteContent } from "../src/content/types.js";
import { parseSiteContent } from "./contentValidation.js";

type UrlSettingKey = "mapEmbedUrl" | "mapExternalUrl" | "instagramUrl" | "telegramUrl";

const cloneDefaultContent = (): SiteContent =>
  JSON.parse(JSON.stringify(defaultSiteContent)) as SiteContent;

describe("parseSiteContent URL settings", () => {
  it("keeps valid http URLs and optional blank social URLs", () => {
    const payload = cloneDefaultContent();

    payload.settings.mapEmbedUrl = " https://example.com/embed ";
    payload.settings.mapExternalUrl = "http://example.com/map";
    payload.settings.instagramUrl = "";
    payload.settings.telegramUrl = " https://t.me/montis ";

    const parsed = parseSiteContent(payload);

    assert.equal(parsed.settings.mapEmbedUrl, "https://example.com/embed");
    assert.equal(parsed.settings.mapExternalUrl, "http://example.com/map");
    assert.equal(parsed.settings.instagramUrl, "");
    assert.equal(parsed.settings.telegramUrl, "https://t.me/montis");
  });

  it("rejects executable schemes before settings are persisted", () => {
    const unsafeSettings: Record<UrlSettingKey, string> = {
      mapEmbedUrl: "data:text/html,<script>alert(1)</script>",
      mapExternalUrl: "javascript:alert(1)",
      instagramUrl: "vbscript:msgbox(1)",
      telegramUrl: "file:///etc/passwd",
    };

    for (const [key, value] of Object.entries(unsafeSettings) as Array<[UrlSettingKey, string]>) {
      const payload = cloneDefaultContent();
      payload.settings[key] = value;

      assert.throws(() => parseSiteContent(payload), /Invalid URL setting/);
    }
  });
});
