
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Award, Globe, Truck } from 'lucide-react';

const HeroSection = () => {
  const taglines = [
    "Redefining Contemporary Fashion",
    "Sophisticated. Timeless. Exceptional.",
    "Where Style Meets Innovation",
    "Crafted for the Modern Professional",
    "Excellence in Every Detail"
  ];

  const [currentTagline, setCurrentTagline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [taglines.length]);

  return (
    <section className="relative bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
      {/* Main Hero Content */}
      <div className="container mx-auto container-padding section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Premium Collection 2025</span>
              </div>
              
              <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-light leading-tight text-foreground">
                NO DISTRAXIONZ
              </h1>
              
              <div className="h-20 flex items-center">
                <p className="text-lg md:text-xl lg:text-2xl font-light text-muted-foreground transition-all duration-700 opacity-100">
                  {taglines[currentTagline]}
                </p>
              </div>
            </div>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Discover our meticulously curated collection of contemporary fashion. 
              Each piece represents our commitment to quality, innovation, and timeless design.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-8 py-6 text-lg"
              >
                Explore Collection
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium px-8 py-6 text-lg"
              >
                Our Heritage
              </Button>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="aspect-[4/5] bg-gradient-to-br from-primary/5 to-secondary/20 rounded-lg overflow-hidden corporate-shadow">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4 text-muted-foreground">
                  <div className="text-6xl font-playfair font-light">2025</div>
                  <div className="text-lg font-medium">Spring Collection</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="bg-card border-t border-border">
        <div className="container mx-auto container-padding py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Globe className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold text-lg">Global Reach</div>
                <div className="text-sm text-muted-foreground">Shipping Worldwide</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Award className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold text-lg">Premium Quality</div>
                <div className="text-sm text-muted-foreground">Crafted Excellence</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Truck className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold text-lg">Express Delivery</div>
                <div className="text-sm text-muted-foreground">Fast & Reliable</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
