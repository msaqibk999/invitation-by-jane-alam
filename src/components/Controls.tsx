import { Globe, Volume2, VolumeX } from "lucide-react";
export function Controls({
  muted,
  onToggle,
}: {
  muted: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <button
        onClick={onToggle}
        aria-label="Toggle music"
        className="fixed top-4 right-4 z-50 inline-flex items-center justify-center h-18 w-18 rounded-md border border-[var(--primary)]/50 text-white bg-[var(--primary)] shadow-gold"
      >
        <span>{muted ? <VolumeX size={32} /> : <Volume2 size={32} />}</span>
      </button>
    </>
  );
}
