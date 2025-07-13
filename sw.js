// ===== SERVICE WORKER GITHUB PAGES ORGANIZACAO COMPLETA =====
const CACHE_NAME = 'teacher-alex-v6-organized';

// ✅ URLs RELATIVOS - Compatível com estrutura organizada
const urlsToCache = [
  './',
  './index.html',
  './pages/auth/login.html',
  './manifest.json',
  './src/styles/base.css',
  './src/styles/layout.css',
  './src/styles/theme-patriot.css',
  './src/assets/images/icons/icon-192.png',
  './src/assets/images/icons/icon-512.png',
  './src/assets/images/students/group-students.png',
  './src/assets/images/students/listening-student.jpg',
  './src/assets/images/students/reading-student.jpg'
];

// ===== INSTALAR =====
self.addEventListener('install', event => {
  console.log('🔧 SW Organizado instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cacheando arquivos essenciais organizados...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Cache organizado OK!');
        self.skipWaiting(); // Força ativação imediata
      })
      .catch(error => {
        console.error('❌ Erro no cache:', error);
        // Cache apenas arquivos críticos se algum falhar
        return caches.open(CACHE_NAME).then(cache => {
          const criticalFiles = ['./', './index.html', './manifest.json'];
          return cache.addAll(criticalFiles);
        });
      })
  );
});

// ===== ATIVAR =====
self.addEventListener('activate', event => {
  console.log('✅ SW Organizado ativo');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // Assume controle imediato
    })
  );
});

// ===== FETCH STRATEGY MELHORADA =====
self.addEventListener('fetch', event => {
  // Só intercepta requests para o próprio site
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      // Network First para HTML, Cache First para assets
      event.request.destination === 'document' 
        ? networkFirstStrategy(event.request)
        : cacheFirstStrategy(event.request)
    );
  }
});

// Network First Strategy (para HTML)
function networkFirstStrategy(request) {
  return fetch(request)
    .then(response => {
      if (response.status === 200 && response.type === 'basic') {
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => cache.put(request, responseClone))
          .catch(err => console.log('Cache put falhou:', err));
      }
      return response;
    })
    .catch(() => {
      return caches.match(request)
        .then(response => {
          if (response) {
            console.log('📦 Servindo HTML do cache:', request.url);
            return response;
          }
          // Fallback para index.html
          return caches.match('./index.html');
        });
    });
}

// Cache First Strategy (para CSS, images, etc)
function cacheFirstStrategy(request) {
  return caches.match(request)
    .then(response => {
      if (response) {
        console.log('⚡ Servindo do cache:', request.url);
        return response;
      }
      
      return fetch(request).then(fetchResponse => {
        if (fetchResponse.status === 200 && fetchResponse.type === 'basic') {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseClone))
            .catch(err => console.log('Cache put falhou:', err));
        }
        return fetchResponse;
      });
    })
    .catch(() => {
      console.log('❌ Falha total para:', request.url);
      // Para imagens, retorna um placeholder se necessário
      if (request.destination === 'image') {
        return new Response('', { status: 404, statusText: 'Image not found' });
      }
    });
}

// ===== DEBUG INFO =====
console.log('🎓 SW Teacher Alex Organizado carregado!');
console.log('🌍 Origin:', self.location.origin);
console.log('📂 Scope:', self.registration?.scope || 'N/A');
console.log('📁 Arquivos no cache:', urlsToCache.length);
console.log('🗂️ Estrutura organizada: src/styles/, src/assets/, pages/');
