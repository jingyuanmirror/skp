import { motion } from "motion/react";
import { CarFront, MapPin } from "lucide-react";
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
        maxWidth: 328,
        borderRadius: 18,
        background: "#FFFFFF",
        border: "1px solid rgba(184,146,74,0.2)",
        boxShadow: "0 8px 26px rgba(26,23,19,0.1), 0 1px 6px rgba(26,23,19,0.05)",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, #B8924A, #D4B978, #B8924A)" }}
      />

      <div
        className="px-5 pt-4 pb-3.5"
        style={{
          background: "linear-gradient(135deg, #F7F0E4 0%, #F0E8D4 100%)",
          borderBottom: "1px solid rgba(184,146,74,0.12)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CarFront size={18} strokeWidth={1.8} color="#B8924A" />
            <span className="text-[13px] tracking-wide text-[#1A1713]" style={{ fontWeight: 600 }}>
              智能停车
            </span>
          </div>
          <span
            className="text-[10px] tracking-wide px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(139,168,136,0.15)",
              color: "#6B8C6A",
              border: "1px solid rgba(139,168,136,0.25)",
              fontWeight: 500,
            }}
          >
            已记录
          </span>
        </div>
      </div>

      <div className="px-5 py-4.5">
        <div className="flex items-start gap-2.5 mb-3.5">
          <span className="w-5 h-5 mt-[2px] flex items-center justify-center" style={{ color: "#B8924A" }}>
            <MapPin size={16} strokeWidth={1.8} color="#B8924A" />
          </span>
          <div>
            <p className="text-[10px] tracking-wide text-[#8C8278] mb-0.5">停车位置</p>
            <p className="text-[31px] text-[#1A1713]" style={{ fontWeight: 600, fontSize: 29 }}>
              {card.location}
            </p>
          </div>
        </div>

        <div className="flex gap-3.5">
          <div className="flex-1 px-3.5 py-3 rounded-[12px]" style={{ background: "#F9F6F1", border: "1px solid rgba(184,146,74,0.08)" }}>
            <p className="text-[10px] tracking-wide text-[#8C8278] mb-1">停车时长</p>
            <p className="text-[20px] text-[#1A1713] leading-none" style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
              {card.duration}
            </p>
          </div>
          <div className="flex-1 px-3.5 py-3 rounded-[12px]" style={{ background: "#F9F6F1", border: "1px solid rgba(184,146,74,0.08)" }}>
            <p className="text-[10px] tracking-wide text-[#8C8278] mb-1">停车费用</p>
            <p className="text-[20px] text-[#B8924A] leading-none" style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>
              ¥{card.fee}
            </p>
          </div>
        </div>

        <p className="text-[10px] text-[#B6AA99] mt-3 tracking-wide">{card.feeRate}</p>
      </div>
    </motion.div>
  );
}
