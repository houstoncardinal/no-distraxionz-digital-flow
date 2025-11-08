import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export const useCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_products(count)
        `)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const collectionsWithCount = data?.map(col => ({
        ...col,
        product_count: col.collection_products?.[0]?.count || 0,
      })) || [];

      setCollections(collectionsWithCount);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const createCollection = async (collection: Omit<Collection, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .insert([collection])
        .select()
        .single();

      if (error) throw error;

      setCollections([...collections, { ...data, product_count: 0 }]);
      toast({
        title: 'Success',
        description: 'Collection created successfully',
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateCollection = async (id: string, updates: Partial<Collection>) => {
    try {
      const { error } = await supabase
        .from('collections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setCollections(collections.map(c => c.id === id ? { ...c, ...updates } : c));
      toast({
        title: 'Success',
        description: 'Collection updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCollections(collections.filter(c => c.id !== id));
      toast({
        title: 'Success',
        description: 'Collection deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const addProductToCollection = async (collectionId: string, productId: string) => {
    try {
      const { error } = await supabase
        .from('collection_products')
        .insert([{ collection_id: collectionId, product_id: productId }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product added to collection',
      });
      await fetchCollections();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    collections,
    loading,
    createCollection,
    updateCollection,
    deleteCollection,
    addProductToCollection,
    refreshCollections: fetchCollections,
  };
};