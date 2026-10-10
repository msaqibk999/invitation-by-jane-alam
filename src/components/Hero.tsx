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
      className="relative flex h-[100svh] min-h-[100svh] w-full items-center justify-center overflow-hidden bg-black"
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
        className={`absolute inset-0 h-full w-full scale-[1.04] object-cover ${
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

        <p className="font-dancing mb-3 text-2xl md:text-6xl">
          We're getting married
        </p>

        <div className="my-3 flex items-center gap-3">
          <div className="h-px w-16 bg-white/45" />
          <Heart size={15} fill="currentColor" />
          <div className="h-px w-16 bg-white/45" />
        </div>

        <h1 className="font-dancing text-6xl leading-none drop-shadow-lg md:text-9xl">
          {wedding.groom.name}

          <p className="font-display mt-3 mb-0 whitespace-pre-line text-sm italic md:text-3xl">
            {wedding.groom.subtext}
          </p>
        </h1>

        <p className="font-dancing my-6 text-3xl md:text-5xl">
          &amp;
        </p>

        <h1 className="font-dancing text-6xl leading-none drop-shadow-lg md:text-9xl">
          {wedding.bride.name}

          <p className="font-display mt-6 whitespace-pre-line text-sm italic md:text-3xl">
            {wedding.bride.subtext}
          </p>
        </h1>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-[max(3rem,env(safe-area-inset-bottom))] z-10 flex flex-col items-center gap-2 text-white/70 transition-opacity duration-[1200ms] ease-in-out ${
          showScroll
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-2 animate-bounce-slow">
          <span className="text-4xl uppercase tracking-widest">
            Scroll
          </span>

          <ChevronDown size={60} />
        </div>
      </div>
    </section>
  );
}