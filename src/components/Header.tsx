import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CartTrigger } from '@/components/cart/CartSidebar';
import { useCart } from '@/contexts/CartContext';
import MegaMenu from './MegaMenu';
import MobileMegaMenu from './MobileMegaMenu';
import { Menu, X, Search, User, Heart, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMegaMenuOpen, setIsMobileMegaMenuOpen] = useState(false);
  const { state } = useCart();

  const navLinks = [
    { to: '/', label: 'Home' },
    { 
      to: '/shop', 
      label: 'Shop',
      hasMegaMenu: true 
    },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/faq', label: 'FAQ' },
  ];

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-full container-padding-modern">
        <div className="flex h-20 items-center justify-between">
          {/* Professional Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <img
                  src="/lovable-uploads/30a4fcab-8cc9-4f74-8a58-f4c349a4cb3c.png"
                  alt="NO DISTRAXIONZ"
                  className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </div>
            </Link>
          </motion.div>

          {/* Professional Desktop Navigation */}
          <motion.nav 
            className="hidden lg:flex items-center space-x-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                className="relative"
              >
                {link.hasMegaMenu ? (
                  <div
                    className="relative text-sm font-semibold transition-all duration-300 hover:text-black group cursor-pointer flex items-center gap-1"
                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                    onMouseLeave={() => setIsMegaMenuOpen(false)}
                  >
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                      isMegaMenuOpen ? 'rotate-180' : ''
                    }`} />
                    <span className="absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 w-0 group-hover:w-full" />
                  </div>
                ) : (
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `relative text-sm font-semibold transition-all duration-300 hover:text-black group ${
                        isActive ? 'text-black' : 'text-gray-600'
                      }`
                    }
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 w-0 group-hover:w-full" />
                  </NavLink>
                )}
              </motion.div>
            ))}
          </motion.nav>

          {/* Professional Desktop Actions */}
          <motion.div 
            className="hidden lg:flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100 transition-colors duration-200">
              <Search className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100 transition-colors duration-200 relative">
              <Heart className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100 transition-colors duration-200">
              <User className="h-5 w-5 text-gray-600" />
            </Button>
            <div className="h-6 w-px bg-gray-300 mx-2" />
            <CartTrigger />
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-3">
            <CartTrigger />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Professional Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <nav className="container-padding-modern py-6">
              <div className="space-y-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {link.hasMegaMenu ? (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMobileMegaMenuOpen(true);
                        }}
                        className="block text-lg font-semibold transition-colors duration-200 text-gray-600 hover:text-black flex items-center gap-2"
                      >
                        {link.label}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    ) : (
                      <NavLink
                        to={link.to}
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                          `block text-lg font-semibold transition-colors duration-200 ${
                            isActive ? 'text-black' : 'text-gray-600 hover:text-black'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    )}
                  </motion.div>
                ))}
                <motion.div 
                  className="flex items-center space-x-4 pt-6 border-t border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Button variant="ghost" size="icon" className="h-12 w-12 hover:bg-gray-100">
                    <Search className="h-5 w-5 text-gray-600" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-12 w-12 hover:bg-gray-100">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-12 w-12 hover:bg-gray-100">
                    <User className="h-5 w-5 text-gray-600" />
                  </Button>
                </motion.div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mega Menu */}
      <MegaMenu 
        isOpen={isMegaMenuOpen} 
        onClose={() => setIsMegaMenuOpen(false)} 
      />

      {/* Mobile Mega Menu */}
      <MobileMegaMenu 
        isOpen={isMobileMegaMenuOpen} 
        onClose={() => setIsMobileMegaMenuOpen(false)} 
      />
    </motion.header>
  );
};

export default Header; 