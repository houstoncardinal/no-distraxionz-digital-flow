import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ColorSwatchProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect?: (color: string) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  'Black': { bg: 'bg-black', border: 'border-gray-300', text: 'text-white' },
  'White': { bg: 'bg-white', border: 'border-gray-300', text: 'text-black' },
  'Gray': { bg: 'bg-gray-500', border: 'border-gray-300', text: 'text-white' },
  'Navy': { bg: 'bg-navy-600', border: 'border-gray-300', text: 'text-white' },
  'Charcoal': { bg: 'bg-gray-700', border: 'border-gray-300', text: 'text-white' },
  'Pink': { bg: 'bg-pink-400', border: 'border-gray-300', text: 'text-white' },
  'Purple': { bg: 'bg-purple-500', border: 'border-gray-300', text: 'text-white' },
  'Red': { bg: 'bg-red-500', border: 'border-gray-300', text: 'text-white' },
  'Blue': { bg: 'bg-blue-500', border: 'border-gray-300', text: 'text-white' },
  'Green': { bg: 'bg-green-500', border: 'border-gray-300', text: 'text-white' },
  'Yellow': { bg: 'bg-yellow-400', border: 'border-gray-300', text: 'text-black' },
  'Orange': { bg: 'bg-orange-500', border: 'border-gray-300', text: 'text-white' },
};

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10'
};

export const ColorSwatch = ({ 
  colors, 
  selectedColor, 
  onColorSelect, 
  size = 'md', 
  showLabels = false 
}: ColorSwatchProps) => {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const getColorClasses = (color: string) => {
    const colorData = colorMap[color] || { bg: 'bg-gray-400', border: 'border-gray-300', text: 'text-white' };
    return colorData;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => {
        const colorData = getColorClasses(color);
        const isSelected = selectedColor === color;
        const isHovered = hoveredColor === color;
        
        return (
          <div key={color} className="flex flex-col items-center gap-1">
            <button
              className={cn(
                'rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50',
                sizeClasses[size],
                colorData.bg,
                colorData.border,
                isSelected && 'ring-2 ring-primary ring-offset-2',
                isHovered && 'scale-105'
              )}
              onClick={() => onColorSelect?.(color)}
              onMouseEnter={() => setHoveredColor(color)}
              onMouseLeave={() => setHoveredColor(null)}
              aria-label={`Select ${color} color`}
            >
              {isSelected && (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
            {showLabels && (
              <span className="text-xs text-muted-foreground capitalize">
                {color}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ColorSwatch;
