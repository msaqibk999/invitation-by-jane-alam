import { Heart } from "lucide-react";
import { wedding } from "../data/wedding";
export function Welcome() {
  return (
    <section
      className="relative px-6 py-24 md:py-24 text-center overflow-hidden"
      style={{
        background:
          "linear-gradient(rgb(86,74,66) 0%,rgb(122,106,95) 45%,rgb(199,182,168) 78%,rgb(243,233,226) 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#b87a5e]" />
          <Heart size={14} fill="currentColor" className="text-[#b87a5e]" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#b87a5e]" />
        </div>
        <p className="font-calligraphy text-2xl md:text-7xl leading-relaxed italic text-[#fbe8da] drop-shadow-lg">
          We are honored to welcome you to the Wedding ceremony of {wedding.groom.name} &amp;
          {wedding.bride.name}. As they begin their journey together in faith and love, we
          thank you for being part of this blessed occasion ❤
        </p>
        <HeartDivider />
      </div>
    </section>
  );
}
function HeartDivider() {
  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <div className="w-20 h-px bg-[#b87a5e]" />
      <Heart size={14} fill="currentColor" className="text-[#b87a5e]" />
      <div className="w-20 h-px bg-[#b87a5e]" />
    </div>
  );
}
