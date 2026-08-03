import { Router } from "express";
import multer from "multer";
import path from "node:path";
import {
  ADMIN_PASSWORD,
  clearSessionCookie,
  createSession,
  destroySession,
  isValidSession,
  requireAuth,
  SESSION_COOKIE_NAME,
  setSessionCookie,
} from "./auth.js";
import { ensureUploadsDir, readSiteContent, UPLOADS_DIR, writeSiteContent } from "./contentStore.js";

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".bin";
      const base = path
        .basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9-_]+/g, "-")
        .slice(0, 48);
      cb(null, `${base || "file"}-${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(png|jpe?g|webp|gif|svg|mp4|webm)$/i.test(file.originalname);
    cb(null, allowed);
  },
});

export const createApiRouter = () => {
  const router = Router();

  router.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  router.get("/content", async (_req, res, next) => {
    try {
      const content = await readSiteContent();
      res.json(content);
    } catch (error) {
      next(error);
    }
  });

  router.get("/auth/me", (req, res) => {
    const token = req.cookies?.[SESSION_COOKIE_NAME];
    res.json({ authenticated: isValidSession(token) });
  });

  router.post("/auth/login", (req, res) => {
    try {
      const password = String(req.body?.password ?? "");
      if (password !== ADMIN_PASSWORD) {
        res.status(401).json({ error: "Invalid password" });
        return;
      }
      const token = createSession();
      setSessionCookie(res, token);
      res.json({ ok: true });
    } catch (error) {
      console.error("[auth/login]", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  router.post("/auth/logout", (req, res) => {
    destroySession(req.cookies?.[SESSION_COOKIE_NAME]);
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  router.put("/content", requireAuth, async (req, res) => {
    try {
      const saved = await writeSiteContent(req.body);
      res.json(saved);
    } catch {
      res.status(400).json({ error: "Invalid content payload" });
    }
  });

  router.post("/upload", requireAuth, (req, res, next) => {
    upload.single("file")(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        res.status(400).json({ error: error.code === "LIMIT_FILE_SIZE" ? "File too large (max 25 MB)" : "Invalid upload" });
        return;
      }
      if (error) {
        res.status(400).json({ error: "Upload failed" });
        return;
      }
      next();
    });
  }, async (req, res) => {
    await ensureUploadsDir();
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded or file type not allowed" });
      return;
    }
    res.json({ url: `/media/uploads/${req.file.filename}` });
  });

  return router;
};
