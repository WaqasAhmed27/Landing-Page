import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ActiveTrailImage } from '../types';
import { TRAIL_IMAGES } from '../data';

export default function TrailCanvas() {
  const [images, setImages] = useState<ActiveTrailImage[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const currentIndex = useRef(0);
  const highestZIndex = useRef(100);
  const containerRef = useRef<HTMLDivElement>(null);

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

    // Handle lifespan expiry by triggering removal
    setTimeout(() => {
      // Instead of abruptly removing, we let the exit animation complete first.
      // But the enter animation takes care of the exit. We'll clean up state anyway.
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

  // GSAP animation for new elements
  useGSAP(() => {
    if (!containerRef.current) return;
    
    const imageElements = gsap.utils.toArray('.trail-image', containerRef.current) as HTMLDivElement[];
    
    imageElements.forEach((el) => {
      if (el.dataset.animated) return; // skip already animated ones
      el.dataset.animated = "true";
      
      const rotation = parseFloat(el.dataset.rotation || "0");
      
      gsap.fromTo(el, 
        { 
          opacity: 0, 
          scale: 0.35, 
          rotation: rotation 
        },
        { 
          opacity: 1, 
          scale: 1.0, 
          rotation: rotation, 
          duration: 0.25, 
          ease: "back.out(2)" 
        }
      );
      
      // Exit animation before React unmounts it
      gsap.to(el, {
        opacity: 0,
        scale: 0.0,
        rotation: rotation,
        duration: 0.3,
        ease: "power2.in",
        delay: (LIFESPAN / 1000) - 0.3 // start exit just before unmount
      });
    });
  }, { scope: containerRef, dependencies: [images] });

  return (
    <div
      id="simple-trail-canvas"
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[9999] select-none overflow-hidden"
    >
      {images.map((img) => (
        <div
          key={img.id}
          className="trail-image absolute pointer-events-none origin-center"
          data-rotation={img.rotation}
          style={{
            left: img.x,
            top: img.y,
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            zIndex: img.zIndex,
            transform: 'translate(-50%, -50%)',
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
        </div>
      ))}
    </div>
  );
}
