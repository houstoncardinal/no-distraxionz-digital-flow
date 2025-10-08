import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ChevronRight, 
  Star, 
  TrendingUp, 
  Sparkles, 
  Crown, 
  Search,
  Filter,
  Shirt,
  Users,
  ShirtIcon,
  HardHat,
  ArrowRight,
  X
} from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface MobileMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMegaMenu = ({ isOpen, onClose }: MobileMegaMenuProps) => {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 'shirts',
      name: 'Shirts',
      description: 'Premium cotton tees with motivational messaging',
      icon: Shirt,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      image: '/shirts/envato-labs-image-edit (62).png',
      subcategories: ['Basic Tees', 'Graphic Tees', 'Long Sleeve', 'Tank Tops'],
      features: ['100% Cotton', 'Pre-shrunk', 'Machine Washable', 'Unisex Fit'],
      priceRange: '$25 - $45'
    },
    {
      id: 'ladies',
      name: 'Ladies',
      description: 'Empowering designs for strong women',
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
      borderColor: 'border-pink-200',
      image: '/ladies/envato-labs-image-edit (63).png',
      subcategories: ['Blouses', 'Tops', 'Dresses', 'Activewear'],
      features: ['Premium Materials', 'Perfect Fit', 'Trendy Designs', 'Comfortable'],
      priceRange: '$30 - $60'
    },
    {
      id: 'hoodies',
      name: 'Hoodies',
      description: 'Comfortable hoodies for focus sessions',
      icon: ShirtIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      image: '/hoodie/envato-labs-image-edit (62).png',
      subcategories: ['Pullover', 'Zip-up', 'Cropped', 'Oversized'],
      features: ['Fleece Lined', 'Kangaroo Pocket', 'Drawstring Hood', 'Ribbed Cuffs'],
      priceRange: '$45 - $75'
    },
    {
      id: 'hats',
      name: 'Hats',
      description: 'Premium caps for outdoor focus',
      icon: HardHat,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      image: '/hats/envato-labs-image-edit (62).png',
      subcategories: ['Baseball Caps', 'Beanies', 'Snapbacks', 'Bucket Hats'],
      features: ['Adjustable Fit', 'UV Protection', 'Moisture Wicking', 'Durable'],
      priceRange: '$20 - $40'
    },
    {
      id: 'toddler shirts',
      name: 'Toddler Shirts',
      description: 'Premium tees designed for active toddlers',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      image: '/toddler-shirts/envato-labs-image-edit - 2025-10-07T220721.938.png',
      subcategories: ['Basic Tees', 'Graphic Tees', 'Performance Tees', 'Premium Cotton'],
      features: ['Soft Fabric', 'Durable', 'Easy Care', 'Toddler Sizes'],
      priceRange: '$20 - $26'
    }
  ];

  const featuredProducts = products.filter(product => product.featured).slice(0, 4);
  const searchResults = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Shop Categories</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-primary rounded-xl"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-2xl font-bold text-blue-700">{products.length}</div>
              <div className="text-sm text-blue-600">Products</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-2xl font-bold text-green-700">{featuredProducts.length}</div>
              <div className="text-sm text-green-600">Featured</div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id}>
                  <Card 
                    className={`border-2 transition-all duration-200 ${
                      activeCategory === category.id 
                        ? `${category.borderColor} ${category.bgColor}` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div 
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => setActiveCategory(
                          activeCategory === category.id ? '' : category.id
                        )}
                      >
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} text-white`}>
                          <category.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{category.name}</h4>
                          <p className="text-sm text-gray-600">{category.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{category.priceRange}</span>
                            <Badge variant="outline" className="text-xs">
                              {products.filter(p => p.category.toLowerCase() === category.id.toLowerCase()).length} items
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${
                          activeCategory === category.id ? 'rotate-90' : ''
                        }`} />
                      </div>

                      {/* Category Details */}
                      {activeCategory === category.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="space-y-4">
                            {/* Subcategories */}
                            <div>
                              <h5 className="text-sm font-semibold text-gray-700 mb-2">Subcategories</h5>
                              <div className="flex flex-wrap gap-2">
                                {category.subcategories.map((sub) => (
                                  <Badge key={sub} variant="outline" className="text-xs">
                                    {sub}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Features */}
                            <div>
                              <h5 className="text-sm font-semibold text-gray-700 mb-2">Features</h5>
                              <div className="flex flex-wrap gap-2">
                                {category.features.map((feature) => (
                                  <Badge key={feature} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Featured Products */}
                            <div>
                              <h5 className="text-sm font-semibold text-gray-700 mb-2">Featured Products</h5>
                              <div className="grid grid-cols-2 gap-3">
                                {products
                                  .filter(p => p.category.toLowerCase() === category.id.toLowerCase())
                                  .slice(0, 2)
                                  .map((product) => (
                                    <Link key={product.id} to={`/product/${product.id}`}>
                                      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200">
                                        <OptimizedImage
                                          src={product.image}
                                          alt={product.name}
                                          className="w-full aspect-square object-cover"
                                        />
                                        <CardContent className="p-2">
                                          <h6 className="font-semibold text-xs line-clamp-1">{product.name}</h6>
                                          <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs font-bold text-primary">${product.price}</span>
                                            {product.featured && (
                                              <Crown className="h-3 w-3 text-yellow-500" />
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </Link>
                                  ))}
                              </div>
                            </div>

                            {/* View All Button */}
                            <Link to={`/shop?category=${category.name}`}>
                              <Button className="w-full bg-gradient-to-r from-primary to-blue-600">
                                View All {category.name}
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Search Results</h3>
              <div className="space-y-3">
                {searchResults.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <Card className="p-3 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <OptimizedImage
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-sm line-clamp-1">{product.name}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-primary font-bold">${product.price}</span>
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Featured Products */}
          {!searchQuery && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Featured Products</h3>
              <div className="grid grid-cols-2 gap-3">
                {featuredProducts.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200">
                      <OptimizedImage
                        src={product.image}
                        alt={product.name}
                        className="w-full aspect-square object-cover"
                      />
                      <CardContent className="p-3">
                        <h5 className="font-semibold text-sm line-clamp-1">{product.name}</h5>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-primary">${product.price}</span>
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/shop?sort=featured">
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Featured
                </Button>
              </Link>
              <Link to="/shop?sort=price-low">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Best Deals
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="h-4 w-4 mr-2" />
                  All Products
                </Button>
              </Link>
              <Link to="/shop?sort=new">
                <Button variant="outline" className="w-full justify-start">
                  <Sparkles className="h-4 w-4 mr-2" />
                  New Arrivals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMegaMenu;
