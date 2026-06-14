import { useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "gsap";
import useContainer from "../../pages/Home/useContainer";
import LineGameBg from "../../assets/images/LineGameBg.svg";

// Fun, high-contrast colour per countdown step (all pop against the pink bar).
const COUNTDOWN_COLORS: Record<string, string> = {
  "3": "#ffd60a", // yellow
  "2": "#ffffff", // white
  "1": "#3a86ff", // blue
  Go: "#06d6a0", // green
};

const Line = () => {
  const { countdown } = useContainer();
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const textColor = countdown !== null ? COUNTDOWN_COLORS[String(countdown)] : undefined;

  // Entrance: widen out from the center, smoothly.
  // gsap owns the full transform (resting xPercent/rotation) so it never clashes with
  // Tailwind transform utilities — the bar stays centered while scaleX grows.
  // fromTo (explicit end values) + context cleanup keeps React 18 StrictMode's double
  // effect invocation from capturing a mid-animation value and stopping halfway.
  useLayoutEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.set(el, { xPercent: -50, rotation: -10, transformOrigin: "center center" });
      gsap.fromTo(el, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.6, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, []);

  // Each countdown tick punches the text in.
  useEffect(() => {
    if (countdown === null || !textRef.current) return;
    gsap.fromTo(textRef.current, { scale: 1.6, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" });
  }, [countdown]);

  return (
    <div
      ref={barRef}
      className="fixed flex border-4 bg-pink border-white items-center justify-center w-auto px-3 h-[130%] -top-10  left-1/2  "
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url(${LineGameBg})`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          animation: "bg-slide-up 8s linear infinite",
        }}
      />
      <h1
        ref={textRef}
        style={textColor ? { color: textColor } : undefined}
        className="w-[1.5em] text-center text-8xl text-dark stroke-inherit stroke-text"
      >
        {countdown ?? "VS"}
      </h1>
    </div>
  );
};

export default Line;
