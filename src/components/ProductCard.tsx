import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Product } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star, Zap, Shield, Crown } from 'lucide-react';
import ColorSwatch from '@/components/ColorSwatch';

interface ProductCardProps extends Product {}

const ProductCard = (product: ProductCardProps) => {
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
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
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="block relative">
      <motion.div
        className="group"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Card 
          className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white backdrop-blur-sm group-hover:bg-white/95 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative overflow-hidden">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            
            {/* Enhanced Overlay with Gradient */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Action Buttons */}
              <motion.div 
                className="absolute top-4 right-4 flex flex-col gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/95 hover:bg-white shadow-xl backdrop-blur-sm border border-white/20"
                  onClick={handleWishlist}
                >
                  <Heart className={`h-5 w-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
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
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold shadow-lg border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </motion.div>
              )}
              {product.original_price && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-lg border-0">
                    <Zap className="h-3 w-3 mr-1" />
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
                opacity: isMobile || isHovered ? 1 : 0,
                y: isMobile || isHovered ? 0 : 20
              }}
              transition={{ duration: 0.3, delay: 0.2 }}
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
              <h3 className="font-playfair text-lg font-medium text-gray-900 group-hover:text-primary transition-colors">
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
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
              </div>
            </div>

            {/* Category and Colors */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs capitalize">
                  {product.category}
                </Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
                </div>
              </div>
              
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-600">Available Colors:</span>
                  <ColorSwatch
                    colors={product.colors}
                    size="sm"
                    showLabels={false}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
