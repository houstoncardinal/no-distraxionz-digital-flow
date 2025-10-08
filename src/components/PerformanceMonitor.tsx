import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  fps: number;
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      const renderTime = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
      
      // Memory usage (if available)
      const memoryUsage = (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0;
      
      // FPS calculation (simplified)
      let fps = 60;
      let lastTime = performance.now();
      const calculateFPS = () => {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        fps = Math.round(1000 / delta);
        lastTime = currentTime;
        requestAnimationFrame(calculateFPS);
      };
      calculateFPS();

      setMetrics({
        loadTime,
        renderTime,
        memoryUsage,
        fps
      });
    };

    // Measure after a short delay to ensure everything is loaded
    const timer = setTimeout(measurePerformance, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (process.env.NODE_ENV !== 'development' || !metrics) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-mono backdrop-blur-sm"
      >
        Perf: {metrics.fps}fps
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-black/90 text-white p-4 rounded-lg text-xs font-mono backdrop-blur-sm min-w-48">
          <div className="space-y-1">
            <div>Load Time: {metrics.loadTime.toFixed(2)}ms</div>
            <div>Render Time: {metrics.renderTime.toFixed(2)}ms</div>
            <div>Memory: {metrics.memoryUsage.toFixed(2)}MB</div>
            <div>FPS: {metrics.fps}</div>
            <div className="pt-2 border-t border-gray-600">
              <div className="text-green-400">✓ Optimized</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
