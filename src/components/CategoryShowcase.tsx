import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shirt, Users, ShirtIcon, HardHat } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Shirts',
    description: 'Premium cotton tees with motivational messaging',
    image: '/shirts/envato-labs-image-edit (62).png',
    href: '/shop?category=Shirts',
    icon: Shirt,
    color: 'from-blue-500 to-blue-600',
    count: '4 Products',
    featured: true
  },
  {
    name: 'Ladies',
    description: 'Empowering designs for strong women',
    image: '/ladies/envato-labs-image-edit (63).png',
    href: '/shop?category=Ladies',
    icon: Users,
    color: 'from-pink-500 to-pink-600',
    count: '4 Products',
    featured: true
  },
  {
    name: 'Hoodies',
    description: 'Comfortable hoodies for focus sessions',
    image: '/hoodie/envato-labs-image-edit (62).png',
    href: '/shop?category=Hoodies',
    icon: ShirtIcon,
    color: 'from-purple-500 to-purple-600',
    count: '4 Products',
    featured: true
  },
  {
    name: 'Hats',
    description: 'Premium caps for outdoor focus',
    image: '/hats/envato-labs-image-edit (62).png',
    href: '/shop?category=Hats',
    icon: HardHat,
    color: 'from-orange-500 to-orange-600',
    count: '4 Products',
    featured: false
  }
];

const CategoryShowcase = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Shop by Category
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover our carefully curated collections designed for the focused and ambitious
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Link to={category.href}>
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-64 object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-90 transition-opacity duration-500`} />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center gap-2 mb-2">
                          <category.icon className="h-5 w-5 text-white" />
                          <Badge className="bg-white/20 text-white border-white/30">
                            {category.count}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {category.name}
                        </h3>
                        <p className="text-white/90 text-sm mb-4">
                          {category.description}
                        </p>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30 w-fit"
                        >
                          Shop Now
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {category.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/shop">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8 py-3 text-lg font-semibold shadow-xl"
            >
              View All Products
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
