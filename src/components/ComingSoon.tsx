import { useState } from "react";
import { ArrowUpRight, Check, ScanLine, Sparkles, Waves } from "lucide-react";
import neobrutalistLogo from "../assets/images/taptile_logo_neobrutalist.png";
import chameleonThinking from "../assets/images/chameleon_thinking.png";
import chameleonWink from "../assets/images/trail_images/chameleon_wink.png";
import coin from "../assets/images/trail_images/coin.png";
import confetti from "../assets/images/trail_images/confetti.png";
import lightning from "../assets/images/trail_images/lighning_bolt.png";
import BrutalButton from "./BrutalButton";

const clues = [
  "It lives close to the moment you pay.",
  "It likes taps, scans, and very tidy pockets.",
  "It makes the little after-checkout moment much smarter.",
];

export default function ComingSoon() {
  const [clueIndex, setClueIndex] = useState(0);
  const [isClueVisible, setIsClueVisible] = useState(false);

  const revealClue = () => {
    setIsClueVisible(true);
    setClueIndex((current) => (current + 1) % clues.length);
  };

  return (
    <main className="coming-soon-page relative min-h-[100dvh] overflow-hidden bg-[#FDFBEE] text-[#111111] font-sans selection:bg-[#4ADE80] selection:text-black lg:h-[100dvh] lg:min-h-0">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(#111111_1px,transparent_1px),linear-gradient(90deg,#111111_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="pointer-events-none absolute -right-28 top-16 h-72 w-72 rounded-full border-[3px] border-black/10 sm:h-[28rem] sm:w-[28rem]" />
      <div className="pointer-events-none absolute -left-24 bottom-10 h-56 w-56 rounded-full border-[3px] border-black/10" />

      <header className="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8 sm:py-7 lg:absolute lg:inset-x-0 lg:top-0 lg:px-12 lg:py-4">
        <a href="#top" className="flex items-center gap-3" aria-label="TapTile home">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border-[3px] border-black bg-white shadow-[4px_4px_0_#111111] sm:h-12 sm:w-12">
            <img src={neobrutalistLogo} alt="" className="h-full w-full object-cover" />
          </span>
          <span className="font-syne text-xl font-extrabold tracking-tight sm:text-2xl">TapTile</span>
        </a>

        <div className="flex items-center gap-2 rounded-full border-2 border-black bg-[#FFF248] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] shadow-[3px_3px_0_#111111] sm:px-4 sm:text-xs">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full border-2 border-black bg-[#4ADE80]" />
          Coming soon
        </div>
      </header>

      <section id="top" className="coming-soon-hero relative z-10 mx-auto grid min-h-[calc(100dvh-92px)] w-full max-w-[1400px] items-center gap-12 px-5 pb-8 pt-5 sm:px-8 sm:pb-12 lg:h-full lg:min-h-0 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:overflow-hidden lg:px-12 lg:pb-16 lg:pt-20 xl:gap-14">
        <div className="relative max-w-2xl">
          <div className="secret-pill mb-5 inline-flex -rotate-2 items-center gap-2 rounded-full border-[3px] border-black bg-[#FFF248] px-4 py-2 text-xs font-black uppercase tracking-[0.15em] shadow-[5px_5px_0_#111111]">
            <Sparkles size={15} strokeWidth={2.5} className="secret-pill-icon text-[#22C55E]" />
            A small secret is loading
          </div>

          <h1 className="coming-soon-title font-syne text-[clamp(3.25rem,8vw,7.9rem)] font-extrabold leading-[0.86] tracking-[-0.07em] lg:text-[clamp(3.8rem,5.15vw,6.2rem)]">
            <span className="block whitespace-nowrap">The next</span>
            <span className="little-highlight relative block w-fit whitespace-nowrap text-[#22C55E] [text-shadow:3px_3px_0_#111111]">
              Little
              <span className="absolute -right-3 -top-7 text-[#FFF248] [text-shadow:2px_2px_0_#111111] sm:-right-5 sm:-top-10">
                <Sparkles size={26} fill="currentColor" strokeWidth={2.5} className="sm:h-9 sm:w-9" />
              </span>
            </span>
            <span className="block whitespace-nowrap">Thing After</span>
            <span className="block whitespace-nowrap">Checkout</span>
          </h1>

          <p className="coming-soon-copy mt-5 max-w-lg text-base font-semibold leading-relaxed text-black/70 sm:text-lg lg:max-w-md lg:text-base">
            We are building something that makes the moment after “thanks, have a nice day” feel a lot more useful. It is nearly ready to leave the lab.
          </p>

          <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <BrutalButton
              type="button"
              onClick={revealClue}
              className="flex items-center gap-3 rounded-xl border-[3px] border-black bg-[#4ADE80] px-5 py-3.5 text-sm font-black uppercase tracking-wide text-black sm:px-6"
              baseShadow="6px 6px 0px 0px rgba(0,0,0,1)"
            >
              {isClueVisible ? "Another clue" : "Give me a clue"}
              <ArrowUpRight size={19} strokeWidth={3} />
            </BrutalButton>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-black/50">No spoilers. Promise.</span>
          </div>

          <div className={`mt-4 flex min-h-14 max-w-md items-center gap-3 rounded-xl border-[3px] border-black bg-white px-4 py-3 shadow-[5px_5px_0_#111111] transition-all duration-300 ${isClueVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`} aria-live="polite">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[#FFF248] font-mono text-xs font-black">0{clueIndex + 1}</span>
            <p className="text-sm font-bold leading-snug">{clues[clueIndex]}</p>
          </div>
        </div>

        <div className="coming-soon-lab relative mx-auto w-full max-w-[560px] lg:justify-self-end">
          <div className="absolute -right-1 top-0 z-20 hidden w-32 -rotate-6 rounded-lg border-[3px] border-black bg-[#FFF248] px-3 py-2 text-center font-mono text-[10px] font-black uppercase leading-tight shadow-[5px_5px_0_#111111] sm:block lg:-right-5 lg:top-6">
            Something<br />is hiding here
          </div>

          <div className="relative rotate-[2deg] rounded-[2rem] border-[4px] border-black bg-[#4ADE80] p-3 shadow-[10px_10px_0_#111111] sm:p-5 lg:p-5">
            <div className="absolute -left-5 -top-8 w-20 -rotate-12 sm:-left-10 sm:-top-10 sm:w-28">
              <img src={confetti} alt="" className="w-full object-contain" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-20 rotate-12 sm:-bottom-12 sm:-right-12 sm:w-28">
              <img src={coin} alt="" className="w-full object-contain" />
            </div>

            <div className="relative overflow-hidden rounded-[1.25rem] border-[3px] border-black bg-white p-4 sm:p-6 lg:p-5">
              <div className="mb-6 flex items-start justify-between border-b-[3px] border-dashed border-black/20 pb-4">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-black/50">TapTile / secret lab</p>
                  <p className="mt-1 font-syne text-2xl font-extrabold tracking-tight sm:text-3xl">Almost ready.</p>
                </div>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-black bg-[#FFF248] shadow-[3px_3px_0_#111111]">
                  <ScanLine size={27} strokeWidth={2.5} />
                  <span className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full border-2 border-black bg-[#4ADE80]" />
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-end gap-4 sm:gap-6">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-black/50">Current status</p>
                  <p className="mt-1 font-syne text-3xl font-extrabold leading-none sm:text-5xl">Nearly<br /><span className="text-[#22C55E]">there</span>.</p>
                  <div className="mt-4 h-4 w-full max-w-[260px] overflow-hidden rounded-full border-[3px] border-black bg-[#FDFBEE] p-0.5">
                    <div className="h-full w-[78%] animate-progress rounded-full bg-[#22C55E]" />
                  </div>
                  <div className="mt-2 flex max-w-[260px] justify-between font-mono text-[9px] font-black uppercase tracking-wider text-black/45">
                    <span>Testing magic</span>
                    <span>78%</span>
                  </div>
                </div>
                <div className="relative h-32 w-28 shrink-0 sm:h-44 sm:w-36">
                  <img src={chameleonThinking} alt="A curious chameleon thinking about the secret launch" className="absolute inset-0 h-full w-full object-contain" />
                  <img src={chameleonWink} alt="" className="absolute -right-3 bottom-0 w-12 rotate-12 object-contain sm:-right-5 sm:w-16" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 border-t-[3px] border-dashed border-black/20 pt-4 sm:gap-3">
                <div className="rounded-lg border-2 border-black bg-[#dcfce7] p-2 text-center sm:p-3">
                  <Waves size={17} className="mx-auto mb-1" strokeWidth={2.5} />
                  <p className="font-mono text-[9px] font-black uppercase leading-tight">Less mess</p>
                </div>
                <div className="rounded-lg border-2 border-black bg-[#FFF248] p-2 text-center sm:p-3">
                  <ScanLine size={17} className="mx-auto mb-1" strokeWidth={2.5} />
                  <p className="font-mono text-[9px] font-black uppercase leading-tight">One tap</p>
                </div>
                <div className="rounded-lg border-2 border-black bg-[#f4f4f5] p-2 text-center sm:p-3">
                  <Check size={17} className="mx-auto mb-1" strokeWidth={3} />
                  <p className="font-mono text-[9px] font-black uppercase leading-tight">Good stuff</p>
                </div>
              </div>
            </div>
          </div>

          <img src={lightning} alt="" className="absolute -bottom-9 left-4 w-14 -rotate-12 object-contain sm:-bottom-12 sm:left-8 sm:w-20" />
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-5 pb-6 pt-2 font-mono text-[10px] font-black uppercase tracking-[0.13em] text-black/45 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:absolute lg:inset-x-0 lg:bottom-0 lg:px-12 lg:pb-4">
        <span>© 2026 TapTile / Pakistan</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#22C55E]" /> The counter is getting interesting</span>
      </footer>
    </main>
  );
}
