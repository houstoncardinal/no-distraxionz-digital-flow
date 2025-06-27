
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const HeroSection = () => {
  const taglines = [
    "The Culture. The Movement. The Vision.",
    "Time Is Money",
    "Why Be Average, Be Legendary",
    "Tunnel Vision",
    "No More Fake Friends"
  ];

  const [currentTagline, setCurrentTagline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [taglines.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-card">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] repeat"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Brand */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="font-oswald text-5xl md:text-7xl lg:text-8xl font-black text-gradient leading-tight">
              NO DISTRAXIONZ
            </h1>
            <div className="h-16 flex items-center justify-center">
              <p className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground transition-all duration-500 opacity-100">
                {taglines[currentTagline]}
              </p>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
            For those who hustle, create, and dominate without losing focus. 
            Premium streetwear that represents the grind.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button 
              size="lg" 
              className="gradient-brand text-black font-bold text-lg px-8 py-6 hover-lift glow"
            >
              Shop Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold text-lg px-8 py-6 hover-lift"
            >
              Our Story
            </Button>
          </div>

          {/* Featured Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto pt-8 animate-slide-up">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-oswald font-bold text-primary">8+</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-oswald font-bold text-primary">NOLA</div>
              <div className="text-sm text-muted-foreground">Based</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-oswald font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Hustle</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-glow-pulse"></div>
      <div className="absolute bottom-40 right-20 w-3 h-3 bg-accent rounded-full animate-glow-pulse animation-delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-primary rounded-full animate-glow-pulse animation-delay-2000"></div>
    </section>
  );
};

export default HeroSection;
