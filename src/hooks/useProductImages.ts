import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { uploadImage, deleteImage, generateUniqueFilename, validateImageFile } from '@/lib/storage';
import type { Tables } from '@/integrations/supabase/types';

type ProductImage = Tables<'product_images'>;

interface UseProductImagesProps {
  productId?: string;
}

export const useProductImages = ({ productId }: UseProductImagesProps = {}) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch images for a product
  const fetchImages = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching product images:', error);
        return;
      }

      setImages(data || []);
    } catch (error) {
      console.error('Error fetching product images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Upload new image
  const uploadProductImage = async (
    file: File,
    productId: string,
    options?: {
      isPrimary?: boolean;
      sortOrder?: number;
    }
  ): Promise<{ success: boolean; image?: ProductImage; error?: string }> => {
    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      setUploading(true);

      // Generate unique filename
      const filename = generateUniqueFilename(file.name, `products/${productId}`);

      // Upload to storage
      const { url, error: uploadError } = await uploadImage(file, filename);

      if (uploadError || !url) {
        return { success: false, error: 'Failed to upload image' };
      }

      // Save to database
      const { data, error: dbError } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: url,
          is_primary: options?.isPrimary || false,
          sort_order: options?.sortOrder || 0,
        })
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file if database insert failed
        await deleteImage(filename);
        return { success: false, error: 'Failed to save image to database' };
      }

      // Update local state
      setImages(prev => [...prev, data]);

      return { success: true, image: data };
    } catch (error) {
      console.error('Error uploading product image:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const deleteProductImage = async (imageId: string, imageUrl: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Extract filename from URL for storage deletion
      const urlParts = imageUrl.split('/');
      const filename = urlParts.slice(-2).join('/'); // Get the last two parts (folder/filename)

      // Delete from database first
      const { error: dbError } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (dbError) {
        return { success: false, error: 'Failed to delete image from database' };
      }

      // Delete from storage
      const { error: storageError } = await deleteImage(filename);
      if (storageError) {
        console.warn('Failed to delete image from storage, but removed from database:', storageError);
      }

      // Update local state
      setImages(prev => prev.filter(img => img.id !== imageId));

      return { success: true };
    } catch (error) {
      console.error('Error deleting product image:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Update image properties
  const updateProductImage = async (
    imageId: string,
    updates: Partial<Pick<ProductImage, 'is_primary' | 'sort_order'>>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .update(updates)
        .eq('id', imageId)
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Failed to update image' };
      }

      // Update local state
      setImages(prev => prev.map(img =>
        img.id === imageId ? { ...img, ...updates } : img
      ));

      return { success: true };
    } catch (error) {
      console.error('Error updating product image:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Set primary image
  const setPrimaryImage = async (imageId: string): Promise<{ success: boolean; error?: string }> => {
    if (!productId) return { success: false, error: 'Product ID required' };

    try {
      // First, unset all primary flags for this product
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId);

      // Then set the new primary
      const result = await updateProductImage(imageId, { is_primary: true });

      return result;
    } catch (error) {
      console.error('Error setting primary image:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Load images when productId changes
  useEffect(() => {
    if (productId) {
      fetchImages(productId);
    } else {
      setImages([]);
    }
  }, [productId]);

  return {
    images,
    loading,
    uploading,
    uploadProductImage,
    deleteProductImage,
    updateProductImage,
    setPrimaryImage,
    refetch: productId ? () => fetchImages(productId) : () => {},
  };
};
