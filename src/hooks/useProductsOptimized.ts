import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from './useProducts';

// Cache for products to avoid unnecessary API calls
let productsCache: Product[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProductsOptimized = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if cache is still valid
  const isCacheValid = useMemo(() => {
    return productsCache && (Date.now() - cacheTimestamp) < CACHE_DURATION;
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Return cached data if valid
      if (isCacheValid && productsCache) {
        setProducts(productsCache);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our Product interface
      const transformedProducts: Product[] = (data || []).map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.original_price,
        image: product.image,
        category: product.category,
        sizes: product.sizes || [],
        colors: product.colors || [],
        featured: product.featured || false,
        created_at: product.created_at,
        updated_at: product.updated_at
      }));

      // Update cache
      productsCache = transformedProducts;
      cacheTimestamp = Date.now();
      setProducts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [isCacheValid]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Optimized product operations with memoization
  const createProduct = useCallback(async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      // Update cache
      const newProduct: Product = {
        ...data,
        sizes: data.sizes || [],
        colors: data.colors || [],
        featured: data.featured || false
      };
      
      productsCache = [newProduct, ...(productsCache || [])];
      setProducts(prev => [newProduct, ...prev]);
      
      return newProduct;
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update cache
      const updatedProduct: Product = {
        ...data,
        sizes: data.sizes || [],
        colors: data.colors || [],
        featured: data.featured || false
      };
      
      productsCache = (productsCache || []).map(p => p.id === id ? updatedProduct : p);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      
      return updatedProduct;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update cache
      productsCache = (productsCache || []).filter(p => p.id !== id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  }, []);

  // Memoized computed values
  const featuredProducts = useMemo(() => 
    products.filter(product => product.featured), 
    [products]
  );

  const categories = useMemo(() => {
    const categorySet = new Set(products.map(p => p.category));
    return Array.from(categorySet);
  }, [products]);

  const totalProducts = useMemo(() => products.length, [products]);

  return {
    products,
    featuredProducts,
    categories,
    totalProducts,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};

