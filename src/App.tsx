import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { AuthProvider } from '@/contexts/AuthContext';
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
import { checkAndPopulateProducts } from '@/utils/autoPopulate';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';
import Cart from './pages/Cart';
import Checkout from './pages/CheckoutWithStripe';
import ProductDetail from './pages/ProductDetail';
import OrderConfirmation from './pages/OrderConfirmation';
import Auth from './pages/Auth';
import MyOrders from './pages/MyOrders';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Returns from './pages/Returns';

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import AdminSettings from "./pages/admin/SettingsPage";
import Reviews from "./pages/admin/Reviews";
import PopulateProducts from "./pages/admin/PopulateProducts";
import Analytics from "./pages/admin/Analytics";
import Inventory from "./pages/admin/Inventory";
import Discounts from "./pages/admin/Discounts";
import Abandoned from "./pages/admin/Abandoned";
import Collections from "./pages/admin/Collections";
import Segments from "./pages/admin/Segments";
import Pages from "./pages/admin/Pages";
import Media from "./pages/admin/Media";
import Campaigns from "./pages/admin/Campaigns";
import SEO from "./pages/admin/SEO";
import Shipping from "./pages/admin/Shipping";
import Taxes from "./pages/admin/Taxes";
import Payments from "./pages/admin/Payments";
import Integrations from "./pages/admin/Integrations";
import { ProtectedRoute } from "./components/ProtectedRoute";

import './App.css';

function App() {
  // Auto-populate products if none exist
  useEffect(() => {
    checkAndPopulateProducts();
  }, []);

  // Make populate functions available globally for debugging
  if (typeof window !== 'undefined') {
    (window as any).populateProducts = quickPopulateProducts;
    (window as any).populateFromImages = populateProductsFromImageDatabase;
    (window as any).populateToddlerShirts = populateToddlerShirts;
    (window as any).populateAllProducts = populateAllProducts;
    (window as any).populateBasicProducts = populateBasicProducts;
  }

  return (
    <AuthProvider>
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
              <Route path="/auth" element={<Auth />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/returns" element={<Returns />} />
              
              {/* Admin Routes - Protected */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="customers" element={<Customers />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="populate" element={<PopulateProducts />} />
                <Route path="discounts" element={<Discounts />} />
                <Route path="abandoned" element={<Abandoned />} />
                <Route path="collections" element={<Collections />} />
                <Route path="segments" element={<Segments />} />
                <Route path="pages" element={<Pages />} />
                <Route path="media" element={<Media />} />
                <Route path="campaigns" element={<Campaigns />} />
                <Route path="seo" element={<SEO />} />
                <Route path="shipping" element={<Shipping />} />
                <Route path="taxes" element={<Taxes />} />
                <Route path="payments" element={<Payments />} />
                <Route path="integrations" element={<Integrations />} />
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
    </AuthProvider>
  );
}

export default App;
