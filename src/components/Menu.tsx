
import React, { useState, useMemo } from 'react';
import { menuItems, menuCategories } from '@/data/menuData';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('todos');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'todos') {
      return menuItems;
    }
    return menuItems.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const groupedItems = useMemo(() => {
    const groups: { [key: string]: typeof menuItems } = {};
    
    if (activeCategory === 'todos') {
      menuCategories.slice(1).forEach(category => {
        groups[category.id] = menuItems.filter(item => item.category === category.id);
      });
    } else {
      groups[activeCategory] = filteredItems;
    }
    
    return groups;
  }, [activeCategory, filteredItems]);

  const getCategoryName = (categoryId: string) => {
    const category = menuCategories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full">
        <CategoryFilter 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </div>
      
      <div className="container mx-auto px-4 py-6 mt-6">
        {Object.entries(groupedItems).map(([categoryId, items]) => (
          items.length > 0 && (
            <div key={categoryId} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>
                  {menuCategories.find(cat => cat.id === categoryId)?.icon}
                </span>
                {getCategoryName(categoryId)}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )
        ))}
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum item encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
