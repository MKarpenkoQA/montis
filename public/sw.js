const MEDIA_CACHE = "montis-media-v1";

const CRITICAL_ASSETS = [
  "/media/montis-hero.mp4",
  "/media/mountain-lake-hero.jpg",
  "/media/logo-montis-icon.png",
  "/media/logo-montis.png",
];

// Cached in the background after the hero is ready.
const DEFERRED_ASSETS = [
  "/media/0,5.png",
  "/media/1.5l.png",
  "/media/1l.png",
  "/media/gaz-0.5.png",
  "/media/gaz-1l.png",
  "/media/gaz-1.5l.png",
  "/media/montis-bottle.mp4",
  "/media/montis-bottle-poster.jpg",
  "/media/alpine-vista.jpg",
  "/media/back.png",
  "/media/black.png",
  "/media/filtration.png",
  "/media/mountain-stream.jpg",
  "/media/mountain-valley.jpg",
  "/media/osmos.png",
  "/media/ozone.png",
  "/media/reflective-lake.jpg",
  "/media/uv.png",
  "https://api.baikal430.ru/storage/photos/shares/images/index/section-sequence/depthRangeImg.svg",
  "https://api.baikal430.ru/storage/photos/shares/images/index/section-sequence/ranges.svg",
];

const cacheInBackground = (urls) => {
  caches.open(MEDIA_CACHE).then((cache) => {
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
      .then(() => cacheInBackground(DEFERRED_ASSETS)),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  const isMediaRequest =
    request.destination === "image" ||
    request.destination === "video" ||
    request.destination === "audio" ||
    /\.(png|jpe?g|webp|avif|svg|gif|mp4|webm|mp3|wav|ogg|woff2?|ttf|otf)$/i.test(url.pathname);

  if (!isMediaRequest) return;

  // Stale-while-revalidate: instant cache hit + background refresh.
  event.respondWith(
    caches.open(MEDIA_CACHE).then(async (cache) => {
      const cached = await cache.match(request, { ignoreVary: true });
      const networkFetch = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    }),
  );
});
