'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ShoppingBag, Instagram, Shirt, Star, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NoDistraxionzHeroProps {
  children?: ReactNode;
}

const NoDistraxionzHero = ({ children }: NoDistraxionzHeroProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener('scroll', handleScroll as EventListener);
    window.addEventListener(
      'touchstart',
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      'touchmove',
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener(
        'wheel',
        handleWheel as unknown as EventListener
      );
      window.removeEventListener('scroll', handleScroll as EventListener);
      window.removeEventListener(
        'touchstart',
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        'touchmove',
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 450 + scrollProgress * (isMobileState ? 400 : 800);
  const mediaHeight = 350 + scrollProgress * (isMobileState ? 250 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 60 : 50);

  return (
    <div
      ref={sectionRef}
      className='transition-colors duration-700 ease-in-out overflow-x-hidden relative min-h-[100dvh]'
      style={{
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)'
      }}
    >
      <section className='relative flex flex-col items-center justify-center min-h-[100dvh]'>
        <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>
          {/* Urban Streetwear Background */}
          <motion.div
            className='absolute inset-0 z-0'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <div className='w-screen h-screen relative overflow-hidden'>
              {/* Urban Grid Pattern */}
              <div 
                className='absolute inset-0 opacity-20'
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '80px 80px'
                }}
              />
              
              {/* Streetwear Corner Elements */}
              <div className='absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-white/20'></div>
              <div className='absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-white/20'></div>
              <div className='absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-white/20'></div>
              <div className='absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-white/20'></div>

              {/* Subtle Urban Glow */}
              <div className='absolute inset-0'>
                <div className='absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent'></div>
                <div className='absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent'></div>
              </div>
            </div>
          </motion.div>

          <div className='w-full flex flex-col items-center justify-center relative z-10 px-8'>
                          <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative'>
              
              {/* Streetwear Brand Container */}
              <div
                className='absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none'
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '85vw',
                  maxHeight: '65vh',
                }}
              >
                {/* Clean Streetwear Card */}
                <div className='relative w-full h-full bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-white/10 flex items-center justify-center'>
                  <div className='relative z-10 text-center space-y-6 p-8'>
                    {/* Logo */}
                    <motion.div
                      className='relative'
                      initial={{ scale: 0.95, opacity: 0.9 }}
                      animate={{ 
                        scale: 1 - scrollProgress * 0.02,
                        opacity: 1 - scrollProgress * 0.1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src="/lovable-uploads/809945ef-fe18-461e-963e-17ee3add2941.png"
                        alt="NO DISTRAXIONZ"
                        className='w-full max-w-lg h-auto object-contain filter brightness-110'
                      />
                    </motion.div>
                    
                    {/* Streetwear Tagline */}
                    <motion.div
                      className='text-white/80 text-sm font-medium tracking-wider uppercase'
                      style={{ 
                        transform: `translateY(${scrollProgress * 8}px)`,
                        opacity: 1 - scrollProgress * 0.3
                      }}
                    >
                      Premium Streetwear Collection
                    </motion.div>

                    {/* Streetwear Credentials */}
                    <motion.div
                      className='flex justify-center gap-6 text-xs text-white/60'
                      style={{ 
                        transform: `translateY(${scrollProgress * 6}px)`,
                        opacity: 1 - scrollProgress * 0.2
                      }}
                    >
                      <div className='flex items-center gap-1'>
                        <Star className='h-3 w-3' />
                        <span>Limited Drops</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Zap className='h-3 w-3' />
                        <span>Fresh Designs</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Target className='h-3 w-3' />
                        <span>Stay Focused</span>
                      </div>
                    </motion.div>

                    {/* Price Range */}
                    <motion.div
                      className='text-white/90 text-lg font-medium'
                      style={{ 
                        transform: `translateY(${scrollProgress * 4}px)`,
                        opacity: 1 - scrollProgress * 0.15
                      }}
                    >
                      $45 - $120
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Streetwear Brand Title */}
              <div className='flex items-center justify-center text-center w-full relative z-10 transition-none flex-col space-y-8'>
                <motion.h1
                  className='text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair font-bold text-white transition-none tracking-tight'
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  NO
                </motion.h1>
                <motion.h1
                  className='text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair font-bold text-center transition-none tracking-tight'
                  style={{ 
                    transform: `translateX(${textTranslateX}vw)`,
                    background: 'linear-gradient(135deg, #00ff88, #0066ff, #ff0066)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  DISTRAXIONZ
                </motion.h1>
                
                {/* Streetwear Mission */}
                <motion.p
                  className='text-lg md:text-xl text-white/70 mt-8 text-center leading-relaxed font-medium'
                  style={{ 
                    transform: `translateY(${scrollProgress * 25}px)`,
                    opacity: 1 - scrollProgress * 0.5
                  }}
                >
                  Premium streetwear for those who stay focused. 
                  Bold designs, quality materials, authentic street culture.
                </motion.p>

                {/* Streetwear Badges */}
                <motion.div
                  className='flex flex-wrap gap-4 mt-8 justify-center'
                  style={{ 
                    transform: `translateY(${scrollProgress * 20}px)`,
                    opacity: 1 - scrollProgress * 0.4
                  }}
                >
                  <Badge className='bg-primary/20 text-primary border border-primary/30 px-4 py-2 font-medium'>
                    <Star className='h-3 w-3 mr-2' />
                    Limited Edition
                  </Badge>
                  <Badge className='bg-white/10 text-white border border-white/30 px-4 py-2 font-medium'>
                    <Shirt className='h-3 w-3 mr-2' />
                    Premium Cotton
                  </Badge>
                  <Badge className='bg-gradient-to-r from-primary/20 to-blue-500/20 text-white border border-primary/30 px-4 py-2 font-medium'>
                    <Target className='h-3 w-3 mr-2' />
                    Stay Focused
                  </Badge>
                </motion.div>
              </div>

              {/* Streetwear Action Buttons */}
              <motion.div
                className='absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-6 z-20'
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1 - scrollProgress * 0.5,
                  y: scrollProgress * 25
                }}
                transition={{ duration: 0.3 }}
              >
                <Button 
                  asChild
                  className='bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-3 shadow-lg transition-all duration-300'
                  size="lg"
                >
                  <Link to="/shop">
                    <ShoppingBag className='h-4 w-4 mr-2' />
                    Shop Collection
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className='border-2 border-white/30 text-white hover:bg-white/10 px-8 py-3 font-medium transition-all duration-300'
                  size="lg"
                >
                  <Instagram className='h-4 w-4 mr-2' />
                  Follow @nodistraxionz
                </Button>
              </motion.div>

              {/* Streetwear Scroll Indicator */}
              <motion.div
                className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 flex flex-col items-center'
                initial={{ opacity: 1 }}
                animate={{ opacity: scrollProgress >= 0.9 ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className='text-xs mb-2 tracking-wide uppercase font-medium'>Explore Drops</p>
                <ChevronDown className='h-4 w-4 animate-bounce' />
              </motion.div>
            </div>

            {/* Expanded Streetwear Content */}
            <motion.section
              className='flex flex-col w-full px-8 py-20 md:px-16 lg:py-24'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children || (
                <div className='w-full space-y-20'>
                  {/* Streetwear Collections */}
                  <div className='text-center space-y-4 mb-16'>
                    <h2 className='font-playfair text-3xl md:text-4xl font-bold text-white'>
                      Latest Drops
                    </h2>
                    <p className='text-white/70'>
                      Fresh streetwear pieces designed for those who refuse to blend in. 
                      Quality materials, bold designs, authentic street culture.
                    </p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                    <div className='text-center space-y-6 p-8 bg-gray-900/50 backdrop-blur-sm border border-white/10'>
                      <div className='w-16 h-16 bg-primary/20 flex items-center justify-center mx-auto'>
                        <Shirt className='h-8 w-8 text-primary' />
                      </div>
                      <h3 className='font-playfair text-xl font-semibold text-white'>Hoodies & Tees</h3>
                      <p className='text-white/70 leading-relaxed'>
                        Premium cotton hoodies and graphic tees. Comfortable, durable, and designed to make a statement.
                      </p>
                      <div className='text-white font-semibold'>$45 - $85</div>
                      <Button className='w-full bg-primary hover:bg-primary/90 text-black font-semibold'>
                        Shop Now
                      </Button>
                    </div>
                    
                    <div className='text-center space-y-6 p-8 bg-gray-900/50 backdrop-blur-sm border border-white/10'>
                      <div className='w-16 h-16 bg-blue-500/20 flex items-center justify-center mx-auto'>
                        <Target className='h-8 w-8 text-blue-400' />
                      </div>
                      <h3 className='font-playfair text-xl font-semibold text-white'>Accessories</h3>
                      <p className='text-white/70 leading-relaxed'>
                        Complete your look with our curated selection of caps, bags, and streetwear accessories.
                      </p>
                      <div className='text-white font-semibold'>$25 - $65</div>
                      <Button className='w-full bg-primary hover:bg-primary/90 text-black font-semibold'>
                        Shop Now
                      </Button>
                    </div>
                    
                    <div className='text-center space-y-6 p-8 bg-gray-900/50 backdrop-blur-sm border border-white/10'>
                      <div className='w-16 h-16 bg-red-500/20 flex items-center justify-center mx-auto'>
                        <Star className='h-8 w-8 text-red-400' />
                      </div>
                      <h3 className='font-playfair text-xl font-semibold text-white'>Limited Drops</h3>
                      <p className='text-white/70 leading-relaxed'>
                        Exclusive releases and collaborations. Limited quantities, maximum impact. Don't sleep on these.
                      </p>
                      <div className='text-white font-semibold'>$65 - $120</div>
                      <Button className='w-full bg-primary hover:bg-primary/90 text-black font-semibold'>
                        Get Notified
                      </Button>
                    </div>
                  </div>

                  {/* Streetwear Call to Action */}
                  <div className='text-center space-y-8 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm border border-white/10 p-16'>
                    <h2 className='font-playfair text-3xl md:text-4xl font-bold text-white'>
                      Ready to Stay Focused?
                    </h2>
                    <p className='text-white/80 leading-relaxed text-lg'>
                      Join the movement of individuals who choose focus over distraction. 
                      Discover streetwear that speaks your language and represents your mindset.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-6 justify-center'>
                      <Button asChild className='bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-3' size="lg">
                        <Link to="/shop">
                          <ShoppingBag className='h-5 w-5 mr-2' />
                          Shop Collection
                        </Link>
                      </Button>
                      <Button variant="outline" className='border-2 border-white/30 text-white hover:bg-white/10 px-8 py-3 font-medium' size="lg">
                        <Instagram className='h-5 w-5 mr-2' />
                        Follow Us
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NoDistraxionzHero;

