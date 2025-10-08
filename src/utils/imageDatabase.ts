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
  const categories = ['shirts', 'ladies', 'hats', 'hoodie', 'lovable-uploads'];
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
export const generateProductsFromImages = () => {
  const images = discoverImages();
  const products: any[] = [];
  
  Object.entries(images).forEach(([category, categoryImages]) => {
    categoryImages.forEach((image, index) => {
      const productName = generateProductName(category, index);
      const productPrice = generateProductPrice(category);
      
      products.push({
        id: `${category}-${index + 1}`,
        name: productName,
        description: generateProductDescription(category, productName),
        price: productPrice,
        image: image.fullPath,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        stock: Math.floor(Math.random() * 100) + 10,
        featured: index < 2, // First 2 items in each category are featured
        sizes: getSizesForCategory(category),
        colors: getColorsForCategory(category),
        original_price: Math.random() > 0.7 ? productPrice * 1.3 : null,
        price_range: getPriceRangeForCategory(category),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
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
    'lovable-uploads': '$45-70'
  };
  
  return ranges[category] || '$30-60';
};

// Export the main function to populate from images
export const populateFromImageDatabase = async () => {
  const products = generateProductsFromImages();
  return products;
};


