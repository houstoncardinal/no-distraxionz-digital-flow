import { supabase } from '@/integrations/supabase/client';
import { populateFromImageDatabase } from '@/utils/imageDatabase';

/**
 * Comprehensive utility to populate ALL products from all image categories
 * This includes: shirts, ladies, hats, hoodie, onesie, toddler-shirts
 */
export const populateAllCategories = async (): Promise<{ success: boolean; message: string; details?: any }> => {
  try {
    console.log('🚀 Starting comprehensive product population from ALL categories...');
    console.log('📁 Categories: shirts, ladies, hats, hoodie, onesie, toddler-shirts');
    
    // Generate products from ALL image categories
    const products = await populateFromImageDatabase();
    console.log(`📦 Generated ${products.length} products from image database`);
    
    // Clear existing products
    console.log('🧹 Clearing existing products from database...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('❌ Error clearing products:', deleteError);
      throw deleteError;
    }
    
    console.log('✅ Existing products cleared successfully');
    
    // Insert all products
    console.log(`📝 Inserting ${products.length} products into database...`);
    const { data, error } = await supabase
      .from('products')
      .insert(products);
    
    if (error) {
      console.error('❌ Error inserting products:', error);
      throw error;
    }
    
    console.log(`🎉 Successfully populated ${products.length} products!`);
    
    // Calculate and display breakdown by category
    const categoryBreakdown = products.reduce((acc: any, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📊 Product breakdown by category:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    Object.entries(categoryBreakdown).forEach(([category, count]) => {
      console.log(`  ✓ ${category}: ${count} products`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return { 
      success: true, 
      message: `Successfully imported ${products.length} products from all categories!`,
      details: categoryBreakdown
    };
  } catch (error) {
    console.error('❌ Error in populateAllCategories:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to populate products from all categories' 
    };
  }
};

// Make it globally available for console testing
if (typeof window !== 'undefined') {
  (window as any).populateAllCategories = populateAllCategories;
  console.log('💡 Run populateAllCategories() in console to import ALL products from all folders');
}
