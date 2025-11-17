import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import {
  Shirt,
  Users,
  ShirtIcon,
  HardHat,
  ArrowRight
} from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu = ({ isOpen, onClose }: MegaMenuProps) => {
  const { products } = useProducts();
  const menuRef = useRef<HTMLDivElement>(null);

  // Simplified categories
  const categories = [
    { id: 'shirts', name: 'Shirts', icon: Shirt, image: '/shirts/envato-labs-image-edit (62).png' },
    { id: 'ladies', name: 'Ladies', icon: Users, image: '/ladies/envato-labs-image-edit (63).png' },
    { id: 'hoodies', name: 'Hoodies', icon: ShirtIcon, image: '/hoodie/envato-labs-image-edit (62).png' },
    { id: 'hats', name: 'Hats', icon: HardHat, image: '/hats/envato-labs-image-edit (62).png' },
    { id: 'toddler shirts', name: 'Toddler Shirts', icon: Users, image: '/toddler-shirts/envato-labs-image-edit - 2025-10-07T220721.938.png' },
    { id: 'onesies', name: 'Onesies', icon: Users, image: '/onesie/envato-labs-image-edit - 2025-10-07T213233.751.png' }
  ];

  // Get featured products (limit to 3)
  const featuredProducts = products.filter(product => product.featured).slice(0, 3);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg"
      style={{ marginTop: '80px' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* Category Grid */}
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              onClick={onClose}
              className="group"
            >
              <div className="text-center space-y-3">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
                  <OptimizedImage
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <category.icon className="h-4 w-4 text-gray-600 group-hover:text-black transition-colors" />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-black transition-colors">
                    {category.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Featured Products</h3>
              <Link to="/shop" onClick={onClose} className="text-sm font-semibold text-gray-600 hover:text-black flex items-center gap-1 group">
                View All
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="group"
                >
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <OptimizedImage
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-sm line-clamp-1 group-hover:text-black transition-colors">
                        {product.name}
                      </h5>
                      <span className="text-sm font-bold text-gray-900">${product.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MegaMenu;
