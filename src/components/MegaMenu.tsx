import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Zap, 
  Target,
  ArrowRight,
  Search,
  Filter,
  Shirt,
  Users,
  ShirtIcon,
  HardHat,
  Heart,
  ShoppingCart,
  Eye,
  Clock,
  Award,
  Shield,
  Truck,
  Headphones,
  Globe,
  Play,
  Package,
  CreditCard,
  Diamond
} from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu = ({ isOpen, onClose }: MegaMenuProps) => {
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Enhanced categories with detailed information
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

  // Get products by category
  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => 
      product.category.toLowerCase() === categoryId.toLowerCase()
    ).slice(0, 4);
  };

  // Get featured products
  const featuredProducts = products.filter(product => product.featured).slice(0, 6);

  // Filter products by search
  const searchResults = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8);

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
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-2xl"
      style={{ marginTop: '80px' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search products, categories, or styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-14 text-lg border-2 border-gray-200 focus:border-primary rounded-2xl bg-white/80 backdrop-blur-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                ×
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-2xl font-bold text-blue-700">{products.length}</div>
            <div className="text-sm text-blue-600">Total Products</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-2xl font-bold text-green-700">{featuredProducts.length}</div>
            <div className="text-sm text-green-600">Featured Items</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-2xl font-bold text-purple-700">{categories.length}</div>
            <div className="text-sm text-purple-600">Categories</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
            <div className="text-2xl font-bold text-orange-700">4.9</div>
            <div className="text-sm text-orange-600">Avg Rating</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Shop by Category
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id}>
                  <Button
                    variant={activeCategory === category.id ? 'default' : 'ghost'}
                    className={`w-full justify-start h-12 text-left ${
                      activeCategory === category.id 
                        ? `bg-gradient-to-r ${category.color} text-white` 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveCategory(
                      activeCategory === category.id ? '' : category.id
                    )}
                  >
                    <category.icon className="h-5 w-5 mr-3" />
                    <div className="flex-1">
                      <div className="font-semibold">{category.name}</div>
                      <div className="text-xs opacity-80">{category.description}</div>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending Now
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Best Sellers
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Sparkles className="h-4 w-4 mr-2" />
                  New Arrivals
                </Button>
              </div>
            </div>
          </div>

          {/* Category Details */}
          <div className="lg:col-span-2">
            {activeCategory ? (
              <div key={activeCategory}>
                {(() => {
                  const category = categories.find(c => c.id === activeCategory);
                  const categoryProducts = getProductsByCategory(activeCategory);
                  
                  return (
                    <div className="space-y-6">
                      {/* Category Header */}
                      <div className={`p-6 rounded-2xl ${category?.bgColor} border ${category?.borderColor}`}>
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${category?.color} text-white`}>
                            {category?.icon && <category.icon className="h-6 w-6" />}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{category?.name}</h3>
                            <p className="text-gray-600">{category?.description}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-700">Subcategories</div>
                            <div className="text-xs text-gray-600">
                              {category?.subcategories.join(', ')}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">Features</div>
                            <div className="text-xs text-gray-600">
                              {category?.features.join(', ')}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">Price Range</div>
                            <div className="text-xs text-gray-600">{category?.priceRange}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">Products</div>
                            <div className="text-xs text-gray-600">{categoryProducts.length} items</div>
                          </div>
                        </div>
                      </div>

                      {/* Category Products */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Featured {category?.name}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {categoryProducts.map((product) => (
                            <div
                              key={product.id}
                              onMouseEnter={() => setHoveredProduct(product.id)}
                              onMouseLeave={() => setHoveredProduct(null)}
                            >
                              <Link to={`/product/${product.id}`}>
                                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                  <div className="relative">
                                    <OptimizedImage
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full aspect-square object-cover"
                                    />
                                    {product.featured && (
                                      <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                                        <Crown className="h-3 w-3 mr-1" />
                                        Featured
                                      </Badge>
                                    )}
                                  </div>
                                  <CardContent className="p-3">
                                    <h5 className="font-semibold text-sm line-clamp-1">{product.name}</h5>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="font-bold text-primary">${product.price}</span>
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs text-gray-600">4.8</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore Categories</h3>
                <p className="text-gray-600">Select a category to see featured products and details</p>
              </div>
            )}
          </div>

          {/* Featured Products & Search Results */}
          <div className="lg:col-span-1">
            {searchQuery ? (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Results
                </h3>
                <div className="space-y-3">
                  {searchResults.map((product) => (
                    <div key={product.id}>
                      <Link to={`/product/${product.id}`}>
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
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Featured Products
                </h3>
                <div className="space-y-3">
                  {featuredProducts.map((product) => (
                    <div key={product.id}>
                      <Link to={`/product/${product.id}`}>
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
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/shop">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    View All Products
                  </Button>
                </Link>
                <Link to="/shop?sort=featured">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Featured Collection
                  </Button>
                </Link>
                <Link to="/shop?sort=price-low">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Best Deals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="h-4 w-4" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Headphones className="h-4 w-4" />
                <span>24/7 Support</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onClose}>
                Close Menu
              </Button>
              <Link to="/shop">
                <Button className="bg-gradient-to-r from-primary to-blue-600">
                  Shop Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
