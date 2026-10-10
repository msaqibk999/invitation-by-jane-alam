import { useEffect, useRef, useState } from "react";
import { Users, Heart, Loader2 } from "lucide-react";
import { wedding } from "../data/wedding";

/* ---------- Detects when the section enters the viewport (once) ---------- */
function useInView<T extends HTMLElement>(threshold = 0.12) {
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

const fadeUp = (show: boolean, delay: number, distance = 30): React.CSSProperties => ({
  opacity: show ? 1 : 0,
  transform: show ? "translate3d(0,0,0)" : `translate3d(0,${distance}px,0)`,
  transition: `opacity 900ms ${EASE} ${delay}ms, transform 900ms ${EASE} ${delay}ms`,
});

/* ---------- Animated success checkmark (draws itself) ---------- */
const AnimatedCheck = () => (
  <svg
    viewBox="0 0 52 52"
    width={64}
    height={64}
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle
      cx="26"
      cy="26"
      r="23"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1}
      className="rs-a"
      style={{ animation: `rs-draw 900ms ${EASE} 200ms forwards` }}
    />
    <path
      d="M15 27 l8 8 l15 -17"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1}
      className="rs-a"
      style={{ animation: `rs-draw 600ms ${EASE} 900ms forwards` }}
    />
  </svg>
);

/* ---------- Confetti burst (hearts + dots) ---------- */
const confetti = Array.from({ length: 22 }, (_, i) => {
  const angle = (i / 22) * Math.PI * 2;
  const dist = 120 + (i % 3) * 50;
  return {
    tx: Math.round(Math.cos(angle) * dist),
    ty: Math.round(Math.sin(angle) * dist - 40),
    rot: (i % 2 === 0 ? 1 : -1) * (120 + i * 17),
    size: 8 + (i % 4) * 3,
    heart: i % 3 === 0,
    white: i % 2 === 0,
    delay: 900 + (i % 5) * 40,
  };
});

const ConfettiBurst = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute left-1/2 top-1/2"
  >
    {confetti.map((c, i) => (
      <span
        key={i}
        className={`rs-a absolute block ${
          c.white ? "text-white" : "text-[var(--primary)]"
        }`}
        style={
          {
            "--tx": `${c.tx}px`,
            "--ty": `${c.ty}px`,
            "--rot": `${c.rot}deg`,
            opacity: 0,
            animation: `rs-confetti 1700ms ${EASE} ${c.delay}ms forwards`,
          } as React.CSSProperties
        }
      >
        {c.heart ? (
          <Heart size={c.size + 4} fill="currentColor" stroke="none" />
        ) : (
          <span
            className="block rounded-full bg-current"
            style={{ width: c.size / 1.6, height: c.size / 1.6 }}
          />
        )}
      </span>
    ))}
  </div>
);

/* ---------- Shared field styling ---------- */
const fieldBase = `
  mt-4
  w-full
  rounded-lg
  border border-[var(--border)]
  bg-white
  px-4
  text-4xl
  outline-none
  focus:border-[var(--primary)]
  focus:ring-1
  focus:ring-[var(--primary)]
  focus:-translate-y-0.5
  focus:shadow-[0_10px_28px_-10px_rgba(0,0,0,0.25)]
  transition-all
  duration-300
`;

export function RSVP() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [message, setMessage] = useState("");

  const { ref, inView } = useInView<HTMLElement>(0.12);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sending) return;

    setSending(true);

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${wedding.rsvpEmail}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            Name: name,
            Attendance: attendance === "yes" ? "Yes" : "No",
            Message: message || "No message provided",

            _subject: `Wedding RSVP - ${name}`,
            _captcha: "false",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send RSVP");
      }

      setSent(true);
    } catch (error) {
      console.error("RSVP submission failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const thankYouWords = `Thank you, ${name || "dear guest"}!`.split(" ");

  return (
    <>
      <style>{`
        @keyframes rs-beat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.22); }
          28% { transform: scale(1); }
          42% { transform: scale(1.14); }
          70% { transform: scale(1); }
        }
        @keyframes rs-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes rs-pop {
          0%   { opacity: 0; transform: scale(0.85) translate3d(0,30px,0); }
          60%  { opacity: 1; transform: scale(1.03) translate3d(0,-4px,0); }
          100% { opacity: 1; transform: scale(1) translate3d(0,0,0); }
        }
        @keyframes rs-rise {
          from { opacity: 0; transform: translate3d(0,115%,0) rotate(4deg); }
          to   { opacity: 1; transform: translate3d(0,0,0) rotate(0deg); }
        }
        @keyframes rs-fade {
          from { opacity: 0; transform: translate3d(0,16px,0); }
          to   { opacity: 1; transform: translate3d(0,0,0); }
        }
        @keyframes rs-confetti {
          0%   { opacity: 0; transform: translate3d(0,0,0) scale(0) rotate(0deg); }
          12%  { opacity: 1; }
          100% { opacity: 0; transform: translate3d(var(--tx),var(--ty),0) scale(1) rotate(var(--rot)); }
        }
        @keyframes rs-ring {
          0%   { opacity: .55; transform: scale(0.6); }
          100% { opacity: 0; transform: scale(2.4); }
        }

        /* Submit button: soft ripple halo behind the button.
           Only transform + opacity are animated, so it runs on the GPU
           compositor and never triggers layout or paint. */
        @keyframes rs-halo {
          0%   { opacity: 0.4; transform: scale3d(1, 1, 1); }
          70%  { opacity: 0;   transform: scale3d(1.05, 1.22, 1); }
          100% { opacity: 0;   transform: scale3d(1.05, 1.22, 1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .rs-t, .rs-a { transition: none !important; animation: none !important; }
          .rs-a { opacity: 1 !important; }
          .rs-halo { display: none !important; }
          .rs-btn-heart { animation: none !important; }
        }
      `}</style>

      <section
        ref={ref}
        className="overflow-x-clip py-12 sm:py-16 md:py-24 px-4 sm:px-6"
      >
        <div className="w-full max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center">
            <div
              className="rs-t"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "scale(1)" : "scale(0.3)",
                transition: `opacity 900ms ${EASE}, transform 900ms ${EASE}`,
              }}
            >
              <Heart
                className="rs-a mx-auto text-[var(--primary)] mb-3"
                fill="currentColor"
                size={32}
                style={{
                  animation: inView ? "rs-beat 2.4s ease-in-out 1.2s infinite" : "none",
                }}
              />
            </div>

            {/*
              RSVP title.
              Calligraphy glyphs (the "P" especially) overhang their advance
              width. iOS Safari clips animated text to its layer box, so:
                - the text lives in an inline-block with generous padding on
                  every side, so the overhang sits INSIDE the box
                - the reveal is opacity + a small lift only (no mask / overflow
                  reveal that could crop the glyph)
                - no overflow-hidden anywhere around it
            */}
            <h2 className="font-calligraphy text-6xl md:text-7xl text-[var(--primary)] leading-[1.4] whitespace-nowrap">
              <span
                className="rs-t inline-block"
                style={{
                  padding: "0.3em 0.6em 0.4em 0.4em",
                  opacity: inView ? 1 : 0,
                  transform: inView
                    ? "translate3d(0,0,0)"
                    : "translate3d(0,24px,0)",
                  transition: `opacity 1100ms ${EASE} 200ms, transform 1100ms ${EASE} 200ms`,
                }}
              >
                RSVP
              </span>
            </h2>

            {/* Gold line that draws outward */}
            <div
              className="rs-t mx-auto mt-1 h-px bg-[var(--primary)]"
              style={{
                width: inView ? "7rem" : "0rem",
                opacity: 0.5,
                transition: `width 1200ms ${EASE} 600ms`,
              }}
            />

            <p
              className="rs-t text-sm md:text-4xl text-[var(--muted)] mt-4"
              style={fadeUp(inView, 700, 20)}
            >
              We would love to celebrate with you
            </p>
          </div>

          {sent ? (
            /* Success */
            <div
              className="rs-a relative rounded-2xl bg-[var(--primary)] text-white p-7 md:px-16 md:py-12 text-center mt-14 shadow-gold"
              style={{ opacity: 0, animation: `rs-pop 900ms ${EASE} forwards` }}
            >
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                {/* Pulse rings */}
                {[0, 350].map((d) => (
                  <span
                    key={d}
                    aria-hidden="true"
                    className="rs-a absolute inset-0 rounded-full border-2 border-white"
                    style={{
                      opacity: 0,
                      animation: `rs-ring 1600ms ease-out ${900 + d}ms forwards`,
                    }}
                  />
                ))}
                <AnimatedCheck />
                <ConfettiBurst />
              </div>

              <h3 className="font-calligraphy text-7xl md:text-6xl leading-relaxed mt-2">
                {thankYouWords.map((word, i) => (
                  <span key={i}>
                    <span
                      className="inline-block overflow-hidden align-bottom"
                      style={{ padding: "0.2em 0.08em", margin: "-0.2em 0" }}
                    >
                      <span
                        className="rs-a inline-block"
                        style={{
                          opacity: 0,
                          animation: `rs-rise 1000ms ${EASE} ${1000 + i * 120}ms forwards`,
                        }}
                      >
                        {word}
                      </span>
                    </span>
                    {i < thankYouWords.length - 1 ? " " : ""}
                  </span>
                ))}
              </h3>

              <p
                className="rs-a mt-6 text-sm md:text-3xl opacity-90 leading-relaxed"
                style={{
                  opacity: 0,
                  animation: `rs-fade 1000ms ${EASE} ${1000 + thankYouWords.length * 120 + 200}ms forwards`,
                }}
              >
                Your response has been received. We look forward to celebrating
                with you!
              </p>
            </div>
          ) : (
            /* Form */
            <form onSubmit={submit} className="space-y-8 mt-14">
              {/* Name */}
              <label
                className="rs-t block text-sm md:text-4xl font-medium"
                style={fadeUp(inView, 900)}
              >
                Your Name
                <span className="text-red-500 ml-1">*</span>

                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className={`${fieldBase} h-24`}
                />
              </label>

              {/* Attendance */}
              <label
                className="rs-t block text-sm md:text-4xl font-medium"
                style={fadeUp(inView, 1050)}
              >
                <span className="flex items-center gap-2">
                  <Users size={34} />
                  Will you be attending?
                  <span className="text-red-500">*</span>
                </span>

                <select
                  required
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  className={`${fieldBase} h-24`}
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes, I'll be there!</option>
                  <option value="no">Sorry, I can't make it</option>
                </select>
              </label>

              {/* Message */}
              <label
                className="rs-t block text-sm md:text-4xl font-medium"
                style={fadeUp(inView, 1200)}
              >
                Your Message

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Write your wishes..."
                  className={`${fieldBase} py-3 leading-relaxed resize-none`}
                />
              </label>

              {/* Submit */}
              <div style={fadeUp(inView, 1350)} className="rs-t">
                <div className="relative mt-4">
                  {/* Soft ripple halo (opacity + transform only) */}
                  {!sending && inView && (
                    <span
                      aria-hidden="true"
                      className="rs-halo pointer-events-none absolute inset-0 rounded-lg bg-[var(--primary)]"
                      style={{
                        animation: "rs-halo 2.6s ease-out 2s infinite",
                        willChange: "transform, opacity",
                      }}
                    />
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="
                      relative
                      z-10
                      flex
                      items-center
                      justify-center
                      gap-3
                      w-full
                      h-24
                      rounded-lg
                      bg-[var(--primary)]
                      text-white
                      text-4xl
                      font-medium
                      shadow-gold
                      transition-transform
                      duration-200
                      active:scale-[0.98]
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  >
                    {sending ? (
                      <Loader2 size={34} className="animate-spin" />
                    ) : (
                      <Heart
                        size={30}
                        fill="currentColor"
                        stroke="none"
                        className="rs-btn-heart"
                        style={{
                          animation: "rs-beat 2.4s ease-in-out 2s infinite",
                        }}
                      />
                    )}
                    <span>{sending ? "Sending..." : "Send RSVP"}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}