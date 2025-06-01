import { useEffect, useState } from 'react';
import { checkForNewVersion, clearCacheAndReload, markVersionSeen } from '../utils/cacheManager';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

export function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Verifica atualizações quando o componente é montado
  useEffect(() => {
    const checkUpdate = () => {
      // Verificar se há uma nova versão quando o componente for montado
      const hasUpdate = checkForNewVersion();
      if (hasUpdate) {
        setUpdateAvailable(true);
      }

      // Verificar novamente a cada 5 minutos
      const interval = setInterval(() => {
        const hasUpdate = checkForNewVersion();
        if (hasUpdate) {
          setUpdateAvailable(true);
        }
      }, 5 * 60 * 1000);

      // Limpar o intervalo quando o componente for desmontado
      return () => clearInterval(interval);
    };

    checkUpdate();
  }, []);

  // Função para atualizar o aplicativo
  const handleUpdate = async () => {
    toast({
      title: "Atualizando...",
      description: "Estamos atualizando o aplicativo com as últimas alterações."
    });

    // Marca a versão atual como vista para não mostrar novamente a notificação
    markVersionSeen();
    
    // Limpa o cache e força recarregamento
    await clearCacheAndReload();
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-20 right-4 bg-yellow-100 p-3 rounded-lg shadow-lg z-50 max-w-xs">
      <p className="text-sm font-medium mb-2">Nova versão disponível!</p>
      <Button
        onClick={handleUpdate}
        size="sm"
        variant="default"
        className="w-full"
      >
        Atualizar agora
      </Button>
    </div>
  );
}
