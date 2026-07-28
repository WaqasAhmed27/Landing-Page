import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  baseShadow?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export default function BrutalButton({ children, className = '', baseShadow = '4px 4px 0px 0px rgba(0,0,0,1)', ...props }: BrutalButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    if (!buttonRef.current) return;
    
    const btn = buttonRef.current;
    
    // We remove the static tailwind hover/active classes in the parent and replace with GSAP.
    // Base is 0,0 translate.
    const hoverAnim = gsap.to(btn, {
      x: -2,
      y: -2,
      boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
      duration: 0.1,
      paused: true,
      ease: "power2.out",
    });

    const pressAnim = gsap.to(btn, {
      x: 4,
      y: 4,
      boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)",
      duration: 0.05,
      paused: true,
      ease: "power2.out",
    });

    const onMouseEnter = () => hoverAnim.play();
    const onMouseLeave = () => {
      pressAnim.reverse();
      hoverAnim.reverse();
    };
    const onMouseDown = () => {
      hoverAnim.pause();
      pressAnim.play();
    };
    const onMouseUp = () => {
      pressAnim.reverse();
      hoverAnim.play();
    };

    btn.addEventListener('mouseenter', onMouseEnter);
    btn.addEventListener('mouseleave', onMouseLeave);
    btn.addEventListener('mousedown', onMouseDown);
    btn.addEventListener('mouseup', onMouseUp);

    return () => {
      btn.removeEventListener('mouseenter', onMouseEnter);
      btn.removeEventListener('mouseleave', onMouseLeave);
      btn.removeEventListener('mousedown', onMouseDown);
      btn.removeEventListener('mouseup', onMouseUp);
    };
  }, { scope: buttonRef });

  return (
    <button
      ref={buttonRef}
      style={{ boxShadow: baseShadow }}
      className={`transition-none cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
