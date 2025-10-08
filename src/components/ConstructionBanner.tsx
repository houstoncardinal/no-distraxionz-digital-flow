import { useState } from 'react';
import { X, AlertCircle, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ConstructionBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-black shadow-lg"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 flex-1">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Wrench className="h-5 w-5 flex-shrink-0" />
                </motion.div>
                <div className="flex items-center gap-2 flex-wrap">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="font-bold text-sm md:text-base">
                    Website Under Construction
                  </p>
                  <span className="hidden md:inline text-sm">—</span>
                  <p className="text-sm md:text-base">
                    We're launching soon! Some features may be limited during this period.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="ml-4 p-1 hover:bg-black/10 rounded-full transition-colors flex-shrink-0"
                aria-label="Close banner"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

