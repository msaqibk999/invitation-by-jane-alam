import { useEffect, useMemo, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { wedding } from "../data/wedding";

export function Welcome() {
  const textRef = useRef<HTMLParagraphElement>(null);

  // Highest scroll progress reached so far (0 to 1).
  // Only ever goes up, so text stays visible when scrolling back up.
  const maxProgressRef = useRef(0);
  const lastCountRef = useRef(0);

  const message = `We are honored to welcome you to the wedding ceremony of ${wedding.groom.name} & ${wedding.bride.name}. As they begin their journey together in faith and love, we would be delighted to have you join us on this blessed occasion.`;

  const words = useMemo(() => message.split(" "), [message]);

  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Respect reduced-motion: show everything immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lastCountRef.current = words.length + 1;
      setVisibleCount(words.length + 1);
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;

      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();

      // 0 when the text top reaches 90% of the viewport height,
      // 1 when the text bottom reaches 70% of the viewport height.
      const raw = (vh * 0.9 - rect.top) / (vh * 0.2 + rect.height);
      const progress = Math.min(1, Math.max(0, raw));

      if (progress > maxProgressRef.current) {
        maxProgressRef.current = progress;
      }

      // words.length + 1 -> the extra step reveals the heart at the end
      const count = Math.ceil(maxProgressRef.current * (words.length + 1));

      if (count !== lastCountRef.current) {
        lastCountRef.current = count;
        setVisibleCount(count);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update(); // handle the case where the section is already on screen

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [words.length]);

  return (
    <section
      className="relative px-6 py-24 md:py-24 text-center overflow-hidden"
      style={{
        background:
          "linear-gradient(rgb(86,74,66) 0%, rgb(122,106,95) 70%, rgb(199,182,168) 88%, rgb(243,233,226) 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#b87a5e]" />
          <Heart size={14} fill="currentColor" className="text-[#b87a5e]" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#b87a5e]" />
        </div>

        <p
          ref={textRef}
          aria-label={message}
          className="font-calligraphy text-2xl md:text-7xl leading-relaxed italic text-[#fbe8da] drop-shadow-lg"
        >
          {words.map((word, i) => {
            const shown = i < visibleCount;
            return (
              <span key={i} aria-hidden="true">
                <span
                  className={`inline-block transition-all duration-700 ease-out ${
                    shown
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  }`}
                >
                  {word}
                </span>
                {i < words.length - 1 ? " " : ""}
              </span>
            );
          })}

          <span
            aria-hidden="true"
            className={`block mt-2 transition-all duration-1000 ease-out ${
              visibleCount > words.length
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            ❤
          </span>
        </p>

        <HeartDivider />
      </div>
    </section>
  );
}

function HeartDivider() {
  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <div className="w-20 h-px bg-[#b87a5e]" />
      <Heart size={14} fill="currentColor" className="text-[#b87a5e]" />
      <div className="w-20 h-px bg-[#b87a5e]" />
    </div>
  );
}