
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';

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
    <Card className="group overflow-hidden border-border bg-card hover-lift transition-all duration-300">
      <div className="relative overflow-hidden">
        {featured && (
          <Badge className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
        <div className="aspect-square bg-muted overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <Button size="sm" variant="secondary" className="bg-white/90 text-black hover:bg-white">
            <Eye className="h-4 w-4 mr-1" />
            Quick View
          </Button>
          <Button size="sm" className="gradient-brand text-black font-semibold">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            {category}
          </p>
          <h3 className="font-oswald font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-primary">{price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice}
              </span>
            )}
          </div>
          <Button size="sm" variant="ghost" className="hover:text-primary">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
