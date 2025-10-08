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
      priceRange: '$40'
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
      priceRange: '$35'
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
      priceRange: '$65'
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
      priceRange: '$35'
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
      priceRange: '$25'
    },
    {
      id: 'onesies',
      name: 'Onesies',
      description: 'Adorable onesies for your little ones',
      icon: Users,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      image: '/onesie/envato-labs-image-edit - 2025-10-07T213233.751.png',
      subcategories: ['Newborn', 'Infant', 'Cotton Blend', 'Organic Cotton'],
      features: ['Soft Cotton', 'Easy Snaps', 'Machine Washable', 'Baby Safe'],
      priceRange: '$20'
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
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-gray-300 shadow-2xl"
      style={{ marginTop: '80px' }}
      onMouseEnter={() => {}} // Keep menu open on hover
      onMouseLeave={() => {}} // Prevent auto-close
    >
      <div className="max-w-7xl mx-auto px-6 py-10 bg-white">
        {/* Enhanced Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 h-6 w-6" />
            <Input
              placeholder="Search products, categories, or styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-12 h-16 text-xl border-3 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-3xl bg-white shadow-lg"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded-full"
              >
                ×
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-white">{products.length}</div>
            <div className="text-sm text-blue-100">Total Products</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-white">{featuredProducts.length}</div>
            <div className="text-sm text-green-100">Featured Items</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-white">{categories.length}</div>
            <div className="text-sm text-purple-100">Categories</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-white">4.9</div>
            <div className="text-sm text-orange-100">Avg Rating</div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Enhanced Categories Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Filter className="h-6 w-6 text-blue-600" />
              Shop by Category
            </h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id}>
                  <Button
                    variant={activeCategory === category.id ? 'default' : 'ghost'}
                    className={`w-full justify-start h-16 text-left rounded-xl border-2 transition-all duration-300 ${
                      activeCategory === category.id 
                        ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg` 
                        : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => setActiveCategory(
                      activeCategory === category.id ? '' : category.id
                    )}
                  >
                    <category.icon className="h-6 w-6 mr-4" />
                    <div className="flex-1">
                      <div className="font-bold text-base">{category.name}</div>
                      <div className="text-sm opacity-90">{category.description}</div>
                    </div>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Enhanced Quick Actions */}
            <div className="mt-10">
              <h4 className="text-base font-bold text-gray-800 mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <Button variant="outline" size="lg" className="w-full justify-start h-12 rounded-xl border-2 hover:border-blue-300 hover:bg-blue-50">
                  <TrendingUp className="h-5 w-5 mr-3" />
                  Trending Now
                </Button>
                <Button variant="outline" size="lg" className="w-full justify-start h-12 rounded-xl border-2 hover:border-green-300 hover:bg-green-50">
                  <Star className="h-5 w-5 mr-3" />
                  Best Sellers
                </Button>
                <Button variant="outline" size="lg" className="w-full justify-start h-12 rounded-xl border-2 hover:border-purple-300 hover:bg-purple-50">
                  <Sparkles className="h-5 w-5 mr-3" />
                  New Arrivals
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Category Details */}
          <div className="lg:col-span-2">
            {activeCategory ? (
              <div key={activeCategory}>
                {(() => {
                  const category = categories.find(c => c.id === activeCategory);
                  const categoryProducts = getProductsByCategory(activeCategory);
                  
                  return (
                    <div className="space-y-8">
                      {/* Enhanced Category Header */}
                      <div className={`p-8 rounded-3xl ${category?.bgColor} border-2 ${category?.borderColor} shadow-lg`}>
                        <div className="flex items-center gap-6 mb-6">
                          <div className={`p-4 rounded-2xl bg-gradient-to-r ${category?.color} text-white shadow-lg`}>
                            {category?.icon && <category.icon className="h-8 w-8" />}
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold text-gray-900">{category?.name}</h3>
                            <p className="text-lg text-gray-600">{category?.description}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="bg-white/50 p-4 rounded-xl">
                            <div className="text-base font-bold text-gray-800">Subcategories</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {category?.subcategories.join(', ')}
                            </div>
                          </div>
                          <div className="bg-white/50 p-4 rounded-xl">
                            <div className="text-base font-bold text-gray-800">Features</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {category?.features.join(', ')}
                            </div>
                          </div>
                          <div className="bg-white/50 p-4 rounded-xl">
                            <div className="text-base font-bold text-gray-800">Price Range</div>
                            <div className="text-lg font-bold text-gray-900 mt-1">{category?.priceRange}</div>
                          </div>
                          <div className="bg-white/50 p-4 rounded-xl">
                            <div className="text-base font-bold text-gray-800">Products</div>
                            <div className="text-lg font-bold text-gray-900 mt-1">{categoryProducts.length} items</div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Category Products */}
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-6">
                          Featured {category?.name}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {categoryProducts.map((product) => (
                            <div
                              key={product.id}
                              onMouseEnter={() => setHoveredProduct(product.id)}
                              onMouseLeave={() => setHoveredProduct(null)}
                            >
                              <Link to={`/product/${product.id}`}>
                                <Card className="overflow-hidden border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                                  <div className="relative">
                                    <OptimizedImage
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full aspect-square object-cover"
                                    />
                                    {product.featured && (
                                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold shadow-lg">
                                        <Crown className="h-4 w-4 mr-1" />
                                        Featured
                                      </Badge>
                                    )}
                                  </div>
                                  <CardContent className="p-4">
                                    <h5 className="font-bold text-base line-clamp-1 mb-2">{product.name}</h5>
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-lg text-primary">${product.price}</span>
                                      <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-semibold text-gray-600">4.8</span>
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
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Filter className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Explore Categories</h3>
                <p className="text-lg text-gray-600">Select a category to see featured products and details</p>
              </div>
            )}
          </div>

          {/* Enhanced Featured Products & Search Results */}
          <div className="lg:col-span-1">
            {searchQuery ? (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Search className="h-6 w-6 text-blue-600" />
                  Search Results
                </h3>
                <div className="space-y-4">
                  {searchResults.map((product) => (
                    <div key={product.id}>
                      <Link to={`/product/${product.id}`}>
                        <Card className="p-4 hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-blue-300">
                          <div className="flex items-center gap-4">
                            <OptimizedImage
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-base line-clamp-1">{product.name}</h5>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-lg font-bold text-primary">${product.price}</span>
                                <Badge variant="outline" className="text-sm font-semibold">
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
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Star className="h-6 w-6 text-yellow-500" />
                  Featured Products
                </h3>
                <div className="space-y-4">
                  {featuredProducts.map((product) => (
                    <div key={product.id}>
                      <Link to={`/product/${product.id}`}>
                        <Card className="p-4 hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-yellow-300">
                          <div className="flex items-center gap-4">
                            <OptimizedImage
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-base line-clamp-1">{product.name}</h5>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-lg font-bold text-primary">${product.price}</span>
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold">
                                  <Crown className="h-4 w-4 mr-1" />
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

            {/* Enhanced Quick Links */}
            <div className="mt-10">
              <h4 className="text-base font-bold text-gray-800 mb-4">Quick Links</h4>
              <div className="space-y-3">
                <Link to="/shop">
                  <Button variant="outline" size="lg" className="w-full justify-start h-12 rounded-xl border-2 hover:border-blue-300 hover:bg-blue-50">
                    <ArrowRight className="h-5 w-5 mr-3" />
                    View All Products
                  </Button>
                </Link>
                <Link to="/shop?sort=featured">
                  <Button variant="outline" size="lg" className="w-full justify-start h-12 rounded-xl border-2 hover:border-yellow-300 hover:bg-yellow-50">
                    <Star className="h-5 w-5 mr-3" />
                    Featured Collection
                  </Button>
                </Link>
                <Link to="/shop?sort=price-low">
                  <Button variant="outline" size="lg" className="w-full justify-start h-12 rounded-xl border-2 hover:border-green-300 hover:bg-green-50">
                    <Target className="h-5 w-5 mr-3" />
                    Best Deals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer Actions */}
        <div className="mt-12 pt-8 border-t-2 border-gray-300">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 text-base font-semibold text-gray-700">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-3 text-base font-semibold text-gray-700">
                <Truck className="h-5 w-5 text-blue-600" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-3 text-base font-semibold text-gray-700">
                <Headphones className="h-5 w-5 text-purple-600" />
                <span>Customer Support</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="lg" onClick={onClose} className="h-12 px-6 rounded-xl border-2">
                Close Menu
              </Button>
              <Link to="/shop">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-8 rounded-xl shadow-lg">
                  Shop Now
                  <ArrowRight className="h-5 w-5 ml-2" />
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
