import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, MoveRight, Truck, RotateCcw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["focused", "bold", "authentic", "limitless", "unstoppable"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="relative w-full bg-black overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.4) contrast(1.1)' }}
        >
          <source src="/vid1.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Enhanced Dark Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      
      {/* Ultra sleek dark vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.8)_100%)]" />

      {/* Animated gradient blobs (subtle white glows) */}
      <motion.div
        aria-hidden
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-3xl"
        animate={{ x: [-10, 10, -10], y: [0, -8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-40 -right-24 w-96 h-96 rounded-full bg-white/3 blur-3xl"
        animate={{ x: [10, -10, 10], y: [0, 12, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-32 left-1/3 w-[28rem] h-[28rem] rounded-full bg-white/4 blur-3xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sleek moving grid */}
      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)",
        }}
        animate={{ backgroundPositionX: [0, -24], backgroundPositionY: [0, -24] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="w-full relative z-10">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button variant="outline" size="sm" className="gap-4 border-white/20 text-white hover:bg-white hover:text-black bg-transparent">
              New drop live now <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-white">NO DISTRAXIONZ</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-white/80 max-w-3xl text-center">
              Premium streetwear built for focus and movement. Limited drops, precision details, everyday comfort.
            </p>

            {/* Benefits strip */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Free shipping $75+
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Limited releases
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Easy returns
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <Button asChild size="lg" className="gap-4 bg-white text-black hover:bg-gray-100 font-medium">
              <Link to="/shop">
                <ShoppingBag className="w-4 h-4" />
                Shop Now
              </Link>
            </Button>
            <Button asChild size="lg" className="gap-4 border-white/30 text-white hover:bg-white hover:text-black bg-transparent" variant="outline">
              <Link to="/shop">
                Browse Catalog <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="text-white/60">Starting at $45</div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
