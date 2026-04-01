import React, { useRef, useEffect, useState } from 'react';
import { menuCategories } from '@/data/menuData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, onCategoryChange }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 10);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-3">
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-white to-white/80 dark:from-zinc-950 dark:to-zinc-950/80 p-2.5 rounded-full shadow-lg hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Rolar para esquerda"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Categories Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {menuCategories.map((category, index) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`
                    group relative flex-shrink-0 px-4 py-2.5 rounded-xl font-semibold text-sm
                    transition-all duration-300 whitespace-nowrap
                    ${isActive
                      ? 'bg-gradient-to-br from-primary to-orange-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.name}</span>
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-white to-white/80 dark:from-zinc-950 dark:to-zinc-950/80 p-2.5 rounded-full shadow-lg hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Rolar para direita"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
