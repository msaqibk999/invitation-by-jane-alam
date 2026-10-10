import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { wedding } from "../data/wedding";

function getRemaining() {
  const target = new Date(`${wedding.date} ${wedding.time}`).getTime();

  let d = Math.max(0, target - Date.now());

  const days = Math.floor(d / 86400000);

  d %= 86400000;

  const hours = Math.floor(d / 3600000);

  d %= 3600000;

  const minutes = Math.floor(d / 60000);

  const seconds = Math.floor(d / 1000) % 60;

  return {
    Days: days,
    Hours: hours,
    Minutes: minutes,
    Seconds: seconds,
  };
}

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

/* ---------- Odometer digit: a vertical reel that always scrolls UP ---------- */
// Counting down means the next digit sits just below the current one,
// so the reel is listed 9 → 0, twice, and scrolls upward.
const REEL = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
const LINE = 1.2; // em, height of one digit slot
const SPIN = "cubic-bezier(0.34, 1.35, 0.64, 1)"; // slight mechanical overshoot

const RollingDigit = ({ value }: { value: number }) => {
  const [pos, setPos] = useState(9 - value);
  const [instant, setInstant] = useState(true);
  const last = useRef(value);

  // Value changed: move the reel upward by the number of steps
  useEffect(() => {
    if (value === last.current) return;
    const steps = (last.current - value + 10) % 10;
    last.current = value;
    setInstant(false);
    setPos((p) => p + steps);
  }, [value]);

  // After the spin, silently jump back to the first half of the reel
  useEffect(() => {
    if (pos < 10) return;
    const t = setTimeout(() => {
      setInstant(true);
      setPos((p) => (p >= 10 ? p - 10 : p));
    }, 780);
    return () => clearTimeout(t);
  }, [pos]);

  return (
    <span
      className="relative inline-block overflow-hidden"
      style={{
        height: `${LINE}em`,
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
      }}
    >
      <span
        className="cd-reel block"
        style={{
          transform: `translate3d(0, ${-pos * LINE}em, 0)`,
          transition: instant ? "none" : `transform 720ms ${SPIN}`,
          willChange: "transform",
        }}
      >
        {REEL.map((n, i) => (
          <span
            key={i}
            className="block text-center"
            style={{ height: `${LINE}em`, lineHeight: `${LINE}em` }}
          >
            {n}
          </span>
        ))}
      </span>
    </span>
  );
};

const title = "Counting Down to Forever".split(" ");

export function Countdown() {
  const [time, setTime] = useState(getRemaining());
  const { ref, inView } = useInView<HTMLElement>(0.3);

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const wordStep = 120;
  const dividerStart = 300 + title.length * wordStep + 100;
  const boxesStart = dividerStart + 700;

  return (
    <>
      <style>{`
        @keyframes cd-beat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.22); }
          28% { transform: scale(1); }
          42% { transform: scale(1.14); }
          70% { transform: scale(1); }
        }
        @keyframes cd-breathe {
          0%, 100% { transform: translate3d(-50%,-50%,0) scale(1); opacity: .9; }
          50% { transform: translate3d(-50%,-50%,0) scale(1.14); opacity: 1; }
        }
        @keyframes cd-pulse {
          0%   { opacity: .6; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.16); }
        }
        @keyframes cd-shine {
          0%   { transform: translate3d(-150%,0,0) skewX(-20deg); }
          100% { transform: translate3d(350%,0,0) skewX(-20deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cd-t, .cd-a, .cd-reel { transition: none !important; animation: none !important; }
        }
      `}</style>

      <section
        ref={ref}
        className="relative overflow-hidden py-16 md:py-20 px-6 text-center"
      >
        {/* Soft breathing glow */}
        <div
          aria-hidden="true"
          className="cd-t cd-a pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] md:h-[560px] md:w-[560px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--primary) 14%, transparent) 0%, transparent 65%)",
            opacity: inView ? 1 : 0,
            transform: "translate3d(-50%,-50%,0)",
            transition: `opacity 2000ms ${EASE} 300ms`,
            animation: inView ? "cd-breathe 7s ease-in-out 2s infinite" : "none",
          }}
        />

        <div className="relative z-10">
          {/* Title: word-by-word masked reveal */}
          <h2 className="font-calligraphy text-4xl md:text-7xl text-[var(--primary)] mb-3 leading-snug">
            {title.map((word, i) => (
              <span key={i}>
                <span
                  className="inline-block overflow-hidden align-bottom"
                  style={{ padding: "0.2em 0.08em", margin: "-0.2em 0" }}
                >
                  <span
                    className="cd-t inline-block"
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView
                        ? "translate3d(0,0,0) rotate(0deg)"
                        : "translate3d(0,115%,0) rotate(4deg)",
                      transformOrigin: "left bottom",
                      transition: `opacity 1100ms ${EASE} ${300 + i * wordStep}ms, transform 1100ms ${EASE} ${300 + i * wordStep}ms`,
                    }}
                  >
                    {word}
                  </span>
                </span>
                {i < title.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>

          {/* Divider: lines grow outward, heart pops and beats */}
          <div className="flex items-center justify-center gap-3 my-6">
            <div
              className="cd-t w-16 h-px bg-[var(--primary)]/30"
              style={{
                transform: inView ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "right center",
                transition: `transform 1200ms ${EASE} ${dividerStart + 200}ms`,
              }}
            />
            <div
              className="cd-t"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "scale(1)" : "scale(0.2)",
                transition: `opacity 800ms ${EASE} ${dividerStart}ms, transform 800ms ${EASE} ${dividerStart}ms`,
              }}
            >
              <Heart
                size={30}
                fill="currentColor"
                className="cd-a text-[var(--primary)] opacity-50"
                style={{
                  animation: inView
                    ? `cd-beat 2.4s ease-in-out ${dividerStart + 1200}ms infinite`
                    : "none",
                }}
              />
            </div>
            <div
              className="cd-t w-16 h-px bg-[var(--primary)]/30"
              style={{
                transform: inView ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left center",
                transition: `transform 1200ms ${EASE} ${dividerStart + 200}ms`,
              }}
            />
          </div>

          {/* Countdown boxes */}
          <div className="flex justify-center gap-2 sm:gap-4 md:gap-6">
            {Object.entries(time).map(([label, value], i) => {
              const delay = boxesStart + i * 160;
              const digits = String(value).padStart(2, "0").split("");

              return (
                <div
                  className="cd-t text-center"
                  key={label}
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView
                      ? "translate3d(0,0,0) scale(1)"
                      : "translate3d(0,36px,0) scale(0.85)",
                    transition: `opacity 900ms ${EASE} ${delay}ms, transform 900ms ${EASE} ${delay}ms`,
                  }}
                >
                  <div className="relative w-14 sm:w-20 md:w-28 mb-2">
                    <div className="relative overflow-hidden rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/10 py-2 sm:py-3 md:py-5">
                      <div className="font-display text-2xl sm:text-4xl md:text-6xl font-bold tabular-nums flex justify-center">
                        {digits.map((d, idx) => (
                          <RollingDigit key={idx} value={Number(d)} />
                        ))}
                      </div>

                      {/* One-time shine sweep when the box appears */}
                      {inView && (
                        <span
                          aria-hidden="true"
                          className="cd-a pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                          style={{
                            transform: "translate3d(-150%,0,0)",
                            animation: `cd-shine 1400ms ${EASE} ${delay + 500}ms forwards`,
                          }}
                        />
                      )}
                    </div>

                    {/* Seconds box gets a soft pulse ring on every tick */}
                    {label === "Seconds" && inView && (
                      <span
                        key={value}
                        aria-hidden="true"
                        className="cd-a pointer-events-none absolute inset-0 rounded-lg border border-[var(--primary)]"
                        style={{
                          opacity: 0,
                          animation: "cd-pulse 900ms ease-out",
                        }}
                      />
                    )}
                  </div>

                  <p
                    className="cd-t text-[10px] sm:text-2xl uppercase tracking-wider text-[var(--muted)]"
                    style={{
                      opacity: inView ? 1 : 0,
                      transition: `opacity 900ms ${EASE} ${delay + 400}ms`,
                    }}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}