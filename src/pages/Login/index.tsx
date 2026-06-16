import { useLayoutEffect, useMemo, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Navigate } from "react-router-dom";
import { gsap } from "gsap";
import useAuth from "../../hooks/useAuth";
import Background from "../../components/Background/Background";

const EMBER_COUNT = 22;

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const rootRef = useRef<HTMLDivElement>(null);

  // Pre-computed ember spawn data so positions stay stable across renders.
  const embers = useMemo(
    () =>
      Array.from({ length: EMBER_COUNT }, () => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 7,
        drift: (Math.random() - 0.5) * 80,
      })),
    []
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Scoped + reverted on unmount → safe under React 18 StrictMode.
    const ctx = gsap.context(() => {
      // Embers drift upward and fade, then loop from the bottom.
      gsap.utils.toArray<HTMLElement>(".ember").forEach((el) => {
        const drift = Number(el.dataset.drift);
        const dur = Number(el.dataset.duration);
        const delay = Number(el.dataset.delay);
        gsap.fromTo(
          el,
          { y: 0, x: 0, opacity: 0 },
          {
            y: -window.innerHeight * 0.85,
            x: drift,
            opacity: 0,
            duration: dur,
            delay,
            ease: "none",
            repeat: -1,
            keyframes: { opacity: [0, 0.9, 0.9, 0] },
          }
        );
      });

      // Cinematic entrance — slow, weighty, AAA-menu pacing.
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".scene-vignette", { opacity: 0, duration: 1 })
        .from(".god-ray", { opacity: 0, scale: 0.6, duration: 1.4 }, "<")
        .from(".emblem", { opacity: 0, scale: 0.4, y: -20, duration: 0.8, ease: "back.out(1.7)" }, "-=0.8")
        .from(".title-letter", { opacity: 0, yPercent: 60, filter: "blur(8px)", duration: 0.7, stagger: 0.06 }, "-=0.4")
        .from(".subtitle", { opacity: 0, y: 14, duration: 0.6 }, "-=0.3")
        .from(".divider", { scaleX: 0, opacity: 0, duration: 0.7, ease: "power2.inOut" }, "-=0.4")
        .from(".cta", { opacity: 0, y: 22, duration: 0.6 }, "-=0.3")
        .from(".footer-note", { opacity: 0, duration: 0.6 }, "-=0.3")
        .from(".panel-corner", { opacity: 0, scale: 0, duration: 0.5, stagger: 0.06, ease: "back.out(2)" }, "-=0.6");

      // ---- Perpetual idle motion (kicks in after the entrance) ----

      // Emblem keeps a soft living pulse.
      gsap.to(".emblem-glow", { opacity: 0.85, scale: 1.12, duration: 2.2, ease: "sine.inOut", repeat: -1, yoyo: true });

      // Whole panel breathes up and down.
      gsap.to(".panel", { y: -8, duration: 3, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1 });

      // Title letters ripple in a gentle wave.
      gsap.to(".title-letter", {
        y: -6,
        duration: 1.1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.08, from: "center", repeat: -1, yoyo: true },
        delay: 1.2,
      });

      // Radar pings expand and fade out from the emblem on a stagger.
      gsap.set(".ping", { scale: 0.7, opacity: 0 });
      gsap.to(".ping", {
        scale: 1.7,
        opacity: 0,
        duration: 2.6,
        ease: "power1.out",
        repeat: -1,
        stagger: 1.3,
        keyframes: { opacity: [0, 0.7, 0] },
      });

      // Lightning bolt crackles: a quick charge-flash every few seconds.
      gsap.set(".bolt", { transformOrigin: "50% 50%" });
      gsap
        .timeline({ repeat: -1, repeatDelay: 2.4, delay: 1.5 })
        .to(".bolt", { scale: 1.18, rotation: -4, duration: 0.08, ease: "power2.out" })
        .to(".bolt", { scale: 0.96, rotation: 3, duration: 0.08 })
        .to(".bolt", { scale: 1, rotation: 0, duration: 0.2, ease: "back.out(3)" });

      // Divider gem slowly spins and pulses.
      gsap.set(".divider-gem", { rotation: 45 });
      gsap.to(".divider-gem", { rotation: 405, duration: 8, ease: "none", repeat: -1 });
      gsap.to(".divider-gem", { scale: 1.45, duration: 1.4, ease: "sine.inOut", repeat: -1, yoyo: true });

      // Corner brackets glow-pulse together.
      gsap.to(".panel-corner", { opacity: 0.45, duration: 1.6, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.4 });

      // CTA frame keeps an inviting glow.
      gsap.to(".cta-frame", {
        boxShadow: "0 0 22px 2px rgba(255,0,110,0.55)",
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.5,
      });

      // A light streak sweeps across the panel on an interval.
      gsap.fromTo(
        ".panel-sheen",
        { xPercent: 0 },
        { xPercent: 520, duration: 1.2, ease: "power2.in", repeat: -1, repeatDelay: 3.5, delay: 2 }
      );

      // Subtle cursor parallax on the backdrop layers for depth.
      const ray = gsap.quickTo(".god-ray", "x", { duration: 1, ease: "power3" });
      const rayY = gsap.quickTo(".god-ray", "y", { duration: 1, ease: "power3" });
      const panel = gsap.quickTo(".panel", "rotationY", { duration: 0.8, ease: "power3" });
      const panelX = gsap.quickTo(".panel", "rotationX", { duration: 0.8, ease: "power3" });
      const onMove = (e: MouseEvent) => {
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        ray(dx * -50);
        rayY(dy * -50);
        panel(dx * 6);
        panelX(dy * -6);
      };
      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    }, root);

    return () => ctx.revert();
  }, []);

  // Already signed in — skip the login screen.
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div ref={rootRef} className="relative h-full w-full overflow-hidden">
      {/* Shared app background (Sparkle particles) at the very back */}
      <div className="absolute inset-0">
        <Background />
      </div>

      {/* Soft pastel wash on top — keeps the look while letting sparkles twinkle through */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 22%, rgba(131,56,236,0.34), transparent 60%)," + // purple, soft
            "radial-gradient(circle at 84% 24%, rgba(58,134,255,0.30), transparent 60%)," + // blue, soft
            "radial-gradient(circle at 46% 82%, rgba(255,190,11,0.34), transparent 55%)," + // yellow, soft
            "radial-gradient(circle at 78% 76%, rgba(255,0,110,0.32), transparent 60%)," + // pink, soft
            "linear-gradient(135deg, #fbf3ff 0%, #fbeff6 50%, #fff7ea 100%)", // soft light base (no dark)
          opacity: 0.82,
        }}
      />

      {/* Rotating god-ray glow behind the panel (pink / purple / blue / yellow) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="god-ray h-[860px] w-[860px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(255,0,110,0.30), rgba(131,56,236,0.28), rgba(58,134,255,0.28), rgba(255,190,11,0.28), rgba(255,0,110,0.30))",
            animation: "ray-spin 28s linear infinite",
          }}
        />
      </div>

      {/* Breathing haze + cinematic vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.12), transparent 62%)", animation: "haze-breathe 9s ease-in-out infinite" }}
      />
      <div
        className="scene-vignette pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 45%, transparent 60%, rgba(255,126,103,0.12) 100%)" }}
      />

      {/* Rising embers */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0">
        {embers.map((e, i) => (
          <span
            key={i}
            className="ember absolute bottom-0 rounded-full"
            data-drift={e.drift}
            data-duration={e.duration}
            data-delay={e.delay}
            style={{
              left: `${e.left}%`,
              height: e.size,
              width: e.size,
              background: "#ffcf6b",
              boxShadow: "0 0 8px 2px rgba(255,176,59,0.7)",
            }}
          />
        ))}
      </div>

      {/* Center stage */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-4" style={{ perspective: 1200 }}>
        <div className="panel relative w-[420px] max-w-full" style={{ transformStyle: "preserve-3d" }}>
          {/* Ornate gradient frame */}
          <div
            className="absolute -inset-[2px] rounded-2xl opacity-90"
            style={{ background: "linear-gradient(160deg, #c9a227, rgba(201,162,39,0.15) 30%, rgba(255,0,110,0.35) 70%, #8338ec)" }}
          />
          {/* Panel body */}
          <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0a0f20]/90 px-9 pb-9 pt-12 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
            {/* Light streak that periodically sweeps across the panel */}
            <div
              className="panel-sheen pointer-events-none absolute -inset-y-10 -left-1/3 w-1/3 skew-x-12"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }}
            />
            {/* Corner brackets */}
            <span className="panel-corner absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-[#c9a227]/80" />
            <span className="panel-corner absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-[#c9a227]/80" />
            <span className="panel-corner absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-[#c9a227]/80" />
            <span className="panel-corner absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-[#c9a227]/80" />

            <div className="flex flex-col items-center text-center">
              {/* Emblem */}
              <div className="emblem relative mb-6 flex h-24 w-24 items-center justify-center">
                <div
                  className="emblem-glow absolute inset-0 rounded-full opacity-60 blur-xl"
                  style={{ background: "radial-gradient(circle, #ff006e, transparent 70%)" }}
                />
                {/* Radar-style ping rings that expand outward */}
                <span className="ping absolute h-24 w-24 rounded-full border border-[#ff006e]/60" />
                <span className="ping absolute h-24 w-24 rounded-full border border-[#c9a227]/60" />
                <div
                  className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#c9a227]/70"
                  style={{ background: "radial-gradient(circle at 50% 35%, #1c2b4a, #0a0f20)" }}
                >
                  <svg viewBox="0 0 24 24" className="bolt h-12 w-12" aria-hidden>
                    <defs>
                      <linearGradient id="bolt" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffe39a" />
                        <stop offset="55%" stopColor="#c9a227" />
                        <stop offset="100%" stopColor="#ff006e" />
                      </linearGradient>
                    </defs>
                    <path d="M13 2 L4.5 13 H11 L9 22 L19.5 9 H13 Z" fill="url(#bolt)" stroke="#fff3d6" strokeWidth="0.5" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h1 className="flex text-5xl leading-none tracking-[0.04em]">
                {"SKYDUEL".split("").map((ch, i) => (
                  <span
                    key={i}
                    className="title-letter"
                    style={{
                      backgroundImage:
                        i < 3
                          ? "linear-gradient(180deg,#ff5ea0,#ff006e)"
                          : "linear-gradient(180deg,#fff,#c9a227)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))",
                    }}
                  >
                    {ch}
                  </span>
                ))}
              </h1>
              <p className="subtitle mt-2 text-sm uppercase tracking-[0.45em] text-[#c9a227]/90">Enter the Arena</p>

              {/* Divider with diamond ornament */}
              <div className="divider my-7 flex w-full items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a227]/60" />
                <span className="divider-gem h-2 w-2 bg-[#c9a227]" />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9a227]/60" />
              </div>

              {/* Sign-in CTA. Google's iframe button can't be deeply themed, so we
                  frame it to read as a premium menu action and tune its props. */}
              <div className="cta flex flex-col items-center gap-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Sign in to continue</p>
                <div className="cta-frame rounded-md p-[2px]" style={{ background: "linear-gradient(120deg,#c9a227,#ff006e,#8338ec)" }}>
                  <div className="rounded-[5px] bg-[#0a0f20] p-1 transition-transform duration-300 ease-bounce hover:scale-[1.04]">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        if (credentialResponse.credential) login(credentialResponse.credential);
                      }}
                      onError={() => {
                        console.error("Google login failed");
                      }}
                      theme="filled_black"
                      shape="rectangular"
                      size="large"
                      text="continue_with"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="footer-note absolute bottom-6 left-0 right-0 text-center text-[11px] uppercase tracking-[0.35em] text-dark/45">
          Pick your fighter · Challenge a friend · Claim victory
        </p>
      </div>
    </div>
  );
};

export default Login;
