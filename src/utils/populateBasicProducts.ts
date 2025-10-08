import { supabase } from '@/integrations/supabase/client';

// Product data with client-specified pricing
const basicProducts = [
  // Men's Shirts - $40
  {
    name: 'No Distraxionz Classic Tee - Black',
    description: 'Premium black cotton t-shirt with motivational "No Distraxionz" print. Perfect for staying focused.',
    price: 40.00,
    category: 'Shirts',
    image: '/shirts/envato-labs-image-edit (62).png',
    stock: 50,
  },
  {
    name: 'Focus Mode Graphic Tee',
    description: 'Bold graphic tee designed to inspire productivity and eliminate distractions.',
    price: 40.00,
    category: 'Shirts',
    image: '/shirts/envato-labs-image-edit (62) copy.png',
    stock: 45,
  },
  {
    name: 'Digital Flow Performance Tee',
    description: 'Moisture-wicking performance tee for the modern hustler. Stay cool under pressure.',
    price: 40.00,
    category: 'Shirts',
    image: '/shirts/envato-labs-image-edit (63).png',
    stock: 40,
  },
  {
    name: 'Hustle Hard Essential Tee',
    description: 'Essential t-shirt for those who refuse to be distracted from their goals.',
    price: 40.00,
    category: 'Shirts',
    image: '/shirts/envato-labs-image-edit (64).png',
    stock: 55,
  },

  // Ladies Shirts - $35
  {
    name: 'Women\'s Empowerment Tee',
    description: 'Designed for powerful women who conquer distractions. Fitted, flattering cut.',
    price: 35.00,
    category: 'Ladies',
    image: '/ladies/envato-labs-image-edit (63).png',
    stock: 35,
  },
  {
    name: 'Boss Babe Premium Top',
    description: 'Premium quality top for the modern boss babe. Soft, comfortable, and stylish.',
    price: 35.00,
    category: 'Ladies',
    image: '/ladies/envato-labs-image-edit (64).png',
    stock: 30,
  },
  {
    name: 'Focus Queen Athletic Top',
    description: 'Athletic fit for active women. Perfect for gym or everyday wear.',
    price: 35.00,
    category: 'Ladies',
    image: '/ladies/envato-labs-image-edit (65).png',
    stock: 40,
  },
  {
    name: 'Distraction-Free Lifestyle Tee',
    description: 'Lifestyle tee for women who prioritize their goals. Relaxed, comfortable fit.',
    price: 35.00,
    category: 'Ladies',
    image: '/ladies/envato-labs-image-edit (68).png',
    stock: 38,
  },

  // Hoodies - $65
  {
    name: 'No Distraxionz Premium Hoodie',
    description: 'Cozy fleece-lined hoodie for focus sessions. Kangaroo pocket and drawstring hood.',
    price: 65.00,
    category: 'Hoodies',
    image: '/hoodie/envato-labs-image-edit (62).png',
    stock: 25,
  },
  {
    name: 'Focus Flow Zip-Up Hoodie',
    description: 'Versatile zip-up hoodie for maximum comfort and style. Perfect for any weather.',
    price: 65.00,
    category: 'Hoodies',
    image: '/hoodie/envato-labs-image-edit (63).png',
    stock: 20,
  },
  {
    name: 'Hustle Mode Pullover',
    description: 'Classic pullover hoodie with ribbed cuffs. Built for comfort and durability.',
    price: 65.00,
    category: 'Hoodies',
    image: '/hoodie/envato-labs-image-edit (64).png',
    stock: 30,
  },
  {
    name: 'Digital Flow Oversized Hoodie',
    description: 'Trendy oversized fit hoodie. Ultimate comfort for work or relaxation.',
    price: 65.00,
    category: 'Hoodies',
    image: '/hoodie/envato-labs-image-edit (65).png',
    stock: 22,
  },

  // Hats - $35
  {
    name: 'No Distraxionz Snapback',
    description: 'Classic snapback with embroidered logo. Adjustable fit, one size fits most.',
    price: 35.00,
    category: 'Hats',
    image: '/hats/envato-labs-image-edit (62).png',
    stock: 60,
  },
  {
    name: 'Focus Mode Baseball Cap',
    description: 'Curved brim baseball cap with UV protection. Perfect for outdoor focus sessions.',
    price: 35.00,
    category: 'Hats',
    image: '/hats/envato-labs-image-edit (63).png',
    stock: 55,
  },
  {
    name: 'Digital Flow Dad Hat',
    description: 'Unstructured dad hat for a relaxed look. Adjustable strap for perfect fit.',
    price: 35.00,
    category: 'Hats',
    image: '/hats/envato-labs-image-edit (64).png',
    stock: 50,
  },
  {
    name: 'Hustle Hard Trucker Hat',
    description: 'Mesh back trucker hat for breathability. Great for active days.',
    price: 35.00,
    category: 'Hats',
    image: '/hats/envato-labs-image-edit (65).png',
    stock: 45,
  },

  // Toddler Shirts - $25
  {
    name: 'Little Hustler Toddler Tee',
    description: 'Soft, durable tee for active toddlers. Machine washable and easy care.',
    price: 25.00,
    category: 'Toddler Shirts',
    image: '/toddler-shirts/envato-labs-image-edit - 2025-10-07T220721.938.png',
    stock: 40,
  },
  {
    name: 'Future Leader Toddler Tee',
    description: 'Premium cotton tee for your little one. Comfortable and adorable.',
    price: 25.00,
    category: 'Toddler Shirts',
    image: '/toddler-shirts/envato-labs-image-edit - 2025-10-07T221052.201.png',
    stock: 35,
  },
  {
    name: 'Mini Boss Graphic Tee',
    description: 'Cute graphic tee with motivational print. Perfect for playtime.',
    price: 25.00,
    category: 'Toddler Shirts',
    image: '/toddler-shirts/envato-labs-image-edit - 2025-10-07T221222.032.png',
    stock: 38,
  },
  {
    name: 'Focus Kid Performance Tee',
    description: 'Performance fabric for active toddlers. Moisture-wicking and comfortable.',
    price: 25.00,
    category: 'Toddler Shirts',
    image: '/toddler-shirts/envato-labs-image-edit (12).webp',
    stock: 30,
  },
  {
    name: 'Dream Big Toddler Tee',
    description: 'Inspiring message for your little dreamer. Soft, breathable fabric.',
    price: 25.00,
    category: 'Toddler Shirts',
    image: '/toddler-shirts/envato-labs-image-edit (13).webp',
    stock: 33,
  },
  {
    name: 'No Limits Kids Tee',
    description: 'Durable tee for endless adventures. Easy care and long-lasting.',
    price: 25.00,
    category: 'Toddler Shirts',
    image: '/toddler-shirts/envato-labs-image-edit (14).webp',
    stock: 36,
  },

  // Onesies - $20
  {
    name: 'No Distraxionz Baby Onesie',
    description: 'Adorable onesie for your little one. Soft, comfortable, and easy to change.',
    price: 20.00,
    category: 'Onesies',
    image: '/onesie/envato-labs-image-edit - 2025-10-07T213233.751.png',
    stock: 30,
  },
  {
    name: 'Future Focus Baby Onesie',
    description: 'Cute and comfy onesie with motivational design. Perfect for naptime and playtime.',
    price: 20.00,
    category: 'Onesies',
    image: '/onesie/envato-labs-image-edit - 2025-10-07T213443.609.png',
    stock: 28,
  },
  {
    name: 'Little Achiever Onesie',
    description: 'Premium cotton onesie for babies. Snap closures for easy diaper changes.',
    price: 20.00,
    category: 'Onesies',
    image: '/onesie/envato-labs-image-edit - 2025-10-07T213736.621.png',
    stock: 32,
  },
  {
    name: 'Baby Boss Onesie',
    description: 'Stylish and comfortable onesie for your little boss. Soft and breathable.',
    price: 20.00,
    category: 'Onesies',
    image: '/onesie/envato-labs-image-edit - 2025-10-07T214228.011.png',
    stock: 25,
  },
  {
    name: 'Distraction-Free Baby Onesie',
    description: 'Cozy onesie for peaceful sleep. Made with love for your little one.',
    price: 20.00,
    category: 'Onesies',
    image: '/onesie/envato-labs-image-edit (12).webp',
    stock: 27,
  }
];

export async function populateBasicProducts() {
  try {
    console.log('🚀 Starting to populate products...');
    console.log('📊 Total products to add:', basicProducts.length);

    // Clear existing products
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.log('⚠️ Note: Could not clear existing products:', deleteError.message);
    } else {
      console.log('✅ Cleared existing products');
    }

    // Insert all products
    const { data, error } = await supabase
      .from('products')
      .insert(basicProducts)
      .select();

    if (error) {
      console.error('❌ Error inserting products:', error);
      throw error;
    }

    console.log('✅ Successfully populated', data?.length, 'products!');
    console.log('📦 Products by category:');
    console.log('  - Men\'s Shirts: 4 products @ $40 each');
    console.log('  - Ladies Shirts: 4 products @ $35 each');
    console.log('  - Hoodies: 4 products @ $65 each');
    console.log('  - Hats: 4 products @ $35 each');
    console.log('  - Toddler Shirts: 6 products @ $25 each');
    console.log('  - Onesies: 5 products @ $20 each');
    console.log('🎉 Total: 27 products added!');

    return data;
  } catch (error) {
    console.error('❌ Error in populateBasicProducts:', error);
    throw error;
  }
}
