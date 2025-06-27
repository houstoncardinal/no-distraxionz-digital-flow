
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LavaCrackEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const crackLineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lavaGlowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        onEnter: () => {
          // Start the crack animation
          animateCracks();
        }
      }
    });

    const animateCracks = () => {
      // Animate crack lines appearing
      crackLineRefs.current.forEach((crack, index) => {
        if (crack) {
          gsap.fromTo(crack, 
            { 
              scaleY: 0,
              opacity: 0,
              transformOrigin: "center bottom"
            },
            {
              scaleY: 1,
              opacity: 1,
              duration: 2,
              delay: index * 0.3,
              ease: "power2.out"
            }
          );
        }
      });

      // Animate lava glow effect
      lavaGlowRefs.current.forEach((glow, index) => {
        if (glow) {
          gsap.fromTo(glow,
            {
              opacity: 0,
              scale: 0.5
            },
            {
              opacity: 0.8,
              scale: 1,
              duration: 1.5,
              delay: index * 0.4 + 1,
              ease: "power2.out"
            }
          );
        }
      });

      // Animate text emergence
      if (textRef.current) {
        gsap.fromTo(textRef.current,
          {
            y: 50,
            opacity: 0,
            filter: "brightness(0.3)"
          },
          {
            y: 0,
            opacity: 1,
            filter: "brightness(1)",
            duration: 2.5,
            delay: 1.5,
            ease: "power3.out"
          }
        );
      }
    };

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addCrackRef = (el: HTMLDivElement | null, index: number) => {
    crackLineRefs.current[index] = el;
  };

  const addLavaRef = (el: HTMLDivElement | null, index: number) => {
    lavaGlowRefs.current[index] = el;
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {/* Main cracked text */}
      <div 
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          fontSize: 'clamp(4rem, 12vw, 12rem)',
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900,
          letterSpacing: '0.1em',
          background: 'linear-gradient(45deg, #ff4500, #ff6347, #ff0000, #dc143c)',
          backgroundSize: '400% 400%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(255, 69, 0, 0.5)',
          animation: 'lavaFlow 4s ease-in-out infinite'
        }}
      >
        NO DISTRAXIONZ
      </div>

      {/* Crack lines */}
      {[...Array(8)].map((_, index) => (
        <div
          key={`crack-${index}`}
          ref={(el) => addCrackRef(el, index)}
          className="absolute bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400"
          style={{
            width: '2px',
            height: `${Math.random() * 200 + 100}px`,
            left: `${15 + index * 10 + Math.random() * 10}%`,
            top: `${60 + Math.random() * 20}%`,
            transform: `rotate(${(Math.random() - 0.5) * 30}deg)`,
            boxShadow: '0 0 10px rgba(255, 69, 0, 0.8)',
            filter: 'blur(0.5px)'
          }}
        />
      ))}

      {/* Lava glow spots */}
      {[...Array(12)].map((_, index) => (
        <div
          key={`lava-${index}`}
          ref={(el) => addLavaRef(el, index)}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 20 + 10}px`,
            height: `${Math.random() * 20 + 10}px`,
            left: `${10 + index * 7 + Math.random() * 15}%`,
            top: `${65 + Math.random() * 25}%`,
            background: 'radial-gradient(circle, #ff4500, #ff0000, transparent)',
            boxShadow: '0 0 20px rgba(255, 69, 0, 0.8)',
            animation: `lavaGlow ${2 + Math.random() * 2}s ease-in-out infinite alternate`
          }}
        />
      ))}

      {/* Additional ground crack effect */}
      <div 
        className="absolute bottom-0 left-0 w-full h-32"
        style={{
          background: 'linear-gradient(to top, rgba(255, 69, 0, 0.3), transparent)',
          mask: 'linear-gradient(to top, black, transparent)',
          WebkitMask: 'linear-gradient(to top, black, transparent)'
        }}
      />

      <style jsx>{`
        @keyframes lavaFlow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes lavaGlow {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default LavaCrackEffect;
