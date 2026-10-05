import { useRef, useState } from "react";
import { Heart, ChevronDown } from "lucide-react";
import { wedding } from "../data/wedding";

interface HeroProps {
  onUnlock: () => void;
  onTap: () => void;
}

export function Hero({ onUnlock, onTap }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasStartedPlayback = useRef(false);

  const [showText, setShowText] = useState(false);
  const [blurBackground, setBlurBackground] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [pageUnlocked, setPageUnlocked] = useState(false);

  const startVideo = () => {
    const video = videoRef.current;

    if (!video || hasStartedPlayback.current) return;

    hasStartedPlayback.current = true;

    void video.play().catch(() => {
      hasStartedPlayback.current = false;
    });
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (!video) return;

    // Fade in text after 5 seconds
    if (video.currentTime >= 5 && !showText) {
      setShowText(true);
    }

    // Blur background after 8 seconds
    if (video.currentTime >= 8 && !blurBackground) {
      setBlurBackground(true);
    }

    // Show scroll indicator after 9 seconds
    if (video.currentTime >= 9 && !showScroll) {
      setShowScroll(true);
    }

    // Unlock page after 10 seconds
    if (video.currentTime >= 10 && !pageUnlocked) {
      setPageUnlocked(true);
      onUnlock();
    }
  };

  return (
    <section
      className="relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-black"
      onClick={() => {
        startVideo();
        onTap();
      }}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        src="https://res.cloudinary.com/ulfi8xon/video/upload/f_auto,q_auto/v1791022693/rose-gold-blush.mp4"
        poster="https://res.cloudinary.com/ulfi8xon/video/upload/so_0,f_auto,q_auto/v1791022693/rose-gold-blush.jpg"
        className={`absolute inset-0 h-full w-full object-cover scale-[1.04] ${
          blurBackground ? "blur-[8px]" : "blur-0"
        } transition-[filter] duration-[1500ms] ease-in-out`}
        playsInline
        muted
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/55" />

      {/* Wedding Text */}
      <div
        className={`relative z-10 flex w-full flex-col items-center justify-center px-6 text-center text-[#f5e6e0] transition-opacity duration-[1500ms] ease-in-out ${
          showText ? "opacity-100" : "opacity-0"
        }`}
      >
        <Heart size={30} fill="currentColor" className="mb-3" />

        <p className="font-dancing text-2xl md:text-6xl mb-3">
          We're getting married
        </p>

        <div className="flex items-center gap-3 my-3">
          <div className="w-16 h-px bg-white/45" />
          <Heart size={15} fill="currentColor" />
          <div className="w-16 h-px bg-white/45" />
        </div>

        <h1 className="font-dancing text-6xl md:text-9xl leading-none drop-shadow-lg">
          {wedding.groom.name}

          <p className="font-display text-sm md:text-2xl italic whitespace-pre-line mt-3 mb-3">
            {wedding.groom.subtext}
          </p>
        </h1>

        <p className="font-dancing text-3xl md:text-5xl my-2">
          &amp;
        </p>

        <h1 className="font-dancing text-6xl md:text-9xl leading-none drop-shadow-lg">
          {wedding.bride.name}

          <p className="font-display text-sm md:text-2xl italic whitespace-pre-line mt-6">
            {wedding.bride.subtext}
          </p>
        </h1>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-[max(3rem,env(safe-area-inset-bottom))] z-10 flex flex-col items-center gap-2 text-white/70 transition-opacity duration-[1200ms] ease-in-out ${
          showScroll
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <span className="text-3xl uppercase tracking-widest">
          Scroll
        </span>

        <ChevronDown size={40} />
      </div>
    </section>
  );
}