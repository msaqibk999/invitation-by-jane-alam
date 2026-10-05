import { useEffect, useRef, useState } from "react";

import { Controls } from "./components/Controls";
import { Hero } from "./components/Hero";
import { Welcome } from "./components/Welcome";
import { InvitationCard } from "./components/InvitationCard";
import { Gallery } from "./components/Gallery";
import { Countdown } from "./components/Countdown";

import {
  Timeline,
  Venue,
  DressCode,
  SpecialInviters,
  SimpleInfo,
} from "./components/InfoSections";

import { RSVP } from "./components/RSVP";
import { Closing } from "./components/Closing";

import "./index.css";

export default function App() {
  const audio = useRef<HTMLAudioElement>(null);

  // -------------------------------------------------------
  // PAGE STAGES
  // -------------------------------------------------------
  // 0 = Hero only
  // 1 = Hero + Welcome + Invitation Card
  // 2 = Everything
  // -------------------------------------------------------

  const [pageStage, setPageStage] = useState<0 | 1 | 2>(0);

  const [muted, setMuted] = useState(false);

  // -------------------------------------------------------
  // SCROLL TARGETS
  // -------------------------------------------------------

  const welcomeRef = useRef<HTMLElement>(null);
  const countdownRef = useRef<HTMLElement>(null);

  // -------------------------------------------------------
  // AUDIO CONTROL
  // -------------------------------------------------------

  const toggle = () => {
    const nextMuted = !muted;

    setMuted(nextMuted);

    const a = audio.current;

    if (a) {
      a.muted = nextMuted;

      if (!nextMuted) {
        a.play().catch(() => {});
      }
    }
  };

  // -------------------------------------------------------
  // SLOW AUTO SCROLL
  // -------------------------------------------------------

  const slowScrollTo = (
    element: HTMLElement,
    duration = 2500
  ) => {
    const startY = window.scrollY;

    const targetY =
      element.getBoundingClientRect().top + window.scrollY;

    const distance = targetY - startY;
    const startTime = performance.now();

    let animationFrame: number;

    const easeInOut = (t: number) => {
      return t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo(
        0,
        startY + distance * easeInOut(progress)
      );

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    // Return a function that cancels the animation
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  };

  // -------------------------------------------------------
  // AUTO SCROLL AFTER NEW STAGE IS RENDERED
  // -------------------------------------------------------

  const autoScrollCancelled = useRef(false);

  useEffect(() => {
    // No auto-scroll for the initial Hero stage
    if (pageStage === 0) return;

    autoScrollCancelled.current = false;

    let cancelAnimation: (() => void) | undefined;

    // Cancel automatic scrolling when the user interacts
    // with the page manually.
    const cancelAutoScroll = () => {
      autoScrollCancelled.current = true;

      if (cancelAnimation) {
        cancelAnimation();
      }
    };

    // Mouse wheel
    window.addEventListener("wheel", cancelAutoScroll, {
      passive: true,
    });

    // Touch scrolling
    window.addEventListener("touchstart", cancelAutoScroll, {
      passive: true,
    });

    window.addEventListener("touchmove", cancelAutoScroll, {
      passive: true,
    });

    // Keyboard scrolling
    const handleKeyDown = (event: KeyboardEvent) => {
      const scrollKeys = [
        "ArrowDown",
        "ArrowUp",
        "PageDown",
        "PageUp",
        "Home",
        "End",
        " ",
      ];

      if (scrollKeys.includes(event.key)) {
        cancelAutoScroll();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Wait 3 seconds before starting the automatic scroll
    const timeout = window.setTimeout(() => {
      if (autoScrollCancelled.current) return;

      // Stage 1:
      // Scroll to Welcome
      if (pageStage === 1 && welcomeRef.current) {
        cancelAnimation = slowScrollTo(
          welcomeRef.current,
          2500
        );
      }

      // Stage 2:
      // Scroll to Countdown
      if (pageStage === 2 && countdownRef.current) {
        cancelAnimation = slowScrollTo(
          countdownRef.current,
          2500
        );
      }
    }, 3000);

    // Cleanup
    return () => {
      window.clearTimeout(timeout);

      if (cancelAnimation) {
        cancelAnimation();
      }

      window.removeEventListener("wheel", cancelAutoScroll);
      window.removeEventListener("touchstart", cancelAutoScroll);
      window.removeEventListener("touchmove", cancelAutoScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pageStage]);

  // -------------------------------------------------------
  // HERO UNLOCK
  // -------------------------------------------------------

  const handleHeroUnlock = () => {
    setPageStage(1);
  };

  // -------------------------------------------------------
  // SCRATCH CARD UNLOCK
  // -------------------------------------------------------

  const handleScratchUnlock = () => {
    setPageStage(2);
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* ---------------------------------------------------
          AUDIO
      --------------------------------------------------- */}

      <audio
        ref={audio}
        autoPlay
        muted={muted}
        loop
        preload="auto"
        src="/music/bgm.mp3"
      />

      {/* ---------------------------------------------------
          CONTROLS
          Always visible
      --------------------------------------------------- */}

      <Controls
        muted={muted}
        onToggle={toggle}
      />

      {/* ---------------------------------------------------
          STAGE 0
          HERO
      --------------------------------------------------- */}

      <Hero
        onUnlock={handleHeroUnlock}
        onTap={() => {
          const a = audio.current;

          if (a) {
            a.muted = false;
            a.play().catch(() => {});
          }
        }}
      />

      {/* ---------------------------------------------------
          STAGE 1+
          WELCOME
      --------------------------------------------------- */}

      {pageStage >= 1 && (
        <section ref={welcomeRef}>
          <Welcome />
        </section>
      )}

      {/* ---------------------------------------------------
          STAGE 1+
          INVITATION CARD
      --------------------------------------------------- */}

      {pageStage >= 1 && (
        <InvitationCard
          onReveal={handleScratchUnlock}
        />
      )}

      {/* ---------------------------------------------------
          STAGE 2+
          EVERYTHING BELOW INVITATION CARD
      --------------------------------------------------- */}

      {pageStage >= 2 && (
        <>
          <section ref={countdownRef}>
            <Countdown />
          </section>

          <Timeline />
          <Venue />
          <Gallery />
          <DressCode />
          <SimpleInfo />
          <SpecialInviters />
          <RSVP />
          <Closing />
        </>
      )}
    </div>
  );
}