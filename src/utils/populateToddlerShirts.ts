import { supabase } from '@/integrations/supabase/client';

export const toddlerShirtsData = [
  {
    name: 'Toddler Focus Tee - Classic White',
    description: 'Premium cotton tee designed for active toddlers. Soft, breathable, and built to last through endless adventures. Features our signature NO DISTRAXIONZ branding in a kid-friendly design.',
    price: 22,
    original_price: 28,
    image: '/toddler-shirts/envato-labs-image-edit - 2025-10-07T220721.938.png',
    category: 'Toddler Shirts',
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['White', 'Black', 'Navy', 'Gray'],
    featured: true,
    specifications: {
      material: '100% Premium Cotton',
      weight: '5.3 oz',
      fit: 'Regular Fit',
      care: 'Machine washable',
      origin: 'Made in USA',
      features: ['Pre-shrunk', 'Tear-away label', 'Double-needle stitching', 'Reinforced seams']
    },
    variations: [
      { size: '2T', color: 'White', sku: 'TS-2T-WHT-001', stock: 25, price: 22 },
      { size: '3T', color: 'White', sku: 'TS-3T-WHT-001', stock: 30, price: 22 },
      { size: '4T', color: 'White', sku: 'TS-4T-WHT-001', stock: 28, price: 22 },
      { size: '5T', color: 'White', sku: 'TS-5T-WHT-001', stock: 20, price: 22 }
    ],
    tax_rate: 0.08,
    tags: ['toddler', 'cotton', 'basic', 'everyday']
  },
  {
    name: 'Toddler Adventure Tee - Bold Graphics',
    description: 'Eye-catching graphic tee that inspires young minds to stay focused and dream big. Made with ultra-soft fabric perfect for sensitive toddler skin.',
    price: 24,
    original_price: 30,
    image: '/toddler-shirts/envato-labs-image-edit - 2025-10-07T221052.201.png',
    category: 'Toddler Shirts',
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Navy', 'Black', 'Red', 'Green'],
    featured: true,
    specifications: {
      material: '100% Organic Cotton',
      weight: '5.5 oz',
      fit: 'Comfortable Fit',
      care: 'Machine washable, tumble dry low',
      origin: 'Made in USA',
      features: ['Organic fabric', 'Eco-friendly dyes', 'Tagless design', 'Reinforced shoulders']
    },
    variations: [
      { size: '2T', color: 'Navy', sku: 'TS-2T-NVY-002', stock: 22, price: 24 },
      { size: '3T', color: 'Navy', sku: 'TS-3T-NVY-002', stock: 28, price: 24 },
      { size: '4T', color: 'Navy', sku: 'TS-4T-NVY-002', stock: 25, price: 24 },
      { size: '5T', color: 'Navy', sku: 'TS-5T-NVY-002', stock: 18, price: 24 }
    ],
    tax_rate: 0.08,
    tags: ['toddler', 'organic', 'graphic', 'adventure']
  },
  {
    name: 'Toddler Comfort Tee - Everyday Essential',
    description: 'The perfect everyday tee for your little one. Super soft, durable, and designed to withstand the most active toddlers. Features motivational messaging scaled for kids.',
    price: 20,
    original_price: 26,
    image: '/toddler-shirts/envato-labs-image-edit - 2025-10-07T221222.032.png',
    category: 'Toddler Shirts',
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Gray', 'White', 'Black', 'Blue'],
    featured: false,
    specifications: {
      material: '60% Cotton, 40% Polyester Blend',
      weight: '4.8 oz',
      fit: 'Relaxed Fit',
      care: 'Machine washable, easy care',
      origin: 'Made in USA',
      features: ['Moisture-wicking', 'Quick-dry', 'Fade-resistant', 'Stretchy collar']
    },
    variations: [
      { size: '2T', color: 'Gray', sku: 'TS-2T-GRY-003', stock: 30, price: 20 },
      { size: '3T', color: 'Gray', sku: 'TS-3T-GRY-003', stock: 35, price: 20 },
      { size: '4T', color: 'Gray', sku: 'TS-4T-GRY-003', stock: 32, price: 20 },
      { size: '5T', color: 'Gray', sku: 'TS-5T-GRY-003', stock: 25, price: 20 }
    ],
    tax_rate: 0.08,
    tags: ['toddler', 'blend', 'everyday', 'comfort']
  },
  {
    name: 'Toddler Premium Tee - Limited Edition',
    description: 'Limited edition toddler tee with exclusive design. Premium quality fabric and construction for the most discerning parents. Part of our exclusive kids collection.',
    price: 26,
    original_price: 32,
    image: '/toddler-shirts/envato-labs-image-edit (12).webp',
    category: 'Toddler Shirts',
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Black', 'White', 'Navy', 'Charcoal'],
    featured: true,
    specifications: {
      material: '100% Pima Cotton',
      weight: '6.0 oz',
      fit: 'Premium Fit',
      care: 'Machine washable, hang dry recommended',
      origin: 'Made in USA',
      features: ['Pima cotton', 'Luxury feel', 'Colorfast', 'Reinforced construction']
    },
    variations: [
      { size: '2T', color: 'Black', sku: 'TS-2T-BLK-004', stock: 15, price: 26 },
      { size: '3T', color: 'Black', sku: 'TS-3T-BLK-004', stock: 20, price: 26 },
      { size: '4T', color: 'Black', sku: 'TS-4T-BLK-004', stock: 18, price: 26 },
      { size: '5T', color: 'Black', sku: 'TS-5T-BLK-004', stock: 12, price: 26 }
    ],
    tax_rate: 0.08,
    tags: ['toddler', 'premium', 'limited', 'pima']
  },
  {
    name: 'Toddler Active Tee - Performance Blend',
    description: 'Performance tee designed for the most active toddlers. Moisture-wicking fabric keeps them cool and comfortable during play. Perfect for daycare, playground, or home.',
    price: 23,
    original_price: 29,
    image: '/toddler-shirts/envato-labs-image-edit (13).webp',
    category: 'Toddler Shirts',
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Blue', 'Green', 'Red', 'Orange'],
    featured: false,
    specifications: {
      material: '50% Cotton, 50% Performance Polyester',
      weight: '4.5 oz',
      fit: 'Athletic Fit',
      care: 'Machine washable, tumble dry',
      origin: 'Made in USA',
      features: ['Moisture-wicking', 'Anti-odor', 'UV protection', 'Stretchy fabric']
    },
    variations: [
      { size: '2T', color: 'Blue', sku: 'TS-2T-BLU-005', stock: 28, price: 23 },
      { size: '3T', color: 'Blue', sku: 'TS-3T-BLU-005', stock: 32, price: 23 },
      { size: '4T', color: 'Blue', sku: 'TS-4T-BLU-005', stock: 30, price: 23 },
      { size: '5T', color: 'Blue', sku: 'TS-5T-BLU-005', stock: 22, price: 23 }
    ],
    tax_rate: 0.08,
    tags: ['toddler', 'performance', 'active', 'sports']
  },
  {
    name: 'Toddler Graphic Tee - Motivational',
    description: 'Inspire your little one with motivational graphics and positive messaging. Soft, comfortable, and built to last. Perfect for building confidence and focus from an early age.',
    price: 25,
    original_price: 31,
    image: '/toddler-shirts/envato-labs-image-edit (14).webp',
    category: 'Toddler Shirts',
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['White', 'Gray', 'Black', 'Navy'],
    featured: true,
    specifications: {
      material: '100% Ring-Spun Cotton',
      weight: '5.0 oz',
      fit: 'Standard Fit',
      care: 'Machine washable',
      origin: 'Made in USA',
      features: ['Ring-spun cotton', 'Soft hand feel', 'Screen-printed graphics', 'Durable print']
    },
    variations: [
      { size: '2T', color: 'White', sku: 'TS-2T-WHT-006', stock: 26, price: 25 },
      { size: '3T', color: 'White', sku: 'TS-3T-WHT-006', stock: 30, price: 25 },
      { size: '4T', color: 'White', sku: 'TS-4T-WHT-006', stock: 28, price: 25 },
      { size: '5T', color: 'White', sku: 'TS-5T-WHT-006', stock: 20, price: 25 }
    ],
    tax_rate: 0.08,
    tags: ['toddler', 'graphic', 'motivational', 'kids']
  }
];

export const populateToddlerShirts = async () => {
  try {
    console.log('🚀 Starting toddler shirts population...');

    // Check if products already exist
    const { data: existingProducts } = await supabase
      .from('products')
      .select('name')
      .eq('category', 'Toddler Shirts');

    if (existingProducts && existingProducts.length > 0) {
      console.log('⚠️ Toddler shirts already exist. Skipping population.');
      return {
        success: true,
        message: 'Toddler shirts already exist',
        count: existingProducts.length
      };
    }

    // Insert products
    const { data, error } = await supabase
      .from('products')
      .insert(toddlerShirtsData.map(product => ({
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.original_price,
        image: product.image,
        category: product.category,
        sizes: product.sizes,
        colors: product.colors,
        featured: product.featured
      })))
      .select();

    if (error) {
      console.error('❌ Error inserting toddler shirts:', error);
      throw error;
    }

    console.log(`✅ Successfully populated ${data?.length || 0} toddler shirt products!`);

    return {
      success: true,
      message: `Successfully added ${data?.length || 0} toddler shirt products`,
      products: data
    };
  } catch (error) {
    console.error('❌ Error in populateToddlerShirts:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      error
    };
  }
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).populateToddlerShirts = populateToddlerShirts;
  console.log('💡 Run populateToddlerShirts() in console to add toddler shirts');
}

