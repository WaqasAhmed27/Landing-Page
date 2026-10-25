import React, { useEffect, useRef, useState } from "react";
import { Check, Receipt, Plug, Repeat, Timer, LayoutDashboard, Sparkles, ShieldCheck, Undo2, Wallet, Gift, MapPin, type LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Audience = "retailer" | "customer";

type Feature = {
  label: string;
  // Wheel and stat-tile color while this feature is showing.
  color: string;
  dark?: boolean;
  icon: LucideIcon;
  stat: string;
  statCaption: string;
  title: string;
  description: string;
  points: string[];
};

const FEATURES: Record<Audience, Feature[]> = {
  retailer: [
    {
      label: "Paper costs",
      color: "#4ADE80",
      icon: Receipt,
      stat: "-85%",
      statCaption: "Monthly thermal roll & printer upkeep",
      title: "Thermal paper is burned capital.",
      description: "Every roll you buy ends up in the bin. Digital receipts cut the paper, and the printer repairs that come with it.",
      points: ["Up to 85% fewer thermal rolls", "Less printer maintenance", "No more rolls running out mid-sale"],
    },
    {
      label: "Keep your POS",
      color: "#FFFFFF",
      icon: Plug,
      stat: "0",
      statCaption: "POS changes needed",
      title: "Keep your POS. Keep your cashiers.",
      description: "TapTile connects to the setup you already run. Nothing to replace, nobody to retrain.",
      points: ["Connects directly to your existing setup", "Paper printing stays 100% operational if needed", "Works offline too"],
    },
    {
      label: "Repeat footfall",
      color: "#F97316",
      icon: Repeat,
      stat: "Repeat",
      statCaption: "Vouchers & reviews on every receipt",
      title: "Turn dead paper into repeat footfall.",
      description: "A paper receipt gets thrown away. A digital one gives the customer a reason to come back.",
      points: ["Personalized discounts and promotions", "Loyalty program and rewards", "A/B test your offers"],
    },
    {
      label: "2-second tap",
      color: "#EEF2FF",
      icon: Timer,
      stat: "<2s",
      statCaption: "From tap to receipt",
      title: "Under 2 seconds. No app. No forms. No lines.",
      description: "No asking for emails or phone numbers. Customers tap their phone and walk away, and the queue keeps moving.",
      points: ["Nothing for the customer to install", "No email or phone number asked", "Queues keep moving"],
    },
    {
      label: "Live dashboard",
      color: "#EF4444",
      icon: LayoutDashboard,
      stat: "Live",
      statCaption: "Every branch, every counter",
      title: "Your entire sales floor in your pocket.",
      description: "See what sells, when, and to whom, in real time.",
      points: ["Monitor transaction volume across branches", "Catch cashier void anomalies", "Customer clusters for targeted marketing"],
    },
    {
      label: "AI insights",
      color: "#111111", dark: true,
      icon: Sparkles,
      stat: "AI",
      statCaption: "Built into your dashboard",
      title: "AI that finds your next best bundle.",
      description: "TapTile's AI reads your real baskets and tells you what to pair, promote and cross-sell, in plain language.",
      points: ["Automatic bundle & cross-sell suggestions", "A clear reason behind every suggestion", "Expected lift shown before you act"],
    },
  ],
  customer: [
    {
      label: "Your data",
      color: "#F97316",
      icon: ShieldCheck,
      stat: "You",
      statCaption: "Decide what's saved, shared or deleted",
      title: "Your data, your control.",
      description: "Decide what to save, share or delete. Your receipts belong to you.",
      points: ["No app or account needed", "Save only what you want", "Delete whenever you like"],
    },
    {
      label: "Easy returns",
      color: "#4ADE80",
      icon: Undo2,
      stat: "1 tap",
      statCaption: "To pull up any receipt",
      title: "Easy returns & exchanges.",
      description: "No more arguments at the counter. Your receipt is on your phone, ready when you need it.",
      points: ["One-tap barcode access at the counter", "No digging through drawers or wallets", "Proof of purchase that never fades"],
    },
    {
      label: "Expense tracking",
      color: "#FFFFFF",
      icon: Wallet,
      stat: "Auto",
      statCaption: "Sorted by store and category",
      title: "Track. Manage. Never miss.",
      description: "Organize your expenses and stay on top of your spending.",
      points: ["Spending auto-categorized across stores", "Every receipt searchable from any device", "No manual entry, ever"],
    },
    {
      label: "Perks & rewards",
      color: "#EF4444",
      icon: Gift,
      stat: "Perks",
      statCaption: "From the stores you love",
      title: "Exclusive perks & rewards.",
      description: "Unlock offers and rewards from your favorite stores.",
      points: ["Points tracked automatically on every receipt", "Offers from your favorite stores", "Totally free for shoppers"],
    },
    {
      label: "Made in Pakistan",
      color: "#DCFCE7",
      icon: MapPin,
      stat: "PK",
      statCaption: "Built local, secured local",
      title: "Made in Pakistan, for Pakistan.",
      description: "Built by a local team for the way Pakistan shops.",
      points: ["Built local", "Secured local", "Supporting local"],
    },
  ],
};

const AUDIENCE_STYLE: Record<Audience, { intro: string }> = {
  retailer: { intro: "6 reasons smart merchants switch" },
  customer: { intro: "5 reasons to use TapTile. Totally free." },
};

// Degrees between neighbouring features on the wheel.
const STEP = 36;
// Scroll distance per feature, in viewport heights. Both audiences share the
// longest list's scroll length so the toggle never has to rebuild the pin.
const SCROLL_PER_FEATURE = 0.7;
const MAX_FEATURES = Math.max(FEATURES.retailer.length, FEATURES.customer.length);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const getFeatureLabelArc = (diameter: number) => {
  const center = diameter / 2;
  const radius = diameter * 0.34;
  const angle = (5 * Math.PI) / 6;
  const startX = center + radius * Math.cos(-angle);
  const startY = center + radius * Math.sin(-angle);
  const endX = center + radius * Math.cos(angle);
  const endY = center + radius * Math.sin(angle);
  return `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`;
};

const getFeatureLabelFontSize = (diameter: number, label: string) => {
  const preferredSize = Math.max(46.8, Math.min(81.2, diameter * 0.1124));
  const arcLength = diameter * 0.34 * (5 * Math.PI / 3);
  // Keep every label inside the visible right side of the wheel, with a clear gap at both ends.
  const maxTextLength = arcLength * 0.5;
  // JetBrains Mono is monospaced, with each character taking about 0.6em.
  const estimatedTextLength = label.length * preferredSize * 0.6;
  return estimatedTextLength > maxTextLength
    ? preferredSize * (maxTextLength / estimatedTextLength)
    : preferredSize;
};

// Maps scroll progress to a fractional feature index that rests on each
// feature for a while and turns in between, instead of turning linearly.
const progressToIndex = (progress: number, count: number) => {
  if (count < 2) return 0;
  const q = clamp01((progress - 0.05) / 0.9) * (count - 1);
  const i = Math.min(Math.floor(q), count - 2);
  const s = clamp01((q - i - 0.3) / 0.4);
  return i + s * s * (3 - 2 * s);
};

export default function FeatureWheel() {
  const [audience, setAudience] = useState<Audience>("retailer");
  const [active, setActive] = useState(0);
  // Phones get a wheel rising from the bottom edge (pointer at 12 o'clock);
  // wider screens get one on the left edge (pointer at 3 o'clock).
  const [fromBottom, setFromBottom] = useState(false);
  const [wheelSize, setWheelSize] = useState(560);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const rotateToRef = useRef<((value: number) => void) | null>(null);
  const countRef = useRef(FEATURES.retailer.length);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setFromBottom(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    const observer = new ResizeObserver(([entry]) => {
      setWheelSize(entry.contentRect.width);
    });
    observer.observe(wheel);
    return () => observer.disconnect();
  }, []);

  const features = FEATURES[audience];
  const count = features.length;
  const style = AUDIENCE_STYLE[audience];
  const feature = features[Math.min(active, count - 1)];
  const Icon = feature.icon;

  // Only the feature under the pointer is visible; neighbours fade in as they
  // turn into place.
  const syncLabels = () => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    const position = -Number(gsap.getProperty(wheel, "rotation")) / STEP;
    labelRefs.current.forEach((label, i) => {
      if (!label) return;
      const opacity = clamp01(1 - Math.abs(i - position) * 1.6);
      label.style.opacity = String(opacity);
      label.style.visibility = opacity < 0.05 ? "hidden" : "visible";
    });
  };

  useGSAP(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    rotateToRef.current = gsap.quickTo(wheel, "rotation", { duration: 0.6, ease: "power3.out", onUpdate: syncLabels });

    // The page's html/body overflow rules break CSS sticky, so pin with GSAP
    // like the platform scene does.
    triggerRef.current = ScrollTrigger.create({
      trigger: stageRef.current,
      pin: true,
      anticipatePin: 1,
      start: "top top",
      end: () => `+=${(MAX_FEATURES - 1) * SCROLL_PER_FEATURE * window.innerHeight}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const index = progressToIndex(self.progress, countRef.current);
        rotateToRef.current?.(-index * STEP);
        const rounded = Math.round(index);
        setActive((prev) => (prev === rounded ? prev : rounded));
      },
    });

    return () => {
      triggerRef.current = null;
      rotateToRef.current = null;
    };
  }, { scope: sectionRef });

  // Spin the wheel in when the audience changes.
  useEffect(() => {
    countRef.current = count;
    if (!wheelRef.current) return;
    const progress = triggerRef.current?.progress ?? 0;
    const target = -progressToIndex(progress, count) * STEP;
    gsap.fromTo(wheelRef.current, { rotation: target + 140 }, { rotation: target, duration: 0.9, ease: "back.out(1.4)", onUpdate: syncLabels });
  }, [audience]);

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current.querySelectorAll("[data-anim]"),
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power2.out", overwrite: true }
    );
  }, [active, audience]);

  const chooseAudience = (next: Audience) => {
    if (next === audience) return;
    const st = triggerRef.current;
    if (st && window.scrollY > st.start + 2) {
      window.scrollTo({ top: st.start, behavior: "smooth" });
    }
    setActive(0);
    setAudience(next);
  };

  // Angle (clockwise from 3 o'clock) where the pointer sits.
  const pointerAngle = fromBottom ? -90 : 0;
  return (
    <section
      id="features"
      ref={sectionRef}
      className="feature-wheel relative w-full bg-[#FFF248]"
    >
      <div ref={stageRef} className="relative h-screen h-dvh overflow-hidden flex flex-col md:justify-center px-4 sm:px-6 md:pr-8 lg:pr-12 md:pl-[calc(var(--d)/2+3rem)] lg:pl-[calc(var(--d)/2+4rem)] py-6 md:py-8">

        {/* Header + toggle */}
        <div className="order-1 shrink-0 md:max-w-2xl">
          <div className="hidden sm:inline-block bg-white border-2 border-black px-4 py-1.5 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-xs uppercase tracking-wider mb-4 md:mb-5">
            Features
          </div>
          <h2 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 md:mb-5">Built for everyone.</h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div role="group" aria-label="Show features for" className="inline-flex bg-white border-2 border-black rounded-full p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {(["retailer", "customer"] as Audience[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={audience === option}
                  onClick={() => chooseAudience(option)}
                  className={`rounded-full px-4 sm:px-5 py-2 font-bold uppercase text-xs sm:text-sm tracking-wider transition-colors cursor-pointer ${audience === option ? "bg-black text-white" : "text-black hover:bg-[#FDFBEE]"}`}
                >
                  For {option === "retailer" ? "Retailers" : "Customers"}
                </button>
              ))}
            </div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black/70">{style.intro}</span>
          </div>
        </div>

        {/* Wheel */}
        <div className="order-3 relative flex-1 min-h-0 -mx-4 sm:-mx-6 -mb-6 md:m-0 md:absolute md:inset-y-0 md:left-0 md:w-[calc(var(--d)/2+1rem)] pointer-events-none">
          <div className="absolute left-1/2 top-full md:left-0 md:top-1/2 w-[var(--d)] h-[var(--d)] -translate-x-1/2 -translate-y-1/2">
            {/* One solid color per feature; the rim ticks turn with it so it reads as a wheel. */}
            <div
              ref={wheelRef}
              className="absolute inset-0 rounded-full border-4 border-black shadow-[0_0_12px_4px_rgba(0,0,0,0.45)] transition-colors duration-500"
              style={{ backgroundColor: feature.color }}
            >
              <div
                className={`absolute inset-0 rounded-full transition-opacity duration-500 ${feature.dark ? "opacity-60" : "opacity-100"}`}
                style={{
                  background: `repeating-conic-gradient(${feature.dark ? "#FFFFFF" : "#111111"} 0deg 1.2deg, transparent 1.2deg 6deg)`,
                  WebkitMask: "radial-gradient(circle closest-side, transparent calc(100% - 22px), #000 calc(100% - 21px))",
                  mask: "radial-gradient(circle closest-side, transparent calc(100% - 22px), #000 calc(100% - 21px))",
                }}
              />
              <div className={`absolute inset-[22px] rounded-full border-2 ${feature.dark ? "border-white/60" : "border-black"}`} />
              {features.map((item, i) => (
                <div key={`${audience}-${item.label}`} className="absolute left-1/2 top-1/2 w-0 h-0" style={{ transform: `rotate(${pointerAngle + i * STEP}deg)` }}>
                  <span
                    ref={(el) => { labelRefs.current[i] = el; }}
                    aria-hidden={i !== active}
                    className="absolute left-0 top-0 block h-0 w-0"
                    style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
                  >
                    <svg
                      aria-hidden="true"
                      className="absolute left-[calc(var(--d)*-0.5)] top-[calc(var(--d)*-0.5)] h-[var(--d)] w-[var(--d)] overflow-visible"
                      viewBox={`0 0 ${wheelSize} ${wheelSize}`}
                    >
                      <defs>
                        <path id={`feature-label-arc-${audience}-${i}`} d={getFeatureLabelArc(wheelSize)} />
                      </defs>
                      <text
                        fill={item.dark ? "#FFFFFF" : "#111111"}
                        fontSize={getFeatureLabelFontSize(wheelSize, item.label.toUpperCase())}
                        fontWeight="900"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        <textPath href={`#feature-label-arc-${audience}-${i}`} startOffset="50%" textAnchor="middle">
                          {item.label.toUpperCase()}
                        </textPath>
                      </text>
                    </svg>
                  </span>
                </div>
              ))}
            </div>

            {/* Hub (does not rotate) */}
            <div className="absolute left-1/2 top-1/2 w-[calc(var(--d)*0.3)] h-[calc(var(--d)*0.3)] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-black transition-colors duration-500" style={{ backgroundColor: feature.color === "#4ADE80" ? "#FFFFFF" : "#4ADE80" }} />

            {/* Pointer: 12 o'clock on phones, 3 o'clock on wider screens */}
            <svg className="absolute left-1/2 -top-[14px] -translate-x-1/2 -rotate-90 md:top-1/2 md:left-[calc(100%-14px)] md:translate-x-0 md:-translate-y-1/2 md:rotate-0 w-9 h-9" viewBox="0 0 36 36" aria-hidden="true">
              <path d="M4 18 L32 4 L32 32 Z" fill="#FFF248" stroke="#111111" strokeWidth="4" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Feature panel */}
        <div ref={panelRef} aria-live="polite" className="order-2 shrink-0 mt-5 md:mt-8 md:max-w-2xl">
          <div className="bg-white border-4 border-black rounded-2xl p-4 sm:p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div data-anim className={`hidden md:flex items-center gap-4 mb-5 border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors duration-500 ${feature.dark ? "text-white" : ""}`} style={{ backgroundColor: feature.color }}>
              <span className="shrink-0 w-12 h-12 rounded-full bg-white text-black border-2 border-black flex items-center justify-center">
                <Icon size={24} strokeWidth={2.5} />
              </span>
              <div>
                <p className="font-syne text-3xl font-extrabold leading-none">{feature.stat}</p>
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider mt-1.5">{feature.statCaption}</p>
              </div>
            </div>
            <div>
              <p data-anim className="font-mono text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 sm:mb-3">
                {audience === "retailer" ? "For retailers" : "For customers"} · {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </p>
              <h3 data-anim className="font-syne text-xl sm:text-2xl xl:text-3xl font-extrabold leading-tight mb-2 sm:mb-3">{feature.title}</h3>
              <p data-anim className="text-sm sm:text-base font-medium text-gray-700 mb-3 sm:mb-5">{feature.description}</p>
              <ul data-anim className="space-y-2 sm:space-y-3 [@media(max-height:720px)_and_(max-width:767px)]:hidden [@media(max-height:640px)]:hidden">
                {feature.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#4ADE80] border-2 border-black flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-sm sm:text-base font-medium text-gray-800">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className={`mt-4 font-mono text-[11px] font-bold uppercase tracking-wider text-black/60 transition-opacity duration-300 ${active === 0 ? "opacity-100" : "opacity-0"}`}>
            Scroll to turn the wheel ↓
          </p>
        </div>
      </div>
    </section>
  );
}
