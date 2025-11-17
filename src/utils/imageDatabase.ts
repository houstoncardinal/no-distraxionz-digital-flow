import type { Database } from '@/integrations/supabase/types';

// Image Database Integration
// This utility discovers and maps all images in your public folder to products

export interface ImageDatabaseItem {
  path: string;
  category: string;
  filename: string;
  fullPath: string;
}

export interface CategoryImages {
  [category: string]: ImageDatabaseItem[];
}

// Discover all images in your public folder structure
export const discoverImages = (): CategoryImages => {
  const categories = ['shirts', 'ladies', 'hats', 'hoodie', 'onesie', 'toddler-shirts', 'lovable-uploads'];
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
  
  const discoveredImages: CategoryImages = {};
  
  categories.forEach(category => {
    discoveredImages[category] = [];
    
    // This would be populated by scanning the actual files
    // For now, we'll use the known structure
    const categoryImages: ImageDatabaseItem[] = [];
    
    // Map known images to their categories
    const imageMap: { [key: string]: string[] } = {
      'shirts': [
        'envato-labs-image-edit (62) copy.png',
        'envato-labs-image-edit (62).png',
        'envato-labs-image-edit (63).png',
        'envato-labs-image-edit (64).png'
      ],
      'ladies': [
        'envato-labs-image-edit (63).png',
        'envato-labs-image-edit (64).png',
        'envato-labs-image-edit (65).png',
        'envato-labs-image-edit (68).png'
      ],
      'hats': [
        'envato-labs-image-edit (62).png',
        'envato-labs-image-edit (63).png',
        'envato-labs-image-edit (64).png',
        'envato-labs-image-edit (65).png'
      ],
      'hoodie': [
        'envato-labs-image-edit (62).png',
        'envato-labs-image-edit (63).png',
        'envato-labs-image-edit (64).png',
        'envato-labs-image-edit (65).png'
      ],
      'onesie': [
        'envato-labs-image-edit (12).webp',
        'envato-labs-image-edit - 2025-10-07T213233.751.png',
        'envato-labs-image-edit - 2025-10-07T213443.609.png',
        'envato-labs-image-edit - 2025-10-07T213736.621.png',
        'envato-labs-image-edit - 2025-10-07T214228.011.png'
      ],
      'toddler-shirts': [
        'envato-labs-image-edit (12).webp',
        'envato-labs-image-edit (13).webp',
        'envato-labs-image-edit (14).webp',
        'envato-labs-image-edit - 2025-10-07T220721.938.png',
        'envato-labs-image-edit - 2025-10-07T221052.201.png',
        'envato-labs-image-edit - 2025-10-07T221222.032.png'
      ],
      'lovable-uploads': [
        '30a4fcab-8cc9-4f74-8a58-f4c349a4cb3c.png',
        '809945ef-fe18-461e-963e-17ee3add2941.png'
      ]
    };
    
    if (imageMap[category]) {
      imageMap[category].forEach(filename => {
        categoryImages.push({
          path: `/${category}/${filename}`,
          category: category,
          filename: filename,
          fullPath: `/${category}/${filename}`
        });
      });
    }
    
    discoveredImages[category] = categoryImages;
  });
  
  return discoveredImages;
};

// Generate products from discovered images
type ProductInsert = Database['public']['Tables']['products']['Insert'];

const generateProductId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `prod-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
};

const getMetaTitle = (category: string, name: string) =>
  `${name} | NO DISTRAXIONZ ${category.charAt(0).toUpperCase() + category.slice(1)}`;

const getMetaDescription = (category: string) =>
  `Premium ${category} from NO DISTRAXIONZ — engineered for focus and crafted for purpose.`;

const getSchemaData = (name: string, price: number) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name,
  brand: 'NO DISTRAXIONZ',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    price: price.toFixed(2),
    availability: 'https://schema.org/InStock',
  },
});

export const generateProductsFromImages = () => {
  const images = discoverImages();
  const products: ProductInsert[] = [];

  Object.entries(images).forEach(([category, categoryImages]) => {
    categoryImages.forEach((image, index) => {
      const productName = generateProductName(category, index);
      const productPrice = generateProductPrice(category);
      
      const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
      const product: ProductInsert = {
        id: generateProductId(),
        name: productName,
        description: generateProductDescription(category, productName),
        price: productPrice,
        image: image.fullPath,
        category: categoryLabel,
        stock: Math.floor(Math.random() * 100) + 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        meta_title: getMetaTitle(categoryLabel, productName),
        meta_description: getMetaDescription(categoryLabel),
        meta_keywords: [categoryLabel, 'premium streetwear', 'No Distraxionz'],
        schema_data: getSchemaData(productName, productPrice),
      };

      products.push(product);
    });
  });
  
  return products;
};

// Helper functions
const generateProductName = (category: string, index: number): string => {
  const names: { [key: string]: string[] } = {
    'shirts': [
      'Focus Mode Classic Tee',
      'Hustle Hard Essential Tee', 
      'Legendary Status Tee',
      'No Distraxionz Signature Tee'
    ],
    'ladies': [
      'Empowered Women Tee',
      'Boss Lady Essential',
      'Focused Femme Tee',
      'Queen Status Tee'
    ],
    'hats': [
      'Focus Cap Classic',
      'Hustle Hard Snapback',
      'Legendary Status Cap',
      'No Distraxionz Beanie'
    ],
    'hoodie': [
      'Focus Mode Hoodie',
      'Hustle Hard Pullover',
      'Legendary Status Hoodie',
      'No Distraxionz Zip-Up'
    ],
    'onesie': [
      'Baby Focus Mode Onesie',
      'Little Legend Onesie',
      'Mini Hustler Baby Onesie',
      'No Distraxionz Baby Romper',
      'Focus Baby Bodysuit'
    ],
    'toddler-shirts': [
      'Toddler Focus Tee',
      'Little Hustler Toddler Shirt',
      'Mini Legend Tee',
      'Future Focus Toddler Shirt',
      'No Distraxionz Kids Tee',
      'Toddler Boss Shirt'
    ],
    'lovable-uploads': [
      'Premium Collection Tee',
      'Exclusive Design Hoodie'
    ]
  };
  
  return names[category]?.[index] || `${category.charAt(0).toUpperCase() + category.slice(1)} Item ${index + 1}`;
};

const generateProductPrice = (category: string): number => {
  const priceRanges: { [key: string]: [number, number] } = {
    'shirts': [35, 50],
    'ladies': [40, 55],
    'hats': [25, 40],
    'hoodie': [60, 85],
    'onesie': [30, 45],
    'toddler-shirts': [28, 42],
    'lovable-uploads': [45, 70]
  };
  
  const [min, max] = priceRanges[category] || [30, 60];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateProductDescription = (category: string, name: string): string => {
  const descriptions: { [key: string]: string } = {
    'shirts': 'Premium cotton tee with motivational messaging. Perfect for those who stay focused on their goals.',
    'ladies': 'Empowering designs for strong women who refuse to be average. Premium quality construction.',
    'hats': 'Premium cap for outdoor focus sessions. Built for the grind and designed for success.',
    'hoodie': 'Comfortable hoodie for focus sessions. Premium materials with streetwear aesthetics.',
    'onesie': 'Soft and comfortable baby onesie with motivational designs. Perfect for the little ones who are destined for greatness.',
    'toddler-shirts': 'Adorable toddler tee with inspirational messaging. Premium quality for active little hustlers.',
    'lovable-uploads': 'Exclusive design from our premium collection. Limited edition streetwear.'
  };
  
  return descriptions[category] || `Premium ${category} designed for the focused and ambitious.`;
};

const getSizesForCategory = (category: string): string[] => {
  const sizeMap: { [key: string]: string[] } = {
    'shirts': ['S', 'M', 'L', 'XL', 'XXL'],
    'ladies': ['XS', 'S', 'M', 'L', 'XL'],
    'hats': ['One Size'],
    'hoodie': ['S', 'M', 'L', 'XL', 'XXL'],
    'onesie': ['0-3M', '3-6M', '6-12M', '12-18M'],
    'toddler-shirts': ['2T', '3T', '4T', '5T'],
    'lovable-uploads': ['S', 'M', 'L', 'XL', 'XXL']
  };
  
  return sizeMap[category] || ['S', 'M', 'L', 'XL'];
};

const getColorsForCategory = (category: string): string[] => {
  const colorMap: { [key: string]: string[] } = {
    'shirts': ['Black', 'White', 'Navy', 'Charcoal'],
    'ladies': ['Black', 'White', 'Pink', 'Navy'],
    'hats': ['Black', 'White', 'Navy', 'Gray'],
    'hoodie': ['Black', 'Gray', 'Navy', 'White'],
    'onesie': ['White', 'Baby Blue', 'Pink', 'Yellow'],
    'toddler-shirts': ['Black', 'White', 'Red', 'Blue'],
    'lovable-uploads': ['Black', 'White', 'Navy']
  };
  
  return colorMap[category] || ['Black', 'White'];
};

const getPriceRangeForCategory = (category: string): string => {
  const ranges: { [key: string]: string } = {
    'shirts': '$35-50',
    'ladies': '$40-55', 
    'hats': '$25-40',
    'hoodie': '$60-85',
    'onesie': '$30-45',
    'toddler-shirts': '$28-42',
    'lovable-uploads': '$45-70'
  };
  
  return ranges[category] || '$30-60';
};

// Export the main function to populate from images
export const populateFromImageDatabase = async () => {
  const products = generateProductsFromImages();
  return products;
};
