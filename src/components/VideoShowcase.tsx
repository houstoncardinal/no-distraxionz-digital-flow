import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, Maximize2, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useRef } from 'react';

const VideoShowcase = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white">Experience the Movement</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Built for the
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Focused & Fearless
              </span>
            </h2>

            <p className="text-lg text-gray-300 leading-relaxed">
              Every piece is designed with intention. Premium materials meet precision craftsmanship 
              to create streetwear that moves with you, not against you. No distractions, just pure focus.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Premium Quality</h4>
                  <p className="text-gray-400 text-sm">Handpicked materials, built to last</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Limited Editions</h4>
                  <p className="text-gray-400 text-sm">Exclusive drops, never mass-produced</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Comfort First</h4>
                  <p className="text-gray-400 text-sm">Designed for all-day wear</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-xl">
                  Shop Collection
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-black">
                  Our Story
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Side - Video */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 backdrop-blur-sm">
              {/* Video */}
              <video
                ref={videoRef}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full aspect-[9/16] md:aspect-video object-cover"
              >
                <source src="/vid1.mp4" type="video/mp4" />
              </video>

              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5 text-white" />
                      ) : (
                        <Play className="h-5 w-5 text-white ml-1" />
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleMute}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5 text-white" />
                      ) : (
                        <Volume2 className="h-5 w-5 text-white" />
                      )}
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFullscreen}
                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    <Maximize2 className="h-5 w-5 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4">
                <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white text-xs font-bold shadow-lg">
                  LIVE NOW
                </div>
              </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Bottom Stats */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 mt-20"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <div className="text-gray-400 text-sm">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              500+
            </div>
            <div className="text-gray-400 text-sm">Products Sold</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
              4.9★
            </div>
            <div className="text-gray-400 text-sm">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
              100%
            </div>
            <div className="text-gray-400 text-sm">Quality Guarantee</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default VideoShowcase;
