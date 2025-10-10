import { supabase } from '@/integrations/supabase/client';
import { products } from '@/data/products';

export const populateProducts = async () => {
  try {
    console.log('Starting product population...');
    
    // Clear existing products
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all products
    
    if (deleteError) {
      console.error('Error clearing products:', deleteError);
      return;
    }
    
    console.log('Cleared existing products');
    
    // Transform and insert products
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace('$', '')),
      image: product.image,
      category: product.category,
      stock: Math.floor(Math.random() * 100) + 10,
      featured: product.featured,
      original_price: product.original_price || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    const { data, error } = await supabase
      .from('products')
      .insert(transformedProducts);
    
    if (error) {
      console.error('Error inserting products:', error);
      return;
    }
    
    console.log(`Successfully populated ${transformedProducts.length} products`);
    return data;
  } catch (error) {
    console.error('Error in populateProducts:', error);
  }
};

// Run the population script
if (typeof window !== 'undefined') {
  // Only run in browser environment
  populateProducts();
}
