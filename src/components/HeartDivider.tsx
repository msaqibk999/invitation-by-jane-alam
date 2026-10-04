import { Heart } from "lucide-react";
export function HeartDivider({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div
        className={`w-16 h-px ${dark ? "bg-white/30" : "bg-[var(--primary)]/30"}`}
      />
      <Heart
        size={10}
        fill="currentColor"
        className={dark ? "text-white/80" : "text-[var(--primary)] opacity-50"}
      />
      <div
        className={`w-16 h-px ${dark ? "bg-white/30" : "bg-[var(--primary)]/30"}`}
      />
    </div>
  );
}
