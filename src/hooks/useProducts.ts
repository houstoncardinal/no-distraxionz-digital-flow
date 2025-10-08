import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string | null;
  stock: number | null;
  featured: boolean;
  sizes: string[];
  colors: string[];
  original_price?: number | null;
  price_range?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to handle JSON fields and missing fields
      const transformedProducts = (data || []).map(product => ({
        ...product,
        sizes: product.sizes ? (Array.isArray(product.sizes) ? product.sizes : JSON.parse(product.sizes as string)) : [],
        colors: product.colors ? (Array.isArray(product.colors) ? product.colors : JSON.parse(product.colors as string)) : [],
        featured: product.featured !== undefined ? product.featured : false
      }));
      
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const productData = {
        ...product,
        sizes: JSON.stringify(product.sizes || []),
        colors: JSON.stringify(product.colors || []),
        featured: product.featured || false
      };

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product created successfully',
      });

      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updateData = {
        ...updates,
        sizes: updates.sizes ? JSON.stringify(updates.sizes) : undefined,
        colors: updates.colors ? JSON.stringify(updates.colors) : undefined,
      };

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });

      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });

      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
};
