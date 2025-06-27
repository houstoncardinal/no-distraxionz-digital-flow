
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { products, categories } from '@/data/products';
import { Search, Filter, SlidersHorizontal, Grid3X3, List } from 'lucide-react';

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
      
      {/* Page Header */}
      <section className="section-padding bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto container-padding text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20 font-medium">
            Complete Collection
          </Badge>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-light mb-6">
            Shop Collection
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our complete range of contemporary fashion. Each piece is carefully curated 
            to meet the highest standards of quality and design excellence.
          </p>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto container-padding">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border h-11"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={selectedCategory === category.value ? 
                    "bg-primary text-primary-foreground" : 
                    "border-border hover:bg-secondary"
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-2 text-foreground h-11 min-w-[160px]"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center gap-1 border border-border rounded-md p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-playfair text-2xl md:text-3xl font-light">
              {selectedCategory === 'all' ? 'All Products' : `${selectedCategory} Collection`}
            </h2>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
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
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-20 border-0 corporate-shadow">
              <CardContent className="p-12">
                <div className="text-6xl mb-6 opacity-50">🔍</div>
                <h3 className="font-playfair text-2xl font-medium mb-4">No Products Found</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  We couldn't find any products matching your criteria. Please try adjusting your search or filters.
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }} className="bg-primary text-primary-foreground hover:bg-primary/90">
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
