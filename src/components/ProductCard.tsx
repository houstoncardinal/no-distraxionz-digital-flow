
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Heart, Eye } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  featured?: boolean;
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  originalPrice, 
  image, 
  category, 
  featured = false 
}: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 bg-card hover-lift transition-all duration-500 corporate-shadow hover:shadow-2xl">
      <div className="relative overflow-hidden">
        {featured && (
          <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground font-medium">
            New Arrival
          </Badge>
        )}
        
        <div className="aspect-[3/4] bg-secondary/20 overflow-hidden relative">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
            <div className="flex space-x-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-white/95 text-black hover:bg-white font-medium"
              >
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Button>
              <Button 
                size="sm" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Heart icon */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 h-8 w-8 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {category}
          </p>
          <h3 className="font-playfair font-medium text-lg leading-snug group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-lg text-foreground">{price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through font-medium">
                {originalPrice}
              </span>
            )}
          </div>
          
          {originalPrice && (
            <Badge variant="destructive" className="text-xs">
              Sale
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
