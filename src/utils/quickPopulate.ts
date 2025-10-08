import { supabase } from '@/integrations/supabase/client';
import { products } from '@/data/products';

export const quickPopulateProducts = async () => {
  try {
    console.log('🚀 Quick populate starting...');
    
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
    
    console.log(`📝 Inserting ${transformedProducts.length} products...`);
    const { data, error } = await supabase
      .from('products')
      .insert(transformedProducts);
    
    if (error) {
      console.error('❌ Error inserting products:', error);
      throw error;
    }
    
    console.log(`🎉 Successfully populated ${transformedProducts.length} products!`);
    return data;
  } catch (error) {
    console.error('Error in quickPopulateProducts:', error);
    throw error;
  }
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  // Make it available globally for console use
  (window as any).quickPopulateProducts = quickPopulateProducts;
  console.log('💡 Run quickPopulateProducts() in console to populate products');
}


