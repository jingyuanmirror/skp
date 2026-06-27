import { motion } from "motion/react";
import type { CouponCard } from "../../types";

export function CouponCardBubble({ coupon }: { coupon: CouponCard }) {
  const isMallWide = coupon.scope === "mall";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden mt-2 mx-1"
      style={{
        width: "100%",
        maxWidth: 300,
        borderRadius: 14,
        background: "#FFFFFF",
        border: "1px solid rgba(184,146,74,0.15)",
        boxShadow: "0 2px 12px rgba(26,23,19,0.06)",
      }}
    >
      <div
        className="h-[3px]"
        style={{
          background: isMallWide
            ? "linear-gradient(90deg, #B8924A, #D4B978, #B8924A)"
            : "linear-gradient(90deg, #C9A86C, #8BA888, #C9A86C)",
        }}
      />

      <div className="px-4 pt-3 pb-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[12px] text-[#1A1713]" style={{ fontWeight: 600, letterSpacing: "0.02em" }}>
            {coupon.brand}
          </span>
          <span
            className="text-[8px] tracking-wider px-2 py-0.5 rounded-full"
            style={{
              background: isMallWide ? "rgba(184,146,74,0.1)" : "rgba(139,168,136,0.1)",
              color: isMallWide ? "#B8924A" : "#6B8C6A",
              border: isMallWide ? "1px solid rgba(184,146,74,0.2)" : "1px solid rgba(139,168,136,0.2)",
            }}
          >
            {isMallWide ? "商场通用" : "品牌专属"}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-[22px] text-[#B8924A]" style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, lineHeight: 1 }}>
            {coupon.discount}
          </span>
          <span className="text-[12px] text-[#1A1713]" style={{ fontWeight: 500 }}>
            {coupon.title}
          </span>
        </div>

        <p className="text-[9px] text-[#C8BEAF] tracking-wide">有效期至 {coupon.validUntil}</p>
      </div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-5 rounded-r-full" style={{ background: "#F5F2ED" }} />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-5 rounded-l-full" style={{ background: "#F5F2ED" }} />
    </motion.div>
  );
}
