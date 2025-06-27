
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { products } from '@/data/products';
import { ChevronRight, Award, Shield, Truck, Headphones, Globe, Users } from 'lucide-react';

const Index = () => {
  const featuredProducts = products.filter(product => product.featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <section className="section-padding bg-background">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20 font-medium">
              Featured Collection
            </Badge>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-light mb-6 text-foreground">
              New Arrivals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover our latest designs crafted with precision and attention to detail. 
              Each piece represents our commitment to contemporary excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-8">
              <Link to="/shop">
                View Complete Collection
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Excellence */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-light mb-6">
              Why Choose No Distraxionz
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our commitment to excellence extends beyond fashion to every aspect of your experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-0 corporate-shadow hover-lift">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Premium Quality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Meticulously crafted using the finest materials and latest manufacturing techniques for lasting quality.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-0 corporate-shadow hover-lift">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Global Shipping</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Worldwide delivery with express shipping options and comprehensive tracking for your peace of mind.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-0 corporate-shadow hover-lift">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Authenticity Guarantee</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every product comes with our authenticity guarantee and comprehensive quality assurance.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-0 corporate-shadow hover-lift">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Headphones className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Expert Support</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our dedicated customer service team provides personalized assistance and style consultation.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-0 corporate-shadow hover-lift">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Fast Delivery</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Express shipping options with same-day processing for urgent orders and special occasions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-0 corporate-shadow hover-lift">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-playfair text-xl font-medium">Community</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Join a community of discerning individuals who appreciate quality, style, and sophistication.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-primary/5 via-background to-secondary/20">
        <div className="container mx-auto container-padding text-center">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-light mb-6">
            Experience Excellence
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover a new standard of contemporary fashion. Join thousands of satisfied customers 
            who trust us for quality, style, and exceptional service.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-8">
              <Link to="/shop">Explore Collection</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium px-8">
              <Link to="/about">Our Heritage</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
