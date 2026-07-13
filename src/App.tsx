import { useState, useRef, useEffect, RefObject } from "react";
import { Check, Menu, X, Plus, Droplet, Recycle, Trees, ArrowRight, Smartphone, Nfc, QrCodeIcon } from "lucide-react";
import originalLogo from "./assets/images/taptile_logo_original.png";
import neobrutalistLogo from "./assets/images/taptile_logo_neobrutalist.png";
import TrailCanvas from "./components/TrailCanvas";

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
  const [activeSegment, setActiveSegment] = useState<'retailers' | 'customers'>('retailers');
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

  useEffect(() => {
    let rAFId: number | null = null;
    let isThrottled = false;
    let wasMobile = false;

    const applyStyles = (cardRef: RefObject<HTMLDivElement>, numRef: RefObject<HTMLHeadingElement> | null, progress: number, maxVal: number, unit: string, format: (val: number) => string, baseTransform = '') => {
      if (cardRef.current) {
        cardRef.current.style.opacity = progress.toString();
        cardRef.current.style.transform = `translateY(${60 * (1 - progress)}px) scale(${0.92 + 0.08 * progress}) rotate(${-8 * (1 - progress)}deg) ${baseTransform}`;
      }
      if (numRef && numRef.current) {
        numRef.current.textContent = format(progress * maxVal) + unit;
      }
    };

    const clearStyles = (cardRef: RefObject<HTMLDivElement>, numRef: RefObject<HTMLHeadingElement> | null, maxVal: number, unit: string, format: (val: number) => string) => {
      if (cardRef.current) {
        cardRef.current.style.opacity = '1';
        cardRef.current.style.transform = 'none';
      }
      if (numRef && numRef.current) {
        numRef.current.textContent = format(maxVal) + unit;
      }
    };

    const handleScroll = () => {
      if (isThrottled) return;
      isThrottled = true;

      rAFId = requestAnimationFrame(() => {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
          if (!wasMobile) {
            clearStyles(card1Ref, num1Ref, 41.5, 'B', v => v.toFixed(1));
            clearStyles(card2Ref, num2Ref, 90, '%', v => Math.round(v).toString());
            clearStyles(card3Ref, num3Ref, 12.4, 'M', v => v.toFixed(1));
            clearStyles(footerRef, null, 0, '', () => '');
            if (progressBarRef.current) progressBarRef.current.style.width = '0%';
            wasMobile = true;
          }
        } else {
          wasMobile = false;
          if (stickyContainerRef.current) {
            const rect = stickyContainerRef.current.getBoundingClientRect();
            const scrolled = -rect.top;
            const totalScrollable = rect.height - window.innerHeight;
            let progress = 0;
            if (totalScrollable > 0) {
              progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
            }

            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${progress * 100}%`;
              progressBarRef.current.style.opacity = (progress > 0 && progress < 1) ? '1' : '0';
            }

            const getCardProgress = (p: number, s: number, e: number) => {
              if (p < s) return 0;
              if (p > e) return 1;
              return (p - s) / (e - s);
            };

            const c1 = getCardProgress(progress, 0.2, 0.3);
            const c2 = getCardProgress(progress, 0.45, 0.55);
            const c3 = getCardProgress(progress, 0.7, 0.8);
            const f1 = getCardProgress(progress, 0.85, 0.95);

            applyStyles(card1Ref, num1Ref, c1, 41.5, 'B', v => v.toFixed(1));
            applyStyles(card2Ref, num2Ref, c2, 90, '%', v => Math.round(v).toString());
            applyStyles(card3Ref, num3Ref, c3, 12.4, 'M', v => v.toFixed(1));
            
            if (footerRef.current) {
               footerRef.current.style.opacity = f1.toString();
               footerRef.current.style.transform = `translateY(${60 * (1 - f1)}px) scale(${0.92 + 0.08 * f1})`;
            }
          }
        }

        if (rightStripMaskRef.current) {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            const ratio = Math.max(0, Math.min(1, window.scrollY / docHeight));
            rightStripMaskRef.current.style.height = `${ratio * 100}%`;
          }
        }

        if (pillRefs.current.length > 0) {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            const scrollProgress = window.scrollY / docHeight;
            pillRefs.current.forEach((pill, index) => {
              if (!pill) return;
              const phase = (index / pillRefs.current.length) * Math.PI * 2;
              const wave = Math.sin((scrollProgress * Math.PI * 4) + phase);
              const baseX = index % 2 === 0 ? 20 : -20;
              const xOffset = baseX + wave * 24;
              pill.style.transform = `translateX(${xOffset}px) rotate(${wave * 3}deg)`;
              
              const shadowX = wave > 0 ? 2 : -2;
              const pillBox = pill.querySelector('.pill-box') as HTMLElement;
              if (pillBox) {
                 pillBox.style.boxShadow = `${shadowX}px 2px 0px 0px #111111`;
              }
            });
          }
        }

        if (howItWorksRef.current) {
          const rect = howItWorksRef.current.getBoundingClientRect();
          // How much of the section is visible from the bottom of the viewport
          const scrolledIntoView = window.innerHeight - rect.top;
          const ratio = Math.max(0, scrolledIntoView / rect.height);
          setActiveHowItWorks(prev => {
            const next = [
              true,
              ratio >= 0.3,
              ratio >= 0.55,
              ratio >= 0.8
            ];
            const changed = next.some((val, i) => val !== prev[i]);
            return changed ? next : prev;
          });
        }

        isThrottled = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    // Initialize
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rAFId) cancelAnimationFrame(rAFId);
    };
  }, []);

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
    { q: "Does this require changes to our POS software?", a: "No. TapTile's middleware intercepts print jobs in parallel, requiring zero changes to your billing software." },
    { q: "Do customers need to install an app?", a: "No app required. The receipt opens instantly in their native mobile browser via NFC or QR code." },
    { q: "What happens if internet is down at the counter?", a: "The TapTile counter device works fully offline. It caches receipts locally and syncs them once the connection is restored." },
    { q: "How fast can a store go live?", a: "Integration is plug-and-play. A store can go fully live in under 48 hours with no operational downtime." },
    { q: "Can TapTile still print paper receipts?", a: "Yes. TapTile runs alongside your thermal printer, allowing you to print paper on demand for customers who request it." },
  ];

  const getCardClasses = (isActive: boolean, baseBg: string, textClass: string = "text-black") => {
    return `hiw-card relative ${baseBg} border-4 border-black rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 ${isActive ? 'hiw-card-active' : 'hiw-card-inactive'} ${textClass}`;
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans selection:bg-[#4ADE80] selection:text-black overflow-x-clip">
      
      {/* LEFT STRIP - SNAKE PILLS */}
      {trailEnabled && (
        <div 
          className="fixed left-0 top-0 h-screen hidden xl:flex justify-center pointer-events-none z-[999] overflow-visible"
          style={{ width: 'max(280px, calc((100vw - 70.625rem) / 2))' }}
        >
          <div className="w-full h-full flex flex-col items-center justify-evenly py-10">
              <div className="translate-x-[20px]" ref={(el) => { pillRefs.current[0] = el; }}>
                <div className="relative animate-pill-1 opacity-0">
                 <img src={imgLightning} alt="" className="absolute -top-6 -left-6 w-12 h-12 -rotate-12 object-contain pointer-events-none drop-shadow-md z-10" />
                 <div className="pill-box bg-white border-[2px] border-[#111111] shadow-[2px_2px_0px_0px_#111111] rounded-full px-4 py-1.5 font-sans font-[700] text-[11px] text-[#111111] whitespace-nowrap">
                   ⚡ Under 2 seconds
                 </div>
                </div>
              </div>
              <div className="-translate-x-[20px]" ref={(el) => { pillRefs.current[1] = el; }}>
                <div className="relative animate-pill-2 opacity-0">
                 <img src={imgWink} alt="" className="absolute -bottom-5 -right-4 w-12 h-12 rotate-12 object-contain pointer-events-none drop-shadow-md z-10" />
                 <div className="pill-box bg-white border-[2px] border-[#111111] shadow-[2px_2px_0px_0px_#111111] rounded-full px-4 py-1.5 font-sans font-[700] text-[11px] text-[#111111] whitespace-nowrap">
                   📵 No app needed
                 </div>
                </div>
              </div>
              <div className="translate-x-[20px]" ref={(el) => { pillRefs.current[2] = el; }}>
                <div className="relative animate-pill-3 opacity-0">
                 <img src={imgCheckmark} alt="" className="absolute -top-4 -right-5 w-10 h-10 rotate-6 object-contain pointer-events-none drop-shadow-md z-10" />
                 <div className="pill-box bg-white border-[2px] border-[#111111] shadow-[2px_2px_0px_0px_#111111] rounded-full px-4 py-1.5 font-sans font-[700] text-[11px] text-[#111111] whitespace-nowrap">
                   ✓ FBR compliant
                 </div>
                </div>
              </div>
              <div className="-translate-x-[20px]" ref={(el) => { pillRefs.current[3] = el; }}>
                <div className="relative animate-pill-4 opacity-0">
                 <img src={imgTongue} alt="" className="absolute -bottom-6 -left-5 w-14 h-14 -rotate-6 object-contain pointer-events-none drop-shadow-md z-10" />
                 <div className="pill-box bg-white border-[2px] border-[#111111] shadow-[2px_2px_0px_0px_#111111] rounded-full px-4 py-1.5 font-sans font-[700] text-[11px] text-[#111111] whitespace-nowrap">
                   🌿 100% paperless
                 </div>
                </div>
              </div>
              <div className="translate-x-[20px]" ref={(el) => { pillRefs.current[4] = el; }}>
                <div className="relative animate-pill-5 opacity-0">
                 <img src={imgGlasses} alt="" className="absolute -top-5 left-10 w-12 h-12 rotate-[15deg] object-contain pointer-events-none drop-shadow-md z-10" />
                 <div className="pill-box bg-white border-[2px] border-[#111111] shadow-[2px_2px_0px_0px_#111111] rounded-full px-4 py-1.5 font-sans font-[700] text-[11px] text-[#111111] whitespace-nowrap">
                   🔒 End-to-end encrypted
                 </div>
                </div>
              </div>
              <div className="-translate-x-[20px]" ref={(el) => { pillRefs.current[5] = el; }}>
                <div className="relative animate-pill-6 opacity-0">
                 <img src={imgCoin} alt="" className="absolute -bottom-5 -right-3 w-10 h-10 -rotate-12 object-contain pointer-events-none drop-shadow-md z-10" />
                 <div className="pill-box bg-white border-[2px] border-[#111111] shadow-[2px_2px_0px_0px_#111111] rounded-full px-4 py-1.5 font-sans font-[700] text-[11px] text-[#111111] whitespace-nowrap">
                   0 POS changes
                 </div>
                </div>
              </div>
              <div className="translate-x-[20px]" ref={(el) => { pillRefs.current[6] = el; }}>
                <div className="relative animate-pill-7 opacity-0">
                 <img src={imgSpark} alt="" className="absolute -top-5 -left-4 w-10 h-10 -rotate-[20deg] object-contain pointer-events-none drop-shadow-md z-10" />
                 <img src={imgConfetti} alt="" className="absolute -bottom-6 -right-6 w-12 h-12 rotate-[25deg] object-contain pointer-events-none drop-shadow-md z-10" />
                 <div className="pill-box bg-white border-[2px] border-[#111111] shadow-[2px_2px_0px_0px_#111111] rounded-full px-4 py-1.5 font-sans font-[700] text-[11px] text-[#111111] whitespace-nowrap">
                   📍 Made in Pakistan
                 </div>
                </div>
              </div>
          </div>
        </div>
      )}

      {/* RIGHT STRIP - SCROLL PROGRESS */}
      {trailEnabled && (
        <div 
          className="fixed right-0 top-0 h-screen hidden xl:flex justify-center pointer-events-none z-0 bg-[#22C55E] overflow-hidden"
          style={{ width: 'calc((100vw - 70.625rem) / 2)' }}
        >
          <div className="absolute w-full h-[100vh] flex items-center justify-center">
            <div 
              className="w-[100vh] flex items-center text-[#111111] font-mono uppercase leading-[0.8] font-black opacity-[0.12] whitespace-nowrap"
              style={{ transform: 'rotate(-90deg)', fontSize: 'calc(((100vw - 70.625rem) / 2) * 0.8)' }}
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
                style={{ transform: 'rotate(-90deg)', fontSize: 'calc(((100vw - 70.625rem) / 2) * 0.8)' }}
              >
                <div className="animate-marquee flex">
                  <span className="pr-4">PAKISTAN'S FIRST DIGITAL RECEIPT INFRASTRUCTURE &middot;&nbsp;PAKISTAN'S FIRST DIGITAL RECEIPT INFRASTRUCTURE &middot;&nbsp;</span>
                  <span className="pr-4">PAKISTAN'S FIRST DIGITAL RECEIPT INFRASTRUCTURE &middot;&nbsp;PAKISTAN'S FIRST DIGITAL RECEIPT INFRASTRUCTURE &middot;&nbsp;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar (Desktop only) */}
      <div className="fixed top-0 left-0 w-full h-2.5 z-[99999] hidden md:block pointer-events-none">
        <div ref={progressBarRef} className="h-full bg-[#4ADE80] border-b-[3px] border-black w-0 opacity-0 transition-none" />
      </div>
      
      {trailEnabled && <TrailCanvas />}
      <div className="max-w-[70.625rem] mx-auto border-x-4 border-black bg-[#FDFBEE] min-h-screen relative shadow-2xl">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#FDFBEE] border-b-4 border-black">
        <div className="max-w-[70.625rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 h-20 flex items-center justify-between">
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
            <button className="bg-[#4ADE80] border-2 border-black rounded-lg px-6 py-2.5 font-bold uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
              Book a Demo
            </button>
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
          <button className="mt-4 bg-[#4ADE80] border-2 border-black rounded-lg px-6 py-3 font-bold uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Book a Demo
          </button>
        </div>
      )}


      {/* Hero */}
      <section className="relative pt-10 pb-8 md:pt-16 md:pb-12 px-4 sm:px-6 md:px-8 lg:px-12 max-w-[70.625rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        <div>
          <div className="inline-block bg-[#4ADE80] border-2 border-black px-3 py-1 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-xs uppercase tracking-wider mb-8">
            Pakistan's First Digital Receipt Experience
          </div>
          <h1 className="font-syne text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-extrabold leading-[1] tracking-tight mb-8 relative z-10">
            Receipts,<br />
            <span className="text-[#4ADE80] relative inline-block">
              reimagined.
              <div className="absolute -bottom-1 sm:-bottom-3 -left-4 sm:-left-6 w-[105%] sm:w-[110%] h-3 sm:h-4 bg-[#FFF248] border-[3px] border-black rounded-full -rotate-2 -z-10 hover:skew-x-6 hover:-rotate-1 transition-all duration-300"></div>
            </span>
          </h1>
          <p className="text-lg font-medium text-gray-700 mb-10 max-w-lg leading-relaxed">
            No app. No POS changes. No workflow friction. One tap delivers a digital receipt to your customer in under two seconds.
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
            <button className="w-full sm:w-auto bg-[#4ADE80] text-black font-bold px-4 py-2.5 text-sm rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase text-sm tracking-wider">
              Book a Demo
            </button>
            <button className="w-full sm:w-auto bg-white text-black font-bold px-4 py-2.5 text-sm rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase text-sm tracking-wider">
              Request Integration
            </button>
          </div>
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
      <div className="w-full bg-black text-white py-2.5 sm:py-4 overflow-hidden border-y-4 border-black flex relative z-10">
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

      {/* The Problem with Paper */}
      <section ref={stickyContainerRef} className="relative w-full bg-[#FFF248] h-auto md:h-[400vh]">
        {/* Sticky viewport content container */}
        <div className="relative md:sticky top-0 h-auto md:h-screen w-full flex flex-col justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12">
          
          <div className="max-w-[70.625rem] mx-auto w-full">
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
      <section ref={howItWorksRef} className="py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#FFFDF7]">
        <div className="max-w-[70.625rem] mx-auto">
        <div className="flex justify-center mb-10">
          <Pill text="How It Works" colorClass="bg-[#4ADE80]" />
        </div>
        <h2 className="text-center font-syne text-3xl sm:text-4xl font-extrabold mb-12">Four steps.<br/>That's it.</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={getCardClasses(activeHowItWorks[0], 'bg-white', 'text-black')}>
            <div className="inline-block bg-white border-2 border-black text-black px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-6">
              Step 01
            </div>
            <h3 className="font-syne text-3xl font-extrabold mb-4">Purchase made.</h3>
            <p className="text-lg font-medium text-gray-800">Customer pays as usual — cash, card, JazzCash, Raast, or Easypaisa. The cashier presses Print exactly as always.</p>
          </div>

          <div className={getCardClasses(activeHowItWorks[1], 'bg-[#FFF9C4]', 'text-black')}>
            <div className="inline-block bg-white border-2 border-black text-black px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-6">
              Step 02
            </div>
            <h3 className="font-syne text-3xl font-extrabold mb-4">Intercepted instantly.</h3>
            <p className="text-lg font-medium text-gray-800">Our middleware reads the print job in parallel. The receipt prints on paper and triggers the digital version simultaneously.</p>
          </div>

          <div className={getCardClasses(activeHowItWorks[2], 'bg-[#DCFCE7]', 'text-black')}>
            <div className="inline-block bg-white border-2 border-black text-black px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-6">
              Step 03
            </div>
            <h3 className="font-syne text-3xl font-extrabold mb-4">Counter device fires.</h3>
            <p className="text-lg font-medium text-gray-800">The Android tablet displays a QR code and writes the receipt URL to NFC — completely offline at the counter.</p>
          </div>

          <div className={getCardClasses(activeHowItWorks[3], 'bg-[#22C55E]', 'text-[#111111]')}>
            <div className="inline-block bg-[#111111] border-2 border-black text-[#22C55E] px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-6">
              Step 04
            </div>
            <h3 className="font-syne text-3xl font-extrabold mb-4 text-[#111111]">Customer taps. Done.</h3>
            <p className="text-lg font-medium text-[#111111]">One tap opens the receipt in the browser. No app, no account, no friction. Searchable and stored forever.</p>
          </div>
        </div>
        </div>
      </section>

      {/* The Interaction */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#dcfce7] border-y-4 border-black">
        <div className="max-w-[70.625rem] mx-auto relative">
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
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#eef2ff]">
        <div className="max-w-[70.625rem] mx-auto">
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
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#FDFBEE]">
        <div className="max-w-[70.625rem] mx-auto">
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
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#FFF248]">
        <div className="max-w-[70.625rem] mx-auto">
        <div className="bg-white border-4 border-black rounded-[3rem] p-6 md:p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold">Built for everyone.</h2>
            <div className="flex bg-white border-4 border-black rounded-full p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <button 
                onClick={() => setActiveSegment('retailers')}
                className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-bold text-xs sm:text-sm uppercase transition-all duration-200 cursor-pointer ${
                  activeSegment === 'retailers' ? 'bg-[#4ADE80] text-black' : 'text-gray-600 hover:text-black'
                }`}
              >
                Retailers
              </button>
              <button 
                onClick={() => setActiveSegment('customers')}
                className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-bold text-xs sm:text-sm uppercase transition-all duration-200 cursor-pointer ${
                  activeSegment === 'customers' ? 'bg-[#4ADE80] text-black' : 'text-gray-600 hover:text-black'
                }`}
              >
                Customers
              </button>
            </div>
          </div>
          
          {activeSegment === 'retailers' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">
                <div className="text-[#4ADE80] mb-4"><Check size={32} /></div>
                <h3 className="font-syne text-2xl font-bold mb-3">Never Lost</h3>
                <p className="text-gray-700 font-medium mb-6">All your receipts are permanently archived and searchable.</p>
                <span className="font-bold border-b-2 border-black pb-1 hover:text-[#4ADE80] hover:border-[#4ADE80] transition-colors cursor-pointer">Learn more →</span>
              </div>
              <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">
                <div className="text-[#4ADE80] mb-4"><Check size={32} /></div>
                <h3 className="font-syne text-2xl font-bold mb-3">Easy Returns</h3>
                <p className="text-gray-700 font-medium mb-6">One-tap barcode access for seamless store returns.</p>
                <span className="font-bold border-b-2 border-black pb-1 hover:text-[#4ADE80] hover:border-[#4ADE80] transition-colors cursor-pointer">Learn more →</span>
              </div>
              <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">
                <div className="text-[#4ADE80] mb-4"><Check size={32} /></div>
                <h3 className="font-syne text-2xl font-bold mb-3 uppercase">EXPENSE TRACKING</h3>
                <p className="text-gray-700 font-medium mb-6">Auto-categorize your spending.</p>
                <span className="font-bold border-b-2 border-black pb-1 hover:text-[#4ADE80] hover:border-[#4ADE80] transition-colors cursor-pointer">Learn more →</span>
              </div>
              <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">
                <div className="text-[#4ADE80] mb-4"><Check size={32} /></div>
                <h3 className="font-syne text-2xl font-bold mb-3 uppercase">LOYALTY</h3>
                <p className="text-gray-700 font-medium mb-6">Integrated reward point tracking.</p>
                <span className="font-bold border-b-2 border-black pb-1 hover:text-[#4ADE80] hover:border-[#4ADE80] transition-colors cursor-pointer">Learn more →</span>
              </div>
            </div>
          )}
        </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#FDFBEE]">
        <div className="max-w-[70.625rem] mx-auto">
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
            <button className="w-full sm:w-auto bg-black text-white font-bold px-6 py-2.5 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(74,222,128,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(74,222,128,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase text-sm">
              Book a Demo
            </button>
            <button className="w-full sm:w-auto bg-white text-black font-bold px-6 py-2.5 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase text-sm">
              Request Integration
            </button>
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
              <input type="text" placeholder="City" className="w-full px-4 py-2.5 rounded-xl border-4 border-black font-bold outline-none focus:bg-[#dcfce7] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors text-sm" />
              <input type="text" placeholder="Daily Transactions" className="w-full px-4 py-2.5 rounded-xl border-4 border-black font-bold outline-none focus:bg-[#dcfce7] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors text-sm" />
              <button type="submit" className="w-full bg-[#4ADE80] text-black font-bold px-4 py-2.5 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase text-sm mt-4 flex items-center justify-center gap-2">
                Send <ArrowRight size={20} />
              </button>
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
