import { useState, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star, StarOff, Crown, Shield } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface ProductCardOptimizedProps extends Product {}

const ProductCardOptimized = memo((product: ProductCardOptimizedProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { toast } = useToast();

  // Optimized motion values for smooth animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast({
        title: "Please select a size",
        description: "Choose your size before adding to cart.",
        variant: "destructive",
      });
      return;
    }
    
    addItem(product, selectedSize);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  }, [addItem, product, selectedSize, toast]);

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleItem(product);
    toast({
      title: isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} ${isInWishlist(product.id) ? 'removed from' : 'added to'} your wishlist.`,
    });
  }, [toggleItem, product, isInWishlist, toast]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left - rect.width / 2);
    mouseY.set(event.clientY - rect.top - rect.height / 2);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  return (
    <Link to={`/product/${product.id}`} className="block relative">
      <motion.div
        className="group"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
        }}
      >
        <Card 
          className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white backdrop-blur-sm group-hover:bg-white/95 cursor-pointer"
        >
          <div className="relative overflow-hidden">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover"
              priority={product.featured}
            />
            
            {/* Enhanced Overlay with Gradient */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Action Buttons */}
              <motion.div 
                className="absolute top-4 right-4 flex flex-col gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/95 hover:bg-white shadow-xl backdrop-blur-sm border border-white/20"
                  onClick={handleWishlist}
                >
                  <Heart className={`h-5 w-5 transition-colors ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/95 hover:bg-white shadow-xl backdrop-blur-sm border border-white/20"
                >
                  <Eye className="h-5 w-5 text-gray-700" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold shadow-lg">
                    <Crown className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </motion.div>
              )}
              {product.original_price && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                >
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-lg">
                    Sale
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Enhanced Quick Add Section */}
            <motion.div 
              className="absolute bottom-4 left-4 right-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                y: isHovered ? 0 : 20 
              }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              {product.sizes && product.sizes.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.slice(0, 4).map((size) => (
                      <motion.div key={size} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={selectedSize === size ? "default" : "secondary"}
                          size="sm"
                          className={`h-8 px-3 text-xs font-medium transition-all ${
                            selectedSize === size 
                              ? "bg-black text-white shadow-lg" 
                              : "bg-white/90 text-gray-700 hover:bg-white shadow-md"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedSize(size);
                          }}
                        >
                          {size}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button
                      className="w-full h-10 text-sm font-bold shadow-xl bg-black hover:bg-gray-800 text-white"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full h-10 text-sm font-bold shadow-xl bg-black hover:bg-gray-800 text-white"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>

          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-playfair text-lg font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.original_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.original_price}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {product.featured ? (
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ) : (
                  <StarOff className="h-3 w-3 text-gray-400" />
                )}
              </div>
            </div>

            {/* Category and Colors */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs capitalize">
                  {product.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
                </div>
              </div>
              
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-600">Available Colors:</span>
                  <div className="flex gap-1">
                    {product.colors.slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                    {product.colors.length > 4 && (
                      <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
});

ProductCardOptimized.displayName = 'ProductCardOptimized';

export default ProductCardOptimized;

