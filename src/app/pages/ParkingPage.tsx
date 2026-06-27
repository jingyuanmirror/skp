import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { calcParkingDuration, calcParkingFee } from "../utils/parking";

interface ParkingPageProps {
  parkingInfo: { location: string; floor: string; parkedAt: number } | null;
  onBack: () => void;
  onRecordParking: (info: { location: string; floor: string; parkedAt: number }) => void;
  onRedeemPoints: () => void;
}

export function ParkingPage({ parkingInfo, onBack, onRedeemPoints }: ParkingPageProps) {
  const [plateNo, setPlateNo] = useState("京A·88888");
  const [showPlateInput, setShowPlateInput] = useState(false);
  const [plateInput, setPlateInput] = useState("");

  const duration = parkingInfo ? calcParkingDuration(parkingInfo.parkedAt) : "--";
  const fee = parkingInfo ? calcParkingFee(parkingInfo.parkedAt) : "--";
  const floorLabel = parkingInfo ? `${parkingInfo.floor}层` : "--";
  const isParked = Boolean(parkingInfo);

  function handleBindPlate() {
    if (plateInput.trim()) {
      setPlateNo(plateInput.trim());
      setShowPlateInput(false);
      setPlateInput("");
    }
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#F5F2ED", fontFamily: "'DM Sans', sans-serif", color: "#1A1713" }}
    >
      {/* ── Header ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 pt-4 pb-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center" style={{ color: "#8C8278" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-[14px] tracking-[0.15em] text-[#1A1713]" style={{ fontFamily: "'Cormorant', serif", fontWeight: 500 }}>
          智能停车
        </span>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto pb-8" style={{ scrollbarWidth: "none" }}>
        {/* ── Dark Parking Info Card ── */}
        <div className="mx-4 mb-4 relative overflow-hidden" style={{ borderRadius: 16 }}>
          {/* Dark bg */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1A1713 0%, #2A2520 50%, #1A1713 100%)" }} />
          {/* Gold border */}
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
          {/* Line pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, #C9A86C 0px, #C9A86C 0.5px, transparent 0.5px, transparent 20px)" }}
          />
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 55%, transparent 70%)" }}
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
          />

          <div className="relative z-10 px-5 pt-5 pb-5">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A86C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10H6l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" fill="none" /><circle cx="17" cy="17" r="2" fill="none" />
                  <path d="M5 17H3v-4l1.5-2h3" /><path d="M9 17h6" />
                </svg>
                <span className="text-[10px] tracking-[0.25em] text-[#C9A86C] uppercase" style={{ fontFamily: "'Cormorant', serif" }}>
                  SKP · Parking
                </span>
              </div>
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                style={{
                  background: isParked ? "rgba(139,168,136,0.2)" : "rgba(201,168,108,0.15)",
                  border: `1px solid ${isParked ? "rgba(139,168,136,0.3)" : "rgba(201,168,108,0.2)"}`,
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{
                  background: isParked ? "#8BA888" : "#C9A86C",
                  boxShadow: isParked ? "0 0 4px rgba(139,168,136,0.5)" : "0 0 4px rgba(201,168,108,0.5)",
                }} />
                <span className="text-[9px] tracking-wider" style={{ color: isParked ? "#A5C9A2" : "#C9A86C" }}>
                  {isParked ? "停放中" : "未停放"}
                </span>
              </div>
            </div>

            {/* License Plate */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="px-3 py-2 rounded-[8px]"
                style={{
                  background: "linear-gradient(135deg, rgba(201,168,108,0.15), rgba(201,168,108,0.05))",
                  border: "1px solid rgba(201,168,108,0.2)",
                }}
              >
                <p className="text-[16px] text-[#C9A86C] tracking-[0.08em]" style={{ fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
                  {plateNo}
                </p>
              </div>
              {parkingInfo && (
                <div className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A86C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-[11px] text-[#F5F2ED]/80">{floorLabel} · {parkingInfo.location}</span>
                </div>
              )}
            </div>

            {/* Duration & Fee */}
            <div className="flex gap-3 mb-3">
              <div className="flex-1 px-3.5 py-3 rounded-[12px]" style={{ background: "rgba(201,168,108,0.08)", border: "1px solid rgba(201,168,108,0.1)" }}>
                <p className="text-[8px] tracking-[0.2em] text-[#8C8278] mb-1.5 uppercase">停车时长</p>
                <p className="text-[20px] text-[#F5F2ED] leading-tight" style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>
                  {duration}
                </p>
              </div>
              <div className="flex-1 px-3.5 py-3 rounded-[12px]" style={{ background: "rgba(201,168,108,0.08)", border: "1px solid rgba(201,168,108,0.1)" }}>
                <p className="text-[8px] tracking-[0.2em] text-[#8C8278] mb-1.5 uppercase">停车费用</p>
                <p className="text-[20px] text-[#C9A86C] leading-tight" style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>
                  {fee === "--" ? "--" : `¥${fee}`}
                </p>
              </div>
            </div>

            {/* Fee Rate */}
            <div className="flex items-center gap-2">
              <div className="h-px flex-1" style={{ background: "rgba(201,168,108,0.12)" }} />
              <span className="text-[8px] tracking-[0.15em] text-[#8C8278]/60">
                ¥15/小时 · 前30分钟免费
              </span>
              <div className="h-px flex-1" style={{ background: "rgba(201,168,108,0.12)" }} />
            </div>
          </div>
        </div>

        {/* ── 绑定车牌 ── */}
        <div className="px-4 mb-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPlateInput(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[14px] transition-all duration-200"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(184,146,74,0.14)",
              boxShadow: "0 2px 12px rgba(26,23,19,0.05)",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #F7F0E4, #F0E8D4)", border: "1px solid rgba(184,146,74,0.2)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8924A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="5" width="22" height="14" rx="3" /><path d="M6 5v14" /><path d="M18 5v14" /><path d="M1 12h22" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[12px] text-[#1A1713]" style={{ fontWeight: 500 }}>绑定车牌</p>
              <p className="text-[9px] text-[#8C8278] mt-0.5">当前车牌：{plateNo}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8BEAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
        </div>

        {/* ── 车辆管理 + 停车订单 ── */}
        <div className="px-4 mb-4 grid grid-cols-2 gap-2.5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-4 py-3.5 rounded-[14px] text-left transition-all duration-200"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(184,146,74,0.1)",
              boxShadow: "0 1px 4px rgba(26,23,19,0.04)",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(184,146,74,0.06)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8924A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10H6l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" fill="none" /><circle cx="17" cy="17" r="2" fill="none" />
              </svg>
            </div>
            <div>
              <p className="text-[12px] text-[#1A1713]" style={{ fontWeight: 500 }}>车辆管理</p>
              <p className="text-[8px] text-[#8C8278] mt-0.5">查看/解绑车辆</p>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onRedeemPoints}
            className="flex items-center gap-3 px-4 py-3.5 rounded-[14px] text-left transition-all duration-200"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(184,146,74,0.1)",
              boxShadow: "0 1px 4px rgba(26,23,19,0.04)",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(184,146,74,0.06)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8924A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <p className="text-[12px] text-[#1A1713]" style={{ fontWeight: 500 }}>停车订单</p>
              <p className="text-[8px] text-[#8C8278] mt-0.5">缴费/开票</p>
            </div>
          </motion.button>
        </div>

        {/* ── 停车活动 ── */}
        <div className="px-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #B8924A20)" }} />
            <span className="text-[9px] tracking-[0.22em] text-[#B8924A]/50 uppercase" style={{ fontFamily: "'Cormorant', serif" }}>
              停车活动
            </span>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #B8924A20, transparent)" }} />
          </div>

          {/* Activity Card 1 */}
          <div
            className="rounded-[14px] overflow-hidden mb-2.5"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(184,146,74,0.12)",
              boxShadow: "0 2px 10px rgba(26,23,19,0.05)",
            }}
          >
            <div
              className="px-4 py-3.5"
              style={{ background: "linear-gradient(135deg, #F7F0E4 0%, #F0E8D4 100%)" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[8px] tracking-[0.15em] px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(184,146,74,0.2)", color: "#B8924A", fontWeight: 500 }}
                    >
                      黑钻专享
                    </span>
                    <span
                      className="text-[8px] tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(139,168,136,0.15)", color: "#6B8C6A", fontWeight: 500 }}
                    >
                      进行中
                    </span>
                  </div>
                  <p className="text-[13px] text-[#1A1713] mb-1" style={{ fontWeight: 500 }}>
                    会员积分抵扣停车费
                  </p>
                  <p className="text-[9px] text-[#8C8278] leading-relaxed">
                    黑钻会员可使用积分抵扣停车费用，100积分=1元，单次最高抵扣50元。消费积分将在离场结算时自动抵扣。
                  </p>
                </div>
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ml-3"
                  style={{ background: "linear-gradient(135deg, #B8924A, #C9A86C)", boxShadow: "0 2px 8px rgba(184,146,74,0.3)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Card 2 */}
          <div
            className="rounded-[14px] overflow-hidden mb-2.5"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(184,146,74,0.12)",
              boxShadow: "0 2px 10px rgba(26,23,19,0.05)",
            }}
          >
            <div
              className="px-4 py-3.5"
              style={{ background: "linear-gradient(135deg, #F0F5EE 0%, #E8F0E4 100%)" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[8px] tracking-[0.15em] px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(139,168,136,0.2)", color: "#6B8C6A", fontWeight: 500 }}
                    >
                      全场通用
                    </span>
                    <span
                      className="text-[8px] tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(139,168,136,0.15)", color: "#6B8C6A", fontWeight: 500 }}
                    >
                      进行中
                    </span>
                  </div>
                  <p className="text-[13px] text-[#1A1713] mb-1" style={{ fontWeight: 500 }}>
                    消费满额免停时
                  </p>
                  <p className="text-[9px] text-[#8C8278] leading-relaxed">
                    当日消费满2,000元免停2小时，满5,000元免停4小时，满10,000元免停8小时。凭购物小票至服务台办理。
                  </p>
                </div>
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ml-3"
                  style={{ background: "linear-gradient(135deg, #8BA888, #6B8C6A)", boxShadow: "0 2px 8px rgba(139,168,136,0.3)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Card 3 */}
          <div
            className="rounded-[14px] overflow-hidden"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(184,146,74,0.12)",
              boxShadow: "0 2px 10px rgba(26,23,19,0.05)",
            }}
          >
            <div
              className="px-4 py-3.5"
              style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #F0EBE1 100%)" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[8px] tracking-[0.15em] px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(184,146,74,0.2)", color: "#B8924A", fontWeight: 500 }}
                    >
                      月度活动
                    </span>
                    <span
                      className="text-[8px] tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(140,130,120,0.1)", color: "#8C8278", fontWeight: 500 }}
                    >
                      常驻
                    </span>
                  </div>
                  <p className="text-[13px] text-[#1A1713] mb-1" style={{ fontWeight: 500 }}>
                    黑钻会员停车封顶
                  </p>
                  <p className="text-[9px] text-[#8C8278] leading-relaxed">
                    黑钻会员每日停车费封顶60元，超出部分自动减免。需绑定车牌并确认为黑钻会员资格方可享受。
                  </p>
                </div>
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ml-3"
                  style={{ background: "linear-gradient(135deg, #C9A86C, #B8924A)", boxShadow: "0 2px 8px rgba(184,146,74,0.3)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bind Plate Modal ── */}
      <AnimatePresence>
        {showPlateInput && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-40"
              style={{ background: "rgba(26,23,19,0.4)" }}
              onClick={() => setShowPlateInput(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 left-0 right-0 z-50 rounded-t-[20px] overflow-hidden"
              style={{ background: "#F5F2ED", boxShadow: "0 -4px 30px rgba(0,0,0,0.15)" }}
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full" style={{ background: "rgba(26,23,19,0.12)" }} />
              </div>
              <div className="px-5 pb-8">
                <p className="text-[14px] text-[#1A1713] mb-1" style={{ fontWeight: 500 }}>
                  绑定车牌
                </p>
                <p className="text-[10px] text-[#8C8278] mb-4">
                  绑定后可自动识别入场车辆并计算停车费用
                </p>

                {/* Province selector */}
                <p className="text-[9px] tracking-[0.15em] text-[#8C8278] mb-2">车牌省份</p>
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  {["京", "沪", "粤", "浙", "苏", "川", "渝", "鄂"].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        const suffix = plateInput.replace(/^[^\d]/, "").match(/[A-Z·\d]+/)?.[0] ?? "A·88888";
                        setPlateInput(`${p}${suffix}`);
                      }}
                      className="w-9 h-9 rounded-[8px] text-[12px] flex items-center justify-center transition-all duration-200"
                      style={{
                        background: plateInput.startsWith(p) ? "linear-gradient(135deg, #F7F0E4, #F0E8D4)" : "#F9F6F1",
                        border: plateInput.startsWith(p) ? "1px solid rgba(184,146,74,0.3)" : "1px solid rgba(184,146,74,0.08)",
                        color: plateInput.startsWith(p) ? "#B8924A" : "#8C8278",
                        fontWeight: plateInput.startsWith(p) ? 600 : 400,
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Plate input */}
                <p className="text-[9px] tracking-[0.15em] text-[#8C8278] mb-2">车牌号码</p>
                <input
                  value={plateInput}
                  onChange={(e) => setPlateInput(e.target.value)}
                  placeholder="京A·88888"
                  className="w-full px-4 py-3 rounded-[12px] text-[15px] outline-none transition-all duration-200 mb-4"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(184,146,74,0.15)",
                    color: "#1A1713",
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                  }}
                  onFocus={(e) => { e.target.style.border = "1px solid rgba(184,146,74,0.4)"; }}
                  onBlur={(e) => { e.target.style.border = "1px solid rgba(184,146,74,0.15)"; }}
                />

                <div className="flex gap-2.5">
                  <button
                    onClick={() => setShowPlateInput(false)}
                    className="flex-1 py-3 rounded-[12px] text-[11px] tracking-wider"
                    style={{ background: "#EDE8DF", color: "#8C8278", fontWeight: 500 }}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleBindPlate}
                    disabled={!plateInput.trim()}
                    className="flex-1 py-3 rounded-[12px] text-[11px] tracking-wider transition-all duration-300"
                    style={{
                      background: plateInput.trim() ? "linear-gradient(135deg, #C9A86C, #B8924A, #D4B978)" : "#E8E3DA",
                      color: plateInput.trim() ? "#FFFFFF" : "#8C8278",
                      fontWeight: 500,
                      boxShadow: plateInput.trim() ? "0 4px 14px rgba(184,146,74,0.25)" : "none",
                    }}
                  >
                    确认绑定
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}