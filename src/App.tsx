import { useState, useRef, RefObject } from "react";
import { Check, Menu, X, Plus, Droplet, Recycle, Trees, ArrowRight, Smartphone, Nfc, QrCodeIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import originalLogo from "./assets/images/taptile_logo_original.png";
import neobrutalistLogo from "./assets/images/taptile_logo_neobrutalist.png";
import TrailCanvas from "./components/TrailCanvas";
import BrutalButton from "./components/BrutalButton";
import PageLoader from "./components/PageLoader";

gsap.registerPlugin(ScrollTrigger);
import imgGlasses from "./assets/images/trail_images/chameleon_glasses.png";
import imgTongue from "./assets/images/trail_images/chameleon_tongue.png";
import imgWink from "./assets/images/trail_images/chameleon_wink.png";
import imgCheckmark from "./assets/images/trail_images/checkmark.png";
import imgCoin from "./assets/images/trail_images/coin.png";
import imgLightning from "./assets/images/trail_images/lighning_bolt.png";
import imgSpark from "./assets/images/trail_images/spark.png";
import imgConfetti from "./assets/images/trail_images/confetti.png";
import imgThinking from "./assets/images/chameleon_thinking.png";

const Pill = ({ text, colorClass }: { text: string, colorClass: string }) => (
  <div className={`inline-block border-2 border-black px-5 py-2 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-xs uppercase tracking-wider ${colorClass}`}>
    {text}
  </div>
);

export default function App() {
  const [calcVolume, setCalcVolume] = useState(500);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [useOriginalLogo, setUseOriginalLogo] = useState(false);
const [logoClicks, setLogoClicks] = useState(0);
  const [trailEnabled, setTrailEnabled] = useState(false);
  const [activeHowItWorks, setActiveHowItWorks] = useState([true, false, false, false]);
  
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const rightStripMaskRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const num1Ref = useRef<HTMLHeadingElement>(null);
  const num2Ref = useRef<HTMLHeadingElement>(null);
  const num3Ref = useRef<HTMLHeadingElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const appRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const blobEffectRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Progress Bar (Desktop only)
    gsap.to(progressBarRef.current, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: stickyContainerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          if (progressBarRef.current) {
            progressBarRef.current.style.opacity = (self.progress > 0 && self.progress < 1) ? '1' : '0';
          }
        }
      }
    });

    // 2. Right Strip Mask
    gsap.to(rightStripMaskRef.current, {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

    // 3. Problem with Paper Cards (Desktop)
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const elements = [card1Ref.current, card2Ref.current, card3Ref.current, footerRef.current];
      const nums = [
        { ref: num1Ref, val: 41.5, unit: 'B', fmt: (v: number) => v.toFixed(1) },
        { ref: num2Ref, val: 90, unit: '%', fmt: (v: number) => Math.round(v).toString() },
        { ref: num3Ref, val: 12.4, unit: 'M', fmt: (v: number) => v.toFixed(1) }
      ];

      // Initial state
      elements.forEach((el, index) => {
        if (el) gsap.set(el, { opacity: 0, y: 60, scale: 0.92, rotation: index < 3 ? -8 : 0 });
      });

      // Unified timeline for the entire pinned section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stickyContainerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrubbing
        }
      });

      // Add a small initial gap before the first card appears
      tl.to({}, { duration: 0.2 });

      elements.forEach((el, index) => {
        if (!el) return;

        // Animate the card in
        tl.to(el, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: "power2.out"
        });

        // Animate the number concurrently
        if (index < 3) {
          const nObj = nums[index];
          tl.to({ val: 0 }, {
            val: nObj.val,
            duration: 1,
            ease: "none",
            onUpdate: function() {
              if (nObj.ref.current) {
                nObj.ref.current.textContent = nObj.fmt(this.targets()[0].val) + nObj.unit;
              }
            }
          }, "<");
        }

        // Add a delay/gap before the next card starts animating
        tl.to({}, { duration: 0.4 });
      });
    });
    
    mm.add("(max-width: 767px)", () => {
       const elements = [card1Ref.current, card2Ref.current, card3Ref.current, footerRef.current];
       elements.forEach(el => el && gsap.set(el, { clearProps: "all" }));
       if (num1Ref.current) num1Ref.current.textContent = '41.5B';
       if (num2Ref.current) num2Ref.current.textContent = '90%';
       if (num3Ref.current) num3Ref.current.textContent = '12.4M';
    });

    // 4. How It Works Snap
    const cards = gsap.utils.toArray('.hiw-card', howItWorksRef.current) as HTMLElement[];
    
    // Set initial inactive state for ALL cards so they slide up
    gsap.set(cards, {
      filter: "grayscale(70%)",
      opacity: 0,
      boxShadow: "none",
      scale: 0.90,
      y: 60
    });

    ScrollTrigger.create({
      trigger: howItWorksRef.current,
      start: "top 60%",
      onEnter: () => {
        gsap.to(cards, {
          y: 0,
          filter: "grayscale(0%)",
          opacity: 1,
          boxShadow: "5px 5px 0px #111111",
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.5)"
        });
      }
    });
    
    cards.forEach((card) => {
      
      // Add brutalist hover effect
      card.addEventListener('mouseenter', () => {
        // Only apply if it's currently 'active' (opacity 1)
        if (gsap.getProperty(card, "opacity") === 1) {
          gsap.to(card, {
            y: -8,
            boxShadow: "12px 20px 0px 0px #111111",
            duration: 0.2,
            ease: "power2.out"
          });
        }
      });
      
      card.addEventListener('mouseleave', () => {
        if (gsap.getProperty(card, "opacity") === 1) {
          gsap.to(card, {
            y: 0,
            boxShadow: "5px 5px 0px #111111",
            duration: 0.2,
            ease: "power2.in"
          });
        }
      });
    });

    // 6. Sticker Badges Continuous Wiggle
    const badges = gsap.utils.toArray('.absolute.object-contain.pointer-events-none.drop-shadow-md');
    badges.forEach((badge: any, index: number) => {
      gsap.to(badge, {
        rotation: "random(-15, 15)",
        x: "random(-10, 10)",
        y: "random(-10, 10)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.2
      });
    });

    // 7. Cursor Blob Follower & Liquid Deformation
    const blob = blobRef.current;
    const blobEffect = blobEffectRef.current;
    if (blob && blobEffect && window.matchMedia("(min-width: 768px)").matches) {
      const xTo = gsap.quickTo(blob, "left", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(blob, "top", { duration: 0.4, ease: "power3" });

      const xToEffect = gsap.quickTo(blobEffect, "left", { duration: 0.7, ease: "power3" });
      const yToEffect = gsap.quickTo(blobEffect, "top", { duration: 0.7, ease: "power3" });

      const mouse = { x: 0, y: 0 };
      const prevMouse = { x: 0, y: 0 };
      let currentSpeed = 0;
      let currentAngle = 0;

      const onMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      };

      window.addEventListener("mousemove", onMouseMove);

      const updateBlob = () => {
        if (prevMouse.x === 0 && prevMouse.y === 0) {
          prevMouse.x = mouse.x;
          prevMouse.y = mouse.y;
          return;
        }

        const dx = mouse.x - prevMouse.x;
        const dy = mouse.y - prevMouse.y;

        const targetSpeed = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.08, 0.8);
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Smooth speed decay
        currentSpeed += (targetSpeed - currentSpeed) * 0.15;
        
        // Only update angle if moving to avoid snapping back to 0 when stopping
        if (Math.sqrt(dx * dx + dy * dy) > 1) {
          currentAngle = targetAngle;
        }

        xTo(mouse.x - 24);
        yTo(mouse.y - 24);

        xToEffect(mouse.x - 20);
        yToEffect(mouse.y - 20);

        gsap.set(blob, {
          scaleX: 1 + currentSpeed * 0.3,
          scaleY: 1 - currentSpeed * 0.15,
          rotation: currentAngle
        });

        gsap.set(blobEffect, {
          scaleX: 1 + currentSpeed * 0.4,
          scaleY: 1 - currentSpeed * 0.2,
          rotation: currentAngle
        });

        prevMouse.x = mouse.x;
        prevMouse.y = mouse.y;
      };

      gsap.ticker.add(updateBlob);

      const generateBlobString = () => {
        const r = () => gsap.utils.random(42, 58, 1);
        return `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`;
      };

      const animateBlob = () => {
        gsap.to(blob, {
          borderRadius: generateBlobString(),
          duration: 1.2,
          ease: "sine.inOut",
          onComplete: animateBlob
        });
      };

      const animateBlobEffect = () => {
        gsap.to(blobEffect, {
          borderRadius: generateBlobString(),
          duration: 1.4,
          ease: "sine.inOut",
          onComplete: animateBlobEffect
        });
      };

      animateBlob();
      animateBlobEffect();

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        gsap.ticker.remove(updateBlob);
      };
    }

  }, { scope: appRef });

  const handleLogoClick = () => {
    setUseOriginalLogo(!useOriginalLogo);
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    if (newClicks >= 5) {
      setTrailEnabled(true);
    }
  };

  // Calculations based on daily transactions
  const water = Math.round(calcVolume * 0.364);
  const paper = Math.round(calcVolume * 0.018);
  const trees = (calcVolume * 0.043).toFixed(1);
  const expenses = Math.round(calcVolume * 18.25).toLocaleString();

  const faqs = [
    { q: "Does this require changes to our POS software?", a: "No. TapTile installs alongside your current system — your printer keeps working exactly as before. Our middleware intercepts the print job in parallel without touching your billing software. If TapTile ever goes offline, your paper receipts continue uninterrupted. Zero risk to your operations." },
    { q: "Do customers need to install an app?", a: "No app, no account, no signup. The receipt opens instantly in their native mobile browser the moment they tap or scan. Customers with any NFC-enabled phone — Android or iPhone — can use it out of the box. No friction for you, no friction for them." },
    { q: "What happens if internet is down at the counter?", a: "The TapTile counter device works fully offline. Customers can still tap or scan and receive their receipt instantly. The device caches all receipts locally and automatically syncs to the cloud the moment connectivity is restored. Your counter never stalls." },
    { q: "How fast can a store go live?", a: "Most stores are fully live in under 48 hours. We handle the setup remotely — no store downtime, no technician visit required for most POS setups. You tell us your billing software; we handle the rest." },
    { q: "Can TapTile still print paper receipts?", a: "Yes, always. TapTile runs alongside your thermal printer — paper receipts print exactly as before. You can go fully paperless, hybrid, or keep paper as the default. You're in control, and the switch is instant." },
  ];

  const getCardClasses = (isActive: boolean, baseBg: string, textClass: string = "text-black") => {
    return `hiw-card relative ${baseBg} border-4 border-black rounded-3xl p-4 sm:p-6 xl:p-8 ${isActive ? 'hiw-card-active' : 'hiw-card-inactive'} ${textClass}`;
  };

  return (
    <div ref={appRef} className="min-h-screen bg-white text-[#111111] font-sans selection:bg-[#4ADE80] selection:text-black overflow-x-clip">
      <PageLoader />
      
      {/* RIGHT STRIP - SCROLL PROGRESS */}
      <div 
        className="fixed right-0 top-0 h-screen hidden xl:flex justify-center pointer-events-none z-0 bg-[#22C55E] overflow-hidden w-64"
      >
        <div className="absolute w-full h-[100vh] flex items-center justify-center">
          <div 
            className="w-[100vh] flex items-center text-[#111111] font-mono uppercase leading-[0.8] font-black opacity-[0.12] whitespace-nowrap"
            style={{ transform: 'rotate(-90deg)', fontSize: '12rem' }}
          >
            <div className="animate-marquee flex">
              <span className="pr-4">PAKISTAN'S FIRST DIGITAL RECEIPT INFRASTRUCTURE &middot;&nbsp;PAKISTAN'S FIRST DIGITAL RECEIPT INFRASTRUCTURE &middot;&nbsp;</span>
              <span className="pr-4">PAKISTAN'S FIRST DIGITAL RECEIPT INFRASTRUCTURE &middot;&nbsp;PAKISTAN'S FIRST DIGITAL RECEIPT INFRASTRUCTURE &middot;&nbsp;</span>
            </div>
          </div>
        </div>
        <div ref={rightStripMaskRef} className="absolute bottom-0 w-full overflow-hidden flex justify-center" style={{ height: '0%' }}>
          <div className="absolute bottom-0 w-full h-[100vh] flex items-center justify-center">
            <div 
              className="w-[100vh] flex items-center text-[#111111] font-mono uppercase leading-[0.8] font-black opacity-100 whitespace-nowrap"
              style={{ transform: 'rotate(-90deg)', fontSize: '12rem' }}
            >
              <div className="animate-marquee flex">
                <span className="pr-4">PAKISTAN'S FIRST DIGITAL RECEIPT INFRASTRUCTURE &middot;&nbsp;PAKISTAN'S FIRST DIGITAL RECEIPT INFRASTRUCTURE &middot;&nbsp;</span>
                <span className="pr-4">PAKISTAN'S FIRST DIGITAL RECEIPT INFRASTRUCTURE &middot;&nbsp;PAKISTAN'S FIRST DIGITAL RECEIPT INFRASTRUCTURE &middot;&nbsp;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar (Desktop only) */}
      <div className="fixed top-0 left-0 w-full h-2.5 z-[99999] hidden md:block pointer-events-none">
        <div ref={progressBarRef} className="h-full bg-[#4ADE80] border-b-[3px] border-black w-0 opacity-0 transition-none" />
      </div>
      
      {trailEnabled && <TrailCanvas />}
      <div className="w-full xl:max-w-[calc(100vw-16rem)] ml-0 border-r-4 border-black bg-[#FDFBEE] min-h-screen relative shadow-2xl md:cursor-none">
        {/* Yellow Trailing Effect Blob */}
        <div 
          ref={blobEffectRef} 
          className="hidden md:block fixed w-10 h-10 bg-[#FFF248] pointer-events-none mix-blend-difference z-[9998]"
          style={{ left: '-100px', top: '-100px', borderRadius: '50%' }}
        />
        {/* Cursor Follower Blob */}
        <div 
          ref={blobRef} 
          className="hidden md:block fixed w-12 h-12 bg-[#4ADE80] pointer-events-none mix-blend-difference z-[9999]"
          style={{ left: '-100px', top: '-100px', borderRadius: '50%' }}
        />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#FDFBEE] border-b-4 border-black">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={handleLogoClick}
          >
            <div className="w-12 h-12 border-2 border-black bg-white rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-300 group-hover:scale-105">
              <img 
                src={useOriginalLogo ? originalLogo : neobrutalistLogo} 
                alt="TapTile Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span 
              className="text-2xl tracking-tight transition-all duration-300 select-none"
              style={
                useOriginalLogo 
                  ? { fontFamily: "'Gilroy-ExtraBold', 'Gilroy', sans-serif", fontWeight: 800 } 
                  : { fontFamily: "'Syne', sans-serif", fontWeight: 800 }
              }
            >
              TapTile
            </span>
          </div>
          
          <div className="hidden md:flex gap-10 font-bold text-sm uppercase tracking-wider">
            <a href="#platform" className="hover:text-[#4ADE80] transition-colors">Platform</a>
            <a href="#integration" className="hover:text-[#4ADE80] transition-colors">Integration</a>
            <a href="#security" className="hover:text-[#4ADE80] transition-colors">Security</a>
            <a href="#pricing" className="hover:text-[#4ADE80] transition-colors">Pricing</a>
          </div>
          
          <div className="hidden md:block">
            <BrutalButton className="bg-[#4ADE80] border-2 border-black rounded-lg px-6 py-2.5 font-bold uppercase text-sm" baseShadow="4px 4px 0px 0px rgba(0,0,0,1)">
              Book a Demo
            </BrutalButton>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#FDFBEE] border-b-4 border-black z-40 px-5 py-5 flex flex-col gap-4 shadow-[0_8px_0_0_rgba(0,0,0,1)]">
          <a href="#platform" className="font-bold text-lg hover:text-[#4ADE80] transition-colors" onClick={() => setMobileMenuOpen(false)}>Platform</a>
          <a href="#integration" className="font-bold text-lg hover:text-[#4ADE80] transition-colors" onClick={() => setMobileMenuOpen(false)}>Integration</a>
          <a href="#security" className="font-bold text-lg hover:text-[#4ADE80] transition-colors" onClick={() => setMobileMenuOpen(false)}>Security</a>
          <a href="#pricing" className="font-bold text-lg hover:text-[#4ADE80] transition-colors" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
          <BrutalButton className="mt-4 bg-[#4ADE80] border-2 border-black rounded-lg px-6 py-3 font-bold uppercase text-sm" baseShadow="4px 4px 0px 0px rgba(0,0,0,1)">
            Book a Demo
          </BrutalButton>
        </div>
      )}


      {/* Hero */}
      <section className="relative pt-10 pb-8 md:pt-16 md:pb-12 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="absolute top-12 right-8 rotate-[8deg] z-20 xl:block hidden">
      <img src={imgLightning} alt="" className="absolute -top-6 -left-6 w-12 h-12 -rotate-12 object-contain pointer-events-none drop-shadow-md z-10" />
      <div className="pill-box bg-white border-[2px] border-[#111111] shadow-[2px_2px_0px_0px_#111111] rounded-full px-4 py-1.5 font-sans font-[700] text-[11px] text-[#111111] whitespace-nowrap">
        ⚡ Under 2 seconds
      </div>
    </div>
        
        <div>
          <div className="inline-block bg-[#4ADE80] border-2 border-black px-3 py-1 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-xs uppercase tracking-wider mb-8">
            Pakistan's First Digital Receipt Experience
          </div>
          <h1 className="font-syne text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-extrabold leading-[1] tracking-tight mb-8 relative z-10">
            Digital receipts.<br />
            <span className="text-[#4ADE80] relative inline-block">
              Zero POS changes.
              <div className="absolute -bottom-1 sm:-bottom-3 -left-4 sm:-left-6 w-[105%] sm:w-[110%] h-3 sm:h-4 bg-[#FFF248] border-[3px] border-black rounded-full -rotate-2 -z-10 hover:skew-x-6 hover:-rotate-1 transition-all duration-300"></div>
            </span>
          </h1>
          <p className="text-lg font-medium text-gray-700 mb-10 max-w-lg leading-relaxed">
            One tap delivers a digital receipt to your customer in under two seconds — no app, no POS changes, no workflow friction. Live in under 48 hours.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <div className="flex flex-col items-start justify-center border-2 border-black bg-white rounded-lg py-3 px-4 flex-1 min-w-[90px] sm:w-[120px] sm:flex-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              <span className="text-sm font-mono font-bold text-[#4ADE80] leading-none mb-2">0 POS</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-black leading-none">Changes</span>
            </div>
            <div className="flex flex-col items-start justify-center border-2 border-black bg-white rounded-lg py-3 px-4 flex-1 min-w-[90px] sm:w-[120px] sm:flex-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              <span className="text-sm font-mono font-bold text-[#4ADE80] leading-none mb-2">100%</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-black leading-none">Paperless</span>
            </div>
            <div className="flex flex-col items-start justify-center border-2 border-black bg-white rounded-lg py-3 px-4 flex-1 min-w-[90px] sm:w-[120px] sm:flex-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              <span className="text-sm font-mono font-bold text-[#4ADE80] leading-none mb-2">&lt;48h</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-black leading-none">Setup</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <BrutalButton className="w-full sm:w-auto bg-[#4ADE80] text-black font-bold px-4 py-2.5 text-sm rounded-md border-2 border-black uppercase text-sm tracking-wider" baseShadow="4px 4px 0px 0px rgba(0,0,0,1)">
              See It In Action
            </BrutalButton>
            <BrutalButton className="w-full sm:w-auto bg-white text-black font-bold px-4 py-2.5 text-sm rounded-md border-2 border-black uppercase text-sm tracking-wider" baseShadow="4px 4px 0px 0px rgba(0,0,0,1)">
              Check POS Compatibility
            </BrutalButton>
          </div>
          <p className="mt-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Trusted by retailers across Pakistan — Al-Fatah, Khaadi, Metro & more</p>
        </div>

        <div className="relative h-[300px] sm:h-[380px] w-full mt-4 sm:mt-12 lg:mt-0 flex justify-center items-center">
          <div className="relative w-full max-w-[450px] h-full flex justify-center items-center scale-[0.75] min-[380px]:scale-[0.85] sm:scale-100 origin-center">
            
            {/* Receipt Mockup */}
            <div className="absolute z-10 w-44 md:w-48 bg-white border-4 border-black rounded-xl p-5 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] left-0 top-10">
              <div className="text-center pb-3 border-b-2 border-dashed border-gray-300">
                <p className="font-syne font-bold text-sm">AL-FATAH SUPERMARKET</p>
                <p className="font-mono text-[10px] text-gray-500 mt-1">COUNTER #04 · ISLAMABAD</p>
              </div>
              <div className="py-4 font-mono text-xs space-y-3 border-b-2 border-dashed border-gray-300">
                <div className="flex justify-between"><span>Organic Honey 500g</span><span>1,250</span></div>
                <div className="flex justify-between"><span>Basmati Rice 5kg</span><span>1,850</span></div>
                <div className="flex justify-between"><span>Full Cream Milk x4</span><span>1,160</span></div>
              </div>
              <div className="py-3 flex justify-between font-syne font-bold text-lg">
                <span>TOTAL DUE</span><span>5,978.7</span>
              </div>
            </div>

            {/* Blinking Dots */}
            <div className="absolute z-15 left-[55%] md:left-[58%] top-1/2 -translate-y-1/2 flex gap-2">
              <div className="w-2.5 h-2.5 bg-black rounded-full animate-[pulse_1.5s_infinite]"></div>
              <div className="w-2.5 h-2.5 bg-black rounded-full animate-[pulse_1.5s_0.5s_infinite]"></div>
              <div className="w-2.5 h-2.5 bg-black rounded-full animate-[pulse_1.5s_1s_infinite]"></div>
            </div>
            
            {/* Phone Mockup */}
            <div className="absolute z-20 w-32 h-[260px] bg-[#111111] border-4 border-black rounded-[2rem] p-1.5 right-0 md:-right-8 top-24 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center items-center">
              <div className="absolute top-1.5 w-16 h-4 bg-black rounded-b-xl z-30"></div>
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden p-4 flex flex-col items-center justify-center border-2 border-black">
                 <div className="bg-[#dcfce7] border-2 border-black rounded-lg p-2 text-black font-bold text-xs uppercase mb-4 w-full flex items-center justify-center gap-2">
                   <Check size={14} className="text-[#4ADE80]" /> ✓ Received
                 </div>
                 <p className="font-mono text-[10px] text-center font-bold leading-relaxed">
                   TAPTILE RECEIPT<br/><br/>
                   TOTAL: 5,978.7 PKR<br/><br/>
                   SAVED & SEARCHABLE
                 </p>
              </div>
            </div>
            
            {/* NFC Icon */}
            <div className="absolute z-30 bottom-10 right-[90px] w-14 h-14 bg-[#4ADE80] rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <Nfc size={28} className="text-black" />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="w-full bg-black text-white border-y-4 border-black flex flex-col relative z-10">
        <div className="text-center py-2 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-400 border-b-2 border-gray-800">
          Pilot partners &amp; integrations
        </div>
        <div className="overflow-hidden py-2.5 sm:py-4 flex">
          <div className="animate-marquee whitespace-nowrap flex items-center font-mono text-xs sm:text-sm font-bold tracking-widest">
            {Array(8).fill(0).map((_, i) => (
              <span key={i} className="flex items-center">
                <span className="mx-6">AL-FATAH SUPERMARKET</span><span className="text-[#4ADE80]">★</span>
                <span className="mx-6">KHAADI</span><span className="text-[#4ADE80]">★</span>
                <span className="mx-6">METRO CASH & CARRY</span><span className="text-[#4ADE80]">★</span>
                <span className="mx-6">SAVOUR FOODS</span><span className="text-[#4ADE80]">★</span>
                <span className="mx-6">IMTIAZ SUPER MARKET</span><span className="text-[#4ADE80]">★</span>
                <span className="mx-6">CHASE UP</span><span className="text-[#4ADE80]">★</span>
                <span className="mx-6">SANA SAFINAZ</span><span className="text-[#4ADE80]">★</span>
                <span className="mx-6">CARREFOUR</span><span className="text-[#4ADE80]">★</span>
                <span className="mx-6">LALA TEXTILE</span><span className="text-[#4ADE80]">★</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* The Problem with Paper */}
      <section ref={stickyContainerRef} className="relative w-full bg-[#FFF248] h-auto md:h-[400vh]">
        <div className="absolute top-[10%] left-[62%] rotate-[-8deg] z-20 xl:block hidden">
      <img src={imgTongue} alt="" className="absolute -bottom-6 -left-5 w-14 h-14 -rotate-6 object-contain pointer-events-none drop-shadow-md z-10" />
      <div className="pill-box bg-white border-[2px] border-[#111111] shadow-[2px_2px_0px_0px_#111111] rounded-full px-4 py-1.5 font-sans font-[700] text-[11px] text-[#111111] whitespace-nowrap">
        🌿 100% paperless
      </div>
    </div>
        {/* Sticky viewport content container */}
        <div className="relative md:sticky top-0 h-auto md:h-screen w-full flex flex-col justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12">
          
          <div className="max-w-[85rem] mx-auto w-full">
            <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
              <Pill text="The Problem with Paper" colorClass="bg-white" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Card 1 */}
              <div 
                ref={card1Ref}
                className="bg-white border-4 border-black rounded-2xl sm:rounded-[2rem] p-5 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
                style={{
                  willChange: 'transform, opacity'
                }}
              >
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-4 border-[#ef4444] text-[#ef4444] flex items-center justify-center mb-3 md:mb-6">
                  <Droplet size={20} className="md:w-7 md:h-7" strokeWidth={3} />
                </div>
                <h3 ref={num1Ref} className="font-syne text-3xl md:text-4xl font-extrabold text-[#ef4444] mb-2 md:mb-3">
                  41.5B
                </h3>
                <p className="font-bold text-base sm:text-lg md:text-xl mb-2 md:mb-4">Gallons of water</p>
                <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
                  Consumed annually to manufacture standard thermal paper receipt rolls. Enough to fill 62,000 Olympic swimming pools.
                </p>
              </div>

              {/* Card 2 */}
              <div 
                ref={card2Ref}
                className="bg-white border-4 border-black rounded-2xl sm:rounded-[2rem] p-5 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
                style={{
                  willChange: 'transform, opacity'
                }}
              >
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-4 border-[#f97316] text-[#f97316] flex items-center justify-center mb-3 md:mb-6">
                  <Recycle size={20} className="md:w-7 md:h-7" strokeWidth={3} />
                </div>
                <h3 ref={num2Ref} className="font-syne text-3xl md:text-4xl font-extrabold text-[#f97316] mb-2 md:mb-3">
                  90%
                </h3>
                <p className="font-bold text-base sm:text-lg md:text-xl mb-2 md:mb-4">Directly into landfill</p>
                <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
                  Thermal receipt paper is coated in plastic polymers. It cannot be recycled. It poisons the soil it lands in.
                </p>
              </div>

              {/* Card 3 */}
              <div 
                ref={card3Ref}
                className="bg-white border-4 border-black rounded-2xl sm:rounded-[2rem] p-5 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
                style={{
                  willChange: 'transform, opacity'
                }}
              >
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-4 border-[#4ADE80] text-[#4ADE80] flex items-center justify-center mb-3 md:mb-6">
                  <Trees size={20} className="md:w-7 md:h-7" strokeWidth={3} />
                </div>
                <h3 ref={num3Ref} className="font-syne text-3xl md:text-4xl font-extrabold text-[#4ADE80] mb-2 md:mb-3">
                  12.4M
                </h3>
                <p className="font-bold text-base sm:text-lg md:text-xl mb-2 md:mb-4">Trees per year</p>
                <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
                  Logged and processed into paper receipts that customers read for three seconds before throwing away.
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-8 sm:mt-12 md:mt-16">
              <div ref={footerRef} className="bg-white border-4 border-black px-5 py-3 md:px-6 md:py-4 rounded-2xl sm:rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-syne font-bold text-sm sm:text-base md:text-xl text-center" style={{ willChange: 'transform, opacity' }}>
                Every. Single. Year. — There's a better way.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#FFFDF7] relative">
        <div className="absolute top-4 right-4 rotate-[-6deg] z-10 xl:block hidden">
      <img src={imgWink} alt="" className="absolute -bottom-5 -right-4 w-12 h-12 rotate-12 object-contain pointer-events-none drop-shadow-md z-10" />
      <div className="pill-box bg-white border-[2px] border-[#111111] shadow-[2px_2px_0px_0px_#111111] rounded-full px-4 py-1.5 font-sans font-[700] text-[11px] text-[#111111] whitespace-nowrap">
        📵 No app needed
      </div>
    </div>
        <div className="max-w-[85rem] mx-auto">
        <div className="flex justify-center mb-10">
          <Pill text="How It Works" colorClass="bg-[#4ADE80]" />
        </div>
        <h2 className="text-center font-syne text-3xl sm:text-4xl font-extrabold mb-12">Four steps.<br/>That's it.</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={getCardClasses(activeHowItWorks[0], 'bg-white', 'text-black')}>
            <div className="inline-block bg-white border-2 border-black text-black px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-6">
              Step 01
            </div>
            <h3 className="font-syne text-2xl lg:text-xl min-[1200px]:text-2xl xl:text-3xl font-extrabold mb-4 break-normal">Purchase made.</h3>
            <p className="text-sm sm:text-base xl:text-lg font-medium text-gray-800">Customer pays as usual — cash, card, JazzCash, Raast, or Easypaisa. The cashier presses Print exactly as always.</p>
          </div>

          <div className={getCardClasses(activeHowItWorks[1], 'bg-[#FFF9C4]', 'text-black')}>
            <div className="inline-block bg-white border-2 border-black text-black px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-6">
              Step 02
            </div>
            <h3 className="font-syne text-2xl lg:text-xl min-[1200px]:text-2xl xl:text-3xl font-extrabold mb-4 break-normal">Intercepted instantly.</h3>
            <p className="text-sm sm:text-base xl:text-lg font-medium text-gray-800">Our middleware reads the print job in parallel. The receipt prints on paper and triggers the digital version simultaneously.</p>
          </div>

          <div className={getCardClasses(activeHowItWorks[2], 'bg-[#DCFCE7]', 'text-black')}>
            <div className="inline-block bg-white border-2 border-black text-black px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-6">
              Step 03
            </div>
            <h3 className="font-syne text-2xl lg:text-xl min-[1200px]:text-2xl xl:text-3xl font-extrabold mb-4 break-normal">Counter device fires.</h3>
            <p className="text-sm sm:text-base xl:text-lg font-medium text-gray-800">The Android tablet displays a QR code and writes the receipt URL to NFC — completely offline at the counter.</p>
          </div>

          <div className={getCardClasses(activeHowItWorks[3], 'bg-[#22C55E]', 'text-[#111111]')}>
            <div className="inline-block bg-[#111111] border-2 border-black text-[#22C55E] px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-6">
              Step 04
            </div>
            <h3 className="font-syne text-2xl lg:text-xl min-[1200px]:text-2xl xl:text-3xl font-extrabold mb-4 text-[#111111] break-normal">Customer taps. Done.</h3>
            <p className="text-sm sm:text-base xl:text-lg font-medium text-[#111111]">One tap opens the receipt in the browser. No app, no account, no friction. Searchable and stored forever.</p>
          </div>
        </div>
        </div>
      </section>

      {/* The Interaction */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#dcfce7] border-y-4 border-black relative">
        <div className="absolute bottom-8 left-4 rotate-[6deg] z-20 xl:block hidden">
      <img src={imgGlasses} alt="" className="absolute -top-5 left-10 w-12 h-12 rotate-[15deg] object-contain pointer-events-none drop-shadow-md z-10" />
      <div className="pill-box bg-white border-[2px] border-[#111111] shadow-[2px_2px_0px_0px_#111111] rounded-full px-4 py-1.5 font-sans font-[700] text-[11px] text-[#111111] whitespace-nowrap">
        🔒 End-to-end encrypted
      </div>
    </div>
        <div className="max-w-[85rem] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-block bg-white border-2 border-black px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-8">
              The Interaction
            </div>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold mb-8 leading-tight">
              One tap.<br/>Everything.
            </h2>
            <p className="text-xl font-medium text-gray-800 mb-10">
              NFC delivers the receipt to the customer's phone in under two seconds. QR fallback is always there, and the counter can work offline.
            </p>
            <ul className="space-y-4 font-bold text-lg">
              <li className="flex items-center gap-3"><Check size={24} className="text-black" /> Any NFC-enabled phone — no setup</li>
              <li className="flex items-center gap-3"><Check size={24} className="text-black" /> QR code fallback built in</li>
              <li className="flex items-center gap-3"><Check size={24} className="text-black" /> Under 2 seconds, start to finish</li>
              <li className="flex items-center gap-3"><Check size={24} className="text-black" /> Fully offline at the counter</li>
            </ul>
          </div>
          <div className="relative w-full max-w-[440px] mx-auto h-[300px] sm:h-[380px] flex items-center justify-center scale-[0.75] min-[380px]:scale-[0.85] sm:scale-100 origin-center">
            
            {/* TapTile Device */}
            <div className="absolute left-0 z-10 w-56 h-72 bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center p-6 justify-between">
               <span className="font-syne font-bold text-lg">TapTile</span>
               <div className="w-28 h-28 bg-[#4ADE80] border-4 border-black rounded-full flex items-center justify-center text-center font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                 TAP HERE
               </div>
               <div className="w-10 h-2 bg-gray-200 rounded-full"></div>
            </div>

            {/* Arrows */}
            <div className="absolute left-[224px] right-[112px] z-0 flex items-center justify-center text-black opacity-30">
               <ArrowRight size={44} />
            </div>

            {/* Phone Mockup */}
            <div className="absolute right-[-16px] z-20 w-32 h-[260px] bg-[#111111] border-4 border-black rounded-[2rem] p-1.5 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center items-center">
              <div className="absolute top-1.5 w-16 h-4 bg-black rounded-b-xl z-30"></div>
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden p-4 flex flex-col items-center justify-center border-2 border-black">
                 <p className="font-mono text-[10px] text-center font-bold leading-relaxed mt-4">
                   ✓ SAVED!<br/><br/>
                   Al-Fatah Supermarket<br/><br/>
                   TOTAL: 5,978.7<br/><br/>
                   Receipt stored
                 </p>
              </div>
            </div>

          </div>
        </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#eef2ff] relative">
        <div className="absolute bottom-[-1.5rem] left-8 rotate-[4deg] z-10 xl:block hidden">
      <img src={imgCheckmark} alt="" className="absolute -top-4 -right-5 w-10 h-10 rotate-6 object-contain pointer-events-none drop-shadow-md z-10" />
      <div className="pill-box bg-white border-[2px] border-[#111111] shadow-[2px_2px_0px_0px_#111111] rounded-full px-4 py-1.5 font-sans font-[700] text-[11px] text-[#111111] whitespace-nowrap">
        ✓ FBR compliant
      </div>
    </div>
        <div className="max-w-[85rem] mx-auto">
        <div className="flex justify-center mb-10">
          <Pill text="Infrastructure" colorClass="bg-[#eef2ff]" />
        </div>
        <h2 className="text-center font-syne text-3xl sm:text-4xl font-extrabold mb-12">
          Built for Pakistani POS.<br/>Not against it.
        </h2>
        <p className="text-center text-lg font-medium text-gray-700 max-w-3xl mx-auto mb-12">
          Zero changes to billing software. Works with Candela, Odoo, SAP, Microsoft Dynamics, or any custom setup. Install in under 48 hours.
        </p>

        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4">
          <div className="flex-1 bg-white border-4 border-black rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col justify-center">
            <h4 className="font-syne font-bold text-lg mb-2">Billing Software</h4>
            <span className="font-mono text-[10px] uppercase font-bold text-gray-500">ESC/POS</span>
          </div>
          <div className="flex-1 bg-black text-white border-4 border-black rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col justify-center">
            <h4 className="font-syne font-bold text-lg mb-2">Middleware Agent</h4>
            <span className="font-mono text-[10px] uppercase font-bold text-gray-400">JSON</span>
          </div>
          <div className="flex-1 bg-white border-4 border-black rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col justify-center">
            <h4 className="font-syne font-bold text-lg mb-2">ESC/POS Parser</h4>
            <span className="font-mono text-[10px] uppercase font-bold text-gray-500">HTTPS</span>
          </div>
          <div className="flex-1 bg-[#4ADE80] border-4 border-black rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col justify-center">
            <h4 className="font-syne font-bold text-lg mb-2">Counter Device</h4>
            <span className="font-mono text-[10px] uppercase font-bold text-black">NFC + QR</span>
          </div>
          <div className="flex-1 bg-[#4ADE80] border-4 border-black rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center flex flex-col justify-center">
            <h4 className="font-syne font-bold text-lg mb-2">Customer Phone</h4>
            <span className="font-mono text-[10px] uppercase font-bold text-black">Browser</span>
          </div>
        </div>
        </div>
      </section>

      {/* Interactive Calculator */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#FDFBEE] relative">
        <div className="absolute top-8 right-8 rotate-[8deg] z-20 xl:block hidden">
      <img src={imgSpark} alt="" className="absolute -top-5 -left-4 w-10 h-10 -rotate-[20deg] object-contain pointer-events-none drop-shadow-md z-10" />
      <img src={imgConfetti} alt="" className="absolute -bottom-6 -right-6 w-12 h-12 rotate-[25deg] object-contain pointer-events-none drop-shadow-md z-10" />
      <div className="pill-box bg-white border-[2px] border-[#111111] shadow-[2px_2px_0px_0px_#111111] rounded-full px-4 py-1.5 font-sans font-[700] text-[11px] text-[#111111] whitespace-nowrap">
        📍 Made in Pakistan
      </div>
    </div>
        <div className="max-w-[85rem] mx-auto">
        <div className="bg-white border-4 border-black rounded-3xl sm:rounded-[3rem] p-4 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#FFF248] border-2 border-black px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Interactive Calculator
            </div>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold">See your store's savings.</h2>
            <p className="text-lg font-medium text-gray-700 mt-4">Drag the slider to match your daily transaction volume.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex justify-between font-bold uppercase tracking-wider text-sm mb-4">
                <span>Daily Transactions</span>
                <span className="text-[#4ADE80] text-xl font-syne">{calcVolume} / day</span>
              </div>
              <input 
                type="range" 
                min="50" max="2000" step="50" 
                value={calcVolume} 
                onChange={(e) => setCalcVolume(Number(e.target.value))}
                className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] accent-[#4ADE80]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div className="border-4 border-[#4ADE80] rounded-xl sm:rounded-2xl p-3 sm:p-6 bg-white shadow-[3px_3px_0px_0px_rgba(74,222,128,1)] sm:shadow-[4px_4px_0px_0px_rgba(74,222,128,1)]">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 truncate">Water Preserved</p>
                <p className="font-syne text-lg min-[360px]:text-xl min-[400px]:text-2xl sm:text-3xl font-extrabold text-[#4ADE80] break-words">{water} Gal</p>
              </div>
              <div className="border-4 border-[#f97316] rounded-xl sm:rounded-2xl p-3 sm:p-6 bg-white shadow-[3px_3px_0px_0px_rgba(249,115,22,1)] sm:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)]">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 truncate">Paper Saved</p>
                <p className="font-syne text-lg min-[360px]:text-xl min-[400px]:text-2xl sm:text-3xl font-extrabold text-[#f97316] break-words">{paper} kg</p>
              </div>
              <div className="border-4 border-black rounded-xl sm:rounded-2xl p-3 sm:p-6 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 truncate">Trees Shielded</p>
                <p className="font-syne text-lg min-[360px]:text-xl min-[400px]:text-2xl sm:text-3xl font-extrabold break-words">{trees}</p>
              </div>
              <div className="border-4 border-[#4ADE80] rounded-xl sm:rounded-2xl p-3 sm:p-6 bg-white shadow-[3px_3px_0px_0px_rgba(74,222,128,1)] sm:shadow-[4px_4px_0px_0px_rgba(74,222,128,1)]">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 truncate">Roll Expenses Saved</p>
                <p className="font-syne text-lg min-[360px]:text-xl min-[400px]:text-2xl sm:text-3xl font-extrabold text-[#4ADE80] break-all">PKR {expenses}</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Built for everyone */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#FFF248] relative">
        <div className="absolute top-[-1rem] left-[15%] rotate-[-4deg] z-10 xl:block hidden">
      <img src={imgCoin} alt="" className="absolute -bottom-5 -right-3 w-10 h-10 -rotate-12 object-contain pointer-events-none drop-shadow-md z-10" />
      <div className="pill-box bg-white border-[2px] border-[#111111] shadow-[2px_2px_0px_0px_#111111] rounded-full px-4 py-1.5 font-sans font-[700] text-[11px] text-[#111111] whitespace-nowrap">
        0 POS changes
      </div>
    </div>
        <div className="max-w-[85rem] mx-auto">
        <div className="bg-white border-4 border-black rounded-[3rem] p-6 md:p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-10">
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold">Built for everyone.</h2>
          </div>

          <h3 className="font-syne text-xl font-bold uppercase tracking-wider mb-6 flex items-center gap-3">
            <span className="bg-[#4ADE80] border-2 border-black px-3 py-1 rounded-full text-xs">For Retailers</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">
              <div className="text-[#4ADE80] mb-4"><Check size={32} /></div>
              <h3 className="font-syne text-2xl font-bold mb-3">Zero POS changes needed</h3>
              <p className="text-gray-700 font-medium mb-6">Compatible with every billing system in Pakistan, including legacy setups and custom agents.</p>
              <span className="font-bold border-b-2 border-black pb-1 hover:text-[#4ADE80] hover:border-[#4ADE80] transition-colors cursor-pointer">Learn more →</span>
            </div>
            <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">
              <div className="text-[#4ADE80] mb-4"><Check size={32} /></div>
              <h3 className="font-syne text-2xl font-bold mb-3">Cut thermal roll costs by 85%</h3>
              <p className="text-gray-700 font-medium mb-6">Save PKR 270,000+ per branch per year while removing the operational mess of paper rolls.</p>
              <span className="font-bold border-b-2 border-black pb-1 hover:text-[#4ADE80] hover:border-[#4ADE80] transition-colors cursor-pointer">Learn more →</span>
            </div>
            <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">
              <div className="text-[#4ADE80] mb-4"><Check size={32} /></div>
              <h3 className="font-syne text-2xl font-bold mb-3">Purchase analytics built in</h3>
              <p className="text-gray-700 font-medium mb-6">Understand buying patterns across branches without asking customers to install another app.</p>
              <span className="font-bold border-b-2 border-black pb-1 hover:text-[#4ADE80] hover:border-[#4ADE80] transition-colors cursor-pointer">Learn more →</span>
            </div>
            <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">
              <div className="text-[#4ADE80] mb-4"><Check size={32} /></div>
              <h3 className="font-syne text-2xl font-bold mb-3">Eco-Retailer certification</h3>
              <p className="text-gray-700 font-medium mb-6">A verified badge for your store window, receipts, and digital customer touchpoints.</p>
              <span className="font-bold border-b-2 border-black pb-1 hover:text-[#4ADE80] hover:border-[#4ADE80] transition-colors cursor-pointer">Learn more →</span>
            </div>
          </div>

          <h3 className="font-syne text-xl font-bold uppercase tracking-wider mb-6 flex items-center gap-3">
            <span className="bg-[#FFF248] border-2 border-black px-3 py-1 rounded-full text-xs">For Customers</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">
              <div className="text-[#4ADE80] mb-4"><Check size={32} /></div>
              <h3 className="font-syne text-2xl font-bold mb-3">Never Lost</h3>
              <p className="text-gray-700 font-medium mb-6">All your receipts are permanently archived and searchable from any device.</p>
              <span className="font-bold border-b-2 border-black pb-1 hover:text-[#4ADE80] hover:border-[#4ADE80] transition-colors cursor-pointer">Learn more →</span>
            </div>
            <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">
              <div className="text-[#4ADE80] mb-4"><Check size={32} /></div>
              <h3 className="font-syne text-2xl font-bold mb-3">Easy Returns</h3>
              <p className="text-gray-700 font-medium mb-6">One-tap barcode access for seamless store returns — no digging through drawers.</p>
              <span className="font-bold border-b-2 border-black pb-1 hover:text-[#4ADE80] hover:border-[#4ADE80] transition-colors cursor-pointer">Learn more →</span>
            </div>
            <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">
              <div className="text-[#4ADE80] mb-4"><Check size={32} /></div>
              <h3 className="font-syne text-2xl font-bold mb-3">Expense Tracking</h3>
              <p className="text-gray-700 font-medium mb-6">Auto-categorize your spending across stores. No manual entry, ever.</p>
              <span className="font-bold border-b-2 border-black pb-1 hover:text-[#4ADE80] hover:border-[#4ADE80] transition-colors cursor-pointer">Learn more →</span>
            </div>
            <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">
              <div className="text-[#4ADE80] mb-4"><Check size={32} /></div>
              <h3 className="font-syne text-2xl font-bold mb-3">Loyalty</h3>
              <p className="text-gray-700 font-medium mb-6">Integrated reward point tracking — your points, automatically, on every receipt.</p>
              <span className="font-bold border-b-2 border-black pb-1 hover:text-[#4ADE80] hover:border-[#4ADE80] transition-colors cursor-pointer">Learn more →</span>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#FDFBEE] relative">
        <div className="max-w-[85rem] mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 items-center mb-12">
          <div className="lg:w-1/2">
            <div className="inline-block bg-black text-white border-2 border-black px-3 py-1 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-xs uppercase tracking-wider mb-8">
              Security
            </div>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold leading-tight">
              Enterprise grade.<br/>Obviously.
            </h2>
          </div>
          <div className="lg:w-1/2 space-y-8">
            <p className="text-xl font-medium text-gray-700">Receipts are infrastructure. TapTile treats every merchant, transaction, and customer record like it matters.</p>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <span className="font-mono font-bold text-gray-400">01</span>
                <p className="font-bold text-lg">HTTPS everywhere, always — Every receipt URL is delivered over encrypted connections.</p>
              </li>
              <li className="flex gap-4">
                <span className="font-mono font-bold text-gray-400">02</span>
                <p className="font-bold text-lg">Per-merchant API keys — Rotated every 90 days and scoped by branch.</p>
              </li>
              <li className="flex gap-4">
                <span className="font-mono font-bold text-gray-400">03</span>
                <p className="font-bold text-lg">PDPO-ready separation — Data boundaries are architectural, not decorative.</p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-[#dcfce7] border-4 border-black rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center font-bold text-xs sm:text-sm uppercase tracking-wider text-center gap-4">
          <div className="flex-1 w-full md:w-auto">POS MACHINE</div>
          <div className="text-[#4ADE80] bg-white border-2 border-black rounded-full px-3 py-1 text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">+ HTTPS +</div>
          <div className="flex-1 w-full md:w-auto">COUNTER DEVICE</div>
          <div className="text-[#4ADE80] bg-white border-2 border-black rounded-full px-3 py-1 text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">+ HTTPS +</div>
          <div className="flex-1 w-full md:w-auto">CLOUD BACKEND</div>
        </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#dcfce7]">
        <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-10">
          <div className="relative inline-block isolate">
            <Pill text="FAQ" colorClass="bg-[#4ADE80]" />
            <img src={imgThinking} alt="" className="absolute -right-3 top-[-10%] -translate-y-1/2 w-[53px] h-[53px] object-contain -z-10" />
          </div>
        </div>
        <h2 className="text-center font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 sm:mb-12">Got questions?</h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <button 
                className="w-full px-4 py-4 sm:px-8 sm:py-6 flex justify-between items-center text-left font-bold text-base sm:text-lg hover:bg-[#4ADE80] group transition-colors cursor-pointer"
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
              >
                {faq.q}
                <span className="text-[#4ADE80] group-hover:text-black font-syne text-3xl leading-none font-bold transition-colors">
                  {faqOpen === i ? '-' : '+'}
                </span>
              </button>
              {faqOpen === i && (
                <div className="px-4 pb-4 sm:px-8 sm:pb-6 text-gray-700 font-medium border-t-2 border-gray-100 pt-4 text-sm sm:text-lg">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* CTA Let's Go */}
      <section className="py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-[#4ADE80] border-y-4 border-black text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block bg-black text-white border-2 border-black px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Let's Go
          </div>
          <h2 className="font-syne text-[2rem] min-[380px]:text-[2.5rem] sm:text-[4.5rem] lg:text-[5.5rem] font-extrabold mb-6 sm:mb-8 leading-[1] tracking-tight text-black">
            Stop buying<br/>paper.
          </h2>
          <p className="text-2xl font-bold mb-12">Join Pakistan's paperless retail revolution.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            <BrutalButton className="w-full sm:w-auto bg-black text-white font-bold px-6 py-2.5 rounded-2xl border-4 border-black uppercase text-sm" baseShadow="8px 8px 0px 0px rgba(74,222,128,1)">
              Start Your Free Pilot
            </BrutalButton>
            <BrutalButton className="w-full sm:w-auto bg-white text-black font-bold px-6 py-2.5 rounded-2xl border-4 border-black uppercase text-sm" baseShadow="8px 8px 0px 0px rgba(0,0,0,1)">
              Check POS Compatibility
            </BrutalButton>
          </div>
        </div>
      </section>

      {/* Get in Touch & Footer */}
      <section className="pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#FDFBEE] relative overflow-hidden">
        <div className="max-w-[70.625rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
          <div>
            <div className="inline-block bg-[#4ADE80] border-2 border-black px-3 py-1 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-xs uppercase tracking-wider mb-8">
              Get in Touch
            </div>
            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-10">Ready to start?</h2>
            
            <form className="space-y-6" onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder="Business Name" className="w-full px-4 py-2.5 rounded-xl border-4 border-black font-bold outline-none focus:bg-[#dcfce7] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors text-sm" />
              <input type="email" placeholder="Contact Email" className="w-full px-4 py-2.5 rounded-xl border-4 border-black font-bold outline-none focus:bg-[#dcfce7] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors text-sm" />
              <BrutalButton type="submit" className="w-full bg-[#4ADE80] text-black font-bold px-4 py-2.5 rounded-xl border-4 border-black uppercase text-sm mt-4 flex items-center justify-center gap-2" baseShadow="8px 8px 0px 0px rgba(0,0,0,1)">
                Get a Free Compatibility Check <ArrowRight size={20} />
              </BrutalButton>
              <p className="text-xs font-bold text-gray-500 text-center">We'll reply within 4 hours with a POS compatibility check.</p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                <span className="flex items-center gap-1"><span className="text-[#4ADE80]">1.</span> We review your POS setup</span>
                <span className="hidden sm:block">→</span>
                <span className="flex items-center gap-1"><span className="text-[#4ADE80]">2.</span> Free compatibility check</span>
                <span className="hidden sm:block">→</span>
                <span className="flex items-center gap-1"><span className="text-[#4ADE80]">3.</span> Live in 48 hours</span>
              </div>
            </form>
          </div>
          
          <div className="flex justify-center transform lg:rotate-3 lg:ml-10">
             <div className="w-full max-w-md bg-white border-4 border-black rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-center pb-4 border-b-4 border-dashed border-gray-300">
                  <p className="font-syne font-bold text-xl">TAPTILE DIGITAL RECEIPT</p>
                  <p className="font-mono text-xs text-gray-500 mt-2">Karachi, Pakistan</p>
                </div>
                <div className="py-6 font-mono text-sm space-y-4 border-b-4 border-dashed border-gray-300">
                  <div className="flex justify-between"><span>Organic Honey 500g</span><span>1,250</span></div>
                  <div className="flex justify-between"><span>Basmati Rice 5kg</span><span>1,850</span></div>
                  <div className="flex justify-between"><span>Full Cream Milk x4</span><span>1,160</span></div>
                </div>
                <div className="py-6 flex justify-between font-syne font-extrabold text-2xl">
                  <span>TOTAL SAVED</span><span>5,978.7</span>
                </div>
                <div className="bg-[#dcfce7] border-4 border-black rounded-xl p-3 text-black font-extrabold text-sm uppercase text-center w-full flex items-center justify-center gap-2 mt-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                   <Check size={20} className="text-[#4ADE80]" /> DIGITAL RECEIPT ISSUED
                </div>
             </div>
          </div>
        </div>

        <footer className="bg-[#111111] text-white py-12 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6 mt-16 border-t-4 border-black absolute left-0 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-white bg-black text-white rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
              <QrCodeIcon className="w-5 h-5" />
            </div>
            <span className="font-syne font-extrabold text-2xl tracking-tight">TapTile</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-bold text-sm uppercase tracking-wider text-gray-500">
            <a href="#platform" className="hover:text-[#4ADE80] transition-colors">Platform</a>
            <span>·</span>
            <a href="#integration" className="hover:text-[#4ADE80] transition-colors">Integration</a>
            <span>·</span>
            <a href="#security" className="hover:text-[#4ADE80] transition-colors">Security</a>
            <span>·</span>
            <a href="#pricing" className="hover:text-[#4ADE80] transition-colors">Pricing</a>
          </div>
          <div className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest">
            © 2026 · Karachi, Pakistan
          </div>
        </footer>
        </div>
      </section>

    </div>
    </div>
  );
}
