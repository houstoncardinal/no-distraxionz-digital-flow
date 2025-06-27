
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ElegantBackgroundEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const glowOrbs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate floating particles
    particlesRef.current.forEach((particle, index) => {
      if (particle) {
        gsap.to(particle, {
          y: `${-30 - Math.random() * 50}px`,
          x: `${(Math.random() - 0.5) * 60}px`,
          duration: 4 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.3
        });

        gsap.to(particle, {
          opacity: 0.3 + Math.random() * 0.4,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: Math.random() * 2
        });
      }
    });

    // Animate glowing orbs
    glowOrbs.current.forEach((orb, index) => {
      if (orb) {
        gsap.to(orb, {
          scale: 1.2 + Math.random() * 0.3,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: index * 0.8
        });

        gsap.to(orb, {
          rotation: 360,
          duration: 20 + Math.random() * 10,
          repeat: -1,
          ease: "none"
        });
      }
    });

    // Scroll-triggered animations
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        gsap.to(containerRef.current, {
          opacity: 1,
          duration: 1.5,
          ease: "power2.out"
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addParticleRef = (el: HTMLDivElement | null, index: number) => {
    particlesRef.current[index] = el;
  };

  const addOrbRef = (el: HTMLDivElement | null, index: number) => {
    glowOrbs.current[index] = el;
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none opacity-0"
      style={{ zIndex: 1 }}
    >
      {/* Elegant gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)
          `
        }}
      />

      {/* Floating particles */}
      {[...Array(25)].map((_, index) => (
        <div
          key={`particle-${index}`}
          ref={(el) => addParticleRef(el, index)}
          className="absolute rounded-full"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(${Math.random() > 0.5 ? '59, 130, 246' : '139, 92, 246'}, ${0.4 + Math.random() * 0.4})`,
            boxShadow: `0 0 ${4 + Math.random() * 6}px rgba(${Math.random() > 0.5 ? '59, 130, 246' : '139, 92, 246'}, 0.3)`
          }}
        />
      ))}

      {/* Glowing orbs */}
      {[...Array(6)].map((_, index) => (
        <div
          key={`orb-${index}`}
          ref={(el) => addOrbRef(el, index)}
          className="absolute rounded-full"
          style={{
            width: `${40 + Math.random() * 60}px`,
            height: `${40 + Math.random() * 60}px`,
            left: `${15 + index * 15 + Math.random() * 10}%`,
            top: `${20 + Math.random() * 60}%`,
            background: `radial-gradient(circle, 
              rgba(${Math.random() > 0.33 ? (Math.random() > 0.5 ? '59, 130, 246' : '139, 92, 246') : '236, 72, 153'}, 0.2) 0%, 
              rgba(${Math.random() > 0.33 ? (Math.random() > 0.5 ? '59, 130, 246' : '139, 92, 246') : '236, 72, 153'}, 0.05) 50%, 
              transparent 100%
            )`,
            filter: `blur(${1 + Math.random() * 2}px)`
          }}
        />
      ))}

      {/* Subtle mesh gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            conic-gradient(from 0deg at 30% 30%, 
              rgba(59, 130, 246, 0.08) 0deg, 
              transparent 60deg, 
              rgba(139, 92, 246, 0.06) 120deg, 
              transparent 180deg, 
              rgba(236, 72, 153, 0.04) 240deg, 
              transparent 300deg
            )
          `,
          animation: 'meshRotate 30s linear infinite'
        }}
      />

      <style>
        {`
          @keyframes meshRotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ElegantBackgroundEffect;
