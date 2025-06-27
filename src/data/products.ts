
export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  priceRange: string;
  description: string;
  category: string;
  image: string;
  featured: boolean;
  sizes: string[];
  colors: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Time Is Money T-Shirt',
    price: '$45',
    priceRange: '$35-50',
    description: 'Premium streetwear tee with motivational messaging. Perfect for those who understand that every second counts.',
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Gray']
  },
  {
    id: '2',
    name: 'Time & Money Waits on No One T-Shirt',
    price: '$45',
    priceRange: '$35-50',
    description: 'Bold statement piece for hustlers who never wait for opportunities.',
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Charcoal']
  },
  {
    id: '3',
    name: 'Why Be Average Be Legendary Ladies T-Shirt',
    price: '$40',
    priceRange: '$35-50',
    description: 'Empowering design for women who refuse to settle for average.',
    category: 'Women',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    featured: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Pink']
  },
  {
    id: '4',
    name: 'No Distraxionz Onesie',
    price: '$18',
    priceRange: '$18',
    description: 'Start them young! Comfortable onesie for the future hustlers.',
    category: 'Kids',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500',
    featured: false,
    sizes: ['6M', '12M', '18M', '24M'],
    colors: ['Black', 'White', 'Gray']
  },
  {
    id: '5',
    name: 'Ladies T-Shirt',
    price: '$30',
    priceRange: '$25-35',
    description: 'Classic No Distraxionz ladies tee with premium comfort fit.',
    category: 'Women',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    featured: false,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray']
  },
  {
    id: '6',
    name: 'No More Fake Friends T-Shirt',
    price: '$45',
    priceRange: '$35-50',
    description: 'Keep your circle tight with this authentic message tee.',
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Red']
  },
  {
    id: '7',
    name: 'Tunnel Vision T-Shirt',
    price: '$45',
    priceRange: '$35-50',
    description: 'Focus on your goals with this motivational streetwear piece.',
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'White']
  },
  {
    id: '8',
    name: 'Why Be Average, Be Legendary Max Heavyweight Cotton T-Shirt',
    price: '$50',
    priceRange: '$35-50',
    description: 'Premium heavyweight cotton tee with maximum impact messaging.',
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Gray']
  }
];

export const categories = [
  { name: 'All', value: 'all' },
  { name: 'Men', value: 'Men' },
  { name: 'Women', value: 'Women' },
  { name: 'Kids', value: 'Kids' },
  { name: 'Supplements', value: 'Supplements' },
  { name: 'Winter Sports', value: 'Winter' },
];
