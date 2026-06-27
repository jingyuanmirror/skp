import { motion } from "motion/react";
import type { ParkingCard } from "../../types";

export function ParkingCardBubble({ card }: { card: ParkingCard }) {
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
        background: "#FFFFFF",
        border: "1px solid rgba(184,146,74,0.18)",
        boxShadow: "0 4px 20px rgba(26,23,19,0.08), 0 1px 4px rgba(26,23,19,0.04)",
      }}
    >
      <div
        className="px-4 pt-4 pb-3"
        style={{
          background: "linear-gradient(135deg, #F7F0E4 0%, #F0E8D4 100%)",
          borderBottom: "1px solid rgba(184,146,74,0.12)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[14px]" style={{ color: "#B8924A" }}>
              ◎
            </span>
            <span className="text-[11px] tracking-wide text-[#1A1713]" style={{ fontWeight: 500 }}>
              智能停车
            </span>
          </div>
          <span
            className="text-[9px] tracking-wider px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(139,168,136,0.15)",
              color: "#6B8C6A",
              border: "1px solid rgba(139,168,136,0.25)",
            }}
          >
            已记录
          </span>
        </div>
      </div>

      <div className="px-4 py-3.5">
        <div className="flex items-start gap-2.5 mb-3">
          <span className="text-[12px] mt-0.5" style={{ color: "#B8924A" }}>
            📍
          </span>
          <div>
            <p className="text-[9px] tracking-wider text-[#8C8278] mb-0.5">停车位置</p>
            <p className="text-[13px] text-[#1A1713]" style={{ fontWeight: 500 }}>
              {card.location}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 px-3 py-2.5 rounded-[10px]" style={{ background: "#F9F6F1", border: "1px solid rgba(184,146,74,0.08)" }}>
            <p className="text-[9px] tracking-wider text-[#8C8278] mb-1">停车时长</p>
            <p className="text-[16px] text-[#1A1713]" style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>
              {card.duration}
            </p>
          </div>
          <div className="flex-1 px-3 py-2.5 rounded-[10px]" style={{ background: "#F9F6F1", border: "1px solid rgba(184,146,74,0.08)" }}>
            <p className="text-[9px] tracking-wider text-[#8C8278] mb-1">停车费用</p>
            <p className="text-[16px] text-[#B8924A]" style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>
              ¥{card.fee}
            </p>
          </div>
        </div>

        <p className="text-[9px] text-[#C8BEAF] mt-2.5 tracking-wide">{card.feeRate}</p>
      </div>
    </motion.div>
  );
}
