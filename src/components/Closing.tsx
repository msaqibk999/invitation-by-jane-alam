import { wedding } from "../data/wedding";

export function Closing() {
  return (
    <>
      <section className="py-16 md:py-20 px-6 cream-bg text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-[var(--primary)] opacity-30 text-3xl">
            〰〰〰
          </div>
          <p className="font-calligraphy text-4xl md:text-6xl text-[var(--primary)] leading-relaxed mb-4">
            We can't wait to celebrate with you!
          </p>
          <p className="font-calligraphy text-5xl text-[var(--muted)]">
            {wedding.groom.name} &amp; {wedding.bride.name}
          </p>
          <div className="text-[var(--primary)] opacity-30 text-3xl mt-8 rotate-180">
            〰〰〰
          </div>
        </div>
      </section>
      <footer className="py-10 px-9 md:px-12 text-center border-t border-[var(--border)] relative">
        <p className="font-calligraphy text-2xl text-[var(--primary)]">
          {wedding.groom.name} &amp; {wedding.bride.name}
        </p>
        <p className="text-2xl text-[var(--muted)] mt-2">
          Designed & Developed by{" "}
          <a
            href="/"
            className="font-calligraphy text-2xl gold-gradient-text font-semibold"
          >
            Amir Khan & The Groom Himself
          </a>
        </p>
      </footer>
    </>
  );
}
