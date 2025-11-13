import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Hero } from '@/components/ui/animated-hero';
import ProductCard from '@/components/ProductCard';
import CategoryShowcase from '@/components/CategoryShowcase';
import VideoShowcase from '@/components/VideoShowcase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ChevronRight, Award, Shield, Truck, Headphones, Globe, Users, Play, ShoppingBag, Star, Filter, Search, Heart, TrendingUp, Package, CreditCard, Sparkles, Crown, Diamond, Zap, Target, ArrowRight, Shirt, Zap as ZapIcon, Eye } from 'lucide-react';
import QuickViewModal from '@/components/QuickViewModal';

const Index = () => {
  const { products, loading } = useProducts();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  
  // Show featured products, or if none are marked as featured, just show first 3 products
  const featuredProducts = products.filter(product => product.featured).slice(0, 3);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);

  const handleBuyNow = () => {
    if (displayProducts.length > 0) {
      // Add the first product to cart and go to checkout
      addItem(displayProducts[0]);
      toast({
        title: "Added to cart!",
        description: `${displayProducts[0].name} has been added to your cart.`,
      });
      // Navigate to checkout
      window.location.href = '/checkout';
    }
  };

  const handleAddToWishlist = () => {
    if (displayProducts.length > 0) {
      toggleItem(displayProducts[0]);
      toast({
        title: isInWishlist(displayProducts[0].id) ? "Removed from wishlist" : "Added to wishlist",
        description: `${displayProducts[0].name} has been ${isInWishlist(displayProducts[0].id) ? 'removed from' : 'added to'} your wishlist.`,
      });
    }
  };

  const handleQuickView = () => {
    if (displayProducts.length > 0) {
      setQuickViewProduct(displayProducts[0]);
      setShowQuickView(true);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      {/* Animated Streetwear Hero */}
      <Hero />

      {/* Floating Benefits Bar over Hero */}
      <motion.div 
        className="relative -mt-20 md:-mt-28 z-20 container-padding-modern"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-gray-900/60 to-black/40 rounded-3xl blur-xl"></div>
            <motion.div 
              className="relative bg-black/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  className="flex items-center justify-center space-x-6 text-center md:text-left group"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Shield className="h-7 w-7 text-white group-hover:text-green-400 transition-colors duration-300" />
                  </motion.div>
                  <div>
                    <h4 className="font-playfair text-xl font-medium text-white mb-1 group-hover:text-green-400 transition-colors duration-300">Secure Checkout</h4>
                    <p className="text-sm text-white/70">SSL encrypted transactions</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-center space-x-6 text-center md:text-left group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Truck className="h-7 w-7 text-white group-hover:text-blue-400 transition-colors duration-300" />
                  </motion.div>
                  <div>
                    <h4 className="font-playfair text-xl font-medium text-white mb-1 group-hover:text-blue-400 transition-colors duration-300">Fast Shipping</h4>
                    <p className="text-sm text-white/70">Delivery in 3-5 business days</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-center space-x-6 text-center md:text-left group"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center mx-auto flex-shrink-0 backdrop-blur-sm border border-white/20"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Headphones className="h-7 w-7 text-white group-hover:text-purple-400 transition-colors duration-300" />
                  </motion.div>
                  <div>
                    <h4 className="font-playfair text-xl font-medium text-white mb-1 group-hover:text-purple-400 transition-colors duration-300">Customer Support</h4>
                    <p className="text-sm text-white/70">We're here to help</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Ultra Modern Featured Collection Section */}
      <section className="relative -mt-32 pt-40 pb-32 bg-white">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-gray-100/50 to-gray-200/30 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 -right-24 w-80 h-80 bg-gradient-to-br from-gray-200/40 to-gray-100/30 rounded-full blur-3xl"
            animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/30 to-transparent" />
        </div>

        <div className="w-full container-padding-modern relative z-10">
          <div className="w-full">
            {/* Ultra Modern Header */}
            <motion.div 
              className="text-center mb-24"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Badge className="mb-8 bg-black text-white border-0 px-8 py-4 text-sm font-bold shadow-xl rounded-full">
                  <Crown className="h-4 w-4 mr-2" />
                  PREMIUM COLLECTION
                </Badge>
              </motion.div>
              
              <motion.h2 
                className="font-playfair text-6xl md:text-7xl lg:text-8xl font-light leading-tight mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="text-gray-900">Featured</span>
                <span className="block bg-gradient-to-r from-black via-gray-700 to-gray-900 bg-clip-text text-transparent font-bold">
                  Collection
                </span>
              </motion.h2>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Premium streetwear engineered for the relentless. Limited drops, precision details, uncompromising quality.
              </motion.p>

              {/* Enhanced Stats Bar */}
              <motion.div 
                className="flex flex-wrap items-center justify-center gap-12 mt-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <motion.div 
                  className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-bold text-gray-900">Limited Edition</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-bold text-gray-900">Premium Quality</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <Zap className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-bold text-gray-900">Fast Shipping</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Enhanced Products Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {loading ? (
                // Loading state
                <div className="col-span-3 text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              ) : displayProducts.length === 0 ? (
                // No products state
                <div className="col-span-3 text-center py-20">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Products Loading</h3>
                  <p className="text-gray-600 mb-6">Our products are being added to the store. Please refresh in a moment.</p>
                  <Button onClick={() => window.location.reload()} className="bg-black text-white hover:bg-gray-800">
                    Refresh Page
                  </Button>
                </div>
              ) : (
                displayProducts.map((product, index) => (
                <motion.div 
                  key={product.id} 
                  className="group"
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.6 + (index * 0.15),
                    ease: "easeOut"
                  }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className={`relative ${index === 1 ? 'md:scale-110 md:z-10' : ''}`}>
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Enhanced Product Card */}
                    <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/20 group-hover:shadow-3xl transition-all duration-500">
                      <ProductCard {...product} />
                      
                      {/* Center Badge for Featured Item */}
                      {index === 1 && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2 shadow-lg">
                            <Crown className="h-4 w-4 mr-1" />
                            BESTSELLER
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )))}
            </motion.div>

            {/* Ultra Modern Call to Action */}
            <motion.div 
              className="text-center space-y-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {/* Quick Purchase Options - Only show if products exist */}
              {displayProducts.length > 0 && (
                <div className="bg-gray-50 rounded-3xl p-8 max-w-4xl mx-auto">
                  <h3 className="font-playfair text-2xl font-bold text-gray-900 mb-6">Quick Checkout</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        onClick={handleBuyNow}
                        className="w-full h-16 bg-black hover:bg-gray-800 text-white font-bold text-lg rounded-2xl shadow-xl"
                      >
                        <ShoppingBag className="mr-3 h-6 w-6" />
                        Buy Now
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        onClick={handleAddToWishlist}
                        variant="outline" 
                        className="w-full h-16 border-2 border-gray-300 hover:bg-gray-100 text-gray-900 font-bold text-lg rounded-2xl"
                      >
                        <Heart className={`mr-3 h-6 w-6 ${displayProducts.length > 0 && isInWishlist(displayProducts[0].id) ? 'fill-red-500 text-red-500' : ''}`} />
                        Add to Wishlist
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        onClick={handleQuickView}
                        variant="outline" 
                        className="w-full h-16 border-2 border-gray-300 hover:bg-gray-100 text-gray-900 font-bold text-lg rounded-2xl"
                      >
                        <Eye className="mr-3 h-6 w-6" />
                        Quick View
                      </Button>
                    </motion.div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800 font-bold px-16 py-6 text-xl rounded-full shadow-2xl group">
                  <Link to="/shop">
                    <ShoppingBag className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                    Shop All Products
                    <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button asChild size="lg" variant="outline" className="border-2 border-gray-300 text-gray-900 hover:bg-gray-100 font-bold px-12 py-6 text-xl rounded-full">
                  <Link to="/about">
                    <Target className="mr-2 h-5 w-5" />
                    Our Story
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-3 text-gray-600">
                  <Truck className="h-6 w-6" />
                  <span className="font-medium">Free shipping over $75</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-600">
                  <Shield className="h-6 w-6" />
                  <span className="font-medium">30-day easy returns</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-600">
                  <Star className="h-6 w-6" />
                  <span className="font-medium">Quality guaranteed</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Video Showcase */}
      <VideoShowcase />

      {/* Ultra Sleek Brand Section */}
      <section className="relative w-full bg-black overflow-hidden py-32">
        {/* Ultra sleek dark vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)]" />
        
        {/* Animated gradient blobs (subtle white glows) */}
        <motion.div
          aria-hidden
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-3xl"
          animate={{ x: [-10, 10, -10], y: [0, -8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute top-40 -right-24 w-96 h-96 rounded-full bg-white/3 blur-3xl"
          animate={{ x: [10, -10, 10], y: [0, 12, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-32 left-1/3 w-[28rem] h-[28rem] rounded-full bg-white/4 blur-3xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Sleek moving grid */}
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)",
          }}
        />

        <div className="w-full container-padding-modern relative z-10">
          <div className="w-full">
            {/* Powerful Section Header */}
            <motion.div 
              className="text-center mb-24"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Badge className="bg-white/10 text-white border border-white/20 font-bold px-8 py-4 mb-8 text-sm tracking-wider backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  PREMIUM STREETWEAR
                </Badge>
              </motion.div>

              <motion.h2 
                className="font-playfair text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-tight mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="text-white">NO</span>
                <motion.span 
                  className="block bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent font-bold"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  DISTRAXIONZ
                </motion.span>
              </motion.h2>

              <motion.p 
                className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Premium streetwear built for focus and movement. Limited drops, precision details, everyday comfort.
              </motion.p>

            </motion.div>

            {/* No Distraxionz Features Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Quick Shipping */}
              <motion.div 
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ y: -15, rotateY: 5 }}
              >
                {/* Animated Glow Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-cyan-500/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <Card className="relative bg-white/5 backdrop-blur-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-700 overflow-hidden shadow-2xl h-full">
                  {/* Animated Border Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: "linear-gradient(45deg, transparent, rgba(34, 211, 238, 0.3), transparent)",
                      backgroundSize: "200% 200%",
                    }}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <CardContent className="relative p-8 lg:p-10 text-center space-y-6 h-full flex flex-col justify-center">
                    {/* Animated Icon Container */}
                    <motion.div 
                      className="relative w-24 h-24 mx-auto"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full backdrop-blur-sm border border-white/20"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div 
                        className="absolute inset-2 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full flex items-center justify-center"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Truck className="h-12 w-12 text-cyan-400" />
                      </motion.div>
                      
                      {/* Pulse Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      />
                    </motion.div>
                    
                    <div className="space-y-4">
                      <h3 className="font-playfair text-2xl lg:text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                        Lightning Delivery
                      </h3>
                      <p className="text-white/80 leading-relaxed text-base lg:text-lg">
                        24-48 hour express shipping. Your focus can't wait, neither should your gear.
                      </p>
                      
                      {/* Feature Tags */}
                      <div className="flex flex-wrap gap-2 justify-center pt-2">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/90">Free Over $75</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/90">Same Day NYC</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quality Clothing */}
              <motion.div 
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ y: -15, rotateY: -5 }}
              >
                {/* Animated Glow Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-green-500/40 to-emerald-500/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <Card className="relative bg-white/5 backdrop-blur-2xl border border-white/10 hover:border-emerald-400/50 transition-all duration-700 overflow-hidden shadow-2xl h-full">
                  {/* Animated Border Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: "linear-gradient(45deg, transparent, rgba(52, 211, 153, 0.3), transparent)",
                      backgroundSize: "200% 200%",
                    }}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <CardContent className="relative p-8 lg:p-10 text-center space-y-6 h-full flex flex-col justify-center">
                    {/* Animated Icon Container */}
                    <motion.div 
                      className="relative w-24 h-24 mx-auto"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full backdrop-blur-sm border border-white/20"
                        animate={{ rotate: [0, -360] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div 
                        className="absolute inset-2 bg-gradient-to-br from-emerald-400/30 to-green-500/30 rounded-full flex items-center justify-center"
                        whileHover={{ rotate: -180 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Shirt className="h-12 w-12 text-emerald-400" />
                      </motion.div>
                      
                      {/* Pulse Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-emerald-400/50"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                      />
                    </motion.div>
                    
                    <div className="space-y-4">
                      <h3 className="font-playfair text-2xl lg:text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                        Premium Materials
                      </h3>
                      <p className="text-white/80 leading-relaxed text-base lg:text-lg">
                        100% premium cotton blends. Comfort that moves with your hustle, durability that lasts.
                      </p>
                      
                      {/* Feature Tags */}
                      <div className="flex flex-wrap gap-2 justify-center pt-2">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/90">Lifetime Quality</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/90">Eco-Friendly</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Customization */}
              <motion.div 
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ y: -15, rotateY: 5 }}
              >
                {/* Animated Glow Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <Card className="relative bg-white/5 backdrop-blur-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-700 overflow-hidden shadow-2xl h-full">
                  {/* Animated Border Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: "linear-gradient(45deg, transparent, rgba(168, 85, 247, 0.3), transparent)",
                      backgroundSize: "200% 200%",
                    }}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <CardContent className="relative p-8 lg:p-10 text-center space-y-6 h-full flex flex-col justify-center">
                    {/* Animated Icon Container */}
                    <motion.div 
                      className="relative w-24 h-24 mx-auto"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full backdrop-blur-sm border border-white/20"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div 
                        className="absolute inset-2 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Sparkles className="h-12 w-12 text-purple-400" />
                      </motion.div>
                      
                      {/* Pulse Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-purple-400/50"
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                      />
                    </motion.div>
                    
                    <div className="space-y-4">
                      <h3 className="font-playfair text-2xl lg:text-3xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                        Custom Designs
                      </h3>
                      <p className="text-white/80 leading-relaxed text-base lg:text-lg">
                        Make it yours. Custom prints, embroidery, and exclusive colorways for the focused few.
                      </p>
                      
                      {/* Feature Tags */}
                      <div className="flex flex-wrap gap-2 justify-center pt-2">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/90">Personal Touch</span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/90">Limited Runs</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>


          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-primary via-primary/95 to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"></div>
        
        <div className="w-full container-padding-modern text-center relative z-10">
          <div className="w-full space-y-12">
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
              No Distraxionz. Just Progress.
            </h2>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed font-light">
              Join those who've eliminated the noise. Who've chosen focus over chaos. 
              Who understand that true power comes from unwavering concentration on what matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-medium px-12 py-6 text-lg rounded-full bg-transparent">
                <Link to="/shop">Enter the Zone</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-white hover:bg-white/10 font-medium px-8 py-6 text-lg">
                <Link to="/about">Our Mission</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </div>
  );
};

export default Index;
