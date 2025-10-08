import { supabase } from '@/integrations/supabase/client';
import { populateBasicProducts } from './populateBasicProducts';

let hasChecked = false;

export async function checkAndPopulateProducts() {
  // Only check once per session
  if (hasChecked) return;
  hasChecked = true;

  try {
    console.log('🔍 Checking if products exist...');
    
    // Check if there are any products
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Error checking products:', error);
      return;
    }

    // If no products exist, populate them
    if (!data || data.length === 0) {
      console.log('📦 No products found. Auto-populating...');
      await populateBasicProducts();
      console.log('✅ Products auto-populated successfully!');
      
      // Reload the page to show the new products
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      console.log('✅ Products already exist in database');
    }
  } catch (error) {
    console.error('Error in auto-populate check:', error);
  }
}

