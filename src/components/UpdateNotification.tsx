import { useEffect } from 'react';
import { markVersionSeen } from '../utils/cacheManager';

export function UpdateNotification() {
  useEffect(() => {
    // Marca a versão atual como vista para não mostrar o aviso de atualização
    markVersionSeen();
  }, []);
  
  // Não renderiza nada, efetivamente removendo o botão
  return null;
}
