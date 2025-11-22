import { supabase } from '@/integrations/supabase/client';

// Storage bucket name for product images
export const STORAGE_BUCKET = 'product-images';

// Initialize storage bucket if it doesn't exist
export const initializeStorage = async () => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);

    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true, // Make images publicly accessible
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
        fileSizeLimit: 5242880, // 5MB limit
      });

      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }

      console.log('Storage bucket created successfully');
    }

    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return false;
  }
};

// Upload image to Supabase Storage
export const uploadImage = async (
  file: File,
  path: string,
  options?: {
    upsert?: boolean;
  }
): Promise<{ url: string | null; error: any }> => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: options?.upsert || false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      return { url: null, error };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { url: null, error };
  }
};

// Delete image from Supabase Storage
export const deleteImage = async (path: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);

    if (error) {
      console.error('Error deleting image:', error);
    }

    return { error };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { error };
  }
};

// Get public URL for an image
export const getImageUrl = (path: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return publicUrl;
};

// List images in a folder
export const listImages = async (path?: string): Promise<{ data: any[] | null; error: any }> => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(path, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.error('Error listing images:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error listing images:', error);
    return { data: null, error };
  }
};

// Migrate existing public images to Supabase Storage
export const migratePublicImages = async () => {
  try {
    // This would be used to migrate existing images from public folder to storage
    // For now, we'll just ensure the bucket exists
    const initialized = await initializeStorage();
    return { success: initialized, error: initialized ? null : 'Failed to initialize storage' };
  } catch (error) {
    console.error('Error migrating images:', error);
    return { success: false, error };
  }
};

// Generate a unique filename for uploads
export const generateUniqueFilename = (originalName: string, prefix?: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  const baseName = originalName.replace(/\.[^/.]+$/, '');

  return `${prefix || 'upload'}/${timestamp}-${random}-${baseName}.${extension}`;
};

// Validate image file
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large. Maximum size is 5MB.' };
  }

  return { valid: true };
};
