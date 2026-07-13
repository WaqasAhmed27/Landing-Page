import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTrailImage } from '../types';
import { TRAIL_IMAGES } from '../data';

export default function TrailCanvas() {
  const [images, setImages] = useState<ActiveTrailImage[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const currentIndex = useRef(0);
  const highestZIndex = useRef(100);

  // Core physics parameters requested by user
  const DISTANCE_THRESHOLD = 30; // Min distance threshold
  const MAX_IMAGES = 6;          // 6 trail count
  const LIFESPAN = 500;          // 500ms expiry
  const MAX_ROTATION = 8;        // 8-degree rotation range
  const IMAGE_WIDTH = 75;        // Min width
  const IMAGE_HEIGHT = 100;      // Min height

  const spawnImage = (x: number, y: number) => {
    const url = TRAIL_IMAGES[currentIndex.current % TRAIL_IMAGES.length];
    currentIndex.current++;
    highestZIndex.current++;

    const id = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const rotation = (Math.random() * 2 - 1) * MAX_ROTATION;

    const newImg: ActiveTrailImage = {
      id,
      url,
      x,
      y,
      rotation,
      zIndex: highestZIndex.current,
    };

    setImages(prev => {
      const updated = [...prev, newImg];
      if (updated.length > MAX_IMAGES) {
        return updated.slice(updated.length - MAX_IMAGES);
      }
      return updated;
    });

    // Handle 500ms lifespan expiry
    setTimeout(() => {
      setImages(prev => prev.filter(img => img.id !== id));
    }, LIFESPAN);
  };

  useEffect(() => {
    const handleGlobalMove = (clientX: number, clientY: number) => {
      const dist = Math.hypot(clientX - lastMousePos.current.x, clientY - lastMousePos.current.y);

      if (dist >= DISTANCE_THRESHOLD) {
        spawnImage(clientX, clientY);
        lastMousePos.current = { x: clientX, y: clientY };
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      handleGlobalMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      handleGlobalMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <div
      id="simple-trail-canvas"
      className="fixed inset-0 pointer-events-none z-[9999] select-none overflow-hidden"
    >
      {/* Trail Animation Render Stream */}
      <AnimatePresence mode="popLayout">
        {images.map((img) => (
          <motion.div
            key={img.id}
            className="absolute pointer-events-none origin-center"
            style={{
              left: img.x,
              top: img.y,
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
              zIndex: img.zIndex,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.35, rotate: img.rotation }}
            animate={{ 
              opacity: 1, 
              scale: 1.0, 
              rotate: img.rotation, 
              transition: { type: "spring", stiffness: 220, damping: 20 } 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.0, // "shrinking core" animation
              rotate: img.rotation, 
              transition: { duration: 0.3, ease: "easeIn" } 
            }}
          >
            <div className="w-full h-full pointer-events-none select-none">
              <img
                src={img.url}
                alt="Trail Snapshot"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain select-none pointer-events-none"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
