import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import { assertSecureAdminPassword } from "./auth.js";
import { createApiRouter } from "./routes.js";
import { ensureUploadsDir } from "./contentStore.js";

assertSecureAdminPassword();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT ?? 3000);
const isProd = process.env.NODE_ENV === "production";

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "4mb" }));

await ensureUploadsDir();
app.use(
  "/media/uploads",
  express.static(path.join(ROOT, "public/media/uploads"), {
    setHeaders: (res, filePath) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      if (path.extname(filePath).toLowerCase() === ".svg") {
        res.setHeader("Content-Disposition", "attachment");
        res.setHeader("Content-Security-Policy", "sandbox; default-src 'none'; script-src 'none'");
      }
    },
  }),
);
app.use("/media", express.static(path.join(ROOT, "public/media")));
app.use("/api", createApiRouter());

const server = http.createServer(app);

if (isProd) {
  app.use(express.static(path.join(ROOT, "dist")));
  app.get(["/admin", "/admin/"], (_req, res) => {
    res.sendFile(path.join(ROOT, "dist/admin.html"));
  });
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/media")) {
      next();
      return;
    }
    res.sendFile(path.join(ROOT, "dist/index.html"));
  });
} else {
  const vite = await createViteServer({
    root: ROOT,
    appType: "custom",
    server: {
      middlewareMode: true,
      hmr: { server },
    },
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith("/api") || url.startsWith("/media")) {
      next();
      return;
    }

    const page =
      url === "/admin" || url.startsWith("/admin/")
        ? path.join(ROOT, "admin.html")
        : path.join(ROOT, "index.html");

    try {
      const template = await readFile(page, "utf8");
      const html = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });
}

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[server]", err);
  res.status(500).json({ error: "Internal server error" });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`MONTIS running at http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the other process and run npm run dev again.`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
