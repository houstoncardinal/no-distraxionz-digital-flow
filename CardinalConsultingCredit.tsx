import React from 'react';
import { motion } from 'framer-motion';

interface CardinalConsultingCreditProps {
  className?: string;
  showDecorativeLines?: boolean;
  textColor?: string;
  linkColor?: string;
  hoverColor?: string;
}

const CardinalConsultingCredit: React.FC<CardinalConsultingCreditProps> = ({
  className = "",
  showDecorativeLines = true,
  textColor = "text-gray-500",
  linkColor = "text-gray-700",
  hoverColor = "hover:text-green-600"
}) => {
  return (
    <div className={`relative bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-300 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] ${className}`}>
      {/* Subtle inner shadow for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/30 to-transparent"></div>
      
      <div className="w-full px-4 py-1.5 relative">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4 text-xs font-medium">
            {showDecorativeLines && (
              <>
                {/* Left decorative line */}
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-400"></div>
              </>
            )}
            
            <div className="flex items-center space-x-2">
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={textColor}
              >
                Created by
              </motion.span>
              
              <motion.a 
                href="https://www.cardinalhtx.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`font-bold ${linkColor} ${hoverColor} transition-all duration-500 hover:underline decoration-green-500 underline-offset-2 hover:shadow-lg hover:scale-110 relative group overflow-hidden`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ 
                  scale: 1.1,
                  textShadow: "0 0 8px rgba(34, 197, 94, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Circuit path animation */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  {/* Circuit line flowing through text */}
                  <motion.div
                    className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0
                    }}
                    style={{ width: "100%" }}
                  />
                  
                  {/* Circuit line flowing through bottom */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                    animate={{
                      x: ["100%", "-100%"],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.2
                    }}
                    style={{ width: "100%" }}
                  />
                </motion.div>

                {/* Letter-by-letter lighting effect */}
                <motion.span 
                  className="text-green-600 relative inline-block"
                  style={{
                    background: "linear-gradient(90deg, #22c55e, #16a34a, #15803d, #16a34a, #22c55e)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  <motion.span
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    Cardinal
                  </motion.span>
                </motion.span>
                
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="ml-1 relative"
                >
                  <motion.span
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(34, 197, 94, 0)",
                        "0 0 8px rgba(34, 197, 94, 0.6)",
                        "0 0 0px rgba(34, 197, 94, 0)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                  >
                    Consulting
                  </motion.span>
                </motion.span>
                
                {/* Circuit nodes/points */}
                <motion.div
                  className="absolute top-1/2 left-0 w-1 h-1 bg-green-400 rounded-full"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <motion.div
                  className="absolute top-1/2 right-0 w-1 h-1 bg-green-400 rounded-full"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5
                  }}
                />
              </motion.a>
            </div>
            
            {showDecorativeLines && (
              <>
                {/* Right decorative line */}
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-400"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardinalConsultingCredit;
