
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="font-oswald text-2xl font-bold text-gradient">
              NO DISTRAXIONZ
            </div>
            <p className="text-muted-foreground">
              The Culture. The Movement. The Vision. For those who hustle, create, and dominate without losing focus.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-oswald text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/shop" className="block text-muted-foreground hover:text-primary transition-colors">
                Shop
              </Link>
              <Link to="/faq" className="block text-muted-foreground hover:text-primary transition-colors">
                FAQs
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-oswald text-lg font-semibold">Categories</h3>
            <div className="space-y-2">
              <Link to="/shop/men" className="block text-muted-foreground hover:text-primary transition-colors">
                Men's Collection
              </Link>
              <Link to="/shop/women" className="block text-muted-foreground hover:text-primary transition-colors">
                Women's Collection
              </Link>
              <Link to="/shop/kids" className="block text-muted-foreground hover:text-primary transition-colors">
                Kids Collection
              </Link>
              <Link to="/shop/supplements" className="block text-muted-foreground hover:text-primary transition-colors">
                Nutrition Supplements
              </Link>
              <Link to="/shop/winter" className="block text-muted-foreground hover:text-primary transition-colors">
                Winter Sports
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-oswald text-lg font-semibold">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Subscribe to get the latest drops, exclusive offers, and motivation.
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background border-border"
              />
              <Button className="w-full gradient-brand text-black font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-border" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm">
              © 2025 No Distraxionz. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm">
              New Orleans, LA | nodistraxionz@gmail.com | (504) 316-8944
            </p>
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
