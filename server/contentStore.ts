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
  await fs.writeFile(CONTENT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return payload;
};

export const ensureUploadsDir = async () => {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
};
