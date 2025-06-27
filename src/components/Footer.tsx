
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto container-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="font-playfair text-2xl font-light">
              NO DISTRAXIONZ
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Redefining contemporary fashion with exceptional quality, innovative design, 
              and uncompromising attention to detail.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-playfair text-lg font-medium">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/shop" className="block text-muted-foreground hover:text-primary transition-colors">
                Collection
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
          <div className="space-y-6">
            <h3 className="font-playfair text-lg font-medium">Collections</h3>
            <div className="space-y-3">
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
                Wellness Supplements
              </Link>
              <Link to="/shop/winter" className="block text-muted-foreground hover:text-primary transition-colors">
                Winter Collection
              </Link>
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <h3 className="font-playfair text-lg font-medium">Stay Connected</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Subscribe to receive updates on new collections, exclusive offers, and fashion insights.
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background border-border"
              />
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                Subscribe
              </Button>
            </div>
            
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@nodistraxionz.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(504) 316-8944</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>New Orleans, Louisiana</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-border" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm">
              © 2025 No Distraxionz. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm">
              Crafted with excellence in New Orleans, Louisiana
            </p>
          </div>
          <div className="flex space-x-8 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/returns" className="text-muted-foreground hover:text-primary transition-colors">
              Returns & Exchanges
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
