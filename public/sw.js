const CACHE_NAME = "app-cache-v1";
const ASSET_CACHE = "asset-cache-v1";


// --------------------
// INSTALL
// --------------------
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// --------------------
// ACTIVATE
// --------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (![CACHE_NAME, ASSET_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// --------------------
// FETCH (cache-first for static assets)
// --------------------
self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // ❌ never cache API / actions
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_actions")
  ) {
    return;
  }

  // ----------------------------
  // 1. STATIC ASSETS (cache-first)
  // ----------------------------
  if (
    req.destination === "script" ||
    req.destination === "style" ||
    req.destination === "image" ||
    req.destination === "font"
  ) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // ----------------------------
  // 2. NAVIGATION (your React app)
  // ----------------------------
  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req));
    return;
  }
});


async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;

  const res = await fetch(req);

  const cache = await caches.open(ASSET_CACHE);
  cache.put(req, res.clone());

  return res;
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);

    const cache = await caches.open(CACHE_NAME);
    cache.put(req, res.clone());

    return res;
  } catch (err) {
    const cached = await caches.match(req);

    return (
      cached ||
      new Response("Offline", {
        status: 503,
        statusText: "Offline",
      })
    );
  }
}