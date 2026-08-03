import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { SiteContent } from "../src/content/types.js";
import { parseSiteContent } from "./contentValidation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
export const CONTENT_PATH = path.join(ROOT, "content/site.json");
export const UPLOADS_DIR = path.join(ROOT, "public/media/uploads");

let lastKnownContent: SiteContent | null = null;

const cloneSiteContent = (content: SiteContent): SiteContent =>
  structuredClone(content);

export const readSiteContent = async (): Promise<SiteContent> => {
  try {
    const raw = await fs.readFile(CONTENT_PATH, "utf8");
    const content = parseSiteContent(JSON.parse(raw));
    lastKnownContent = cloneSiteContent(content);
    return content;
  } catch {
    if (lastKnownContent) {
      return cloneSiteContent(lastKnownContent);
    }
    throw new Error("Unable to read site content");
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
  lastKnownContent = cloneSiteContent(payload);
  return payload;
};

export const ensureUploadsDir = async () => {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
};
