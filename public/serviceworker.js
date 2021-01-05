const version = '1.0.0'

// I comment the console.log here and don't remove them to debugg SW easily in the future.

self.addEventListener('install', event => {
  // console.log('ServiceWorker: Installed version', version)
  /**
   * Cache assets when installing the service worker.
   *
   * @returns {Promise} Promise that resolves to undefined
   */
  const casheAssests = async () => {
    const cache = await self.caches.open(version)
    // console.log('ServiceWorker:Caching Files')
    // caching the images for the memory game to enable playing the game offline even if the user didn't do that online.
    return cache.addAll([
      'index.html',
      'css/styles.css',
      'js/index.js',
      'js/components/my-memory-game/images/0.jpg',
      'js/components/my-memory-game/images/1.jpg',
      'js/components/my-memory-game/images/2.jpg',
      'js/components/my-memory-game/images/3.jpg',
      'js/components/my-memory-game/images/4.jpg',
      'js/components/my-memory-game/images/5.jpg',
      'js/components/my-memory-game/images/6.jpg',
      'js/components/my-memory-game/images/7.jpg',
      'js/components/my-memory-game/images/8.jpg'
    ])
  }
  // wait until adding the files to the cache
  event.waitUntil(casheAssests())
})

self.addEventListener('activate', event => {
  // console.log('ServiceWorker: Activated', version)
  /**
   * Delete old cache when changing the version.
   *
   * @returns {Promise} Promise that resolves to undefined
   */
  const remvoveCachedAssets = async () => {
    const cacheKeys = await caches.keys()

    return Promise.all(
      cacheKeys.map(cache => {
        if (cache !== version) {
          console.log('ServiceWorker: Clearing Cache', cache)
          return caches.delete(cache)
        }
        return undefined
      })
    )
  }

  event.waitUntil(remvoveCachedAssets())
})

self.addEventListener('fetch', event => {
  // console.log('ServiceWorker: Fetching')
  // console.log(event.request)
  /**
   * Cache the requested resources and when failing fetching from server, serve the resources from cache.
   *
   * @param {object} request - Request to fetch the resource
   * @returns {Promise} Promise that resolves to undefined
   */
  const cachedFetch = async request => {
    try {
      // try to fetch the asset from the server and if success, clone the result.
      const response = await fetch(request)

      // save the result in the cache
      const cache = await caches.open(version)
      cache.put(request, response.clone())
      return response
    } catch (error) {
      // console.info('ServiceWorker: Serving cached result')
      return caches.match(request)
    }
  }
  event.respondWith(cachedFetch(event.request))
})
