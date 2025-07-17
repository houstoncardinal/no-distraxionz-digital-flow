
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Star, Crown, Zap, Truck, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const HorizonHeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const promoRef = useRef<HTMLDivElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const threeRefs = useRef({
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    renderer: null as THREE.WebGLRenderer | null,
    stars: [] as THREE.Points[],
    nebula: null as THREE.Mesh | null,
    animationId: null as number | null,
    time: 0
  });

  // Stable mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x: x * 0.3, y: y * 0.3 }); // Reduced intensity for stability
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    const initThree = () => {
      const { current: refs } = threeRefs;
      
      // Scene setup with solid black background
      refs.scene = new THREE.Scene();
      refs.scene.background = new THREE.Color(0x000000);
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.0003);

      // Camera
      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      refs.camera.position.set(0, 0, 100);

      // Renderer with solid black background
      if (canvasRef.current) {
        refs.renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          antialias: true,
          alpha: false
        });
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        refs.renderer.setClearColor(0x000000, 1);
      }

      // Create stable star field
      createStableStarField();
      createStableNebula();
      
      // Start animation
      animate();
      setIsReady(true);
    };

    const createStableStarField = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      // Create 3 layers with stable, predictable patterns
      for (let layer = 0; layer < 3; layer++) {
        const starCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
          // Stable positioning using mathematical patterns instead of random
          const angle = (i / starCount) * Math.PI * 2 * 5; // Create spiral pattern
          const radius = 300 + layer * 200 + (i % 100) * 2;
          const height = Math.sin(angle * 0.5) * 100;

          positions[i * 3] = Math.cos(angle) * radius;
          positions[i * 3 + 1] = height + (layer - 1) * 50;
          positions[i * 3 + 2] = Math.sin(angle) * radius - layer * 100;

          // Stable color patterns
          const colorValue = 0.7 + (i % 10) * 0.03;
          colors[i * 3] = colorValue;
          colors[i * 3 + 1] = colorValue;
          colors[i * 3 + 2] = colorValue + 0.1;

          sizes[i] = 1 + (i % 5) * 0.3;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            mouse: { value: new THREE.Vector2(0, 0) }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform vec2 mouse;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
              // Stable, predictable movement
              pos.x += sin(time * 0.5 + pos.y * 0.01) * 10.0;
              pos.y += cos(time * 0.3 + pos.x * 0.01) * 5.0;
              
              // Gentle mouse influence
              pos.x += mouse.x * 30.0;
              pos.y += mouse.y * 20.0;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity * 0.8);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene.add(stars);
        refs.stars.push(stars);
      }
    };

    const createStableNebula = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      const geometry = new THREE.PlaneGeometry(2000, 1000, 50, 50);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mouse: { value: new THREE.Vector2(0, 0) }
        },
        vertexShader: `
          varying vec2 vUv;
          uniform float time;
          uniform vec2 mouse;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Stable wave pattern
            pos.z += sin(pos.x * 0.01 + time * 0.5) * cos(pos.y * 0.01 + time * 0.3) * 30.0;
            pos.z += mouse.x * mouse.y * 20.0;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec2 mouse;
          varying vec2 vUv;
          
          void main() {
            vec2 center = vec2(0.5, 0.5);
            float dist = distance(vUv, center);
            
            // Stable color pattern
            vec3 color1 = vec3(0.1, 0.2, 0.8);
            vec3 color2 = vec3(0.8, 0.1, 0.5);
            vec3 color = mix(color1, color2, sin(dist * 5.0 + time) * 0.5 + 0.5);
            
            float alpha = 0.3 * (1.0 - dist * 1.5);
            alpha *= 1.0 + mouse.x * mouse.y * 0.3;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -500;
      refs.scene.add(nebula);
      refs.nebula = nebula;
    };

    const animate = () => {
      const { current: refs } = threeRefs;
      refs.animationId = requestAnimationFrame(animate);
      
      refs.time += 0.01; // Stable time increment

      // Update star materials with stable time
      refs.stars.forEach((starField) => {
        const material = starField.material as THREE.ShaderMaterial;
        if (material.uniforms) {
          material.uniforms.time.value = refs.time;
          material.uniforms.mouse.value.set(mousePosition.x, mousePosition.y);
        }
      });

      // Update nebula
      if (refs.nebula) {
        const material = refs.nebula.material as THREE.ShaderMaterial;
        if (material.uniforms) {
          material.uniforms.time.value = refs.time;
          material.uniforms.mouse.value.set(mousePosition.x, mousePosition.y);
        }
      }

      // Stable camera movement
      if (refs.camera) {
        refs.camera.position.x = Math.sin(refs.time * 0.1) * 5 + mousePosition.x * 10;
        refs.camera.position.y = Math.cos(refs.time * 0.15) * 3 + mousePosition.y * 5;
        refs.camera.lookAt(0, 0, -500);
      }

      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
    };

    initThree();

    // Handle resize
    const handleResize = () => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      const { current: refs } = threeRefs;
      
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }

      window.removeEventListener('resize', handleResize);

      // Cleanup Three.js resources
      refs.stars.forEach(starField => {
        starField.geometry.dispose();
        if (starField.material instanceof THREE.Material) {
          starField.material.dispose();
        }
      });

      if (refs.nebula) {
        refs.nebula.geometry.dispose();
        if (refs.nebula.material instanceof THREE.Material) {
          refs.nebula.material.dispose();
        }
      }

      if (refs.renderer) {
        refs.renderer.dispose();
      }
    };
  }, [mousePosition]);

  // GSAP animations after component is ready
  useEffect(() => {
    if (!isReady) return;
    
    const tl = gsap.timeline();

    // Set initial visibility
    gsap.set([brandRef.current, promoRef.current], {
      visibility: 'visible'
    });

    // Animate brand name
    if (brandRef.current) {
      tl.from(brandRef.current, {
        y: 100,
        opacity: 0,
        scale: 0.8,
        duration: 1.5,
        ease: "power3.out"
      });
    }

    // Animate promotional content
    if (promoRef.current) {
      const promoElements = promoRef.current.children;
      tl.from(promoElements, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
      }, "-=1");
    }

    return () => {
      tl.kill();
    };
  }, [isReady]);

  const styles = {
    heroContainer: {
      position: 'relative' as const,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#000000'
    },
    heroCanvas: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
      background: '#000000'
    },
    heroContent: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center' as const,
      zIndex: 10,
      color: 'white',
      maxWidth: '90vw'
    }
  };

  return (
    <div ref={containerRef} style={styles.heroContainer}>
      <canvas ref={canvasRef} style={styles.heroCanvas} />
      
      <div ref={contentRef} style={styles.heroContent}>
        {/* Brand Section */}
        <div ref={brandRef} className="mb-12" style={{ visibility: 'hidden' }}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="h-8 w-8 text-yellow-400" />
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 text-lg font-semibold">
              PREMIUM STREETWEAR
            </Badge>
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            NO DISTRAXIONZ
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl font-light mb-8 text-gray-300 max-w-4xl mx-auto">
            Where Focus Meets Fashion
            <span className="block text-lg md:text-xl mt-2 text-purple-300">
              Tunnel Vision. Zero Compromise. Pure Style.
            </span>
          </p>
        </div>

        {/* Promotional Content */}
        <div ref={promoRef} className="space-y-8" style={{ visibility: 'hidden' }}>
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-300">Crafted with precision for those who demand excellence</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <Truck className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-300">Fast, reliable delivery worldwide on all orders</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <Award className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Exclusive Designs</h3>
              <p className="text-sm text-gray-300">Limited drops for the truly focused individuals</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-12 py-6 text-lg rounded-full shadow-2xl transition-all duration-300 hover:scale-105">
              <Link to="/shop">
                <ShoppingBag className="mr-3 h-6 w-6" />
                Shop Collection
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-2 border-white/50 text-white hover:bg-white/10 font-semibold px-10 py-6 text-lg rounded-full bg-transparent backdrop-blur-md">
              <Link to="/about">
                <Zap className="mr-3 h-5 w-5" />
                Our Story
              </Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span>5.0 Rating</span>
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <span>10K+ Happy Customers</span>
            <div className="w-px h-4 bg-gray-600"></div>
            <span>Worldwide Shipping</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizonHeroSection;
