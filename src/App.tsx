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
  // PreWedding,
  // SimpleInfo,
  SpecialInviters,
} from "./components/InfoSections";
import { RSVP } from "./components/RSVP";
import { Closing } from "./components/Closing";
import "./index.css";

export default function App() {
  const audio = useRef<HTMLAudioElement>(null);

  const [muted, setMuted] = useState(false);

  // Hero has not finished yet
  const [heroUnlocked, setHeroUnlocked] = useState(false);

  // Scratch card has not been completed yet
  const [scratchUnlocked, setScratchUnlocked] = useState(false);

  // Whether we are currently locking at the scratch card
  const [scratchLocked, setScratchLocked] = useState(false);

  /*
   * -------------------------------------------------------
   * PAGE SCROLL LOCK
   * -------------------------------------------------------
   */

  useEffect(() => {
    const shouldLock =
      !heroUnlocked ||
      (scratchLocked && !scratchUnlocked);

    document.body.style.overflow = shouldLock
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [heroUnlocked, scratchLocked, scratchUnlocked]);

  /*
   * -------------------------------------------------------
   * SCRATCH CARD SCROLL DETECTION
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!heroUnlocked || scratchUnlocked) return;

    const handleScroll = () => {
      const invitation = document.getElementById(
        "invitation-card"
      );

      if (!invitation) return;

      const rect = invitation.getBoundingClientRect();

      /*
       * Lock once the bottom of the Invitation Card
       * reaches the bottom of the viewport.
       */
      if (rect.bottom <= window.innerHeight) {
        setScratchLocked(true);

        // Put the viewport exactly at the bottom of the card
        window.scrollTo({
          top: window.scrollY + rect.bottom - window.innerHeight,
          behavior: "auto",
        });
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [heroUnlocked, scratchUnlocked]);

  /*
   * -------------------------------------------------------
   * AUDIO
   * -------------------------------------------------------
   */

  const toggle = () => {
    const a = audio.current;
    if (!a) return;

    if (a.paused) {
      a.play().catch(() => {});
    }

    setMuted((currentMuted) => {
      const nextMuted = !currentMuted;

      a.muted = nextMuted;

      return nextMuted;
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <audio
        ref={audio}
        autoPlay
        muted={muted}
        loop
        preload="auto"
        src="/music/bgm.mp3"
      />

      <Controls
        muted={muted}
        onToggle={toggle}
      />

      <Hero
        onUnlock={() => setHeroUnlocked(true)}
        onTap={() => {
          const a = audio.current;
          if (a) {
            a.muted = false;
            a.play().catch(() => {});
          }
        }}
      />

      <Welcome />

      <section id="invitation-card">
        <InvitationCard
          onReveal={() => {
            setScratchUnlocked(true);
            setScratchLocked(false);
          }}
        />
      </section>
      <Countdown />
      <Timeline />
      <Venue />
      <Gallery />
      <DressCode />
      {/* <PreWedding /> */}
      {/* <SimpleInfo /> */}
      <SpecialInviters />
      <RSVP />
      <Closing />
    </div>
  );
}