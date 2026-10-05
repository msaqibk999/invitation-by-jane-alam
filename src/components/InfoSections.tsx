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

const Shell = ({
  title,
  icon: Icon,
  children,
  cream = true,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  cream?: boolean;
}) => (
  <section className={`py-16 md:py-24 px-6 ${cream ? "cream-bg" : ""}`}>
    <div className="max-w-3xl mx-auto">
      <div className="text-center">
        <Icon className="mx-auto text-[var(--primary)] mb-6" size={45} />
        <h2 className="font-calligraphy text-4xl md:text-7xl text-[var(--primary)] mb-2">
          {title}
        </h2>
      </div>
      {children}
    </div>
  </section>
);

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
              <h3 className="font-display font-semibold text-4xl mb-3">
                {item.title}
              </h3>
              <p className="text-3xl text-[var(--muted)]">{item.date}</p>
            </div>
            <span className="font-calligraphy text-3xl text-[var(--primary)]">
              {item.time}
            </span>
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
          <h3 className="text-5xl font-semibold mb-6">
            {wedding.venue.name}
          </h3>

          <p className="text-[var(--muted)] text-3xl leading-relaxed">
            {wedding.venue.address}
          </p>
        </div>

        <div className="mt-10 h-[450px] w-full">
          <iframe
            src={wedding.venue.mapEmbedUrl}
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title={`${wedding.venue.name} location`}
          />
        </div>

        <div className="py-8">
          <a
            href={wedding.venue.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-full bg-[var(--primary)] px-9 py-3 text-3xl text-white"
          >
            Open in Google Maps
          </a>
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
          <h3 className="font-semibold text-3xl text-[var(--primary)] mb-2">
            Women
          </h3>
          <p className="text-2xl">Elegant traditional or formal wear</p>
        </div>

        <div className="p-6 rounded-xl border border-[var(--border)] text-center">
          <h3 className="font-semibold text-3xl text-[var(--primary)] mb-2">
            Men
          </h3>
          <p className="text-2xl">Suit or traditional formal wear</p>
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
            <p className="font-semibold">{e.date}</p>
            <p className="font-calligraphy text-2xl text-[var(--primary)]">
              {e.time}
            </p>
            <p className="text-[var(--muted)] mt-2">{e.place}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function SpecialInviters() {
  return (
    <Shell title="With Warm Regards" icon={Heart} cream={false}>
      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white/60 p-8 md:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 text-center">
          {wedding.specialInviters.map((name, i) => (
            <p
              key={i}
              className="font-display text-2xl md:text-3xl text-[var(--primary)]"
            >
              {name}
            </p>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function SimpleInfo() {
  return (
    <>
      <Shell title="Transportation" icon={Car}>
        <p className="text-center text-2xl mt-8">
          Transportation details will be shared with confirmed guests.
        </p>
      </Shell>

      <Shell title="Accommodation" icon={Hotel} cream={false}>
        <p className="text-center text-2xl mt-8">
          Accommodation information will be shared with guests who need it.
        </p>
      </Shell>

      <Shell title="Gifts" icon={Gift}>
        <p className="text-center text-2xl mt-8">
          Your presence and blessings are the greatest gift.
        </p>
      </Shell>
    </>
  );
}