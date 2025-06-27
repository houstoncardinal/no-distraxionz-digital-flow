
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HorizonHeroSection from '@/components/HorizonHeroSection';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { products } from '@/data/products';
import { ChevronRight, Award, Shield, Truck, Headphones, Globe, Users, ArrowDown, Play } from 'lucide-react';

const Index = () => {
  const featuredProducts = products.filter(product => product.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      {/* 3D Hero Section */}
      <HorizonHeroSection />

      {/* Transition Section */}
      <section className="relative h-32 bg-gradient-to-b from-transparent to-background/80">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-px h-16 bg-gradient-to-b from-primary/60 to-transparent"></div>
        </div>
      </section>

      {/* Brand Philosophy Section */}
      <section className="section-padding bg-background relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10"></div>
        <div className="container mx-auto container-padding relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20 font-medium px-6 py-2">
                Our Philosophy
              </Badge>
              <h2 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-light leading-tight">
                Beyond Fashion,
                <span className="block text-gradient-corporate">Beyond Limits</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                We don't just create clothing. We craft experiences that transcend the ordinary,
                designed for those who refuse to be distracted by mediocrity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="space-y-4 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-playfair text-2xl font-medium">Precision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every thread, every cut, every detail meticulously crafted to perfection.
                </p>
              </div>
              
              <div className="space-y-4 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-playfair text-2xl font-medium">Innovation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pushing boundaries with cutting-edge design and sustainable practices.
                </p>
              </div>
              
              <div className="space-y-4 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-playfair text-2xl font-medium">Community</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Building a movement of individuals who demand excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="section-padding bg-gradient-to-b from-secondary/20 to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"></div>
        
        <div className="container mx-auto container-padding relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20 font-medium px-6 py-2">
              Featured Collection
            </Badge>
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-light mb-8">
              Signature Pieces
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover our most coveted designs, each piece a testament to our unwavering commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="group hover-lift">
                <div className={`${index === 1 ? 'md:scale-110 md:z-10 relative' : ''}`}>
                  <ProductCard {...product} />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-12 py-6 text-lg rounded-full">
              <Link to="/shop">
                Explore Full Collection
                <ChevronRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-secondary/10 relative">
        <div className="container mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border border-primary/20 font-medium px-4 py-2">
                  The Experience
                </Badge>
                <h2 className="font-playfair text-4xl md:text-5xl font-light leading-tight">
                  Crafted for the
                  <span className="block text-gradient-corporate">Exceptional</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every piece in our collection represents a harmony between timeless elegance 
                  and contemporary innovation. We believe in creating more than clothing — 
                  we create confidence, distinction, and an uncompromising standard of quality.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-medium mb-2">Lifetime Quality Promise</h3>
                    <p className="text-muted-foreground">Every piece comes with our guarantee of exceptional durability and timeless style.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Headphones className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-medium mb-2">Personal Styling Service</h3>
                    <p className="text-muted-foreground">Our expert stylists provide personalized consultations to perfect your unique aesthetic.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-medium mb-2">White Glove Delivery</h3>
                    <p className="text-muted-foreground">Premium packaging and express delivery service that matches our exceptional standards.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-primary/10 to-secondary/20 rounded-2xl overflow-hidden corporate-shadow-lg relative">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-6 text-white/90">
                    <Play className="h-20 w-20 mx-auto mb-6 opacity-80" />
                    <div className="text-3xl font-playfair font-light">Behind the Craft</div>
                    <div className="text-lg font-medium">Discover Our Process</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-primary via-primary/95 to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"></div>
        
        <div className="container mx-auto container-padding text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
              Join the Movement
            </h2>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed font-light">
              Step into a world where excellence is not an exception, but the standard. 
              Where every detail matters, and every moment counts.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-medium px-12 py-6 text-lg rounded-full bg-transparent">
                <Link to="/shop">Start Your Journey</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-white hover:bg-white/10 font-medium px-8 py-6 text-lg">
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
