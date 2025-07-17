import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Award, Play } from 'lucide-react';

const MountainHeroSection = () => {
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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700">
      {/* Animated Mountain Landscape */}
      <div className="absolute inset-0">
        {/* Sky gradient with subtle animation */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 animate-pulse" style={{ animationDuration: '8s' }}></div>
        
        {/* Mountain layers with parallax effect */}
        <div className="absolute bottom-0 w-full h-full">
          {/* Back mountains */}
          <div className="absolute bottom-0 w-full">
            <svg
              viewBox="0 0 1440 800"
              className="absolute bottom-0 w-full h-auto text-slate-600 animate-float"
              style={{ animationDelay: '0s', animationDuration: '12s' }}
            >
              <path
                fill="currentColor"
                d="M0,800 L0,400 Q200,200 400,300 Q600,100 800,250 Q1000,150 1200,200 Q1300,180 1440,220 L1440,800 Z"
                opacity="0.4"
              />
            </svg>
          </div>
          
          {/* Middle mountains */}
          <div className="absolute bottom-0 w-full">
            <svg
              viewBox="0 0 1440 700"
              className="absolute bottom-0 w-full h-auto text-slate-500 animate-float"
              style={{ animationDelay: '2s', animationDuration: '10s' }}
            >
              <path
                fill="currentColor"
                d="M0,700 L0,350 Q150,250 300,320 Q500,180 700,280 Q900,200 1100,240 Q1250,220 1440,250 L1440,700 Z"
                opacity="0.6"
              />
            </svg>
          </div>
          
          {/* Front mountains */}
          <div className="absolute bottom-0 w-full">
            <svg
              viewBox="0 0 1440 600"
              className="absolute bottom-0 w-full h-auto text-slate-400 animate-float"
              style={{ animationDelay: '4s', animationDuration: '8s' }}
            >
              <path
                fill="currentColor"
                d="M0,600 L0,300 Q100,200 250,280 Q400,150 600,220 Q800,180 1000,200 Q1200,160 1440,180 L1440,600 Z"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>

        {/* Atmospheric effects */}
        <div className="absolute inset-0">
          {/* Mist layers */}
          <div className="absolute bottom-20 left-0 w-full h-40 bg-gradient-to-t from-white/5 to-transparent animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="absolute bottom-40 left-0 w-full h-32 bg-gradient-to-t from-white/3 to-transparent animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
          
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-white/25 rounded-full animate-ping" style={{ animationDelay: '5s' }}></div>
        </div>
      </div>

      {/* Content overlay with refined professional styling */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto container-padding">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl">
              <Award className="h-5 w-5 text-amber-400" />
              <span className="text-white font-medium tracking-wider text-sm">PREMIUM COLLECTION 2025</span>
            </div>
            
            {/* Main heading with enhanced typography */}
            <div className="space-y-8">
              <h1 className="font-playfair text-6xl md:text-8xl lg:text-9xl font-light leading-none text-white tracking-tight">
                NO DISTRAXIONZ
              </h1>
              
              {/* Animated tagline */}
              <div className="h-16 flex items-center justify-center">
                <p className="text-xl md:text-2xl lg:text-3xl font-light text-white/90 transition-all duration-700 opacity-100 tracking-wide">
                  {taglines[currentTagline]}
                </p>
              </div>
            </div>

            {/* Enhanced description */}
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light">
              Discover our meticulously curated collection where artisanal craftsmanship meets contemporary design. 
              <span className="block mt-4 text-white/70">
                Each piece represents our unwavering commitment to excellence and innovation.
              </span>
            </p>

            {/* Premium action buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button 
                size="lg" 
                className="bg-white text-slate-900 hover:bg-white/90 font-semibold px-12 py-6 text-lg rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105"
              >
                Explore Collection
                <ChevronRight className="ml-3 h-6 w-6" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 font-semibold px-12 py-6 text-lg rounded-full backdrop-blur-xl bg-white/5 shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Play className="mr-3 h-5 w-5" />
                Our Story
              </Button>
            </div>

            {/* Elegant scroll indicator */}
            <div className="pt-16 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/40 rounded-full mx-auto flex justify-center">
                <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-slate-900/10"></div>
    </section>
  );
};

export default MountainHeroSection;