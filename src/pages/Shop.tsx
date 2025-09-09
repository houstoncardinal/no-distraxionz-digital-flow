import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { products, categories } from '@/data/products';
import { Search, Filter, SlidersHorizontal, Grid3X3, List, ShoppingBag } from 'lucide-react';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseInt(a.price.replace('$', '')) - parseInt(b.price.replace('$', ''));
      case 'price-high':
        return parseInt(b.price.replace('$', '')) - parseInt(a.price.replace('$', ''));
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return b.featured ? 1 : -1;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Modern Page Header */}
      <section className="section-padding-modern bg-gradient-modern">
        <div className="w-full container-padding-modern text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20 font-medium px-4 py-2">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Complete Collection
          </Badge>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium mb-6 text-gradient tracking-tight">
            Shop Collection
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Discover our complete range of contemporary fashion. Each piece is carefully curated 
            to meet the highest standards of quality and design excellence.
          </p>
        </div>
      </section>

      {/* Modern Filters and Controls */}
      <section className="py-8 bg-card/50 backdrop-blur-xl border-b border-border/50">
        <div className="w-full container-padding-modern">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Enhanced Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern pl-12"
              />
            </div>

            {/* Modern Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={`rounded-xl font-medium transition-all duration-200 ${
                    selectedCategory === category.value 
                      ? "bg-primary text-primary-foreground shadow-lg" 
                      : "border-border hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Enhanced Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-modern min-w-[180px] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 border border-border rounded-xl p-1 bg-background">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding-modern">
        <div className="w-full container-padding-modern">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-playfair text-2xl md:text-3xl font-medium">
              {selectedCategory === 'all' ? 'All Products' : `${selectedCategory} Collection`}
            </h2>
            <Badge variant="secondary" className="bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-xl">
              {sortedProducts.length} Products
            </Badge>
          </div>

          {sortedProducts.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                : "grid grid-cols-1 md:grid-cols-2 gap-8"
            }>
              {sortedProducts.map((product) => (
                <div key={product.id} className="animate-fade-in">
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-20 card-modern shadow-modern">
              <CardContent className="p-12 space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="font-playfair text-2xl font-medium">No Products Found</h3>
                  <p className="text-muted-foreground text-lg">
                    We couldn't find any products matching your criteria. Try adjusting your search or filters.
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }} 
                  className="btn-primary"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
