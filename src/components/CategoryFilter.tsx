
import React from 'react';
import { menuCategories } from '@/data/menuData';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="bg-white shadow-sm sticky top-[68px] z-40 w-full">
      <div className="container mx-auto px-4 py-4 overflow-hidden">
        {/* Container centralizado */}
        <div className="flex justify-center">{/* Scrollable categories container centralizado */}
          <div 
            className="flex gap-3 overflow-x-auto overflow-y-hidden px-6"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth'
            }}
          >
            {menuCategories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-full whitespace-nowrap transition-all duration-200 flex-shrink-0 min-w-fit ${
                  activeCategory === category.id
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
          {/* Scroll indicator dots centralizados */}
        <div className="flex justify-center gap-1 h-2">
          {menuCategories.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                index < 4 ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
