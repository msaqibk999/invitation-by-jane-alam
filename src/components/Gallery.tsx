import { useEffect, useState } from "react";
import { wedding } from "../data/wedding";
export function Gallery() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % wedding.gallery.length),
      3500,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <section className="py-16 md:py-24 px-6 md:pt-0">
      <div className="flex justify-center">
        <div className="w-full max-w-3xl aspect-[3/2] rounded-xl overflow-hidden shadow-elegant relative">
          <img
            src={wedding.gallery[index]}
            alt={`Wedding moment ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {wedding.gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === index ? "bg-[var(--primary)] w-4" : "bg-white/70 w-2"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
