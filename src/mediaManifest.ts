import { shouldPrefetch } from "./lib/networkAware";

type HintRel = "preload" | "prefetch";
type HintAs = "image" | "video" | "audio" | "font" | "fetch";

export type MediaHint = {
  href: string;
  rel: HintRel;
  as: HintAs;
  type?: string;
  crossOrigin?: "anonymous";
  fetchPriority?: "high" | "low";
  media?: string;
};

/** Second-screen assets — prefetched after hero is ready. */
const NEAR_FOLD_HINTS: MediaHint[] = [
  { href: "/media/montis-bottle-poster.jpg", rel: "prefetch", as: "image" },
  { href: "/media/black-480.webp", rel: "prefetch", as: "image" },
  { href: "/media/black-704.webp", rel: "prefetch", as: "image" },
  { href: "/media/montis-bottle.mp4", rel: "prefetch", as: "video", type: "video/mp4", media: "(min-width: 768px)" },
];

/** Section-specific assets — prefetched when section enters viewport. */
export const SECTION_HINTS: Record<string, MediaHint[]> = {
  composition: [
    { href: "/media/1.5l-640.webp", rel: "prefetch", as: "image" },
  ],
  purification: [
    { href: "/media/filtration-640.webp", rel: "prefetch", as: "image" },
    { href: "/media/uv-640.webp", rel: "prefetch", as: "image" },
    { href: "/media/ozone-640.webp", rel: "prefetch", as: "image" },
    { href: "/media/osmos-640.webp", rel: "prefetch", as: "image" },
  ],
  formats: [
    { href: "/media/0,5-640.webp", rel: "prefetch", as: "image" },
    { href: "/media/1.5-640.webp", rel: "prefetch", as: "image" },
    { href: "/media/gaz-0.5.png", rel: "prefetch", as: "image" },
    { href: "/media/gaz-1l.png", rel: "prefetch", as: "image" },
    { href: "/media/gaz-1.5l.png", rel: "prefetch", as: "image" },
  ],
  cta: [{ href: "/media/back-768.webp", rel: "prefetch", as: "image" }],
};

const dedupeToken = (hint: MediaHint) =>
  `${hint.rel}:${hint.as}:${hint.media ?? ""}:${hint.href}`;

const injectHints = (hints: MediaHint[]) => {
  if (!shouldPrefetch()) return;

  const head = document.head;
  if (!head) return;

  const existing = new Set(
    Array.from(head.querySelectorAll("link[rel='preload'], link[rel='prefetch']")).map(
      (node) =>
        `${node.getAttribute("rel")}:${node.getAttribute("as")}:${node.getAttribute("media") ?? ""}:${node.getAttribute("href")}`,
    ),
  );

  for (const hint of hints) {
    const token = dedupeToken(hint);
    if (existing.has(token)) continue;

    const link = document.createElement("link");
    link.rel = hint.rel;
    link.href = hint.href;
    link.as = hint.as;
    if (hint.type) link.type = hint.type;
    if (hint.media) link.media = hint.media;
    if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
    if (hint.fetchPriority) link.fetchPriority = hint.fetchPriority;
    head.appendChild(link);
    existing.add(token);
  }
};

let nearFoldInjected = false;
const injectedSections = new Set<string>();

export const injectNearFoldHints = () => {
  if (nearFoldInjected) return;
  nearFoldInjected = true;
  injectHints(NEAR_FOLD_HINTS);
};

export const injectSectionHints = (sectionId: string) => {
  if (injectedSections.has(sectionId)) return;
  const hints = SECTION_HINTS[sectionId];
  if (!hints) return;
  injectedSections.add(sectionId);
  injectHints(hints);
};

let sectionObserversInitialized = false;

/** Prefetch section assets when they are one viewport away. */
export const initSectionPrefetch = () => {
  if (sectionObserversInitialized || !shouldPrefetch()) return;
  sectionObserversInitialized = true;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const sectionId = entry.target.id;
        injectSectionHints(sectionId);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "100% 0px 100% 0px", threshold: 0 },
  );

  for (const sectionId of Object.keys(SECTION_HINTS)) {
    const element = document.getElementById(sectionId);
    if (element) observer.observe(element);
  }
};

/** @deprecated Use injectNearFoldHints — kept for preloadContent compat. */
export const injectDeferredMediaHints = injectNearFoldHints;
