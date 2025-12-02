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

    // Subscribe to realtime changes for products
    const productsChannel = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        () => {
          console.log('Product changed - refetching...');
          fetchProducts();
        }
      )
      .subscribe();

    // Subscribe to product_variations changes
    const variationsChannel = supabase
      .channel('variations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_variations',
        },
        () => {
          console.log('Product variation changed - refetching...');
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(variationsChannel);
    };
  }, []);

  const createProduct = async (product: Partial<import('@/data/products').Product> & { variations?: any[], schema_data?: any }) => {
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
        schema_data: product.schema_data || null,
      };

      console.log('Creating product:', productData);

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error('Supabase create error:', error);
        throw error;
      }

      console.log('Product created successfully:', data);

      // Create variations if provided
      if (product.variations && product.variations.length > 0 && data) {
        const variationsData = product.variations.map(v => ({
          product_id: data.id,
          name: v.name || 'Default',
          sku: v.sku || null,
          price: v.price ? parseFloat(String(v.price)) : null,
          stock: v.stock || 0,
          attributes: v.attributes || {},
        }));

        const { error: variationsError } = await supabase
          .from('product_variations')
          .insert(variationsData);

        if (variationsError) {
          console.error('Error creating variations:', variationsError);
        }
      }

      // Immediately refetch to ensure UI updates
      await fetchProducts();

      return data;
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create product',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateProduct = async (id: string, updates: Partial<import('@/data/products').Product> & { variations?: any[] }) => {
    try {
      // Build update object with only defined values to prevent overwriting with undefined
      const updateData: Record<string, any> = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.image !== undefined) updateData.image = updates.image;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.stock !== undefined) updateData.stock = updates.stock;
      if (updates.featured !== undefined) updateData.featured = updates.featured;
      if (updates.meta_title !== undefined) updateData.meta_title = updates.meta_title;
      if (updates.meta_description !== undefined) updateData.meta_description = updates.meta_description;
      if (updates.meta_keywords !== undefined) updateData.meta_keywords = updates.meta_keywords;
      if ((updates as any).schema_data !== undefined) updateData.schema_data = (updates as any).schema_data;

      console.log('Updating product:', id, updateData);

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Product updated successfully:', data);

      // Update variations if provided
      if (updates.variations !== undefined) {
        // Delete existing variations
        const { error: deleteError } = await supabase
          .from('product_variations')
          .delete()
          .eq('product_id', id);

        if (deleteError) {
          console.error('Error deleting variations:', deleteError);
        }

        // Insert new variations
        if (updates.variations.length > 0) {
          const variationsData = updates.variations.map(v => ({
            product_id: id,
            name: v.name || 'Default',
            sku: v.sku || null,
            price: v.price ? parseFloat(String(v.price)) : null,
            stock: v.stock || 0,
            attributes: v.attributes || {},
          }));

          const { error: variationsError } = await supabase
            .from('product_variations')
            .insert(variationsData);

          if (variationsError) {
            console.error('Error inserting variations:', variationsError);
          }
        }
      }

      // Immediately refetch to ensure UI updates
      await fetchProducts();

      return data;
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to update product',
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

      // Immediately refetch to ensure UI updates
      await fetchProducts();

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
