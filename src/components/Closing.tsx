import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { wedding } from "../data/wedding";

/* ---------- Detects when the section enters the viewport (once) ---------- */
function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const trans = (delay: number, duration = 1100) =>
  `opacity ${duration}ms ${EASE} ${delay}ms, transform ${duration}ms ${EASE} ${delay}ms`;

/* ---------- Animated wavy divider (draws itself) ---------- */
const Wave = ({ show, delay = 0 }: { show: boolean; delay?: number }) => (
  <svg
    viewBox="0 0 140 16"
    className="mx-auto w-36 h-4 text-[var(--primary)]"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M0 8 Q 11.67 0, 23.33 8 T 46.67 8 T 70 8 T 93.33 8 T 116.67 8 T 140 8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={show ? 0 : 1}
      opacity={0.45}
      className="cl-t"
      style={{
        transition: `stroke-dashoffset 1800ms ${EASE} ${delay}ms`,
      }}
    />
  </svg>
);

/* ---------- Floating hearts config ---------- */
const floaters = [
  { left: "8%", size: 14, delay: 0.2, dur: 7.5, dx: 20 },
  { left: "20%", size: 10, delay: 2.4, dur: 8.5, dx: -16 },
  { left: "34%", size: 16, delay: 1.1, dur: 9, dx: 24 },
  { left: "52%", size: 11, delay: 3.2, dur: 7, dx: -22 },
  { left: "66%", size: 15, delay: 0.7, dur: 8, dx: 18 },
  { left: "80%", size: 10, delay: 2.9, dur: 9.5, dx: -20 },
  { left: "92%", size: 13, delay: 1.7, dur: 7.8, dx: -14 },
];

/* ---------- Closing ---------- */
export function Closing() {
  const { ref, inView } = useInView<HTMLElement>(0.3);

  const headline = "We can't wait to celebrate with you!".split(" ");
  const wordStart = 700; // ms
  const wordStep = 110; // ms between words
  const namesStart = wordStart + headline.length * wordStep + 250;

  return (
    <>
      <style>{`
        @keyframes cl-float {
          0%   { transform: translate3d(0,0,0) scale(.7); opacity: 0; }
          15%  { opacity: .55; }
          100% { transform: translate3d(var(--dx),-280px,0) scale(1.15); opacity: 0; }
        }
        @keyframes cl-beat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.2); }
          28% { transform: scale(1); }
          42% { transform: scale(1.13); }
          70% { transform: scale(1); }
        }
        @keyframes cl-breathe {
          0%, 100% { transform: translate3d(-50%,-50%,0) scale(1); opacity: .9; }
          50% { transform: translate3d(-50%,-50%,0) scale(1.14); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cl-t, .cl-a { transition: none !important; animation: none !important; }
        }
      `}</style>

      <section
        ref={ref}
        className="relative overflow-hidden py-20 md:py-28 px-6 cream-bg text-center"
      >
        {/* Soft breathing glow */}
        <div
          aria-hidden="true"
          className="cl-t cl-a pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] md:h-[620px] md:w-[620px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--primary) 16%, transparent) 0%, transparent 65%)",
            opacity: inView ? 1 : 0,
            transform: "translate3d(-50%,-50%,0)",
            transition: `opacity 2000ms ${EASE} 300ms`,
            animation: inView ? "cl-breathe 7s ease-in-out 2s infinite" : "none",
          }}
        />

        {/* Floating hearts */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-full"
        >
          {floaters.map((f, i) => (
            <Heart
              key={i}
              size={f.size}
              fill="currentColor"
              className="cl-a absolute bottom-4 text-[var(--primary)]"
              style={
                {
                  left: f.left,
                  opacity: 0,
                  "--dx": `${f.dx}px`,
                  animation: inView
                    ? `cl-float ${f.dur}s ease-in-out ${f.delay + 1.5}s infinite`
                    : "none",
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Top wave */}
          <Wave show={inView} delay={100} />

          {/* Headline: word-by-word masked reveal */}
          <p className="mt-8 font-calligraphy text-6xl md:text-6xl text-[var(--primary)] leading-relaxed mb-6">
            {headline.map((word, i) => (
              <span key={i}>
                <span
                  className="inline-block overflow-hidden align-bottom"
                  style={{ padding: "0.2em 0.08em", margin: "-0.2em 0" }}
                >
                  <span
                    className="cl-t inline-block"
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView
                        ? "translate3d(0,0,0) rotate(0deg)"
                        : "translate3d(0,115%,0) rotate(4deg)",
                      transformOrigin: "left bottom",
                      transition: trans(wordStart + i * wordStep, 1200),
                    }}
                  >
                    {word}
                  </span>
                </span>
                {i < headline.length - 1 ? " " : ""}
              </span>
            ))}
          </p>

          {/* Names: slide in from both sides, "&" pops between */}
          <p className="font-calligraphy text-6xl text-[var(--muted)] flex flex-wrap items-center justify-center gap-x-4">
            <span
              className="cl-t inline-block"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView
                  ? "translate3d(0,0,0)"
                  : "translate3d(-44px,0,0)",
                transition: trans(namesStart, 1200),
              }}
            >
              {wedding.groom.name}
            </span>

            <span
              className="cl-t inline-block text-[var(--primary)]"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView
                  ? "scale(1) rotate(0deg)"
                  : "scale(0.2) rotate(-25deg)",
                transition: trans(namesStart + 350, 1000),
              }}
            >
              &amp;
            </span>

            <span
              className="cl-t inline-block"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView
                  ? "translate3d(0,0,0)"
                  : "translate3d(44px,0,0)",
                transition: trans(namesStart, 1200),
              }}
            >
              {wedding.bride.name}
            </span>
          </p>

          {/* Heartbeat */}
          <div
            className="cl-t mt-8 flex justify-center"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "scale(1)" : "scale(0.3)",
              transition: trans(namesStart + 700, 1000),
            }}
          >
            <Heart
              size={40}
              fill="currentColor"
              className="cl-a text-[var(--primary)]"
              style={{
                animation: inView
                  ? `cl-beat 2.4s ease-in-out ${namesStart + 1800}ms infinite`
                  : "none",
              }}
            />
          </div>

          {/* Bottom wave */}
          <div className="mt-16">
            <Wave show={inView} delay={namesStart + 900} />
          </div>
        </div>
      </section>
    </>
  );
}