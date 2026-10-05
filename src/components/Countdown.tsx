import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { wedding } from "../data/wedding";

function getRemaining() {
  const target = new Date(
    `${wedding.date} ${wedding.time}`
  ).getTime();

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
export function Countdown() {
  const [time, setTime] = useState(getRemaining());
  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="py-16 md:py-20 px-6 text-center ">
      <h2 className="font-calligraphy text-4xl md:text-7xl text-[var(--primary)] mb-3">
        Counting Down to Forever
      </h2>
      <div className="flex items-center justify-center gap-3 my-6">
        <div className="w-16 h-px bg-[var(--primary)]/30" />
        <Heart
          size={30}
          fill="currentColor"
          className="text-[var(--primary)] opacity-50"
        />
        <div className="w-16 h-px bg-[var(--primary)]/30" />
      </div>
      <div className="flex justify-center gap-2 sm:gap-4 md:gap-6">
        {Object.entries(time).map(([label, value]) => (
          <div className="text-center" key={label}>
            <div className="w-14 sm:w-20 md:w-28 py-2 sm:py-3 md:py-5 mb-2 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/10">
              <div className="font-display text-2xl sm:text-4xl md:text-6xl font-bold tabular-nums">
                {String(value).padStart(2, "0")}
              </div>
            </div>
            <p className="text-[10px] sm:text-2xl uppercase tracking-wider text-[var(--muted)]">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
