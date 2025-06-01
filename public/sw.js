// Service Worker para gerenciar cache e forçar atualizações
const CACHE_NAME = 'sanduiche-chefe-v1-' + new Date().toISOString().split('T')[0].replace(/-/g, '');

// Lista de arquivos essenciais que devem ser cacheados
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/refresh.html'
];

// Durante a instalação, fazemos cache dos recursos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  // Força a ativação imediata, sem esperar que abas antigas sejam fechadas
  self.skipWaiting();
});

// Quando ativado, limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('sanduiche-chefe-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('Deletando cache antigo:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('Service Worker ativo com cache:', CACHE_NAME);
      // Assume o controle de todas as páginas imediatamente
      return self.clients.claim();
    })
  );
});

// Função para verificar se uma URL corresponde a recursos que devem ser atualizados frequentemente
function shouldBypassCache(url) {
  const urlObj = new URL(url);
  
  // Arquivos de API devem sempre vir da rede
  if (urlObj.pathname.includes('/api/')) {
    return true;
  }
  
  // Arquivos HTML devem sempre ser atualizados
  if (urlObj.pathname.endsWith('.html') || urlObj.pathname === '/') {
    return true;
  }
  
  // SW.js nunca deve ser cacheado
  if (urlObj.pathname.endsWith('sw.js')) {
    return true;
  }

  return false;
}

// Estratégia de cache: network-first para alguns recursos, cache-first para outros
self.addEventListener('fetch', (event) => {
  // Ignorar requisições de outras origens
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Para requisições que exigem sempre dados frescos (API, HTML, etc)
  if (shouldBypassCache(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          // Se falhar, tenta buscar do cache como fallback
          return caches.match(event.request);
        })
    );
    return;
  }

  // Para outros recursos, usamos cache-first com atualização em segundo plano
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retorna do cache imediatamente se disponível
      if (cachedResponse) {
        // Em segundo plano, atualiza o cache
        fetch(event.request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response);
            });
          }
        }).catch(() => {
          // Erro silencioso na atualização em segundo plano
        });
        return cachedResponse;
      }

      // Se não estiver no cache, busca da rede e armazena no cache
      return fetch(event.request).then((response) => {
        // Verifica se temos uma resposta válida
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clona a resposta para poder usá-la duas vezes
        const responseToCache = response.clone();
        
        // Adiciona ao cache para uso futuro
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Escuta mensagem para limpar o cache
self.addEventListener('message', (event) => {
  if (event.data === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('sanduiche-chefe-'))
            .map((name) => caches.delete(name))
        );
      }).then(() => {
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'CACHE_CLEARED' });
          });
        });
      })
    );
  }
});
