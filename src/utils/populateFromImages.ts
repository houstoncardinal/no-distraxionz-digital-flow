import { supabase } from '@/integrations/supabase/client';
import { populateFromImageDatabase } from '@/utils/imageDatabase';

export const populateProductsFromImageDatabase = async () => {
  try {
    console.log('🚀 Starting image database population...');
    
    // Generate products from your image database
    const products = populateFromImageDatabase();
    console.log(`📦 Generated ${products.length} products from image database`);
    
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
    
    // Insert products with proper database structure
    console.log(`📝 Inserting ${products.length} products...`);
    const { data, error } = await supabase
      .from('products')
      .insert(products);
    
    if (error) {
      console.error('❌ Error inserting products:', error);
      throw error;
    }
    
    console.log(`🎉 Successfully populated ${products.length} products from image database!`);
    
    // Show breakdown by category
    const categoryBreakdown = products.reduce((acc: any, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📊 Product breakdown by category:');
    Object.entries(categoryBreakdown).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });
    
    return data;
  } catch (error) {
    console.error('Error in populateProductsFromImageDatabase:', error);
    throw error;
  }
};

// Make it available globally for console use
if (typeof window !== 'undefined') {
  (window as any).populateFromImages = populateProductsFromImageDatabase;
  console.log('💡 Run populateFromImages() in console to populate from your image database');
}

