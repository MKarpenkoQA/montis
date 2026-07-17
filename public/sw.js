const MEDIA_CACHE = "montis-media-v4";

/** Always cached on install — LCP assets only. */
const CRITICAL_ASSETS = [
  "/media/mountain-lake-hero-828.webp",
  "/media/mountain-lake-hero.jpg",
  "/media/logo-montis-icon.png",
  "/media/logo-montis.png",
];

/** Cached after hero is ready — second screen. */
const NEAR_FOLD_ASSETS = [
  "/media/montis-bottle-poster.jpg",
  "/media/black-480.webp",
  "/media/black-704.webp",
  "/media/black.png",
  "/media/montis-bottle.mp4",
  "/media/montis-hero.mp4",
];

/** Cached in background — below-the-fold sections. */
const BELOW_FOLD_ASSETS = [
  "/media/0,5-640.webp",
  "/media/1.5l-640.webp",
  "/media/0,5.png",
  "/media/1.5l.png",
  "/media/1l.png",
  "/media/gaz-0.5.png",
  "/media/gaz-1l.png",
  "/media/gaz-1.5l.png",
  "/media/back-768.webp",
  "/media/back.png",
  "/media/filtration-640.webp",
  "/media/uv-640.webp",
  "/media/ozone-640.webp",
  "/media/osmos-640.webp",
  "/media/filtration.png",
  "/media/osmos.png",
  "/media/ozone.png",
  "/media/uv.png",
];

const cacheInBackground = (urls) => {
  void caches.open(MEDIA_CACHE).then((cache) => {
    for (const url of urls) {
      void cache.add(url).catch(() => {});
    }
  });
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(MEDIA_CACHE)
      .then((cache) => cache.addAll(CRITICAL_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== MEDIA_CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim())
      .then(() => cacheInBackground(NEAR_FOLD_ASSETS))
      .then(() => {
        setTimeout(() => cacheInBackground(BELOW_FOLD_ASSETS), 3000);
      }),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  const isMediaRequest =
    request.destination === "image" ||
    request.destination === "video" ||
    request.destination === "audio" ||
    /\.(png|jpe?g|webp|avif|svg|gif|mp4|webm|mp3|wav|ogg|woff2?|ttf|otf)$/i.test(url.pathname);

  if (!isMediaRequest) return;

  event.respondWith(
    caches.open(MEDIA_CACHE).then(async (cache) => {
      const cached = await cache.match(request, { ignoreVary: true });

      try {
        const response = await fetch(request);
        if (response.ok) {
          void cache.put(request, response.clone());
          return response;
        }

        if (cached) return cached;
        return response;
      } catch {
        if (cached) return cached;
        return fetch(request);
      }
    }),
  );
});
