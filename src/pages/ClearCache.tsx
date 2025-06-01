import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { clearCacheAndReload } from '@/utils/cacheManager';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function ClearCache() {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      await clearCacheAndReload();
      // Não vamos ver isto, pois a página será recarregada antes
    } catch (error) {
      setIsClearing(false);
      console.error('Erro ao limpar cache:', error);
    }
  };

  useEffect(() => {
    // Adiciona classe especial ao body para estilizar esta página
    document.body.classList.add('clear-cache-page');
    
    return () => {
      document.body.classList.remove('clear-cache-page');
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-red-50">
      <Card className="w-[380px] max-w-full">
        <CardHeader>
          <CardTitle className="text-xl">Limpar Cache do Sanduíche do Chefe</CardTitle>
          <CardDescription>
            Se você está enfrentando problemas com o site, como conteúdo desatualizado ou
            funcionalidades que não estão funcionando corretamente, limpar o cache pode ajudar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Esta ação irá:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
            <li>Limpar o cache do aplicativo armazenado no seu navegador</li>
            <li>Remover dados temporários do site</li>
            <li>Recarregar a página com a versão mais recente</li>
          </ul>
          <p className="text-sm text-red-600">
            Observação: Esta ação não afetará seus pedidos ou informações pessoais.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleClearCache} 
            disabled={isClearing} 
            className="w-full"
          >
            {isClearing ? 'Limpando...' : 'Limpar Cache e Recarregar'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ClearCache;
