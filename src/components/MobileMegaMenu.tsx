import { Link } from 'react-router-dom';
import {
  Shirt,
  Users,
  ShirtIcon,
  HardHat,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMegaMenu = ({ isOpen, onClose }: MobileMegaMenuProps) => {
  const categories = [
    { id: 'shirts', name: 'Shirts', icon: Shirt },
    { id: 'ladies', name: 'Ladies', icon: Users },
    { id: 'hoodies', name: 'Hoodies', icon: ShirtIcon },
    { id: 'hats', name: 'Hats', icon: HardHat },
    { id: 'toddler shirts', name: 'Toddler Shirts', icon: Users },
    { id: 'onesies', name: 'Onesies', icon: Users }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Shop by Category</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Categories List */}
      <div className="overflow-y-auto p-4">
        <div className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              onClick={onClose}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <category.icon className="h-5 w-5 text-gray-700" />
                </div>
                <span className="font-semibold text-gray-900">{category.name}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          ))}
        </div>

        {/* View All Products */}
        <Link to="/shop" onClick={onClose}>
          <Button className="w-full mt-6" size="lg">
            View All Products
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MobileMegaMenu;
