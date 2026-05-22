// ClearMind service worker — offline app shell + stale-while-revalidate.
// Bump CACHE when the cached asset set changes to evict old versions.
const CACHE = "clearmind-v1";

// bundle.js keeps a fixed (un-hashed) name, so the runtime cache below
// refreshes it in the background on each visit.
const SHELL = [
  "./index.html",
  "./bundle.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // SPA navigations: try the network, fall back to the cached shell offline.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("./index.html")));
    return;
  }

  // Static assets + fonts: serve cached immediately, refresh in the background.
  const cacheable =
    url.origin === self.location.origin ||
    url.hostname.endsWith("googleapis.com") ||
    url.hostname.endsWith("gstatic.com");

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((res) => {
          if (cacheable && res && res.status === 200) cache.put(request, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
