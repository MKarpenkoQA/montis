import assert from "node:assert/strict";
import { access, readFile, rename, unlink, writeFile } from "node:fs/promises";
import test from "node:test";
import type { SiteContent } from "../src/content/types";
import { CONTENT_PATH, readSiteContent, writeSiteContent } from "../server/contentStore.ts";

const pathExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

test("readSiteContent serves latest saved content without writing on read failure", async () => {
  const original = await readFile(CONTENT_PATH, "utf8");
  const movedPath = `${CONTENT_PATH}.test-${process.pid}`;
  let movedContentFile = false;

  try {
    const base = JSON.parse(original) as SiteContent;
    const firstVersion = structuredClone(base);
    firstVersion.translations.ru.hero.title = "First cached version";

    await writeSiteContent(firstVersion);
    const firstRead = await readSiteContent();
    assert.equal(firstRead.translations.ru.hero.title, "First cached version");

    const latestVersion = structuredClone(firstRead);
    latestVersion.translations.ru.hero.title = "Latest saved version";
    const savedLatest = await writeSiteContent(latestVersion);

    await rename(CONTENT_PATH, movedPath);
    movedContentFile = true;

    const recovered = await readSiteContent();

    assert.equal(recovered.translations.ru.hero.title, savedLatest.translations.ru.hero.title);
    assert.equal(await pathExists(CONTENT_PATH), false);
  } finally {
    if (movedContentFile && (await pathExists(movedPath))) {
      if (await pathExists(CONTENT_PATH)) {
        await unlink(CONTENT_PATH);
      }
      await rename(movedPath, CONTENT_PATH);
    }

    await writeFile(CONTENT_PATH, original, "utf8");
    await readSiteContent().catch(() => {});
  }
});
