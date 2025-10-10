import { supabase } from '@/integrations/supabase/client';
import { products } from '@/data/products';

export const populateDatabase = async () => {
  try {
    console.log('🚀 Starting database population...');
    
    // Clear existing products
    console.log('🧹 Clearing existing products...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('❌ Error clearing products:', deleteError);
      throw deleteError;
    }
    
    console.log('✅ Existing products cleared');
    
    // Transform and insert products
    console.log('📦 Transforming products...');
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
    
    console.log(`📝 Inserting ${transformedProducts.length} products...`);
    const { data, error } = await supabase
      .from('products')
      .insert(transformedProducts);
    
    if (error) {
      console.error('❌ Error inserting products:', error);
      throw error;
    }
    
    console.log(`🎉 Successfully populated ${transformedProducts.length} products!`);
    console.log('📊 Product breakdown:');
    
    // Show breakdown by category
    const categoryBreakdown = transformedProducts.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(categoryBreakdown).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} products`);
    });
    
    return data;
  } catch (error) {
    console.error('💥 Error in populateDatabase:', error);
    throw error;
  }
};

// Auto-run if in browser environment
if (typeof window !== 'undefined') {
  // Add to window for easy access
  (window as any).populateDatabase = populateDatabase;
  console.log('🔧 Database population function available as window.populateDatabase()');
}
