export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  priceRange?: string;
  description: string | null;
  category: string | null;
  image: string | null;
  featured?: boolean;
  sizes?: string[];
  colors?: string[];
  stock?: number | null;
  created_at?: string;
  updated_at?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  schema_data?: any;
}

export const products: Product[] = [
  // Shirts Collection
  {
    id: 'shirt-1',
    name: 'Focus Mode Classic Tee',
    price: 45,
    priceRange: '$35-50',
    description: 'Premium cotton tee with "No Distraxionz" branding. Perfect for those who stay focused on their goals.',
    category: 'Shirts',
    image: '/shirts/envato-labs-image-edit (62).png',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Navy']
  },
  {
    id: 'shirt-2',
    name: 'Hustle Hard Essential Tee',
    price: 42,
    priceRange: '$35-50',
    description: 'Essential streetwear tee with motivational messaging. Built for the grind.',
    category: 'Shirts',
    image: '/shirts/envato-labs-image-edit (63).png',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Charcoal', 'White']
  },
  {
    id: 'shirt-3',
    name: 'Legendary Status Tee',
    price: 48,
    priceRange: '$35-50',
    description: 'Bold statement tee for those who refuse to be average. Premium quality construction.',
    category: 'Shirts',
    image: '/shirts/envato-labs-image-edit (64).png',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Gray']
  },
  {
    id: 'shirt-4',
    name: 'No Distraxionz Signature Tee',
    price: 40,
    priceRange: '$35-50',
    description: 'Signature design with clean aesthetics. Perfect for everyday wear.',
    category: 'Shirts',
    image: '/shirts/envato-labs-image-edit (62) copy.png',
    featured: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Navy']
  },

  // Ladies Collection
  {
    id: 'ladies-1',
    name: 'Empowered Women Tee',
    price: 38,
    priceRange: '$30-45',
    description: 'Designed for strong, independent women who chase their dreams. Comfortable fit with empowering message.',
    category: 'Ladies',
    image: '/ladies/envato-labs-image-edit (63).png',
    featured: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Pink']
  },
  {
    id: 'ladies-2',
    name: 'Boss Lady Essential',
    price: 42,
    priceRange: '$30-45',
    description: 'Premium ladies tee with motivational messaging. Perfect for the modern entrepreneur.',
    category: 'Ladies',
    image: '/ladies/envato-labs-image-edit (64).png',
    featured: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Purple']
  },
  {
    id: 'ladies-3',
    name: 'Focus & Grind Ladies Tee',
    price: 40,
    priceRange: '$30-45',
    description: 'Comfortable fit with inspiring design. Made for women who never settle.',
    category: 'Ladies',
    image: '/ladies/envato-labs-image-edit (65).png',
    featured: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray']
  },
  {
    id: 'ladies-4',
    name: 'No Distraxionz Ladies Classic',
    price: 36,
    priceRange: '$30-45',
    description: 'Classic design with modern fit. Essential piece for every wardrobe.',
    category: 'Ladies',
    image: '/ladies/envato-labs-image-edit (68).png',
    featured: false,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy']
  },

  // Hoodies Collection
  {
    id: 'hoodie-1',
    name: 'Focus Mode Hoodie',
    price: 65,
    priceRange: '$55-75',
    description: 'Premium heavyweight hoodie with "No Distraxionz" branding. Perfect for cold weather focus sessions.',
    category: 'Hoodies',
    image: '/hoodie/envato-labs-image-edit (62).png',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Gray', 'Navy']
  },
  {
    id: 'hoodie-2',
    name: 'Hustle Hard Hoodie',
    price: 68,
    priceRange: '$55-75',
    description: 'Comfortable hoodie with motivational messaging. Built for long work sessions.',
    category: 'Hoodies',
    image: '/hoodie/envato-labs-image-edit (63).png',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Charcoal', 'White']
  },
  {
    id: 'hoodie-3',
    name: 'Legendary Status Hoodie',
    price: 72,
    priceRange: '$55-75',
    description: 'Premium hoodie with bold design. For those who refuse to be average.',
    category: 'Hoodies',
    image: '/hoodie/envato-labs-image-edit (64).png',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Gray']
  },
  {
    id: 'hoodie-4',
    name: 'No Distraxionz Signature Hoodie',
    price: 62,
    priceRange: '$55-75',
    description: 'Signature hoodie with clean design. Essential for every wardrobe.',
    category: 'Hoodies',
    image: '/hoodie/envato-labs-image-edit (65).png',
    featured: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'White']
  },

  // Hats Collection
  {
    id: 'hat-1',
    name: 'Focus Mode Cap',
    price: 28,
    priceRange: '$25-35',
    description: 'Premium baseball cap with "No Distraxionz" embroidery. Perfect for outdoor focus sessions.',
    category: 'Hats',
    image: '/hats/envato-labs-image-edit (62).png',
    featured: true,
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Navy']
  },
  {
    id: 'hat-2',
    name: 'Hustle Hard Snapback',
    price: 32,
    priceRange: '$25-35',
    description: 'Adjustable snapback cap with motivational design. Built for the grind.',
    category: 'Hats',
    image: '/hats/envato-labs-image-edit (63).png',
    featured: true,
    sizes: ['One Size'],
    colors: ['Black', 'Gray', 'White']
  },
  {
    id: 'hat-3',
    name: 'Legendary Status Cap',
    price: 30,
    priceRange: '$25-35',
    description: 'Bold design cap for those who refuse to be average. Premium quality construction.',
    category: 'Hats',
    image: '/hats/envato-labs-image-edit (64).png',
    featured: true,
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Navy']
  },
  {
    id: 'hat-4',
    name: 'No Distraxionz Classic Cap',
    price: 26,
    priceRange: '$25-35',
    description: 'Classic baseball cap with clean design. Essential accessory for every outfit.',
    category: 'Hats',
    image: '/hats/envato-labs-image-edit (65).png',
    featured: false,
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Gray']
  }
];

export const categories = [
  { name: 'All', value: 'all' },
  { name: 'Shirts', value: 'Shirts' },
  { name: 'Ladies', value: 'Ladies' },
  { name: 'Hoodies', value: 'Hoodies' },
  { name: 'Hats', value: 'Hats' },
  { name: 'Toddler Shirts', value: 'Toddler Shirts' },
];
