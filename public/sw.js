const CACHE_NAME = 'bootcamp-v1';
const assets = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/pwa.js',
  '/js/app.js',
  '/js/data.js',
  '/assets/logo.png'
];

// Service Worker ကို Install လုပ်ချိန်တွင် လိုအပ်သောဖိုင်များကို သိမ်းထားမည်
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets');
      return cache.addAll(assets);
    })
  );
});

// အင်တာနက်မှ ဖိုင်များကို လှမ်းယူသည့်အခါ Warning မတက်စေရန် စနစ်တကျ ကိုင်တွယ်ခြင်း
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache ထဲမှာ ရှိရင် ၎င်းကိုပြမည်၊ မရှိရင် Network ကနေ ဆွဲမည်
      return response || fetch(event.request);
    })
  );
});