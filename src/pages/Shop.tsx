import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { motion } from 'framer-motion';

const Shop = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Shop Our Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover premium streetwear designed for the focused and ambitious. 
            From motivational tees to comfortable hoodies, find your perfect style.
          </p>
        </motion.div>

        {/* Product Grid with Enhanced Filtering */}
        <ProductGrid />
      </div>

      <Footer />
    </div>
  );
};

export default Shop;