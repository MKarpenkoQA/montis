type HintRel = "preload" | "prefetch";
type HintAs = "image" | "video" | "audio" | "font" | "fetch";

type MediaHint = {
  href: string;
  rel: HintRel;
  as: HintAs;
  type?: string;
  crossOrigin?: "anonymous";
  fetchPriority?: "high" | "low";
};

const MEDIA_HINTS: MediaHint[] = [
  // Critical, visible in first viewport.
  { href: "/media/mountain-lake-hero.jpg", rel: "preload", as: "image", fetchPriority: "high" },
  { href: "/media/Meshy_AI_video.mp4", rel: "preload", as: "video", type: "video/mp4" },
  // Below-the-fold image and interaction assets.
  { href: "/media/mountain-valley.jpg", rel: "prefetch", as: "image" },
  { href: "/media/mountain-stream.jpg", rel: "prefetch", as: "image" },
  { href: "/media/alpine-vista.jpg", rel: "prefetch", as: "image" },
  { href: "/media/reflective-lake.jpg", rel: "prefetch", as: "image" },
  { href: "/media/filtration.png", rel: "prefetch", as: "image" },
  { href: "/media/uv.png", rel: "prefetch", as: "image" },
  { href: "/media/ozone.png", rel: "prefetch", as: "image" },
  { href: "/media/osmos.png", rel: "prefetch", as: "image" },
  { href: "/media/0,5.png", rel: "prefetch", as: "image" },
  { href: "/media/1l.png", rel: "prefetch", as: "image" },
  { href: "/media/1.5l.png", rel: "prefetch", as: "image" },
  { href: "/media/back.png", rel: "prefetch", as: "image" },
  {
    href: "https://api.baikal430.ru/storage/photos/shares/images/index/section-sequence/depthRangeImg.svg",
    rel: "prefetch",
    as: "image",
    crossOrigin: "anonymous",
  },
  {
    href: "https://api.baikal430.ru/storage/photos/shares/images/index/section-sequence/ranges.svg",
    rel: "prefetch",
    as: "image",
    crossOrigin: "anonymous",
  },
];

const dedupeToken = (hint: MediaHint) => `${hint.rel}:${hint.as}:${hint.href}`;

export const injectMediaResourceHints = () => {
  const head = document.head;
  if (!head) return;

  const existing = new Set(
    Array.from(head.querySelectorAll("link[rel='preload'], link[rel='prefetch']")).map((node) =>
      `${node.getAttribute("rel")}:${node.getAttribute("as")}:${node.getAttribute("href")}`,
    ),
  );

  for (const hint of MEDIA_HINTS) {
    const token = dedupeToken(hint);
    if (existing.has(token)) continue;

    const link = document.createElement("link");
    link.rel = hint.rel;
    link.href = hint.href;
    link.as = hint.as;
    if (hint.type) link.type = hint.type;
    if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
    if (hint.fetchPriority) link.fetchPriority = hint.fetchPriority;
    head.appendChild(link);
    existing.add(token);
  }
};
