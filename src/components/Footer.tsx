import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50 shadow-modern">
      <div className="w-full container-padding-modern py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <img 
                src="/lovable-uploads/30a4fcab-8cc9-4f74-8a58-f4c349a4cb3c.png" 
                alt="NO DISTRAXIONZ" 
                className="h-16 w-auto"
              />
              <p className="text-muted-foreground leading-relaxed">
                Redefining contemporary fashion with unwavering focus, exceptional quality, 
                and uncompromising attention to detail.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-playfair text-lg font-medium">Quick Links</h3>
            <div className="space-y-3">
              <Link 
                to="/" 
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 py-1"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 py-1"
              >
                About Us
              </Link>
              <Link 
                to="/shop" 
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 py-1"
              >
                Collection
              </Link>
              <Link 
                to="/faq" 
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 py-1"
              >
                FAQs
              </Link>
              <Link 
                to="/contact" 
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 py-1"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-6">
            <h3 className="font-playfair text-lg font-medium">Collections</h3>
            <div className="space-y-3">
              <Link 
                to="/shop?category=Shirts" 
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 py-1"
              >
                Shirts
              </Link>
              <Link 
                to="/shop?category=Ladies" 
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 py-1"
              >
                Ladies Collection
              </Link>
              <Link 
                to="/shop?category=Hoodies" 
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 py-1"
              >
                Hoodies
              </Link>
              <Link 
                to="/shop?category=Hats" 
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 py-1"
              >
                Hats
              </Link>
              <Link 
                to="/shop" 
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 py-1"
              >
                All Products
              </Link>
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <h3 className="font-playfair text-lg font-medium">Stay Connected</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Subscribe to receive updates on new collections, exclusive offers, and style insights.
            </p>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="input-modern flex-1"
                />
                <Button className="btn-primary px-4">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <a 
                  href="mailto:nodistraxionz@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  nodistraxionz@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <a 
                  href="tel:+15043168944"
                  className="hover:text-primary transition-colors"
                >
                  (504) 316-8944
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>New Orleans, Louisiana</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-border/50" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          <div className="text-center lg:text-left">
            <p className="text-muted-foreground text-sm">
              © 2025 No Distraxionz. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm">
              Crafted with excellence in New Orleans, Louisiana
            </p>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-end gap-8 text-sm">
            <Link 
              to="/privacy" 
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link 
              to="/returns" 
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Returns & Exchanges
            </Link>
          </div>
        </div>
      </div>
      
      {/* Ultra Premium Cardinal Consulting Credit Bar */}
      <div className="relative bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-300 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        {/* Subtle inner shadow for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/30 to-transparent"></div>
        
        <div className="w-full container-padding-modern relative">
          <div className="flex items-center justify-center py-1.5">
            <div className="flex items-center space-x-2 text-gray-500 text-xs font-medium">
              <span>Created by</span>
              <a 
                href="https://www.cardinalhtx.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-gray-700 hover:text-green-600 transition-all duration-300 hover:underline decoration-green-500 underline-offset-2 hover:shadow-sm hover:scale-105"
              >
                <span className="text-green-600">Cardinal</span> Consulting
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
