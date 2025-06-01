/**
 * Utilidades para gerenciamento de cache da aplicação
 */

// Versão atual da aplicação - pode ser atualizada a cada deploy
export const APP_VERSION = '1.0.0-' + new Date().toISOString().slice(0, 10).replace(/-/g, '');

// Chave para armazenar a última versão vista pelo usuário
const LAST_VERSION_KEY = 'sanduiche-chefe-version';

/**
 * Verifica se há uma nova versão da aplicação disponível
 * @returns {boolean} True se existir uma nova versão
 */
export const checkForNewVersion = (): boolean => {
  const lastVersion = localStorage.getItem(LAST_VERSION_KEY);
  
  if (!lastVersion || lastVersion !== APP_VERSION) {
    return true;
  }
  
  return false;
};

/**
 * Marca a versão atual como vista pelo usuário
 */
export const markVersionSeen = (): void => {
  localStorage.setItem(LAST_VERSION_KEY, APP_VERSION);
};

/**
 * Limpa o cache do navegador e recarrega a página
 */
export const clearCacheAndReload = (): Promise<void> => {
  return new Promise((resolve) => {
    // Tenta limpar o cache via Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        const unregisterPromises = registrations.map((registration) => {
          return registration.unregister();
        });
        
        Promise.all(unregisterPromises).then(() => {
          // Limpa o cache de aplicação
          if ('caches' in window) {
            caches.keys().then((cacheNames) => {
              cacheNames.forEach((cacheName) => {
                if (cacheName.includes('sanduiche-chefe')) {
                  caches.delete(cacheName);
                }
              });
            });
          }
          
          // Limpa o localStorage
          localStorage.removeItem(LAST_VERSION_KEY);
          
          // Recarrega a página
          window.location.reload(true);
          resolve();
        });
      });
    } else {
      // Fallback para navegadores sem suporte a Service Worker
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload(true);
      resolve();
    }
  });
};
