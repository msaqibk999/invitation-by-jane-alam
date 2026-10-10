import { useEffect, useRef, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { wedding } from "../data/wedding";

/* -------------------------------------------------------
 * SVG heart (viewBox 0 0 100 100)
 * ----------------------------------------------------- */

const HEART_PATH = `
  M50 96
  C50 96 6 70 6 36
  C6 18 20 6 32 6
  C42 6 48 14 50 24
  C52 14 58 6 68 6
  C80 6 94 18 94 36
  C94 70 50 96 50 96
  Z
`;

/* -------------------------------------------------------
 * Canvas heart: same shape as HEART_PATH, scaled to w x h
 * Used for BOTH drawing the scratch layer and building the
 * reveal mask, so they can never drift apart.
 * ----------------------------------------------------- */

function buildHeartPath(w: number, h: number) {
  const p = new Path2D();
  p.moveTo(w * 0.5, h * 0.96);
  p.bezierCurveTo(w * 0.5, h * 0.96, w * 0.06, h * 0.7, w * 0.06, h * 0.36);
  p.bezierCurveTo(w * 0.06, h * 0.18, w * 0.2, h * 0.06, w * 0.32, h * 0.06);
  p.bezierCurveTo(w * 0.42, h * 0.06, w * 0.48, h * 0.14, w * 0.5, h * 0.24);
  p.bezierCurveTo(w * 0.52, h * 0.14, w * 0.58, h * 0.06, w * 0.68, h * 0.06);
  p.bezierCurveTo(w * 0.8, h * 0.06, w * 0.94, h * 0.18, w * 0.94, h * 0.36);
  p.bezierCurveTo(w * 0.94, h * 0.7, w * 0.5, h * 0.96, w * 0.5, h * 0.96);
  p.closePath();
  return p;
}

function drawScratchLayer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.clearRect(0, 0, width, height);

  const heartPath = buildHeartPath(width, height);

  ctx.save();
  ctx.clip(heartPath);

  // Scratch card gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#e4cec6");
  gradient.addColorStop(0.45, "#f5e8e3");
  gradient.addColorStop(1, "#d3b5aa");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Texture dots
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  for (let x = 0; x < width; x += 12) {
    for (let y = 0; y < height; y += 12) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Instruction text (scales with heart size, 3 lines, higher contrast)
  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));

  const big = clamp(width * 0.15, 40, 72);
  const small = clamp(width * 0.095, 26, 44);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(110,40,55,0.95)";
  ctx.shadowColor = "rgba(255,255,255,0.7)";
  ctx.shadowBlur = 4;

  ctx.font = `italic 700 ${big}px Georgia, serif`;
  ctx.fillText("Scratch", width / 2, height * 0.38);

  ctx.font = `italic 600 ${small}px Georgia, serif`;
  ctx.fillText("to reveal", width / 2, height * 0.38 + big * 0.85);
  ctx.fillText(
    "our date",
    width / 2,
    height * 0.38 + big * 0.85 + small * 1.25
  );

  ctx.shadowBlur = 0;

  ctx.restore();

  // Heart border
  ctx.save();
  ctx.strokeStyle = "rgba(125,71,54,0.75)";
  ctx.lineWidth = 2;
  ctx.stroke(heartPath);
  ctx.restore();
}

/* -------------------------------------------------------
 * Glitter
 * ----------------------------------------------------- */

type Particle = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  color: string;
  star: boolean;
};

const GLITTER_COLORS = [
  "#f6d98b",
  "#e8b84a",
  "#fff3c4",
  "#f2c6c2",
  "#ffffff",
  "#d9a441",
];
const STAR_CLIP =
  "polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)";

function makeGlitter(count = 220): Particle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    size: 4 + Math.random() * 11,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 4,
    drift: (Math.random() - 0.5) * 120,
    color: GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)],
    star: Math.random() > 0.45,
  }));
}

/* -------------------------------------------------------
 * Constants
 * ----------------------------------------------------- */

/* Burst: sparkles shooting outward from the heart centre */
type BurstPiece = {
  id: number;
  dx: number;
  dy: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
};

function makeBurst(count = 48): BurstPiece[] {
  return Array.from({ length: count }, (_, id) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 190;
    return {
      id,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      size: 8 + Math.random() * 14,
      delay: Math.random() * 0.5,
      duration: 1.1 + Math.random() * 0.9,
      color: GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)],
    };
  });
}

/* Twinkles: stars that pop in and out on the heart */
type Twinkle = {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
};

function makeTwinkles(count = 30): Twinkle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: 8 + Math.random() * 84,
    top: 8 + Math.random() * 78,
    size: 10 + Math.random() * 18,
    delay: Math.random() * 3,
    duration: 0.9 + Math.random() * 1.1,
    color: GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)],
  }));
}

const SAMPLE = 60; // low-res grid used to measure how much is scratched
const REVEAL_THRESHOLD = 0.6; // fraction of the heart that must be scratched
const BRUSH_RADIUS = 25;
const CHECK_INTERVAL_MS = 120;

/* -------------------------------------------------------
 * Component
 * ----------------------------------------------------- */

export function InvitationCard({ onReveal }: { onReveal: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [revealed, setRevealed] = useState(false);
  const [glitter, setGlitter] = useState<Particle[]>([]);
  const [burst, setBurst] = useState<BurstPiece[]>([]);
  const [twinkles, setTwinkles] = useState<Twinkle[]>([]);

  // Refs instead of state: no re-render on every pointer move
  const scratchingRef = useRef(false);
  const revealedRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const sampleRef = useRef<HTMLCanvasElement | null>(null);
  const maskRef = useRef<{ mask: Uint8Array; count: number } | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const lastCheckRef = useRef(0);
  const hideTimerRef = useRef<number | null>(null);
  const glitterTimerRef = useRef<number | null>(null);

  /* -----------------------------------------------------
   * Google Calendar
   * --------------------------------------------------- */

  const save = () => {
    const start = "20261231T103000";
    const end = "20261231T130000";

    const text = encodeURIComponent(
      `${wedding.groom.name} & ${wedding.bride.name} Wedding`
    );
    const location = encodeURIComponent(
      `${wedding.venue.name}, ${wedding.venue.address}`
    );

    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&location=${location}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* -----------------------------------------------------
   * Canvas setup
   *  - sized from the container via ResizeObserver
   *  - NO inline canvas.style.width/height (CSS controls it),
   *    which is what caused the overflow / white space on iOS
   *  - only redraws when the size really changes, so iOS
   *    toolbar show/hide does not wipe the user's scratching
   * --------------------------------------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // One reusable sample canvas + a precomputed heart mask
    const sample = document.createElement("canvas");
    sample.width = SAMPLE;
    sample.height = SAMPLE;
    sampleRef.current = sample;

    const sctx = sample.getContext("2d", { willReadFrequently: true });
    if (!sctx) return;

    sctx.fill(buildHeartPath(SAMPLE, SAMPLE));
    const data = sctx.getImageData(0, 0, SAMPLE, SAMPLE).data;
    const mask = new Uint8Array(SAMPLE * SAMPLE);
    let count = 0;
    for (let i = 0; i < mask.length; i++) {
      if (data[i * 4 + 3] > 128) {
        mask[i] = 1;
        count++;
      }
    }
    maskRef.current = { mask, count };

    const setup = () => {
      if (revealedRef.current) return;

      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;

      // Ignore sub-pixel / unchanged sizes
      if (
        Math.abs(w - sizeRef.current.w) < 1 &&
        Math.abs(h - sizeRef.current.h) < 1
      ) {
        return;
      }
      sizeRef.current = { w, h };

      // Cap DPR: iOS has a hard canvas memory limit
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      drawScratchLayer(ctx, w, h);
    };

    setup();

    const ro = new ResizeObserver(setup);
    ro.observe(container);

    return () => {
      ro.disconnect();
      sizeRef.current = { w: 0, h: 0 };
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      if (glitterTimerRef.current) {
        window.clearTimeout(glitterTimerRef.current);
        glitterTimerRef.current = null;
      }
    };
  }, []);

  /* -----------------------------------------------------
   * Reveal check (throttled, reuses one sample canvas)
   * --------------------------------------------------- */

  const checkReveal = (canvas: HTMLCanvasElement) => {
    const now = performance.now();
    if (now - lastCheckRef.current < CHECK_INTERVAL_MS) return;
    lastCheckRef.current = now;

    const sample = sampleRef.current;
    const m = maskRef.current;
    if (!sample || !m || !m.count) return;

    const sctx = sample.getContext("2d", { willReadFrequently: true });
    if (!sctx) return;

    sctx.clearRect(0, 0, SAMPLE, SAMPLE);
    sctx.drawImage(canvas, 0, 0, SAMPLE, SAMPLE);
    const px = sctx.getImageData(0, 0, SAMPLE, SAMPLE).data;

    let scratched = 0;
    for (let i = 0; i < m.mask.length; i++) {
      // Only count pixels that are INSIDE the heart
      if (m.mask[i] && px[i * 4 + 3] < 50) scratched++;
    }

    if (scratched / m.count >= REVEAL_THRESHOLD) {
      revealedRef.current = true;
      scratchingRef.current = false;
      setRevealed(true);

      // Glitter falling from top to bottom
      setGlitter(makeGlitter());
      setBurst(makeBurst());
      setTwinkles(makeTwinkles());
      glitterTimerRef.current = window.setTimeout(() => {
        setGlitter([]);
        setBurst([]);
        setTwinkles([]);
      }, 12000);

      canvas.style.transition = "opacity 1s ease";
      canvas.style.opacity = "0";
      canvas.style.pointerEvents = "none";

      hideTimerRef.current = window.setTimeout(() => {
        canvas.style.display = "none";
      }, 1000);

      // Unlock the next section immediately
      onReveal();

      // Wait 1 second, then smoothly scroll upward
      window.setTimeout(() => {
        if (!sectionRef.current) return;

        const targetY =
          sectionRef.current.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
      }, 1000);
    }
  };

  /* -----------------------------------------------------
   * Scratch (draws a smooth line from the last point)
   * --------------------------------------------------- */

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || revealedRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const last = lastPointRef.current;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = BRUSH_RADIUS * 2;

    if (last) {
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPointRef.current = { x, y };
    checkReveal(canvas);
  };

  /* -----------------------------------------------------
   * Pointer events (mouse + touch + pen in one API)
   * --------------------------------------------------- */

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    scratchingRef.current = true;
    lastPointRef.current = null;
    e.currentTarget.setPointerCapture(e.pointerId);
    scratch(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!scratchingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const onPointerUp = () => {
    scratchingRef.current = false;
    lastPointRef.current = null;
  };

  /* =====================================================
   * UI
   * =================================================== */

  return (
    <section
      className="py-16 md:py-20 px-6 cream-bg text-center overflow-x-clip"
      ref={sectionRef}
    >
      <style>{`
        .glitter-piece {
          position: absolute;
          top: 0;
          display: block;
          opacity: 0;
          animation-name: glitter-fall;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          will-change: transform, opacity;
        }
        .glitter-piece > i {
          display: block;
          animation: glitter-twinkle 0.9s ease-in-out infinite alternate;
        }
        @keyframes glitter-fall {
          0%   { transform: translate3d(0, -20px, 0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translate3d(var(--drift), var(--fall), 0) rotate(360deg); opacity: 0; }
        }
        @keyframes glitter-twinkle {
          from { transform: scale(0.4); opacity: 0.5; }
          to   { transform: scale(1.1); opacity: 1; }
        }
        .sparkle {
          position: absolute;
          display: block;
          pointer-events: none;
        }
        .sparkle-burst {
          left: 50%;
          top: 45%;
          opacity: 0;
          animation-name: sparkle-burst;
          animation-timing-function: cubic-bezier(0.15, 0.7, 0.3, 1);
          animation-fill-mode: forwards;
        }
        .sparkle-twinkle {
          opacity: 0;
          animation-name: sparkle-pop;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes sparkle-burst {
          0%   { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1) rotate(180deg); opacity: 0; }
        }
        @keyframes sparkle-pop {
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
          50%      { transform: scale(1) rotate(45deg); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .glitter-layer, .sparkle { display: none; }
        }
      `}</style>

      {glitter.length > 0 && (
        <div
          aria-hidden="true"
          className="glitter-layer fixed inset-0 z-50 pointer-events-none overflow-hidden"
          style={{ ["--fall" as string]: `${window.innerHeight + 40}px` }}
        >
          {glitter.map((p) => (
            <span
              key={p.id}
              className="glitter-piece"
              style={{
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                filter: `drop-shadow(0 0 3px ${p.color})`,
                ["--drift" as string]: `${p.drift}px`,
              }}
            >
              <i
                style={{
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  borderRadius: p.star ? 0 : "50%",
                  clipPath: p.star ? STAR_CLIP : undefined,
                  animationDelay: `${p.delay}s`,
                }}
              />
            </span>
          ))}
        </div>
      )}

      <h2 className="font-calligraphy text-4xl md:text-8xl text-[var(--primary)] break-words">
        Our forever begins
      </h2>

      {/* Heart: responsive via aspect-ratio, never wider than the screen */}
      <div
        ref={containerRef}
        className="mx-auto mt-10 relative w-full max-w-[580px] aspect-[580/500]"
      >
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full z-10"
          preserveAspectRatio="none"
        >
          <defs>
            <clipPath id="heartClip">
              <path d={HEART_PATH} />
            </clipPath>

            <radialGradient
              id="heartBackground"
              cx="50%"
              cy="45%"
              r="70%"
            >
              <stop offset="0%" stopColor="#fffaf8" />
              <stop offset="65%" stopColor="#f4e5df" />
              <stop offset="100%" stopColor="#dfc5bb" />
            </radialGradient>
          </defs>

          {/* Heart background */}
          <path d={HEART_PATH} fill="url(#heartBackground)" />

          {/* Content inside heart */}
          <g clipPath="url(#heartClip)">
            <text
              x="50"
              y="35"
              textAnchor="middle"
              fill="#8d533f"
              fontSize="3.5"
              letterSpacing="0.8"
            >
              YOU'RE INVITED
            </text>

            <text
              x="50"
              y="46"
              textAnchor="middle"
              fill="#914652"
              fontSize="7"
              fontWeight="600"
              fontFamily="Georgia, serif"
            >
              {wedding.groom.name}
            </text>

            <text
              x="50"
              y="53"
              textAnchor="middle"
              fill="#914652"
              fontSize="4.5"
              fontFamily="Georgia, serif"
              fontStyle="italic"
            >
              &
            </text>

            <text
              x="50"
              y="61"
              textAnchor="middle"
              fill="#914652"
              fontSize="7"
              fontWeight="600"
              fontFamily="Georgia, serif"
            >
              {wedding.bride.name}
            </text>

            <line
              x1="35"
              y1="66"
              x2="65"
              y2="66"
              stroke="#8d533f"
              strokeWidth="0.5"
              opacity="0.6"
            />

            <text
              x="50"
              y="73"
              textAnchor="middle"
              fill="#6f4035"
              fontSize="5.5"
              fontWeight="bold"
              fontFamily="Georgia, serif"
            >
              {wedding.date}
            </text>

            <text
              x="50"
              y="79"
              textAnchor="middle"
              fill="#8d533f"
              fontSize="3.5"
              fontFamily="Georgia, serif"
            >
              {wedding.time}
            </text>
          </g>

          {/* Heart border */}
          <path
            d={HEART_PATH}
            fill="none"
            stroke="hsl(15, 40%, 40%)"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
            opacity="0.75"
          />
        </svg>

        {/* Scratch canvas: sized purely by CSS, bitmap size set in effect */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-20 cursor-pointer touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />

        {/* Sparkles over the heart after reveal */}
        {burst.map((b) => (
          <span
            key={`b${b.id}`}
            aria-hidden="true"
            className="sparkle sparkle-burst z-30"
            style={{
              width: b.size,
              height: b.size,
              background: b.color,
              clipPath: STAR_CLIP,
              filter: `drop-shadow(0 0 4px ${b.color})`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
              ["--dx" as string]: `${b.dx}px`,
              ["--dy" as string]: `${b.dy}px`,
            }}
          />
        ))}

        {twinkles.map((t) => (
          <span
            key={`t${t.id}`}
            aria-hidden="true"
            className="sparkle sparkle-twinkle z-30"
            style={{
              left: `${t.left}%`,
              top: `${t.top}%`,
              width: t.size,
              height: t.size,
              background: t.color,
              clipPath: STAR_CLIP,
              filter: `drop-shadow(0 0 4px ${t.color})`,
              animationDelay: `${t.delay}s`,
              animationDuration: `${t.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Message after scratch */}
      <div
        className={`mt-7 transition-all duration-1000 ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p className="font-calligraphy text-6xl text-[#914652] mt-8">
          Our Special Day ❤️
        </p>
      </div>

      {/* Calendar button */}
      <button
        onClick={save}
        disabled={!revealed}
        className={`
          mt-12
          inline-flex
          items-center
          gap-2
          rounded-full
          px-12
          py-6
          text-xs
          md:text-3xl
          font-semibold
          uppercase
          tracking-[.18em]
          bg-[var(--primary)]
          text-white
          shadow-gold
          transition-all
          duration-[1800ms]
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${
            revealed
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-[0.96] pointer-events-none"
          }
        `}
      >
        <CalendarPlus size={32} />
        Save the Date
      </button>
    </section>
  );
}