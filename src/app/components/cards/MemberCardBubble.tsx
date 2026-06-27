import { motion } from "motion/react";
import type { MemberCard } from "../../types";

export function MemberCardBubble({ card }: { card: MemberCard }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden mt-2.5 mx-1"
      style={{
        width: "100%",
        maxWidth: 300,
        borderRadius: 16,
        background: "linear-gradient(135deg, #1A1713 0%, #2A2520 50%, #1A1713 100%)",
        boxShadow: "0 8px 32px rgba(184,146,74,0.18), 0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 16,
          padding: 1.5,
          background: "linear-gradient(135deg, #C9A86C 0%, #B8924A 40%, #D4B978 60%, #B8924A 100%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #C9A86C 0px, #C9A86C 0.5px, transparent 0.5px, transparent 20px)",
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 55%, transparent 70%)",
        }}
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 1.6, delay: 0.5, ease: "easeInOut" }}
      />

      <div className="relative z-10 px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span
              className="text-[12px] tracking-[0.25em] text-[#C9A86C] uppercase"
              style={{ fontFamily: "'Cormorant', serif", fontWeight: 400 }}
            >
              SKP
            </span>
            <span className="w-px h-3" style={{ background: "rgba(201,168,108,0.3)" }} />
            <span className="text-[9px] tracking-[0.18em] text-[#C9A86C]/70 uppercase">Member</span>
          </div>
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,108,0.2), rgba(201,168,108,0.08))",
              border: "1px solid rgba(201,168,108,0.25)",
            }}
          >
            <span className="text-[10px] text-[#C9A86C]">{card.tierIcon}</span>
            <span className="text-[9px] tracking-wider text-[#C9A86C]">{card.tier}</span>
          </div>
        </div>

        <p
          className="text-[22px] text-[#F5F2ED] mb-5 leading-tight"
          style={{ fontFamily: "'Cormorant', serif", fontWeight: 400, letterSpacing: "0.04em" }}
        >
          {card.name}
        </p>

        <p className="text-[11px] text-[#8C8278] mb-4 tracking-[0.15em]" style={{ fontFamily: "'DM Mono', monospace" }}>
          {card.cardNo}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {card.benefits.map((benefit) => (
            <span
              key={benefit}
              className="text-[9px] tracking-wide text-[#C9A86C]/80 px-2 py-1 rounded-full"
              style={{
                background: "rgba(201,168,108,0.1)",
                border: "1px solid rgba(201,168,108,0.18)",
              }}
            >
              {benefit}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
