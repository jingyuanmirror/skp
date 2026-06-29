import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import type { BrandCard } from "../../types";

export function BrandCardBubble({ card }: { card: BrandCard }) {
  const scopeLabel =
    card.tag === "本季新品"
      ? "本季新品"
      : card.highlight
        ? "热销品牌"
        : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden mt-2.5 mx-1"
      style={{
        width: "100%",
        maxWidth: 300,
        borderRadius: 14,
        background: "#FFFFFF",
        border: "1px solid rgba(184,146,74,0.15)",
        boxShadow: "0 4px 20px rgba(26,23,19,0.08), 0 1px 4px rgba(26,23,19,0.04)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 pt-4 pb-3"
        style={{
          background: "linear-gradient(135deg, #F7F0E4 0%, #F0E8D4 100%)",
          borderBottom: "1px solid rgba(184,146,74,0.12)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[13px]" style={{ color: "#B8924A" }}>商会</span>
            <span className="text-[11px] tracking-wide text-[#1A1713]" style={{ fontWeight: 500 }}>
              品牌咨询
            </span>
          </div>
          {scopeLabel && (
            <span
              className="text-[9px] tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(184,146,74,0.12)",
                color: "#B8924A",
                border: "1px solid rgba(184,146,74,0.25)",
              }}
            >
              {scopeLabel}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3.5">
        {/* Brand name & floor */}
        <p className="text-[16px] text-[#1A1713] mb-1.5" style={{ fontFamily: "'Cormorant', serif", fontWeight: 600 }}>
          {card.brand}
        </p>
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin size={12} strokeWidth={1.8} color="#8C8278" />
          <span className="text-[11px] text-[#8C8278] tracking-wide">{card.floor}</span>
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {card.categories.map((cat) => (
            <span
              key={cat}
              className="text-[9px] tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(184,146,74,0.08)",
                color: "#B8924A",
                border: "1px solid rgba(184,146,74,0.15)",
              }}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Highlight */}
        {card.highlight && (
          <div
            className="px-3 py-2 rounded-[8px]"
            style={{ background: "#F9F6F1", border: "1px solid rgba(184,146,74,0.08)" }}
          >
            <p className="text-[9px] tracking-wider text-[#8C8278] mb-1">✦ 当季亮点</p>
            <p className="text-[11px] text-[#1A1713] leading-[1.55]" style={{ fontWeight: 400 }}>
              {card.highlight}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}