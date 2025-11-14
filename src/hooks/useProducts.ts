import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Export Product type from data/products.ts to keep types consistent
export type { Product } from '@/data/products';

export const useProducts = () => {
  const [products, setProducts] = useState<import('@/data/products').Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variations(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match Product interface, using defaults for missing fields
      const transformedProducts = (data || []).map(product => ({
        ...product,
        sizes: [],  // Not stored in DB yet
        colors: [], // Not stored in DB yet
        featured: false,
        priceRange: undefined,
        variations: product.product_variations || []
      })) as any[];
      
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

  const createProduct = async (product: Partial<import('@/data/products').Product> & { variations?: any[] }) => {
    try {
      const productData = {
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock || 0,
        featured: product.featured || false,
        meta_title: product.meta_title,
        meta_description: product.meta_description,
        meta_keywords: product.meta_keywords,
      };

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      // Create variations if provided
      if (product.variations && product.variations.length > 0 && data) {
        const variationsData = product.variations.map(v => ({
          product_id: data.id,
          name: v.name,
          sku: v.sku,
          price: parseFloat(v.price),
          stock: v.stock,
          attributes: v.attributes || {},
        }));

        const { error: variationsError } = await supabase
          .from('product_variations')
          .insert(variationsData);

        if (variationsError) throw variationsError;
      }

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

  const updateProduct = async (id: string, updates: Partial<import('@/data/products').Product> & { variations?: any[] }) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          image: updates.image,
          category: updates.category,
          stock: updates.stock,
          featured: updates.featured,
          meta_title: updates.meta_title,
          meta_description: updates.meta_description,
          meta_keywords: updates.meta_keywords,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update variations if provided
      if (updates.variations !== undefined) {
        // Delete existing variations
        await supabase
          .from('product_variations')
          .delete()
          .eq('product_id', id);

        // Insert new variations
        if (updates.variations.length > 0) {
          const variationsData = updates.variations.map(v => ({
            product_id: id,
            name: v.name,
            sku: v.sku,
            price: parseFloat(v.price),
            stock: v.stock,
            attributes: v.attributes || {},
          }));

          const { error: variationsError } = await supabase
            .from('product_variations')
            .insert(variationsData);

          if (variationsError) throw variationsError;
        }
      }

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
