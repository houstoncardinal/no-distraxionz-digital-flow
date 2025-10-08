import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { Toaster } from '@/components/ui/toaster';
import AIShoppingAssistant from '@/components/AIShoppingAssistant';
import { ScrollToTop } from '@/components/ScrollToTop';
import { ConstructionBanner } from '@/components/ConstructionBanner';
import { quickPopulateProducts } from '@/utils/quickPopulate';
import { populateProductsFromImageDatabase } from '@/utils/populateFromImages';
import { populateToddlerShirts } from '@/utils/populateToddlerShirts';
import { populateAllProducts } from '@/utils/populateAllProducts';
import { populateBasicProducts } from '@/utils/populateBasicProducts';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import OrderConfirmation from './pages/OrderConfirmation';

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin";
import Products from "./pages/admin/ProductsNew";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Settings from "./pages/admin/Settings";
import Reviews from "./pages/admin/Reviews";
import PopulateProducts from "./pages/admin/PopulateProducts";

import './App.css';

function App() {
  // Make populate functions available globally for debugging
  if (typeof window !== 'undefined') {
    (window as any).populateProducts = quickPopulateProducts;
    (window as any).populateFromImages = populateProductsFromImageDatabase;
    (window as any).populateToddlerShirts = populateToddlerShirts;
    (window as any).populateAllProducts = populateAllProducts;
    (window as any).populateBasicProducts = populateBasicProducts;
  }

  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
        <ScrollToTop />
        <ConstructionBanner />
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="settings" element={<Settings />} />
              <Route path="populate" element={<PopulateProducts />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Global Components */}
          <CartSidebar />
          <AIShoppingAssistant />
          <Toaster />
        </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
