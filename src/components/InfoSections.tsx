import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Shirt,
  Car,
  Hotel,
  Gift,
  Heart,
} from "lucide-react";
import { wedding } from "../data/wedding";

/* ---------- Reveal: animates its children when they enter the viewport ---------- */
const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number; // ms
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target); // reveal once, then stay visible
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0,0,0)" : "translate3d(0,28px,0)",
        transition: `opacity 900ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 900ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

/* ---------- Shell ---------- */
const Shell = ({
  title,
  icon: Icon,
  children,
  cream = true,
  noPadding = false,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  cream?: boolean;
  noPadding?: boolean;
}) => (
  <section
    className={`py-16 md:py-24 ${noPadding ? `md:pt-0` : ``} px-6 ${
      cream ? "cream-bg" : ""
    }`}
  >
    <div className="max-w-3xl mx-auto">
      <div className="text-center">
        <Reveal>
          <Icon className="mx-auto text-[var(--primary)] mb-6" size={45} />
        </Reveal>
        <Reveal delay={120}>
          <h2 className="font-calligraphy text-4xl md:text-7xl text-[var(--primary)] mb-2">
            {title}
          </h2>
        </Reveal>
      </div>
      {children}
    </div>
  </section>
);

/* ---------- Sections ---------- */
export function Timeline() {
  return (
    <Shell title="Program Timeline" icon={CalendarDays}>
      <div className="mt-8 space-y-4">
        {wedding.timeline.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--border)] bg-white/60 p-5 flex justify-between items-center"
          >
            <div>
              <Reveal>
                <h3 className="font-display font-semibold text-4xl mb-3">
                  {item.title}
                </h3>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-3xl text-[var(--muted)]">{item.date}</p>
              </Reveal>
            </div>
            <Reveal delay={240}>
              <span className="font-calligraphy text-4xl text-[var(--primary)]">
                {item.time}
              </span>
            </Reveal>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function Venue() {
  return (
    <Shell title="Venue" icon={MapPin} cream={false}>
      <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-white/60 text-center">
        <div className="px-8 pt-16">
          <Reveal>
            <h3 className="text-5xl font-semibold mb-6">
              {wedding.venue.name}
            </h3>
          </Reveal>

          <Reveal delay={150}>
            <p className="text-[var(--muted)] text-3xl leading-relaxed">
              {wedding.venue.address}
            </p>
          </Reveal>
        </div>

        <Reveal delay={200} className="mt-10 h-[450px] w-full">
          <iframe
            src={wedding.venue.mapEmbedUrl}
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title={`${wedding.venue.name} location`}
          />
        </Reveal>

        <div className="py-8">
          <Reveal>
            <a
              href={wedding.venue.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full bg-[var(--primary)] px-9 py-3 text-3xl text-white"
            >
              Open in Google Maps
            </a>
          </Reveal>
        </div>
      </div>
    </Shell>
  );
}

export function DressCode() {
  return (
    <Shell title="Dress Code" icon={Shirt}>
      <div className="grid md:grid-cols-2 gap-5 mt-8">
        <div className="p-6 rounded-xl border border-[var(--border)] text-center">
          <Reveal>
            <h3 className="font-semibold text-4xl text-[var(--primary)] mb-2">
              Women
            </h3>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-3xl">Elegant traditional or formal wear</p>
          </Reveal>
        </div>

        <div className="p-6 rounded-xl border border-[var(--border)] text-center">
          <Reveal>
            <h3 className="font-semibold text-4xl text-[var(--primary)] mb-2">
              Men
            </h3>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-3xl">Suit or traditional formal wear</p>
          </Reveal>
        </div>
      </div>
    </Shell>
  );
}

export function PreWedding() {
  return (
    <Shell title="Pre-Wedding Events" icon={CalendarDays} cream={false}>
      <div className="grid md:grid-cols-2 gap-5 mt-8">
        {wedding.preWedding.map((e, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--border)] p-6 text-center"
          >
            <Reveal>
              <p className="font-semibold">{e.date}</p>
            </Reveal>
            <Reveal delay={120}>
              <p className="font-calligraphy text-2xl text-[var(--primary)]">
                {e.time}
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="text-[var(--muted)] mt-2">{e.place}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function SpecialInviters() {
  return (
    <Shell title="With Warm Regards" icon={Heart}>
      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white/60 p-8 md:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 text-center">
          {wedding.specialInviters.map((name, i) => (
            <Reveal key={i} delay={(i % 3) * 120}>
              <p className="font-display text-2xl md:text-3xl text-[var(--primary)]">
                {name}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function SimpleInfo() {
  return (
    <>
      <Shell title="Transportation" icon={Car} cream={false}>
        <Reveal delay={200}>
          <p className="text-center text-4xl mt-8">
            Transportation details will be shared with confirmed guests.
          </p>
        </Reveal>
      </Shell>

      <Shell title="Accommodation" icon={Hotel}>
        <Reveal delay={200}>
          <p className="text-center text-4xl mt-8">
            Accommodation information will be shared with guests who need it.
          </p>
        </Reveal>
      </Shell>

      <Shell title="Gifts" icon={Gift} cream={false}>
        <Reveal delay={200}>
          <p className="text-center text-4xl mt-8">
            Your presence and blessings are the greatest gift.
          </p>
        </Reveal>
      </Shell>
    </>
  );
}