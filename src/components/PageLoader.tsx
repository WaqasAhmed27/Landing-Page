import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function PageLoader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    const panels = gsap.utils.toArray('.shutter-panel', containerRef.current);
    
    // Prevent scrolling while loader is active
    document.body.style.overflow = 'hidden';
    
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        setIsComplete(true);
      }
    });
    
    // Initial delay for dramatic effect
    tl.to({}, { duration: 0.3 })
    
    // Staggered shutter wipe upwards (8 columns -> 7 staggers)
    .to(panels, {
      yPercent: -100,
      duration: 0.7,
      stagger: 0.0875,
      ease: "power4.inOut"
    })
    // Hide container at the very end of the timeline
    .set(containerRef.current, { autoAlpha: 0 }); 
    
  }, { scope: containerRef });

  if (isComplete) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[999999] flex pointer-events-none bg-transparent">
      {Array(8).fill(0).map((_, i) => (
        <div 
          key={i} 
          className={`shutter-panel flex-1 bg-[#4ADE80] h-full relative z-20 overflow-hidden shadow-[inset_4px_0_8px_rgba(0,0,0,0.08),inset_-2px_0_4px_rgba(255,255,255,0.1)] ${i < 7 ? 'border-r-2 border-[#111111]' : ''}`} 
        >
          {/* Brutalist Noise Texture */}
          <div 
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
