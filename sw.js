// ===== SERVICE WORKER SIMPLIFICADO =====
const CACHE_NAME = 'teacher-alex-v3-clean';

// ✅ Arquivos Essenciais (só o que realmente precisa)
const essentialFiles = [
  './',
  './index.html',
  './manifest.json',
  './pages/auth/login.html',
  './src/styles/base.css',
  './src/styles/layout.css', 
  './src/styles/theme-patriot.css',
  './src/assets/images/icons/icon-192.png',
  './src/assets/images/icons/icon-512.png'
];

// ===== INSTALAR =====
self.addEventListener('install', event => {
  console.log('🔧 SW Clean instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cacheando essenciais...');
        return cache.addAll(essentialFiles);
      })
      .then(() => {
        console.log('✅ Cache OK!');
        self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Erro cache:', error);
        // Cache mínimo se falhar
        return caches.open(CACHE_NAME).then(cache => {
          return cache.addAll(['./', './index.html']);
        });
      })
  );
});

// ===== ATIVAR =====
self.addEventListener('activate', event => {
  console.log('✅ SW Clean ativo');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Limpando:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ===== FETCH SIMPLIFICADO =====
self.addEventListener('fetch', event => {
  // Só intercepta nosso site
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // ✅ NÃO INTERCEPTA ÁUDIOS (LINHA ADICIONADA)
  if (event.request.url.includes('.mp3') || event.request.url.includes('audio')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se tem no cache, retorna
        if (response) {
          console.log('⚡ Cache:', event.request.url.split('/').pop());
          return response;
        }
        
        // Se não tem, busca na rede
        return fetch(event.request)
          .then(fetchResponse => {
            // Se a resposta é boa, cacheia
            if (fetchResponse.ok) {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone))
                .catch(() => {}); // Ignora erros de cache
            }
            return fetchResponse;
          })
          .catch(() => {
            // Fallback para index.html se for navegação
            if (event.request.destination === 'document') {
              console.log('🏠 Fallback para index');
              return caches.match('./index.html');
            }
            // Para outros recursos, falha silenciosamente
            return new Response('', { 
              status: 404, 
              statusText: 'Not found' 
            });
          });
      })
  );
});

// ===== LOGS =====
console.log('🎓 SW Teacher Alex Clean carregado!');
console.log('📦 Arquivos essenciais:', essentialFiles.length);
console.log('🗂️ Versão: v3.0 Clean');
