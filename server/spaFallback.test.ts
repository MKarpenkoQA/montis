import assert from "node:assert/strict";
import test from "node:test";
import { shouldServeSpaFallback } from "./spaFallback.js";

test("serves the SPA shell for extensionless app routes", () => {
  assert.equal(shouldServeSpaFallback("/"), true);
  assert.equal(shouldServeSpaFallback("/about"), true);
  assert.equal(shouldServeSpaFallback("/distributors"), true);
});

test("does not serve the SPA shell for API, media, or built asset paths", () => {
  assert.equal(shouldServeSpaFallback("/api/content"), false);
  assert.equal(shouldServeSpaFallback("/media/logo.png"), false);
  assert.equal(shouldServeSpaFallback("/assets/main-deadbeef.js"), false);
});

test("does not serve the SPA shell for missing static files with extensions", () => {
  assert.equal(shouldServeSpaFallback("/favicon.ico"), false);
  assert.equal(shouldServeSpaFallback("/robots.txt"), false);
  assert.equal(shouldServeSpaFallback("/assets/missing"), false);
});
