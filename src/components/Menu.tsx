import React, { useState, useMemo } from 'react';
import { menuItems, menuCategories, MenuItem } from '@/data/menuData';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';
import CategoryFilter from './CategoryFilter';
import SearchBar from './SearchBar';
import StatusFuncionamento from './StatusFuncionamento';
import { Sparkles, TrendingUp, SearchX } from 'lucide-react';

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('sanduiches');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtra itens com base na busca global OU na categoria ativa
  const filteredItems = useMemo(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return menuItems.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    return menuItems.filter(item => item.category === activeCategory);
  }, [activeCategory, searchQuery]);

  const handleProductClick = (item: MenuItem) => {
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const getCategoryName = (categoryId: string) => {
    const category = menuCategories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = menuCategories.find(cat => cat.id === categoryId);
    return category ? category.icon : '🍽️';
  };

  const getCategoryDescription = (categoryId: string) => {
    const descriptions: { [key: string]: string } = {
      'sanduiches': 'Sanduíches artesanais preparados com ingredientes frescos e selecionados',
      'pizzas': 'Pizzas deliciosas com massa artesanal e coberturas generosas',
      'pasteis': 'Pastéis crocantes recheados na hora com os melhores ingredientes',
      'bebidas': 'Bebidas refrescantes para acompanhar seu pedido',
      'combos': 'Combos especiais com preços imperdíveis',
      'adicionais': 'Incremente seu pedido com nossos adicionais e bordas especiais'
    };
    return descriptions[categoryId] || 'Confira nossas deliciosas opções';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-orange-50/20 to-background">
      {/* Category Filter - Fixo no topo */}
      <CategoryFilter 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />
      
      {/* Menu Content */}
      <div className="container mx-auto px-4 py-8 pb-32">
        
        {/* Search Bar Premium */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {!searchQuery && (
          <>
        
        {/* Banner Hero Promocional */}
        <div className="mb-10 relative rounded-3xl overflow-hidden shadow-premium dark:shadow-premium-dark group animate-fade-in-down">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop" 
            alt="Oferta Especial" 
            className="w-full h-48 md:h-64 lg:h-72 object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 text-shadow-md">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="bg-red-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Sparkles size={12} /> SUPER OFERTA
              </span>
              <span className="scale-75 origin-left md:scale-95">
                <StatusFuncionamento />
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display text-white mb-2 leading-none text-shadow-md tracking-wide">
              Combo Big Chefe
            </h2>
            <p className="text-gray-300 text-sm md:text-base max-w-xs md:max-w-md mb-5 leading-relaxed">
              Saboreie o nosso monstruoso X-Tudo acompanhado com batata frita e refrigerante.
            </p>
            <button 
              onClick={() => {
                setActiveCategory('combos');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-bold py-2.5 px-6 rounded-xl w-fit shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Pedir Oferta
            </button>
          </div>
        </div>

        {/* Category Header */}
        <div className="mb-8 animate-fade-in-down">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-primary to-orange-600 p-4 rounded-2xl shadow-lg">
              <span className="text-5xl">{getCategoryIcon(activeCategory)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {getCategoryName(activeCategory)}
                </h2>
                {activeCategory === 'combos' && (
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
                    <TrendingUp size={14} />
                    <span>Promoção</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                {getCategoryDescription(activeCategory)}
              </p>
              <div className="mt-2 inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                <Sparkles className="text-primary" size={16} />
                <span className="text-sm font-semibold text-primary">
                  {filteredItems.length} {filteredItems.length === 1 ? 'opção disponível' : 'opções disponíveis'}
                </span>
              </div>
            </div>
          </div>
        </div>
        </>
        )}

        {/* Categoria Busca Header (Mostrado apenas em pesquisas) */}
        {searchQuery && (
           <div className="mb-6 animate-fade-in-down flex items-center justify-between">
             <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
               Resultados para "<span className="text-primary">{searchQuery}</span>"
             </h3>
             <span className="text-sm text-gray-500 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full font-medium">
               {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}
             </span>
           </div>
        )}

        {/* Products Grid - Apenas da categoria selecionada ou busca */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard item={item} onClick={() => handleProductClick(item)} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 animate-fade-in-up bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <div className="flex justify-center mb-6">
              <div className="bg-orange-50 dark:bg-zinc-800 p-6 rounded-full text-primary">
                 <SearchX size={48} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Nenhum item encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Não encontramos produtos para "<span className="font-semibold">{searchQuery}</span>". Tente buscar por outros termos como "Frango", "Bacon" ou "Combo".
            </p>
            <button
               onClick={() => setSearchQuery('')}
               className="bg-primary hover:bg-orange-600 text-white font-bold py-2.5 px-8 rounded-xl shadow-md transition-colors"
            >
               Limpar Busca
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        item={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Menu;
