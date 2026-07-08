import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { SiteContent } from "../src/content/types.js";
import { parseSiteContent } from "./contentValidation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
export const CONTENT_PATH = path.join(ROOT, "content/site.json");
export const UPLOADS_DIR = path.join(ROOT, "public/media/uploads");

let defaultContent: SiteContent | null = null;

const loadDefaultContent = async (): Promise<SiteContent> => {
  if (defaultContent) return defaultContent;
  const raw = await fs.readFile(CONTENT_PATH, "utf8");
  defaultContent = JSON.parse(raw) as SiteContent;
  return defaultContent;
};

const writeFileAtomically = async (targetPath: string, contents: string): Promise<void> => {
  const directory = path.dirname(targetPath);
  const temporaryPath = path.join(
    directory,
    `.${path.basename(targetPath)}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`,
  );

  let handle: fs.FileHandle | null = null;
  try {
    handle = await fs.open(temporaryPath, "wx");
    await handle.writeFile(contents, "utf8");
    await handle.sync();
    await handle.close();
    handle = null;
    await fs.rename(temporaryPath, targetPath);
  } catch (error) {
    if (handle) {
      await handle.close().catch(() => undefined);
    }
    await fs.rm(temporaryPath, { force: true }).catch(() => undefined);
    throw error;
  }
};

export const readSiteContent = async (): Promise<SiteContent> => {
  try {
    const raw = await fs.readFile(CONTENT_PATH, "utf8");
    return parseSiteContent(JSON.parse(raw));
  } catch {
    const fallback = await loadDefaultContent();
    await writeSiteContent(fallback);
    return fallback;
  }
};

export const writeSiteContent = async (content: unknown): Promise<SiteContent> => {
  const validated = parseSiteContent(content);
  await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
  const payload: SiteContent = {
    ...validated,
    meta: { updatedAt: new Date().toISOString() },
  };
  await writeFileAtomically(CONTENT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  return payload;
};

export const ensureUploadsDir = async () => {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
};
