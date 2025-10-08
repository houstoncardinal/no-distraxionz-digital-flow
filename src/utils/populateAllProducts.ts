import { supabase } from '@/integrations/supabase/client';

interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  sizes?: string[];
  colors?: string[];
}

const products: ProductData[] = [
  // Shirts
  {
    name: 'No Distraxionz Classic Tee - Black',
    description: 'Premium black cotton t-shirt with motivational "No Distraxionz" print. Perfect for staying focused.',
    price: 29.99,
    category: 'Shirts',
    image: '/shirts/envato-labs-image-edit (62).png',
    stock: 50,
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Gray']
  },
  {
    name: 'Focus Mode Graphic Tee',
    description: 'Bold graphic tee designed to inspire productivity and eliminate distractions.',
    price: 32.99,
    category: 'Shirts',
    image: '/shirts/envato-labs-image-edit (62) copy.png',
    stock: 45,
    featured: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Charcoal']
  },
  {
    name: 'Digital Flow Performance Tee',
    description: 'Moisture-wicking performance tee for the modern hustler. Stay cool under pressure.',
    price: 34.99,
    category: 'Shirts',
    image: '/shirts/envato-labs-image-edit (63).png',
    stock: 40,
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Blue']
  },
  {
    name: 'Hustle Hard Essential Tee',
    description: 'Essential t-shirt for those who refuse to be distracted from their goals.',
    price: 28.99,
    category: 'Shirts',
    image: '/shirts/envato-labs-image-edit (64).png',
    stock: 55,
    featured: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Gray', 'Black', 'White']
  },

  // Ladies
  {
    name: 'Women\'s Empowerment Tee',
    description: 'Designed for powerful women who conquer distractions. Fitted, flattering cut.',
    price: 34.99,
    category: 'Ladies',
    image: '/ladies/envato-labs-image-edit (63).png',
    stock: 35,
    featured: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Pink', 'White', 'Black']
  },
  {
    name: 'Boss Babe Premium Top',
    description: 'Premium quality top for the modern boss babe. Soft, comfortable, and stylish.',
    price: 39.99,
    category: 'Ladies',
    image: '/ladies/envato-labs-image-edit (64).png',
    stock: 30,
    featured: false,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Lavender', 'Mint', 'Coral']
  },
  {
    name: 'Focus Queen Athletic Top',
    description: 'Athletic fit for active women. Perfect for gym or everyday wear.',
    price: 36.99,
    category: 'Ladies',
    image: '/ladies/envato-labs-image-edit (65).png',
    stock: 40,
    featured: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Navy']
  },
  {
    name: 'Distraction-Free Lifestyle Tee',
    description: 'Lifestyle tee for women who prioritize their goals. Relaxed, comfortable fit.',
    price: 32.99,
    category: 'Ladies',
    image: '/ladies/envato-labs-image-edit (68).png',
    stock: 38,
    featured: false,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Blush', 'Sage']
  },

  // Hoodies
  {
    name: 'No Distraxionz Premium Hoodie',
    description: 'Cozy fleece-lined hoodie for focus sessions. Kangaroo pocket and drawstring hood.',
    price: 59.99,
    category: 'Hoodies',
    image: '/hoodie/envato-labs-image-edit (62).png',
    stock: 25,
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Gray', 'Navy']
  },
  {
    name: 'Focus Flow Zip-Up Hoodie',
    description: 'Versatile zip-up hoodie for maximum comfort and style. Perfect for any weather.',
    price: 64.99,
    category: 'Hoodies',
    image: '/hoodie/envato-labs-image-edit (63).png',
    stock: 20,
    featured: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal', 'Black', 'Maroon']
  },
  {
    name: 'Hustle Mode Pullover',
    description: 'Classic pullover hoodie with ribbed cuffs. Built for comfort and durability.',
    price: 56.99,
    category: 'Hoodies',
    image: '/hoodie/envato-labs-image-edit (64).png',
    stock: 30,
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Gray', 'Navy']
  },
  {
    name: 'Digital Flow Oversized Hoodie',
    description: 'Trendy oversized fit hoodie. Ultimate comfort for work or relaxation.',
    price: 62.99,
    category: 'Hoodies',
    image: '/hoodie/envato-labs-image-edit (65).png',
    stock: 22,
    featured: false,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Sand', 'Olive', 'Black']
  },

  // Hats
  {
    name: 'No Distraxionz Snapback',
    description: 'Classic snapback with embroidered logo. Adjustable fit, one size fits most.',
    price: 24.99,
    category: 'Hats',
    image: '/hats/envato-labs-image-edit (62).png',
    stock: 60,
    featured: true,
    sizes: ['One Size'],
    colors: ['Black', 'Navy', 'Gray']
  },
  {
    name: 'Focus Mode Baseball Cap',
    description: 'Curved brim baseball cap with UV protection. Perfect for outdoor focus sessions.',
    price: 22.99,
    category: 'Hats',
    image: '/hats/envato-labs-image-edit (63).png',
    stock: 55,
    featured: false,
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Khaki']
  },
  {
    name: 'Digital Flow Dad Hat',
    description: 'Unstructured dad hat for a relaxed look. Adjustable strap for perfect fit.',
    price: 26.99,
    category: 'Hats',
    image: '/hats/envato-labs-image-edit (64).png',
    stock: 50,
    featured: true,
    sizes: ['One Size'],
    colors: ['Black', 'Navy', 'Forest Green']
  },
  {
    name: 'Hustle Hard Trucker Hat',
    description: 'Mesh back trucker hat for breathability. Great for active days.',
    price: 23.99,
    category: 'Hats',
    image: '/hats/envato-labs-image-edit (65).png',
    stock: 45,
    featured: false,
    sizes: ['One Size'],
    colors: ['Black/White', 'Navy/Gray', 'Red/White']
  },

  // Toddler Shirts
  {
    name: 'Little Hustler Toddler Tee',
    description: 'Soft, durable tee for active toddlers. Machine washable and easy care.',
    price: 19.99,
    category: 'Toddler Shirts',
    image: '/toddler-shirts/envato-labs-image-edit - 2025-10-07T220721.938.png',
    stock: 40,
    featured: true,
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Blue', 'Red', 'Green']
  },
  {
    name: 'Future Leader Toddler Tee',
    description: 'Premium cotton tee for your little one. Comfortable and adorable.',
    price: 21.99,
    category: 'Toddler Shirts',
    image: '/toddler-shirts/envato-labs-image-edit - 2025-10-07T221052.201.png',
    stock: 35,
    featured: false,
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Yellow', 'Pink', 'Purple']
  },
  {
    name: 'Mini Boss Graphic Tee',
    description: 'Cute graphic tee with motivational print. Perfect for playtime.',
    price: 20.99,
    category: 'Toddler Shirts',
    image: '/toddler-shirts/envato-labs-image-edit - 2025-10-07T221222.032.png',
    stock: 38,
    featured: true,
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['White', 'Gray', 'Navy']
  },
  {
    name: 'Focus Kid Performance Tee',
    description: 'Performance fabric for active toddlers. Moisture-wicking and comfortable.',
    price: 23.99,
    category: 'Toddler Shirts',
    image: '/toddler-shirts/envato-labs-image-edit (12).webp',
    stock: 30,
    featured: false,
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Orange', 'Blue', 'Green']
  },
  {
    name: 'Dream Big Toddler Tee',
    description: 'Inspiring message for your little dreamer. Soft, breathable fabric.',
    price: 22.99,
    category: 'Toddler Shirts',
    image: '/toddler-shirts/envato-labs-image-edit (13).webp',
    stock: 33,
    featured: true,
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Pink', 'Lavender', 'Mint']
  },
  {
    name: 'No Limits Kids Tee',
    description: 'Durable tee for endless adventures. Easy care and long-lasting.',
    price: 20.99,
    category: 'Toddler Shirts',
    image: '/toddler-shirts/envato-labs-image-edit (14).webp',
    stock: 36,
    featured: false,
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Red', 'Black', 'White']
  }
];

export async function populateAllProducts() {
  try {
    console.log('Starting to populate products...');

    // First, clear existing products (optional - comment out if you want to keep existing)
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.log('Note: Could not clear existing products:', deleteError.message);
    }

    // Transform products to match database format (sizes and colors as JSON strings)
    const productsForDB = products.map(product => ({
      ...product,
      sizes: JSON.stringify(product.sizes || []),
      colors: JSON.stringify(product.colors || [])
    }));

    // Insert all products
    const { data, error } = await supabase
      .from('products')
      .insert(productsForDB)
      .select();

    if (error) {
      console.error('Error inserting products:', error);
      throw error;
    }

    console.log(`Successfully populated ${data?.length} products!`);
    console.log('Products by category:');
    console.log('- Shirts: 4 products');
    console.log('- Ladies: 4 products');
    console.log('- Hoodies: 4 products');
    console.log('- Hats: 4 products');
    console.log('- Toddler Shirts: 6 products');
    console.log('Total: 22 products');

    return data;
  } catch (error) {
    console.error('Error in populateAllProducts:', error);
    throw error;
  }
}

