import { useState, useMemo, memo, lazy, Suspense, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ColorSwatch from '@/components/ColorSwatch';
import { categories } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';
import { Search, Filter, Grid, List, SortAsc, SortDesc, Loader2, X } from 'lucide-react';

// Lazy load the ProductCard component for better performance
const ProductCard = lazy(() => import('./ProductCard'));

// Loading component for lazy loaded cards
const ProductCardSkeleton = () => (
  <Card className="overflow-hidden border-0 shadow-lg bg-white">
    <div className="aspect-square bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
      </div>
    </div>
  </Card>
);

const ProductGrid = memo(() => {
  const { products, loading } = useProducts();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Optimized callbacks to prevent unnecessary re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  const handlePriceRangeChange = useCallback((range: string) => {
    setSelectedPriceRange(range);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedColor('all');
    setSelectedPriceRange('all');
  }, []);

  // Get all unique colors from products
  const allColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach(product => {
      if (product.colors) {
        product.colors.forEach(color => colors.add(color));
      }
    });
    return Array.from(colors).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Color filter
    if (selectedColor !== 'all') {
      filtered = filtered.filter(product => product.colors && product.colors.includes(selectedColor));
    }

    // Price range filter
    if (selectedPriceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace('$', ''));
        switch (selectedPriceRange) {
          case 'under-25':
            return price < 25;
          case '25-50':
            return price >= 25 && price <= 50;
          case '50-75':
            return price >= 50 && price <= 75;
          case 'over-75':
            return price > 75;
          default:
            return true;
        }
      });
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, selectedColor, selectedPriceRange, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Filters Modal */}
      {isMobile && (
        <div className={`fixed inset-0 z-50 ${isMobileFiltersOpen ? 'block' : 'hidden'}`}>
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-8">
              {/* Search */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search
                </h3>
                <div className="relative">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-primary rounded-xl"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                    className="w-full justify-start h-12 text-left"
                    onClick={() => handleCategoryChange('all')}
                  >
                    All Products ({products.length})
                  </Button>
                  {categories.map((category) => {
                    const count = products.filter(p => p.category === category.value).length;
                    return (
                      <Button
                        key={category.value}
                        variant={selectedCategory === category.value ? 'default' : 'ghost'}
                        className="w-full justify-start h-12 text-left"
                        onClick={() => handleCategoryChange(category.value)}
                      >
                        {category.name} ({count})
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Colors</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedColor === 'all' ? 'default' : 'outline'}
                    className="h-10 justify-start"
                    onClick={() => handleColorChange('all')}
                  >
                    All Colors
                  </Button>
                  {allColors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? 'default' : 'outline'}
                      className="h-10 justify-start capitalize"
                      onClick={() => handleColorChange(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedPriceRange === 'all' ? 'default' : 'outline'}
                    className="w-full justify-start h-10"
                    onClick={() => handlePriceRangeChange('all')}
                  >
                    All Prices
                  </Button>
                  <Button
                    variant={selectedPriceRange === 'under-25' ? 'default' : 'outline'}
                    className="w-full justify-start h-10"
                    onClick={() => handlePriceRangeChange('under-25')}
                  >
                    Under $25
                  </Button>
                  <Button
                    variant={selectedPriceRange === '25-50' ? 'default' : 'outline'}
                    className="w-full justify-start h-10"
                    onClick={() => handlePriceRangeChange('25-50')}
                  >
                    $25 - $50
                  </Button>
                  <Button
                    variant={selectedPriceRange === '50-75' ? 'default' : 'outline'}
                    className="w-full justify-start h-10"
                    onClick={() => handlePriceRangeChange('50-75')}
                  >
                    $50 - $75
                  </Button>
                  <Button
                    variant={selectedPriceRange === 'over-75' ? 'default' : 'outline'}
                    className="w-full justify-start h-10"
                    onClick={() => handlePriceRangeChange('over-75')}
                  >
                    Over $75
                  </Button>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== 'all' || selectedColor !== 'all' || selectedPriceRange !== 'all' || searchQuery) && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full h-12 border-2 border-red-200 text-red-600 hover:bg-red-50"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`${isMobile ? 'block' : 'flex gap-8'}`}>
        {/* Desktop Filter Sidebar */}
        {!isMobile && (
          <div className="w-80 flex-shrink-0">
            <Card className="p-6 bg-white border-0 shadow-lg sticky top-24">
              <div className="space-y-8">
                {/* Search */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search
                  </h3>
                  <div className="relative">
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-10 h-12 border-2 border-gray-200 focus:border-primary rounded-xl"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                      className="w-full justify-start h-12 text-left"
                      onClick={() => handleCategoryChange('all')}
                    >
                      All Products ({products.length})
                    </Button>
                    {categories.map((category) => {
                      const count = products.filter(p => p.category === category.value).length;
                      return (
                        <Button
                          key={category.value}
                          variant={selectedCategory === category.value ? 'default' : 'ghost'}
                          className="w-full justify-start h-12 text-left"
                          onClick={() => handleCategoryChange(category.value)}
                        >
                          {category.name} ({count})
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Colors</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedColor === 'all' ? 'default' : 'outline'}
                      className="h-10 justify-start"
                      onClick={() => handleColorChange('all')}
                    >
                      All Colors
                    </Button>
                    {allColors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? 'default' : 'outline'}
                        className="h-10 justify-start capitalize"
                        onClick={() => handleColorChange(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Price Range</h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedPriceRange === 'all' ? 'default' : 'outline'}
                      className="w-full justify-start h-10"
                      onClick={() => handlePriceRangeChange('all')}
                    >
                      All Prices
                    </Button>
                    <Button
                      variant={selectedPriceRange === 'under-25' ? 'default' : 'outline'}
                      className="w-full justify-start h-10"
                      onClick={() => handlePriceRangeChange('under-25')}
                    >
                      Under $25
                    </Button>
                    <Button
                      variant={selectedPriceRange === '25-50' ? 'default' : 'outline'}
                      className="w-full justify-start h-10"
                      onClick={() => handlePriceRangeChange('25-50')}
                    >
                      $25 - $50
                    </Button>
                    <Button
                      variant={selectedPriceRange === '50-75' ? 'default' : 'outline'}
                      className="w-full justify-start h-10"
                      onClick={() => handlePriceRangeChange('50-75')}
                    >
                      $50 - $75
                    </Button>
                    <Button
                      variant={selectedPriceRange === 'over-75' ? 'default' : 'outline'}
                      className="w-full justify-start h-10"
                      onClick={() => handlePriceRangeChange('over-75')}
                    >
                      Over $75
                    </Button>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedCategory !== 'all' || selectedColor !== 'all' || selectedPriceRange !== 'all' || searchQuery) && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full h-12 border-2 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Main Content Area */}
        <div className={`${isMobile ? 'w-full' : 'flex-1'} space-y-6`}>
          {/* Top Bar with Filters and Sort */}
          <div className={`${isMobile ? 'space-y-4' : 'flex items-center justify-between'}`}>
            {/* Mobile Filter Button */}
            {isMobile && (
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Filter className="h-5 w-5" />
                  Filters
                  {(selectedCategory !== 'all' || selectedColor !== 'all' || selectedPriceRange !== 'all' || searchQuery) && (
                    <Badge variant="secondary" className="ml-1">
                      {(selectedCategory !== 'all' ? 1 : 0) + (selectedColor !== 'all' ? 1 : 0) + (selectedPriceRange !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0)}
                    </Badge>
                  )}
                </Button>

                {/* Sort Options Mobile */}
                <div className="flex items-center gap-2">
                  {/* View Mode Toggle Mobile */}
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handleViewModeChange('grid')}
                      className="rounded-none px-3"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handleViewModeChange('list')}
                      className="rounded-none px-3"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className={`${isMobile ? 'block' : 'flex-1'}`}>
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredProducts.length} Products Found
              </h2>
              <p className="text-gray-600 text-sm">
                {selectedCategory !== 'all' && `in ${selectedCategory}`}
                {selectedColor !== 'all' && ` • ${selectedColor} color`}
                {selectedPriceRange !== 'all' && ` • ${selectedPriceRange.replace('-', ' - ').replace('under', 'Under $').replace('over', 'Over $')}`}
                {searchQuery && ` • matching "${searchQuery}"`}
              </p>
            </div>

            {/* Desktop Controls */}
            {!isMobile && (
              <div className="flex items-center gap-4">
                {/* Sort Options */}
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48 h-12 border-2 border-gray-200 rounded-xl">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="lg"
                    onClick={() => handleViewModeChange('grid')}
                    className="rounded-none"
                  >
                    <Grid className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="lg"
                    onClick={() => handleViewModeChange('list')}
                    className="rounded-none"
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Product Grid with Lazy Loading */}
          <motion.div
            className={
              viewMode === 'grid'
                ? `grid grid-cols-1 ${
                    isMobile ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                  }`
                : 'space-y-6'
            }
            layout
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <Suspense fallback={<ProductCardSkeleton />}>
                  <ProductCard {...product} />
                </Suspense>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <Card className={`${isMobile ? 'p-8' : 'p-12'} text-center`}>
              <div className="space-y-4">
                <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto`}>
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                >
                  Clear all filters
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;
