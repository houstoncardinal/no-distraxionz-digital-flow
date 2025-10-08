import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { products } from '@/data/products';

const ProductPopulator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const populateProducts = async () => {
    setIsLoading(true);
    setStatus('idle');

    try {
      console.log('Starting product population...');
      
      // Clear existing products
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (deleteError) {
        throw deleteError;
      }
      
      console.log('Cleared existing products');
      
      // Transform and insert products
      const transformedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price.replace('$', '')),
        image: product.image,
        category: product.category,
        stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
        featured: product.featured,
        sizes: JSON.stringify(product.sizes),
        colors: JSON.stringify(product.colors),
        original_price: product.originalPrice ? parseFloat(product.originalPrice.replace('$', '')) : null,
        price_range: product.priceRange,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      const { data, error } = await supabase
        .from('products')
        .insert(transformedProducts);
      
      if (error) {
        throw error;
      }
      
      console.log(`Successfully populated ${transformedProducts.length} products`);
      setStatus('success');
      
      toast({
        title: 'Success',
        description: `Successfully populated ${transformedProducts.length} products`,
      });
      
    } catch (error) {
      console.error('Error populating products:', error);
      setStatus('error');
      
      toast({
        title: 'Error',
        description: 'Failed to populate products',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Product Database
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Populate the database with all the real products from your website. This will sync your admin dashboard with the actual product catalog.
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={populateProducts} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            {isLoading ? 'Populating...' : 'Populate Products'}
          </Button>
          
          {status === 'success' && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Success
            </Badge>
          )}
          
          {status === 'error' && (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              Error
            </Badge>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          This will add {products.length} products across {new Set(products.map(p => p.category)).size} categories.
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPopulator;
